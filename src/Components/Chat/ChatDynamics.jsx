import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("https://f1149cff-e1b3-4284-92fe-839b7ebec444-00-2ks36pr5kcad7.worf.replit.dev:3002");

function ChatRoom() {
    const { roomId } = useParams();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.emit("join room", roomId);

        socket.on("chat message", (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socket.emit("request history", roomId);

        socket.on("chat history", (msgs) => {
            if (Array.isArray(msgs)) {
                setMessages(msgs);
            } else {
                setMessages([]);
            }
        });

        return () => {
            socket.off("chat message");
            socket.off("chat history");
        };
    }, [roomId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit("chat message", {
                text: message,
                roomId,
                createdAt: new Date(),
            });
            setMessage("");
        }
    };

    return (
        <div className="chat-room-container">
            <h2>Sala: {roomId}</h2>
            <ul id="messages">
                {messages.map((msg, index) => (
                    <li key={index}>{msg.text}</li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <input
                    autoComplete="off"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button>Enviar</button>
            </form>
        </div>
    );
}

export default ChatRoom;
