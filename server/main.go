package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/ShawnSpitzel/chat-app-go/pkg/websocket"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.mongodb.org/mongo-driver/v2/mongo/readpref"
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
func initDb() (*mongo.Collection, *mongo.Collection, *mongo.Collection, error, *mongo.Client) {
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI("mongodb+srv://theskaterdude911:hTxr0LgB5arw3TCG@threadly-chat-dev.oopdurm.mongodb.net/?retryWrites=true&w=majority&appName=threadly-chat-dev").SetServerAPIOptions(serverAPI)
	client, err := mongo.Connect(opts)
	if err != nil {
		panic(err)
	}
	db := client.Database("threadly-chat-dev")
	usersCollection := db.Collection("users")
	chatRoomsCollection := db.Collection("chatrooms")
	messagesCollection := db.Collection("messages")
	return usersCollection, chatRoomsCollection, messagesCollection, err, client
}
func handleCors(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
}
func getChatRoomMessages(messagesCollection *mongo.Collection, w http.ResponseWriter, r *http.Request) {
	handleCors(w, r)
	ctx := context.TODO()
	id := r.URL.Query().Get("id")
	documents, err := messagesCollection.Find(ctx, map[string]interface{}{"channelId": id})
	if err != nil {
		http.Error(w, "Failed to retrieve messages", http.StatusInternalServerError)
		return
	}
	var messages []bson.M
	var chatItems []websocket.ChatItem
	if err := documents.All(ctx, &messages); err != nil {
		http.Error(w, "Failed to decode messages", http.StatusInternalServerError)
		return
	}
	for _, item := range messages {
		if item["messageType"] == "message"{
			var msg websocket.Message
			bsonBytes, _ := bson.Marshal(item)
			bson.Unmarshal(bsonBytes, &msg)
			chatItems = append(chatItems, msg)
			fmt.Println("Message: ", msg)
		}
		if item["messageType"] == "notification"{
			var noti websocket.Notification
			bsonBytes, _ := bson.Marshal(item)
			bson.Unmarshal(bsonBytes, &noti)
			chatItems = append(chatItems, noti)
			fmt.Println("Notification: ", noti)
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(chatItems)
}
func handleMessageSend(messagesCollection *mongo.Collection, w http.ResponseWriter, r *http.Request) {
	handleCors(w, r)
	var msg websocket.IncomingMessage
	if err := json.NewDecoder(r.Body).Decode(&msg); err != nil {
		http.Error(w, "Invalid message data", http.StatusBadRequest)
		return
	}
	_, err := messagesCollection.InsertOne(context.TODO(), msg)
	if err != nil {
		http.Error(w, "Failed to send message", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
func handleNewChatRoom(chatRoomsCollection *mongo.Collection, w http.ResponseWriter, r *http.Request) {
	handleCors(w, r)
	var chatRoom websocket.ChatRoom
	if err := json.NewDecoder(r.Body).Decode(&chatRoom); err != nil {
		http.Error(w, "Invalid chat room data", http.StatusBadRequest)
		return
	}
	_, err := chatRoomsCollection.InsertOne(context.TODO(), chatRoom)
	if err != nil {
		http.Error(w, "Failed to create chat room", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}
func handleNewUser(usersCollection *mongo.Collection, w http.ResponseWriter, r *http.Request) {
	handleCors(w, r)
	var user websocket.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid user data", http.StatusBadRequest)
		return
	}
	_, err := usersCollection.InsertOne(context.TODO(), user)
	if err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}
func main() {
	usersCollection, chatRoomsCollection, messagesCollection, err, client := initDb()

	http.HandleFunc("/new-message", func(w http.ResponseWriter, r *http.Request) {
		handleMessageSend(messagesCollection, w, r)
	})
	http.HandleFunc("/new-chatroom", func(w http.ResponseWriter, r *http.Request) {
		handleNewChatRoom(chatRoomsCollection, w, r)
	})
	http.HandleFunc("/new-user", func(w http.ResponseWriter, r *http.Request) {
		handleNewUser(usersCollection, w, r)
	})
	http.HandleFunc("/chatroom-messages", func(w http.ResponseWriter, r *http.Request) {
		getChatRoomMessages(messagesCollection, w, r)
	})
	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()
	if err := client.Ping(context.TODO(), readpref.Primary()); err != nil {
		panic(err)
	}
	log.Println("Pinged your deployment. You successfully connected to MongoDB!")
	setupRoutes()
	http.ListenAndServe(":8080", nil)
}
