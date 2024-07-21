
import React, { useState, useEffect, useContext } from "react";
import { UserProvider, UserContext } from "../toolbox/UserContext";

export default function AppHeader() {
  const { user, setUser } = useContext(UserContext);
  
  return (
    <main className="app__header">
      <div className="nav__profile">
        <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}/>
        <span>{user.username}</span>
        <i className="fa-solid fa-chevron-down"></i>
      </div>
    </main>
  )
}
