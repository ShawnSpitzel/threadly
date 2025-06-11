//Each individual client within a pool
package websocket
import (
    "encoding/json"
    "log"
	"fmt"
    "github.com/gorilla/websocket"
	"github.com/ShawnSpitzel/chat-app-go/pkg/redisdb"
)
//user object
type User struct {
	ID       string `json:"id" bson:"_id"`
	Username string `json:"username" bson:"username"`
	Avatar   string `json:"avatar,omitempty" bson:"avatar,omitempty"`
}
//client object
type Client struct {
	ID     string
	Conn   *websocket.Conn
	User User
	Pool   *Pool
	ChannelId string
}
type ChatRoom struct {
	ID string `json:"id" bson:"_id"`
	Title string `json:"title" bson:"title"`
	Users []User `json:"users" bson:"users"`
	ChatHistory []ChatItem `json:"chatHistory" bson:"chatHistory"`
	LastMessage string `json:"lastMessage" bson:"lastMessage"`
	Timestamp string `json:"timestamp" bson:"timestamp"`
}
//message object
type Message struct {
	ID string `json:"id" bson:"_id"`
	DataType int `json:"dataType" bson:"dataType"`
	MessageType string `json:"messageType" bson:"messageType"`
	Message string `json:"message" bson:"message"`
	ChannelId string `json:"channelId" bson:"channelId"`
	AuthorId  string   `json:"authorId" bson:"authorId"`
	Timestamp string `json:"timestamp" bson:"timestamp"`

}
//notification object
type Notification struct {
	ID string `json:"id" bson:"_id"`
	DataType int `json:"DataType" bson:"DataType"`
	MessageType string `json:"messageType" bson:"messageType"`
	Message string `json:"message" bson:"message"`
	ChannelId string `json:"channelId" bson:"channelId"`
	NotificationType string `json:"notificationType" bson:"notificationType"`
	AuthorId  string   `json:"authorId" bson:"authorId"`
	Timestamp string `json:"timestamp" bson:"timestamp"`
}
type ChatItem interface{}

type IncomingMessage struct {
    MessageType string `json:"messageType" bson:"messageType"`
    Message   string `json:"message" bson:"message"`
    AuthorId  string   `json:"authorId" bson:"authorId"`
	ChannelId string `json:"channelId" bson:"channelId"`
    Timestamp string `json:"timestamp" bson:"timestamp"`
}
type IncomingNotification struct {
    MessageType string `json:"messageType" bson:"messageType"`
    Message   string `json:"message" bson:"message"`
	NotificationType string `json:"notificationType" bson:"notificationType"`
    AuthorId  string   `json:"authorId" bson:"authorId"`
	ChannelId string `json:"channelId" bson:"channelId"`
    Timestamp string `json:"timestamp" bson:"timestamp"`
}
//client read function
func (c *Client) Read() {
	defer func() {
		c.Pool.Disconnect <- c 
		c.Conn.Close()       
	}()
	for {
		dataType, msg, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println("Error reading message:", err)
			return
		}
		var incomingMsg IncomingMessage
		if err := json.Unmarshal(msg, &incomingMsg); err != nil {
            log.Printf("Error parsing JSON message: %v, raw data: %s", err, string(msg))
            message := Message{
                ID:          makeId(),
                DataType:    dataType,
                MessageType: "message",
                Message:     string(msg),
                AuthorId:      "",
                Timestamp:   getTime(),
            }
            c.Pool.Broadcast <- message
            continue
        } else {
        message := Message{
            ID:          makeId(),
            DataType:    dataType,
            MessageType: "message",
            Message:     incomingMsg.Message,
            AuthorId:      incomingMsg.AuthorId,
			ChannelId: incomingMsg.ChannelId,
            Timestamp:   incomingMsg.Timestamp,  
        }
		if incomingMsg.MessageType == "join" {
			c.ChannelId = incomingMsg.ChannelId
			go c.listenToRedisChannel(incomingMsg.ChannelId) // 👈 Start Redis subscription
			log.Printf("Client %s joined channel %s\n", c.ID, c.ChannelId)
			return
		}

		c.Pool.Broadcast <- message
        fmt.Printf("Message Received: %+v\n", message)
	}
	}
}
func (c *Client) listenToRedisChannel(channelId string) {
	redisdb.Subscribe("chatroom:"+channelId, func(msg []byte) {
		log.Printf("Redis -> WS [%s]: %s", channelId, msg)
		err := c.Conn.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			log.Printf("WebSocket write error: %v", err)
		}
	})
}
