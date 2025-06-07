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
    message: string;
    author: User;
    channel: ChatRoom;
    timestamp: string;
    isUser: boolean;
}
export interface Notification {
    id?: string;
    type: 'join' | 'leave';
    author: User;
    timestamp: string;
}
export type ChatItem = (Message) | (Notification);