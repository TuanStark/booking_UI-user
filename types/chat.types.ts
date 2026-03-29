// TypeScript types for chat — shared between user UI components
export type ConversationType = 'SUPPORT';
export type ConversationStatus = 'ACTIVE' | 'ARCHIVED' | 'CLOSED';
export type ParticipantRole = 'USER' | 'ADMIN';
export type MessageType = 'TEXT' | 'SYSTEM';

export interface Conversation {
  id: string;
  type: ConversationType;
  status: ConversationStatus;
  title: string | null;
  userId: string;
  lastMessageText: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  participants: { userId: string; role: ParticipantRole; unreadCount: number }[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: ParticipantRole;
  type: MessageType;
  content: string;
  replyToId: string | null;
  isDeleted: boolean;
  isEdited: boolean;
  createdAt: string;
}

export interface ChatPaginationResult<T> {
  data: T[];
  pagination: { hasMore: boolean; nextCursor: string | null; limit: number };
}
