export interface User {
    id: string;
    username: string;
    avatar?: string;
  }
export interface ChatRoom {
  id: string;
  title: string;
  users: User[];
  chatHistory: ChatItem[];
  lastMessage: string;
  timestamp: string;
  isActive?: boolean;
}
export interface Message {
    id?: string;
    messageType: string;
    message: string;
    authorId: string;
    channelId: string;
    timestamp: string;
    isUser?: boolean;
}
export interface Notification {
    id?: string;
    messageType: string;
    type: 'join' | 'leave';
    authorId: string;
    channelId: string;
    timestamp: string;
}
export type ChatItem = (Message) | (Notification);