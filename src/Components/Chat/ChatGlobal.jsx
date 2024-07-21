import React, { useState, useEffect, useContext, useRef } from "react";
import io from "socket.io-client";
import { UserContext } from "../../toolbox/UserContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const socket = io(
    "https://f1149cff-e1b3-4284-92fe-839b7ebec444-00-2ks36pr5kcad7.worf.replit.dev:3002"
);

function App() {
    const { user } = useContext(UserContext);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [groupedMessages, setGroupedMessages] = useState([]);
    const messagesEndRef = useRef(null)

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

    useEffect(() => {
        const groupMessages = (msgs) => {
            const grouped = [];
            let currentGroup = null;

            msgs.forEach((msg) => {
                const msgDate = new Date(msg.createdAt);
                const formattedDate = format(msgDate, "PPP 'às' HH:mm", {
                    locale: ptBR,
                });
                const formattedTime = format(msgDate, "HH:mm", {
                    locale: ptBR,
                });

                if (currentGroup && currentGroup.userId === msg.userId) {
                    currentGroup.messages.push({
                        text: msg.text,
                        createdAt: formattedDate,
                        time: formattedTime,
                    });
                } else {
                    if (currentGroup) {
                        grouped.push(currentGroup);
                    }
                    currentGroup = {
                        userId: msg.userId,
                        username: msg.username,
                        avatar: msg.avatar,
                        messages: [
                            {
                                text: msg.text,
                                createdAt: formattedDate,
                                time: formattedTime,
                            },
                        ],
                    };
                }
            });

            if (currentGroup) {
                grouped.push(currentGroup);
            }

            return grouped;
        };

        setGroupedMessages(groupMessages(messages));
    }, [messages]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView();
        }
    }, [groupedMessages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit("chat message", {
                text: message,
                userId: user.id,
                username: user.username,
                avatar: user.avatar,
                createdAt: new Date(),
            });
            setMessage("");
        }
    };

    return (
        <main className="main--chat">
            <ul id="messages">
                {groupedMessages.map((group, index) => (
                    <li key={index} className="message-group">
                        <div className="msg_col">
                            <div className="msg_row mspecial">
                                <img
                                    src={`https://cdn.discordapp.com/avatars/${group.userId}/${group.avatar}.png`}
                                    alt={group.username}
                                />
                                <div className="msg_col">
                                    <div className="msg_row">
                                        <strong>{group.username}</strong>
                                        <small>
                                            {group.messages[0]?.createdAt}
                                        </small>
                                    </div>
                                    <div className="msg_line">
                                        <span>{group.messages[0]?.text}</span>
                                    </div>
                                </div>
                            </div>
                            {group.messages.slice(1).map((msg, idx) => (
                                <div className="msg_line" key={idx}>
                                    <small>{msg.time}</small>
                                    <span>{msg.text}</span>
                                </div>
                            ))}
                        </div>
                    </li>
                ))}
                <div ref={messagesEndRef} /> {}
            </ul>
            <form className="send__container" id="form" onSubmit={handleSubmit}>
                <input
                    id="input"
                    autoComplete="off"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button>Enviar</button>
            </form>
        </main>
    );
}

export default App;
