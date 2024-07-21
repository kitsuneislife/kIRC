import http from "http";
import { Server } from "socket.io";
import express from "express";
import Database from "@replit/database";

const app = express();
const db = new Database();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const saveUser = async (userId, userInfo) => {
  let users = (await db.get("users")) || { value: [] };
  users = users.value;
  users[userId] = userInfo;
  await db.set("users", users);
};

const getUser = async (userId) => {
  let users = (await db.get("users")) || { value: [] };
  return users.value[userId];
};

const getFullMessages = async (messages) => {
  let users = (await db.get("users")) || { value: [] };
  users = users.value
  return messages.map(msg => ({
    ...msg,
    username: users[msg.userId] ? users[msg.userId].username : "Unknown",
    avatar: users[msg.userId] ? users[msg.userId].avatar : "Unknown",
  }));
};

io.on("connection", (socket) => {
  socket.on("user info", async (userInfo) => {
    let { id, username, avatar } = userInfo;
    await saveUser(id, { username, avatar });
  });

  socket.on("request history", async () => {
    let messages = (await db.get("messages")) || { value: [] };
    messages = messages.value
    let fullMessages = await getFullMessages(messages);
    socket.emit("chat history", fullMessages);
  });

  socket.on("chat message", async (msg) => {
    const user = await getUser(msg.userId);
    if (!user) {
      return;
    }

    let storedMessages = (await db.get("messages")) || { value: [] };
    storedMessages = storedMessages.value
    if (!Array.isArray(storedMessages)) {
      storedMessages = [];
    }

    storedMessages.push({
      text: msg.text,
      createdAt: new Date(),
      userId: msg.userId,
    });

    await db.set("messages", storedMessages);

    const fullMessage = {
      text: msg.text,
      createdAt: new Date(),
      userId: msg.userId,
      username: user.username,
      avatar: user.avatar,
    };

    io.emit("chat message", fullMessage);
  });

  socket.on("disconnect", () => {});
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Servidor WebSocket rodando na porta ${PORT}`);
});
