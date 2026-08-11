/**
 * RTDB Chat Data Models
 *
 * Path layout:
 *   /chat/{clientId}/messages/{messageId}  — one chat room per client
 *   /chat/{clientId}/typing/{userId}        — typing indicators
 *   /presence/{userId}                       — online presence
 */

export interface RtdbMessage {
  id: string;
  channelId: string;       // equals clientId
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'admin';
  senderAvatar: string;
  text: string;
  codeSnippet?: string | null;
  createdAt: number;        // Unix milliseconds (serverTimestamp fills this)
  readBy?: Record<string, boolean>;
}

export interface RtdbTypingStatus {
  userId: string;
  name: string;
  isTyping: boolean;
  updatedAt: number;
}
