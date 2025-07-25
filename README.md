# 🔗 Distributed Chat App
A scalable, real-time chat application built with Go, React, MongoDB, Redis, and WebSockets. Designed for low-latency message delivery and horizontal scalability, supporting multiple concurrent users across distributed nodes.

## ⚙️ Tech Stack
- Backend: Go
  
- Frontend: React.js

- Database: MongoDB (message persistence, user data)

- Caching / Messaging: Redis (Pub/Sub, session store)

- Transport: WebSockets 

## 🚀 Features
- Real-time messaging with WebSocket connections

- Scalable message broadcasting using Redis Pub/Sub

- User authentication and session management

- Persistent chat history stored in MongoDB

- Clean, responsive React frontend

- Distributed deployment-ready architecture

## 🛠️ Running Locally
### Prerequisites
- Go ≥ 1.20

- Node.js ≥ 18.x

- MongoDB and Redis instances (local or Docker)

### 1. Clone the repo
`git clone https://github.com/ShawnSpitzel/Chat-App.git
cd distributed-chat-app`
### 2. Start backend
`cd server
go run main.go`
### 3. Start frontend
`cd client
npm install
npm run dev`


