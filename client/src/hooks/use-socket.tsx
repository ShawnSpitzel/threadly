import { ChatItem, Message, User, Notification} from '@/types';
import { useState, useEffect, useCallback } from 'react';
type ServerMessageResponse = {
    id: string;
    messageType: 'message';
    message: string;
    author?: User;
    timestamp?: string;
};

type ServerNotificationResponse = {
    id: string;
    messageType: 'notification';
    notificationType: 'join' | 'leave';
    message: string;
    author?: User;
    timestamp?: string;
};
type ServerResponse = ServerMessageResponse | ServerNotificationResponse;
export const useWebSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<ChatItem[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    const connect = useCallback(() => {
        console.log("Attempting Connection...");
        const ws = new WebSocket("ws://localhost:8080/ws");
        
        ws.onopen = () => {
            console.log("WebSocket connection established");
            setIsConnected(true);
        };
        
        ws.onmessage = (msg) => {
            
            try {
                const serverResponse: ServerResponse = JSON.parse(msg.data);
                
                if (serverResponse.messageType === 'message') {
                    const newMessage: Message = {
                        id: serverResponse.id,
                        message: serverResponse.message,
                        author: serverResponse.author || {
                            id: serverResponse.author?.id || '',
                            username: serverResponse.author?.username || 'Unknown',
                            avatar: serverResponse.author?.avatar || ''
                        },
                        timestamp: serverResponse.timestamp || new Date().toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        }),
                        isUser: false
                    };
                    
                    setMessages(prev => [...prev, newMessage]);
                    
                } else if (serverResponse.messageType === 'notification') {
                    const newNotification: Notification = {
                        id: Date.now().toString(),
                        type: serverResponse.notificationType,
                        author: serverResponse.author || {
                            id: 'system',
                            username: 'System',
                            avatar: ''
                        },
                        timestamp: serverResponse.timestamp || new Date().toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })
                    };
                    
                    setMessages(prev => [...prev, newNotification]);
                }
            } catch (error) {
                console.error('Error parsing server message:', error);
            }
        };
        
        ws.onclose = (event) => {
            console.log("WebSocket connection closed:", event);
            setIsConnected(false);
        };
        
        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            setIsConnected(false);
        };
        
        setSocket(ws);
    }, []);

    const sendMessage = (message: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        }
    };
    return {
        connect,
        sendMessage,
        messages,
        isConnected,
        clearMessages: () => setMessages([])
    };
};
