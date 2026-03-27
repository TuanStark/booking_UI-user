"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Send, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const question = input.trim();
      if (!question || loading) return;
      setInput("");
      void sendQuestion(question);
    }
  }

  return (
    <>
      {/* ── Nút mở chat ── */}
      {!open && (
        <button
          type="button"
          aria-label="Mở trợ lý KTX AI"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[70] h-14 w-14 overflow-hidden rounded-full bg-white p-0 shadow-2xl ring-2 ring-brand/30 transition-all duration-300 hover:scale-110 hover:ring-brand/60 active:scale-95"
          style={{ boxShadow: "0 8px 32px rgba(75,92,177,0.35)" }}
        >
          <Image
            src="/logoDorm.png"
            alt="KTX AI"
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        </button>
      )}

      {/* ── Khung chat ── */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-[70] flex h-[75vh] w-[390px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl"
          style={{
            boxShadow:
              "0 20px 60px rgba(75,92,177,0.25), 0 4px 16px rgba(0,0,0,0.12)",
            animation: "chatSlideUp 0.25s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <style>{`
            @keyframes chatSlideUp {
              from { opacity: 0; transform: translateY(24px) scale(0.96); }
              to   { opacity: 1; transform: translateY(0)   scale(1); }
            }
            @keyframes dotBounce {
              0%,80%,100% { transform: translateY(0); }
              40%          { transform: translateY(-6px); }
            }
            .dot-bounce { animation: dotBounce 1.2s infinite ease-in-out; }
            .dot-bounce:nth-child(2) { animation-delay: 0.15s; }
            .dot-bounce:nth-child(3) { animation-delay: 0.30s; }
          `}</style>

          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 text-white"
            style={{
              background: "linear-gradient(135deg, #4b5cb1 0%, #3a4a99 100%)",
            }}
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white/40 shadow-md">
              <Image
                src="/logoDorm.png"
                alt="KTX AI Logo"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold leading-tight tracking-wide">
                Trợ lý KTX AI
              </p>
              <p className="text-[11px] opacity-80">
                Tư vấn phòng ở theo nhu cầu của bạn
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 transition hover:bg-white/20 active:scale-90"
              aria-label="Đóng chatbot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Khu vực tin nhắn với nền logo mờ */}
          <div
            ref={messageListRef}
            className="relative flex-1 overflow-y-auto p-3"
            style={{ background: "#f5f6fb" }}
          >
            {/* Logo watermark */}
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <Image
                src="/logoDorm.png"
                alt=""
                width={180}
                height={180}
                className="select-none object-contain"
                style={{ opacity: 0.055 }}
              />
            </div>

            <div className="relative space-y-3">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  {message.role === "assistant" ? (
                    <div className="flex items-end gap-2">
                      {/* Avatar bot nhỏ */}
                      <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full border border-brand/20 shadow-sm">
                        <Image
                          src="/logoDorm.png"
                          alt="bot"
                          width={24}
                          height={24}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-sm ring-1 ring-black/5">
                        {message.text}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <div
                        className="max-w-[85%] rounded-2xl rounded-br-sm px-3.5 py-2.5 text-sm text-white shadow-sm"
                        style={{
                          background:
                            "linear-gradient(135deg, #4b5cb1, #3a4a99)",
                        }}
                      >
                        {message.text}
                      </div>
                    </div>
                  )}

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
                              <div className="flex flex-wrap gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setResultFilters((prev) => ({
                                      ...prev,
                                      [message.id]: "all",
                                    }))
                                  }
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                                    selectedFilter === "all"
                                      ? "bg-brand text-white shadow-sm"
                                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                  }`}
                                >
                                  Tất cả ({typedItems.length})
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setResultFilters((prev) => ({
                                      ...prev,
                                      [message.id]: "building",
                                    }))
                                  }
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                                    selectedFilter === "building"
                                      ? "bg-brand text-white shadow-sm"
                                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                  }`}
                                >
                                  Tòa nhà ({buildingCount})
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setResultFilters((prev) => ({
                                      ...prev,
                                      [message.id]: "room",
                                    }))
                                  }
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                                    selectedFilter === "room"
                                      ? "bg-brand text-white shadow-sm"
                                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                  }`}
                                >
                                  Phòng ({roomCount})
                                </button>
                              </div>

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
                                      className="rounded-xl border border-brand/10 bg-white p-3 text-xs shadow-sm transition hover:shadow-md"
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
                                          <div className="flex items-start justify-between gap-2">
                                            <p className="line-clamp-2 font-semibold text-gray-900">
                                              {title}
                                            </p>
                                            <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand">
                                              {type === "building"
                                                ? "Tòa nhà"
                                                : "Phòng"}
                                            </span>
                                          </div>
                                          {address && (
                                            <p className="mt-1 line-clamp-2 text-gray-500">
                                              {address}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                                        {distanceText && (
                                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
                                            📍 {distanceText}
                                          </span>
                                        )}
                                        {priceText && (
                                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                                            💰 {priceText}
                                          </span>
                                        )}
                                        {item?.capacity && (
                                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
                                            👥 {item.capacity} người
                                          </span>
                                        )}
                                      </div>
                                      {detailLink && (
                                        <div className="mt-2.5">
                                          <Link
                                            href={detailLink}
                                            className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-brand-dark"
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

              {/* Loading dots */}
              {loading && (
                <div className="flex items-end gap-2">
                  <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full border border-brand/20">
                    <Image
                      src="/logoDorm.png"
                      alt="bot"
                      width={24}
                      height={24}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
                    <span className="dot-bounce h-2 w-2 rounded-full bg-brand/60" />
                    <span className="dot-bounce h-2 w-2 rounded-full bg-brand/60" />
                    <span className="dot-bounce h-2 w-2 rounded-full bg-brand/60" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input area */}
          <form
            onSubmit={sendMessage}
            className="border-t border-gray-100 bg-white px-3 pb-3 pt-2"
          >
            <div className="mb-2 flex flex-wrap gap-1.5">
              {QUICK_REPLIES.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void sendQuestion(suggestion)}
                  disabled={loading}
                  className="rounded-full border border-brand/20 bg-brand/5 px-2.5 py-1 text-[11px] text-brand transition hover:bg-brand/10 disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi về KTX... "
                rows={2}
                className="min-h-[44px] flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-xl p-2.5 text-white transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #4b5cb1, #3a4a99)",
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
