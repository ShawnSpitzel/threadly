export interface User {
    id: string;
    username: string;
    avatar?: string;
  }
export interface Message {
    id?: string;
    message: string;
    author: User;
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