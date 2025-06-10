//The pool that all clients will connect to 
package websocket
import (
	"fmt"
	"math/rand"
	"time"
	"strconv"
)
type Pool struct {
	Connect chan *Client // Channel for new clients to connect
	Disconnect chan *Client // Channel for clients to disconnect
	Broadcast chan Message // Channel for broadcasting messages to all clients
	Clients map[*Client]bool
}
func NewPool() *Pool {
	return &Pool{
		Connect:    make(chan *Client),
		Disconnect: make(chan *Client),
		Broadcast:  make(chan Message),
		Clients:    make(map[*Client]bool),
	}
}
func getTime() string {
	now := time.Now()
	formatted := now.Format("3:04 PM")
	return formatted
}
func makeId() string {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	num := r.Intn(90000) + 10000
	return strconv.Itoa(num)
}
func (pool *Pool) Start() {
	for {
		select{
		case client := <-pool.Connect: //in the case our client connects to the pool
			pool.Clients[client] = true 
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			for client := range pool.Clients {
                fmt.Println(client)
                client.Conn.WriteJSON(Notification{ID: makeId(), DataType: 1, Message: "New User Joined...",  MessageType: "notification", NotificationType: "join", Timestamp: getTime()})
            }
		case client := <-pool.Disconnect: //in the case our client disconnects from the pool
            delete(pool.Clients, client)
            fmt.Println("Size of Connection Pool: ", len(pool.Clients))
            for client, _ := range pool.Clients {
                client.Conn.WriteJSON(Notification{ID: makeId(), DataType: 1, Message: "User Disconnected..." ,MessageType: "notification", NotificationType: "leave", Timestamp: getTime()})
            }
		case message := <-pool.Broadcast:
            fmt.Println("Sending message to all clients in Pool")
            for client := range pool.Clients {
                if err := client.Conn.WriteJSON(Message{ID: makeId(), DataType: 1, Message: message.Message, AuthorId: message.AuthorId, Timestamp: getTime(), MessageType: "message"}); err != nil {
                    fmt.Println(err)
                    return
                }
            }
		}
	}
}