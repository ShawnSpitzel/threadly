//Each individual client within a pool
package websocket
import (
    "encoding/json"
    "log"
	"fmt"
    "github.com/gorilla/websocket"
)
//user object
type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Avatar   string `json:"avatar,omitempty"`
}
//client object
type Client struct {
	ID     string
	Conn   *websocket.Conn
	User User
	Pool   *Pool
}
//message object
type Message struct {
	ID string `json:"id"`
	DataType int `json:"dataType"`
	MessageType string `json:"messageType"`
	Message string `json:"message"`
	Author User `json:"author"`
	Timestamp string `json:"timestamp"`

}
//notification object
type Notification struct {
	ID string `json:"id"`
	DataType int `json:"DataType"`
	MessageType string `json:"messageType"`
	Message string `json:"message"`
	NotificationType string `json:"notificationType"`
	Author User `json:"author"`
	Timestamp string `json:"timestamp"`
}
type IncomingMessage struct {
    MessageType      string `json:"messageType"`
    Message   string `json:"message"`
    Author    User   `json:"author"`
    Timestamp string `json:"timestamp"`
}
//client read function
func (c *Client) Read() {
	//cleanup 
	defer func() {
		c.Pool.Disconnect <- c 
		c.Conn.Close()       
	}()
	//read each message and broadcast to pool
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
                Author:      c.User,
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
            Author:      incomingMsg.Author,
            Timestamp:   incomingMsg.Timestamp,  
        }

		c.Pool.Broadcast <- message
        fmt.Printf("Message Received: %+v\n", message)
	}
	}
}
