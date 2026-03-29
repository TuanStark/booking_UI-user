"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, MessageCircle, X, Minus, Lock } from "lucide-react";
import { io, Socket } from "socket.io-client";
import * as chatApi from "@/services/chatService";
import { setChatAuthToken } from "@/services/chatService";
import type { Conversation, Message } from "@/types/chat.types";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";

const CHAT_WS_URL = process.env.NEXT_PUBLIC_CHAT_WS_URL || "http://localhost:3013";

/**
 * Floating support chat widget — User ↔ Admin real-time chat.
 * Positioned to the LEFT of the existing ChatBot AI widget.
 */
export default function SupportChatWidget() {
  const { isAuthenticated, accessToken, isLoading: authLoading } = useUser();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // ─── Sync auth token into chatService module ─────────────
  useEffect(() => {
    setChatAuthToken(accessToken);
  }, [accessToken]);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Socket.IO Connection ────────────────────────────────
  useEffect(() => {
    // Only connect if authenticated and open (or if we want background unread counts we can keep it connected)
    if (!isAuthenticated || !accessToken) return;

    const socket = io(`${CHAT_WS_URL}/chat`, {
      auth: { token: accessToken },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
    });

    socket.on("new_message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      if (!open || minimized) {
        setUnreadCount((c) => c + 1);
      }
      scrollToBottom();
    });

    socket.on("user_typing", (data: { role?: string }) => {
      if (data.role === "admin" || data.role === "ADMIN") {
        setIsTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
      }
    });

    socket.on("user_stop_typing", () => setIsTyping(false));

    socketRef.current = socket;
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, accessToken, open, minimized]);

  // ─── Open chat: create/find conversation & load messages ─
  const handleOpen = useCallback(async () => {
    setOpen(true);
    setMinimized(false);
    setUnreadCount(0);

    // If not authenticated, we just open the widget and show the "Login required" UI
    if (!isAuthenticated) return;

    if (conversation) {
      scrollToBottom();
      return;
    }

    setLoading(true);
    try {
      const conv = await chatApi.createConversation();
      setConversation(conv);

      // Join socket room
      socketRef.current?.emit("join_conversation", { conversationId: conv.id });

      // Load messages
      const result = await chatApi.getMessages(conv.id);
      setMessages(result.data.reverse());
      scrollToBottom();
    } catch (err) {
      console.error("Failed to open chat:", err);
    }
    setLoading(false);
  }, [conversation, isAuthenticated]);

  // ─── Send message ────────────────────────────────────────
  const handleSend = useCallback(() => {
    if (!inputText.trim() || !conversation || !isAuthenticated) return;

    socketRef.current?.emit("send_message", {
      conversationId: conversation.id,
      content: inputText.trim(),
    });
    setInputText("");
    socketRef.current?.emit("typing_stop", { conversationId: conversation.id });
  }, [inputText, conversation, isAuthenticated]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    if (conversation) {
      socketRef.current?.emit("typing_start", { conversationId: conversation.id });
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  if (authLoading) return null;

  return (
    <>
      {/* ── Floating button ── */}
      {!open && (
        <button
          type="button"
          aria-label="Mở hỗ trợ trực tuyến"
          onClick={handleOpen}
          className="fixed bottom-6 right-24 z-[69] h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
          style={{ boxShadow: "0 8px 32px rgba(16,185,129,0.35)" }}
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* ── Chat window ── */}
      {open && !minimized && (
        <div
          className="fixed bottom-6 right-24 z-[69] flex h-[70vh] w-[370px] max-w-[calc(100vw-100px)] flex-col overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl"
          style={{
            boxShadow: "0 20px 60px rgba(16,185,129,0.2), 0 4px 16px rgba(0,0,0,0.12)",
            animation: "chatSlideUp 0.25s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <style>{`
            @keyframes chatSlideUp {
              from { opacity:0; transform:translateY(24px) scale(.96) }
              to   { opacity:1; transform:translateY(0) scale(1) }
            }
          `}</style>

          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 text-white"
            style={{ background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)" }}
          >
            <div className="flex-1">
              <p className="text-[13px] font-bold">Hỗ trợ trực tuyến</p>
              <p className="text-[11px] opacity-80">Chat với đội ngũ hỗ trợ</p>
            </div>
            <button onClick={() => setMinimized(true)} className="p-1.5 hover:bg-white/20 rounded-full">
              <Minus className="h-4 w-4" />
            </button>
            <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/20 rounded-full">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content Area */}
          {!isAuthenticated ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gray-50/50">
              <div className="h-16 w-16 mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <Lock className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="text-gray-800 font-medium mb-2">Yêu cầu đăng nhập</p>
              <p className="text-sm text-gray-500 mb-6">
                Vui lòng đăng nhập để có thể trò chuyện trực tiếp với đội ngũ hỗ trợ của chúng tôi.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all hover:scale-105 active:scale-95 shadow-md"
                style={{ background: "linear-gradient(135deg, #10b981, #0d9488)" }}
                onClick={() => setOpen(false)}
              >
                Đăng nhập ngay
              </Link>
            </div>
          ) : (
            <>
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ background: "#f0fdf4" }}>
                {loading ? (
                  <div className="text-center text-sm text-gray-400 py-8">Đang tải...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-sm text-gray-400 py-8">
                    <p className="font-medium">Chào bạn! 👋</p>
                    <p className="mt-1">Hãy gửi tin nhắn để được hỗ trợ</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isUser = msg.senderRole === "USER";
                    return (
                      <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm ${
                            isUser
                              ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-sm"
                              : "bg-white text-gray-800 rounded-bl-sm shadow-sm ring-1 ring-black/5"
                          }`}
                        >
                          {!isUser && (
                            <p className="text-[10px] font-semibold text-emerald-600 mb-0.5">Hỗ trợ</p>
                          )}
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          <p className={`text-[10px] mt-0.5 ${isUser ? "text-emerald-100" : "text-gray-400"}`}>
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm ring-1 ring-black/5">
                      <div className="flex gap-0.5">
                        <span className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-100 bg-white px-3 pb-3 pt-2">
                <div className="flex items-end gap-2">
                  <textarea
                    value={inputText}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn..."
                    rows={1}
                    className="min-h-[40px] max-h-24 flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="rounded-xl p-2.5 text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #10b981, #0d9488)" }}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Minimized bar ── */}
      {open && minimized && (
        <button
          onClick={() => { setMinimized(false); setUnreadCount(0); }}
          className="fixed bottom-6 right-24 z-[69] flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:scale-105 transition-all"
        >
          <MessageCircle className="h-4 w-4" />
          Hỗ trợ
          {unreadCount > 0 && (
            <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      )}
    </>
  );
}
