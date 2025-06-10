import { Message, Notification } from "@/types";


type ChatItem = (Message) | (Notification);

export function isMessage(item: ChatItem): item is Message {
    return item.messageType === "message";
}
  
export function isNotification(item: ChatItem): item is Notification {
    if (item.messageType) {
      return item.messageType === "notification";
    }
}