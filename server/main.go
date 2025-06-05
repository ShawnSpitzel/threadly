package main
import (
	"log"
	"net/http"
	"github.com/ShawnSpitzel/chat-app-go/pkg/websocket" 
)

func serveWebSocket(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	ws, err := websocket.Upgrade(w, r) // Upgrade HTTP connection to WebSocket
	if err != nil {
		log.Println("Error upgrading connection:", err)
	} 
	client := &websocket.Client{
		Conn: ws,
		Pool: pool,
	}
	pool.Connect <- client // Add the new client to the pool
	client.Read()
}
func setupRoutes() {
	pool := websocket.NewPool()
	go pool.Start()
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
        serveWebSocket(pool, w, r)
    })
}
func main(){
	setupRoutes()
	http.ListenAndServe(":8080", nil)
}