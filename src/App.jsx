import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserProvider, UserContext } from "./toolbox/UserContext";
import { Routes, Route, useParams } from "react-router-dom";

import "./Gearbox/Global";
import "./styles/Root.css";
import "./styles/App.css";
import "./styles/Profile.css";
import "./styles/Chat.css";
import "./styles/Mobile.css";

import AppNav from "./Components/AppNav";
import AppHeader from "./Components/AppHeader";
import AppMain from "./Components/AppMain";

import ProfileMain from "./Components/Profile/ProfileMain";
import ProfileEdit from "./Components/Profile/ProfileEdit";

import ChatGlobal from "./Components/Chat/ChatGlobal";
import ChatRooms from "./Components/Chat/ChatRooms";
import ChatDynamics from "./Components/Chat/ChatDynamics";

const MainApp = () => {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${window.location.origin}:3001/auth/user`,
          { withCredentials: true },
        );
        console.log(response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Usuário não autenticado");
      }
    };
    fetchUser();
  }, [setUser]);

  const handleLogin = () => {
    window.location.href = `${window.location.origin}:3001/auth/discord`;
  };

  console.log(user);
  if (user) {
    return (
      <div className="app__body dark">
        <AppNav />
        {/* <AppHeader /> */}
        <Routes>
          <Route path="/" element={<AppMain />} />
          <Route path="/profile/:userId" element={<ProfileMain />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/chat/rooms" element={<ChatRooms />} />
          <Route path="/chat/global" element={<ChatGlobal />} />
          <Route path="/chat/:roomId" element={<ChatDynamics />} />
          {/* Adicione outras rotas conforme necessário */}
        </Routes>
      </div>
    );
  } else {
    return (
      <main className="main--login dark">
        <img className="login__banner" src="/Assets/kIRC_nobg.png" />
        <button onClick={handleLogin}>Login com Discord</button>
      </main>
    );
  }
};

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}
