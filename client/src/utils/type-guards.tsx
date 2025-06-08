import { Message, Notification } from "@/types";


type ChatItem = (Message) | (Notification);
export function isMessage(item: ChatItem): item is Message {
    return (item as Message).message !== undefined;
  }
  
export function isNotification(item: ChatItem): item is Notification {
    return (item as Notification).type !== undefined;
}