"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import Link from "next/link";

type ChatRole = "user" | "assistant";

interface AgentMetadata {
  duration?: number;
  toolsUsed?: string[];
}

interface AgentResponse {
  success: boolean;
  response: string;
  sessionId: string;
  results?: any[];
  metadata?: AgentMetadata;
}

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  results?: any[];
  metadata?: AgentMetadata;
}

type ResultTypeFilter = "all" | "building" | "room";

const SESSION_STORAGE_KEY = "booking-ai-chat-session-id";
const DEFAULT_AGENT_URL = "http://localhost:3012/api/v1/super-agent/query";
const QUICK_REPLIES = [
  "Tìm ký túc xá gần Đại học Sư phạm Đà Nẵng trong 6km",
  "Gợi ý 3 phòng giá rẻ dưới 2.5 triệu có wifi",
  "Tìm ký túc xá có chỗ đậu xe và an ninh 24/7",
];

function resolveAgentUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_AGENT_API_URL?.trim();
  if (fromEnv) {
    return fromEnv;
  }
  return DEFAULT_AGENT_URL;
}

function createSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // Fallback UUID v4-like for older environments.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const rand = Math.floor(Math.random() * 16);
    const value = char === "x" ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
}

function formatDistance(value: any): string | null {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return `${n.toFixed(2)} km`;
}

function formatPrice(value: any): string | null {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return new Intl.NumberFormat("vi-VN").format(n) + " VND";
}

function detectResultType(item: any): "building" | "room" {
  if (item?.price !== undefined || item?.buildingId || item?.capacity !== undefined) {
    return "room";
  }
  return "building";
}

function resolveResultLink(item: any): string | null {
  const type = detectResultType(item);
  if (type === "room" && item?.id) return `/rooms/${item.id}`;
  if (type === "building" && item?.id) return `/buildings/${item.id}`;
  if (item?.building?.id) return `/buildings/${item.building.id}`;
  return null;
}

function resolveResultImage(item: any): string | null {
  // Room-first strategy
  if (Array.isArray(item?.images) && item.images.length > 0) {
    const firstRoomImage = item.images[0];
    if (typeof firstRoomImage === "string") return firstRoomImage;
    if (firstRoomImage?.imageUrl) return firstRoomImage.imageUrl;
    if (firstRoomImage?.image_url) return firstRoomImage.image_url;
    if (firstRoomImage?.url) return firstRoomImage.url;
    if (firstRoomImage?.src) return firstRoomImage.src;
  }

  if (item?.imageUrl) return item.imageUrl;
  if (item?.image_url) return item.image_url;
  if (item?.thumbnail) return item.thumbnail;
  if (item?.images && typeof item.images === "string") return item.images;
  if (item?.images?.imageUrl) return item.images.imageUrl;
  if (item?.images?.image_url) return item.images.image_url;

  const building = item?.building;
  if (building?.images && typeof building.images === "string") return building.images;
  if (building?.imageUrl) return building.imageUrl;
  if (building?.image_url) return building.image_url;

  if (Array.isArray(building?.images) && building.images.length > 0) {
    const firstBuildingImage = building.images[0];
    if (typeof firstBuildingImage === "string") return firstBuildingImage;
    if (firstBuildingImage?.imageUrl) return firstBuildingImage.imageUrl;
    if (firstBuildingImage?.image_url) return firstBuildingImage.image_url;
    if (firstBuildingImage?.url) return firstBuildingImage.url;
  }

  return null;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [resultFilters, setResultFilters] = useState<Record<string, ResultTypeFilter>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Xin chao! Minh la tro ly tim KTX. Ban cu hoi tu nhien, minh se de xuat top lua chon phu hop nhat.",
    },
  ]);
  const messageListRef = useRef<HTMLDivElement | null>(null);

  const agentUrl = useMemo(() => resolveAgentUrl(), []);

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) {
      setSessionId(saved);
    }
  }, []);

  useEffect(() => {
    if (!messageListRef.current) return;
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [messages, open]);

  async function sendQuestion(question: string) {
    if (!question.trim() || loading) return;

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text: question },
    ]);
    setLoading(true);

    try {
      const effectiveSessionId = sessionId || createSessionId();
      if (!sessionId) {
        setSessionId(effectiveSessionId);
        localStorage.setItem(SESSION_STORAGE_KEY, effectiveSessionId);
      }

      const response = await fetch(agentUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: question,
          sessionId: effectiveSessionId,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorBody}`);
      }

      const data = (await response.json()) as AgentResponse;
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem(SESSION_STORAGE_KEY, data.sessionId);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          role: "assistant",
          text: data.response || "Minh chua co phan hoi phu hop.",
          results: Array.isArray(data.results) ? data.results : [],
          metadata: data.metadata,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: "Minh dang gap loi ket noi den he thong AI. Ban thu lai sau it phut nhe.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;
    setInput("");
    await sendQuestion(question);
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          aria-label="Open chatbot"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[70] rounded-full bg-brand p-4 text-white shadow-xl transition hover:bg-brand-dark"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-[70] flex h-[75vh] w-[380px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 bg-brand px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Tro ly KTX AI</p>
              <p className="text-xs opacity-90">Tu van phong o theo nhu cau cua ban</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 transition hover:bg-white/20"
              aria-label="Close chatbot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={messageListRef} className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-3">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div
                  className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "ml-auto bg-brand text-white"
                      : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  {message.text}
                </div>

                {message.role === "assistant" && message.results && message.results.length > 0 && (
                  <div className="space-y-2">
                    {(() => {
                      const selectedFilter: ResultTypeFilter = resultFilters[message.id] || "all";
                      const typedItems = message.results.map((item) => ({
                        item,
                        type: detectResultType(item),
                      }));
                      const buildingCount = typedItems.filter((x) => x.type === "building").length;
                      const roomCount = typedItems.filter((x) => x.type === "room").length;
                      const filtered = typedItems.filter((x) =>
                        selectedFilter === "all" ? true : x.type === selectedFilter,
                      );

                      return (
                        <>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setResultFilters((prev) => ({ ...prev, [message.id]: "all" }))
                              }
                              className={`rounded-full px-2 py-1 text-[11px] ${
                                selectedFilter === "all"
                                  ? "bg-blue-600 text-white"
                                  : "bg-white text-gray-700 border border-gray-200"
                              }`}
                            >
                              Tat ca ({typedItems.length})
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setResultFilters((prev) => ({ ...prev, [message.id]: "building" }))
                              }
                              className={`rounded-full px-2 py-1 text-[11px] ${
                                selectedFilter === "building"
                                  ? "bg-blue-600 text-white"
                                  : "bg-white text-gray-700 border border-gray-200"
                              }`}
                            >
                              Building ({buildingCount})
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setResultFilters((prev) => ({ ...prev, [message.id]: "room" }))
                              }
                              className={`rounded-full px-2 py-1 text-[11px] ${
                                selectedFilter === "room"
                                  ? "bg-blue-600 text-white"
                                  : "bg-white text-gray-700 border border-gray-200"
                              }`}
                            >
                              Room ({roomCount})
                            </button>
                          </div>

                          {filtered.map(({ item, type }: any, idx: number) => {
                            const title =
                              item?.name ||
                              item?.building?.name ||
                              item?.buildingName ||
                              `Ket qua #${idx + 1}`;
                            const address = item?.address || item?.building?.address;
                            const distanceText = formatDistance(item?.distanceKm);
                            const priceText = formatPrice(item?.price);
                            const detailLink = resolveResultLink(item);
                            const imageUrl = resolveResultImage(item);

                            return (
                              <div
                                key={`${message.id}-r-${idx}`}
                                className="rounded-lg border border-blue-100 bg-white p-3 text-xs shadow-sm"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
                                    {imageUrl ? (
                                      <img
                                        src={imageUrl}
                                        alt={title}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                                        No image
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="line-clamp-2 font-semibold text-gray-900">{title}</p>
                                      <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] uppercase text-gray-600">
                                        {type}
                                      </span>
                                    </div>
                                    {address && <p className="mt-1 line-clamp-2 text-gray-600">{address}</p>}
                                  </div>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                                  {distanceText && (
                                    <span className="rounded bg-blue-50 px-2 py-1 text-blue-700">
                                      Khoang cach: {distanceText}
                                    </span>
                                  )}
                                  {priceText && (
                                    <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">
                                      Gia: {priceText}
                                    </span>
                                  )}
                                  {item?.capacity && (
                                    <span className="rounded bg-gray-100 px-2 py-1 text-gray-700">
                                      Suc chua: {item.capacity}
                                    </span>
                                  )}
                                </div>
                                {detailLink && (
                                  <div className="mt-2">
                                    <Link
                                      href={detailLink}
                                      className="text-[11px] font-medium text-brand hover:underline"
                                      onClick={() => setOpen(false)}
                                    >
                                      Xem chi tiet
                                    </Link>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </>
                      );
                    })()}
                    
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="max-w-[90%] rounded-xl bg-white px-3 py-2 text-sm text-gray-500 shadow-sm">
                Dang xu ly...
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t border-gray-100 bg-white p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {QUICK_REPLIES.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void sendQuestion(suggestion)}
                  disabled={loading}
                  className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhap cau hoi ve KTX..."
                rows={2}
                className="min-h-[44px] flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-brand"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-lg bg-brand p-2.5 text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

