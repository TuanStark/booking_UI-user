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
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
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
  if (
    item?.price !== undefined ||
    item?.buildingId ||
    item?.capacity !== undefined
  ) {
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
  if (building?.images && typeof building.images === "string")
    return building.images;
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
  const [resultFilters, setResultFilters] = useState<
    Record<string, ResultTypeFilter>
  >({});
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Xin chào! Mình là trợ lý tìm KTX. Bạn cứ hỏi tự nhiên, mình sẽ đề xuất top lựa chọn phù hợp nhất.",
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
          text: data.response || "Mình chưa có phản hồi phù hợp.",
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
          text: "Mình đang gặp lỗi kết nối đến hệ thống AI. Bạn thử lại sau ít phút nhé.",
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
      {/* FAB button with pulse ring */}
      {!open && (
        <button
          type="button"
          aria-label="Mở trợ lý KTX AI"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[70] flex items-center gap-2 rounded-full bg-gradient-to-br from-[#4b5cb1] to-[#2d3a8c] px-4 py-3 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[#4b5cb1]/40 hover:shadow-2xl"
          style={{ boxShadow: "0 8px 32px rgba(75,92,177,0.45)" }}
        >
          {/* pulse rings */}
          <span className="absolute inset-0 rounded-full animate-ping bg-[#4b5cb1]/30 pointer-events-none" />
          <img
            src="/logoDorm.png"
            alt="KTX AI"
            className="h-7 w-7 rounded-full object-cover ring-2 ring-white/60"
          />
          <span className="text-sm font-semibold tracking-wide">Hỏi AI</span>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-[70] flex h-[80vh] w-[390px] max-w-[calc(100vw-20px)] flex-col overflow-hidden rounded-3xl shadow-2xl"
          style={{
            boxShadow:
              "0 20px 60px rgba(75,92,177,0.30), 0 4px 16px rgba(0,0,0,0.12)",
          }}
        >
          {/* ── HEADER ── */}
          <div
            className="relative flex items-center gap-3 px-4 py-3 text-white overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #2d3a8c 0%, #4b5cb1 60%, #6b7fd4 100%)",
            }}
          >
            {/* decorative blurred circle */}
            <span className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <span className="absolute right-16 top-2 h-12 w-12 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />

            {/* avatar */}
            <div className="relative shrink-0">
              <img
                src="/logoDorm.png"
                alt="KTX AI"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-white/50 shadow-md"
              />
              {/* online dot */}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-tight">Trợ lý KTX AI</p>
              <p className="text-[11px] opacity-80 leading-tight mt-0.5">
                Tư vấn phòng ở · Luôn sẵn sàng 24/7
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="shrink-0 rounded-full p-1.5 transition hover:bg-white/20"
              aria-label="Đóng chatbot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ── MESSAGE LIST ── */}
          <div
            ref={messageListRef}
            className="relative flex-1 overflow-y-auto p-3 space-y-3"
            style={{ background: "#f4f6fb" }}
          >
            {/* Logo watermark background */}
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              aria-hidden
            >
              <img
                src="/logoDorm.png"
                alt=""
                className="w-52 opacity-[0.06] select-none"
                draggable={false}
              />
            </div>

            {messages.map((message) => (
              <div key={message.id} className="space-y-2 relative">
                {/* Assistant avatar chip */}
                {message.role === "assistant" && (
                  <div className="flex items-end gap-2">
                    <img
                      src="/logoDorm.png"
                      alt="AI"
                      className="h-6 w-6 rounded-full object-cover shrink-0 ring-1 ring-[#4b5cb1]/30"
                    />
                    <div
                      className="max-w-[85%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm text-gray-800 shadow-sm"
                      style={{
                        background: "rgba(255,255,255,0.92)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(75,92,177,0.10)",
                      }}
                    >
                      {message.text}
                    </div>
                  </div>
                )}

                {message.role === "user" && (
                  <div className="flex justify-end">
                    <div
                      className="max-w-[80%] rounded-2xl rounded-br-sm px-3.5 py-2.5 text-sm text-white shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #4b5cb1, #2d3a8c)",
                      }}
                    >
                      {message.text}
                    </div>
                  </div>
                )}

                {/* Result cards */}
                {message.role === "assistant" &&
                  message.results &&
                  message.results.length > 0 && (
                    <div className="ml-8 space-y-2">
                      {(() => {
                        const selectedFilter: ResultTypeFilter =
                          resultFilters[message.id] || "all";
                        const typedItems = message.results.map((item) => ({
                          item,
                          type: detectResultType(item),
                        }));
                        const buildingCount = typedItems.filter(
                          (x) => x.type === "building",
                        ).length;
                        const roomCount = typedItems.filter(
                          (x) => x.type === "room",
                        ).length;
                        const filtered = typedItems.filter((x) =>
                          selectedFilter === "all"
                            ? true
                            : x.type === selectedFilter,
                        );

                        return (
                          <>
                            {/* Filter pills */}
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                {
                                  key: "all",
                                  label: `Tất cả (${typedItems.length})`,
                                },
                                {
                                  key: "building",
                                  label: `Tòa nhà (${buildingCount})`,
                                },
                                { key: "room", label: `Phòng (${roomCount})` },
                              ].map(({ key, label }) => (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() =>
                                    setResultFilters((prev) => ({
                                      ...prev,
                                      [message.id]: key as ResultTypeFilter,
                                    }))
                                  }
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                                    selectedFilter === key
                                      ? "bg-[#4b5cb1] text-white shadow-sm"
                                      : "bg-white text-gray-600 border border-gray-200 hover:border-[#4b5cb1]/40"
                                  }`}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>

                            {/* Cards */}
                            {filtered.map(
                              ({ item, type }: any, idx: number) => {
                                const title =
                                  item?.name ||
                                  item?.building?.name ||
                                  item?.buildingName ||
                                  `Kết quả #${idx + 1}`;
                                const address =
                                  item?.address || item?.building?.address;
                                const distanceText = formatDistance(
                                  item?.distanceKm,
                                );
                                const priceText = formatPrice(item?.price);
                                const detailLink = resolveResultLink(item);
                                const imageUrl = resolveResultImage(item);

                                return (
                                  <div
                                    key={`${message.id}-r-${idx}`}
                                    className="rounded-xl bg-white p-3 text-xs shadow-md"
                                    style={{
                                      border: "1px solid rgba(75,92,177,0.12)",
                                    }}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                        {imageUrl ? (
                                          <img
                                            src={imageUrl}
                                            alt={title}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                          />
                                        ) : (
                                          <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                                            Không có ảnh
                                          </div>
                                        )}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-1">
                                          <p className="line-clamp-2 font-semibold text-gray-900 leading-tight">
                                            {title}
                                          </p>
                                          <span className="shrink-0 rounded-md bg-[#4b5cb1]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#4b5cb1] uppercase">
                                            {type}
                                          </span>
                                        </div>
                                        {address && (
                                          <p className="mt-1 line-clamp-2 text-gray-500 leading-tight">
                                            📍 {address}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                                      {distanceText && (
                                        <span className="rounded-md bg-blue-50 px-2 py-1 text-blue-700 font-medium">
                                          🗺 {distanceText}
                                        </span>
                                      )}
                                      {priceText && (
                                        <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700 font-medium">
                                          💰 {priceText}
                                        </span>
                                      )}
                                      {item?.capacity && (
                                        <span className="rounded-md bg-amber-50 px-2 py-1 text-amber-700 font-medium">
                                          👥 {item.capacity} người
                                        </span>
                                      )}
                                    </div>

                                    {detailLink && (
                                      <div className="mt-2.5">
                                        <Link
                                          href={detailLink}
                                          className="inline-flex items-center gap-1 rounded-lg bg-[#4b5cb1] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#2d3a8c]"
                                          onClick={() => setOpen(false)}
                                        >
                                          Xem chi tiết →
                                        </Link>
                                      </div>
                                    )}
                                  </div>
                                );
                              },
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-end gap-2">
                <img
                  src="/logoDorm.png"
                  alt="AI"
                  className="h-6 w-6 rounded-full object-cover shrink-0 ring-1 ring-[#4b5cb1]/30"
                />
                <div
                  className="flex items-center gap-1 rounded-2xl rounded-bl-sm px-4 py-3 text-sm shadow-sm"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    border: "1px solid rgba(75,92,177,0.10)",
                  }}
                >
                  <span className="h-2 w-2 rounded-full bg-[#4b5cb1] animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-[#4b5cb1] animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-[#4b5cb1] animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>

          {/* ── INPUT AREA ── */}
          <form
            onSubmit={sendMessage}
            className="border-t bg-white px-3 pt-2.5 pb-3"
            style={{ borderColor: "rgba(75,92,177,0.12)" }}
          >
            {/* Quick reply suggestions */}
            <div className="mb-2 flex flex-wrap gap-1.5">
              {QUICK_REPLIES.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void sendQuestion(suggestion)}
                  disabled={loading}
                  className="rounded-full border border-[#4b5cb1]/25 bg-[#4b5cb1]/5 px-2.5 py-1 text-[11px] font-medium text-[#4b5cb1] transition hover:bg-[#4b5cb1]/15 disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendMessage(e as any);
                  }
                }}
                placeholder="Nhập câu hỏi về KTX..."
                rows={2}
                className="min-h-[44px] flex-1 resize-none rounded-xl border px-3 py-2 text-sm outline-none transition"
                style={{
                  borderColor: "rgba(75,92,177,0.25)",
                  background: "#f8f9ff",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#4b5cb1")}
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(75,92,177,0.25)")
                }
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="shrink-0 rounded-xl p-2.5 text-white shadow-md transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #4b5cb1, #2d3a8c)",
                }}
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
