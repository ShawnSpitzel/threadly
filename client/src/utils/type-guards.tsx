interface User {
  id: string;
  username: string;
  avatar?: string;
}
interface Message {
  id?: string;
  message: string;
  author: User;
  timestamp: string;
  isUser: boolean;
}
interface Notification {
  id?: string;
  type: 'join' | 'leave';
  author: User;
  timestamp: string;
}

type ChatItem = (Message) | (Notification);
export function isMessage(item: ChatItem): item is Message {
    return (item as Message).message !== undefined;
  }
  
export function isNotification(item: ChatItem): item is Notification {
    return (item as Notification).type !== undefined;
}