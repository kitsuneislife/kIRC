import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { UserContext } from "../../toolbox/UserContext";

const socket = io("https://f1149cff-e1b3-4284-92fe-839b7ebec444-00-2ks36pr5kcad7.worf.replit.dev:3002");

function App() {
    const { user } = useContext(UserContext);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (user) {
            socket.emit("user info", user);
        }

        socket.on("chat message", (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socket.emit("request history");

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
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit("chat message", { text: message, userId: user.id });
            setMessage("");
        }
    };

    return (
        <div className="App">
            <ul id="messages">
                {messages.map((msg, index) => (
                    <li key={index}>
                        <img src={`https://cdn.discordapp.com/avatars/${msg.userId}/${msg.avatar}.png`} alt={msg.username} width="30" height="30" />
                        <strong>{msg.username}</strong>: {msg.text}
                    </li>
                ))}
            </ul>
            <form id="form" onSubmit={handleSubmit}>
                <input
                    id="input"
                    autoComplete="off"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button>Send</button>
            </form>
        </div>
    );
}

export default App;
