# 💬 Chat.me

A full-stack real-time messaging platform that supports private chats, group communication, and user interaction through a scalable architecture and secure authentication system.

Built using a modern tech stack including **React (client-side UI)**, **Node.js + Express (server-side logic)**, **Socket.IO (real-time communication)**, and **PostgreSQL (relational database)**.

---

## 🚀 Features

- ✅ Users authentication
- 🔑 JWT authentication
- 📩 Email verification via Nodemailer
- 🔍 Search users and groups
- 🎉 Send requests to users
- 👥 Join / leave groups
- 🗑 Delete groups
- 🚫 Block / unblock users
- 💬 Real-time chat
- 🚪 Logout

---

## 🧩 Tech Stack

### Frontend

- React
- Axios
- React Router DOM
- Socket.io-client
- Sonner (notifications)

### Backend

- Node.js
- Express
- CORS
- Dotenv
- JSONWebToken (authentication)
- BCrypt (password hashing)
- Nodemailer (email verification)
- Cookie-parser
- Nanoid
- Date-fns
- Socket.io

### Database

- PostgreSQL
- pg

---

## 🏗️ Architecture

Project structure for **Chat.me**, a fullstack real-time chat application.

The backend follows an **MVC + Service + Repository pattern**, improving scalability and separation of concerns.

```
📁 chatme
├── 📁 client
│   ├── public
│   ├── src
│   └── ...
├── 📁 server
│   ├── src
│   │   ├── controllers
│   │   ├── db
│   │   ├── error
│   │   ├── io
│   │   ├── middlewares
│   │   ├── repositories
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   ├── app.js
│   │   ├── router.js
│   │   └── server.js
└── README.md
```

---

## 🔑 Authentication & Security

### Account Registration

- Users are stored in a **pending state** on registration
- A verification email is sent with a **one-time code (5 min expiration)**
- The server validates the code and activates the account
- On success, **access + refresh tokens** are issued via HTTP-only cookies

### Login

- Validates credentials
- Issues new access and refresh tokens

### Protected Routes

- Middleware validates access tokens
- If expired → refresh token is used
- If invalid → returns **401 Unauthorized**
- Client clears session and redirects to login

---

## 🌳 Environment Variables

### Client

```
VITE_SERVER_URL
```

### Server

#### Server Config

```
CLIENT_URL
PORT
NODE_ENV
```

#### Database

```
DB_USER
DB_HOST
DB_NAME
DB_PASSWORD
DB_PORT
```

#### Email (Nodemailer)

```
EMAIL
PASSWORD
```

#### JWT

```
ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET
```

### ⚠️ Important

To use **Nodemailer with Gmail**:

- Enable **2-Step Verification**
- Generate an **App Password**

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/TKbang-bang/chat.me.git
cd chat.me
```

### 2. Setup client

```
cd client
npm install
npm run dev
```

### 3. Setup server

```
cd server
npm install
npm run dev
```

---

## 👤 Author

- **TKBang-bang**
  👉 https://github.com/TKbang-bang/

---

## 📌 Notes

This project is designed as a **scalable backend-focused architecture**, ideal for learning:

- Real-time systems (Socket.IO)
- Authentication flows (JWT + refresh tokens)
- Clean architecture patterns (MVC + Services + Repositories)

---
