package websocket
import (
	"log"
	"net/http"
	"github.com/gorilla/websocket"
)
var upgrader = websocket.Upgrader{
	ReadBufferSize: 1024,
	WriteBufferSize: 1024,
	//Do no checking, allow any connection
	CheckOrigin: func(r *http.Request) bool { return true },
}
func Upgrade(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	conn, err := upgrader.Upgrade(w, r, nil) // Upgrade HTTP connection to WebSocket
	if err != nil {
		log.Println("Error upgrading connection within websocket:", err)
		return nil, err
	}
	return conn, nil
}

	