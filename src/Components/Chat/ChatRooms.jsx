import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("https://f1149cff-e1b3-4284-92fe-839b7ebec444-00-2ks36pr5kcad7.worf.replit.dev:3002");

function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Listen for room creation and updates
        socket.on("room created", (roomId) => {
            setRooms((prevRooms) => [...prevRooms, roomId]);
        });

        // Clean up on unmount
        return () => {
            socket.off("room created");
        };
    }, []);

    const handleCreateRoom = () => {
        if (newRoom) {
            socket.emit("create room", newRoom);
            setNewRoom("");
        }
    };

    const handleJoinRoom = (roomId) => {
        navigate(`/chat/${roomId}`);
    };

    return (
        <div className="room-list-container">
            <div className="room-management">
                <input
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    placeholder="Nome da nova sala"
                />
                <button onClick={handleCreateRoom}>Criar Sala</button>
            </div>
            <div className="room-selector">
                <h3>Salas Disponíveis:</h3>
                <ul>
                    {rooms.map((room, index) => (
                        <li key={index}>
                            <button onClick={() => handleJoinRoom(room)}>
                                {room}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default RoomList;
