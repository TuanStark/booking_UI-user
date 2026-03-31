import type { Conversation, Message, ChatPaginationResult } from '@/types/chat.types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

/** Module-level access token synced from UserContext */
let _accessToken: string | null = null;
let _cachedSupportConversation: Conversation | null = null;
let _pendingSupportConversation: Promise<Conversation> | null = null;

/** Call this when UserContext provides an accessToken */
export function setChatAuthToken(token: string | null) {
  if (_accessToken !== token) {
    _cachedSupportConversation = null;
    _pendingSupportConversation = null;
  }
  _accessToken = token;
}

async function chatRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  if (!_accessToken) {
    throw new Error('Bạn cần đăng nhập để sử dụng chat');
  }
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${_accessToken}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

/** Create or find existing support conversation */
export async function createConversation(contextType?: string, contextId?: string): Promise<Conversation> {
  if (_cachedSupportConversation?.id) {
    return _cachedSupportConversation;
  }

  if (_pendingSupportConversation) {
    return _pendingSupportConversation;
  }

  _pendingSupportConversation = chatRequest<Conversation>('/chat/conversations', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Hỗ trợ khách hàng',
      contextType,
      contextId,
    }),
  })
    .then((conversation) => {
      _cachedSupportConversation = conversation;
      return conversation;
    })
    .finally(() => {
      _pendingSupportConversation = null;
    });

  return _pendingSupportConversation;
}

/** Get user's conversations */
export async function getMyConversations(): Promise<Conversation[]> {
  return chatRequest('/chat/conversations');
}

/** Get messages for a conversation */
export async function getMessages(conversationId: string, cursor?: string): Promise<ChatPaginationResult<Message>> {
  const params = new URLSearchParams({ limit: '30' });
  if (cursor) params.set('cursor', cursor);
  return chatRequest(`/chat/conversations/${conversationId}/messages?${params}`);
}

/** Send a message via REST (fallback) */
export async function sendMessageRest(conversationId: string, content: string): Promise<Message> {
  return chatRequest(`/chat/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

/** Mark conversation as read */
export async function markAsRead(conversationId: string, messageId: string): Promise<void> {
  await chatRequest(`/chat/conversations/${conversationId}/read`, {
    method: 'POST',
    body: JSON.stringify({ messageId }),
  });
}
