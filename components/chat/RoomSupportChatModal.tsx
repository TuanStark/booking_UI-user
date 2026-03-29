"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, MessageCircle, X, Lock, Loader2 } from "lucide-react";
import { io, Socket } from "socket.io-client";
import * as chatApi from "@/services/chatService";
import { setChatAuthToken } from "@/services/chatService";
import type { Conversation, Message } from "@/types/chat.types";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import { cn } from "@/utils/utils";

const CHAT_WS_URL = process.env.NEXT_PUBLIC_CHAT_WS_URL || "http://localhost:3013";

interface RoomSupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  roomNumber: string;
}

export default function RoomSupportChatModal({ isOpen, onClose, roomId, roomNumber }: RoomSupportChatModalProps) {
  const { isAuthenticated, accessToken, isLoading: authLoading } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Sync auth token into chatService module ─────────────
  useEffect(() => {
    setChatAuthToken(accessToken);
  }, [accessToken]);

  // ─── Socket.IO Connection ────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !accessToken || !isOpen) return;

    const socket = io(`${CHAT_WS_URL}/chat`, {
      auth: { token: accessToken },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
    });

    socket.on("new_message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
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
  }, [isAuthenticated, accessToken, isOpen]);

  // ─── Open chat: create/find conversation & load messages ─
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;

    let mounted = true;

    const initChat = async () => {
      if (conversation) {
        scrollToBottom();
        return;
      }

      setLoading(true);
      try {
        const conv = await chatApi.createConversation("room", roomId);
        if (!mounted) return;
        setConversation(conv);

        // Join socket room
        socketRef.current?.emit("join_conversation", { conversationId: conv.id });

        // Load messages
        const result = await chatApi.getMessages(conv.id);
        if (mounted) {
          setMessages(result.data.reverse());
          scrollToBottom();
        }
      } catch (err) {
        console.error("Failed to open chat:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initChat();

    return () => {
      mounted = false;
    };
  }, [isOpen, isAuthenticated, roomId, conversation]);

  // ─── Reset state on close ──────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      // Optional: don't clear conversation if we want them to reopen it fast during same session
      // setConversation(null);
      // setMessages([]);
    }
  }, [isOpen]);


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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>

        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col h-[70vh] max-h-[800px] animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Tư vấn phòng {roomNumber}</h2>
                <p className="text-xs text-blue-100">Đội ngũ hỗ trợ sẽ phản hồi sớm nhất</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content Area */}
          {authLoading ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : !isAuthenticated ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-900 w-full h-full">
              <div className="h-20 w-20 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Lock className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Yêu cầu đăng nhập</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
                Vui lòng đăng nhập để bắt đầu trò chuyện và nhận tư vấn chi tiết về phòng {roomNumber}.
              </p>
              <div className="flex gap-4 w-full max-w-xs">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Hủy
                </button>
                <Link
                  href="/auth/login"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 w-full h-full">
                {loading ? (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                    <MessageCircle className="h-12 w-12 text-blue-200 dark:text-blue-800" />
                    <p className="font-medium text-gray-600 dark:text-gray-300">Chào bạn! 👋</p>
                    <p className="text-sm">Hãy gửi câu hỏi về phòng {roomNumber} tại đây.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isUser = msg.senderRole === "USER";
                    return (
                      <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[15px] ${isUser
                              ? "bg-blue-600 text-white rounded-br-sm shadow-sm"
                              : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm shadow-sm border border-gray-100 dark:border-gray-700"
                            }`}
                        >
                          {!isUser && (
                            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Hỗ trợ viên</p>
                          )}
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                          <p className={`text-[11px] mt-1.5 text-right ${isUser ? "text-blue-100" : "text-gray-400 dark:text-gray-500"}`}>
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
                    <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-end gap-3">
                  <textarea
                    value={inputText}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn..."
                    rows={1}
                    className="min-h-[44px] max-h-32 flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-2.5 text-sm md:text-base outline-none transition focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="rounded-xl p-3 bg-blue-600 text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-sm"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
