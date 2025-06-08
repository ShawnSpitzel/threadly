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
    author: User;
    channelId: String;
    timestamp: string;
    isUser?: boolean;
}
export interface Notification {
    id?: string;
    messageType: string;
    type: 'join' | 'leave';
    author: User;
    channelId: String;
    timestamp: string;
}
export type ChatItem = (Message) | (Notification);