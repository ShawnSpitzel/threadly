# 🔗 Threadly
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
<pre>git clone https://github.com/ShawnSpitzel/Chat-App.git</pre>
<pre>cd distributed-chat-app</pre>
### 2. Start backend
<pre>cd server</pre>
<pre>go run main.go</pre>
### 3. Start frontend
<pre>cd client</pre>
<pre>npm install</pre>
<pre>npm run dev</pre>


