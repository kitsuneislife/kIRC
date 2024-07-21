import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserProvider, UserContext } from "../toolbox/UserContext";

export default function AppNav() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <main className="app__nav">
      <img
        className="nav__avatar"
        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
      />
      <span className="nav__username">{user.username}</span>

      <div
        className="nav__row"
        onClick={() => {
          navigate(`/chat/global`);
        }}
      >
        <img src={Twemoji["globe_showing_americas"]} alt="Global" />
        <span>Global</span>
      </div>
      <div
        className="nav__row"
        onClick={() => {
          navigate(`/chat/rooms`);
        }}
      >
        <img src={Twemoji["speech_balloon"]} alt="Chats" />
        <span>Chats</span>
      </div>
      <div className="nav__row">
        <img src={Twemoji["package"]} alt="Package" />
        <span>Inventário</span>
      </div>
      <div
        className="nav__row"
        onClick={() => {
          navigate(`/profile/${user.id}`);
        }}
      >
        <img src={Twemoji["ribbon"]} alt="Ribbon" />
        <span>Perfil</span>
      </div>
      <div
        className="nav__row"
        onClick={() => {
          navigate(`/profile/edit`);
        }}
      >
        <img src={Twemoji["ribbon"]} alt="Ribbon" />
        <span>Editar Perfil</span>
      </div>
      <div className="nav__row">
        <img src={Twemoji["card_file_box"]} alt="Card File Box" />
        <span>aaaaaa</span>
        <i className="fa-solid fa-plus"></i>
      </div>
      <div className="nav__opt">
        <i
          class="fa-brands fa-github"
          onClick={() => {
            window.location.href = "https://github.com/kitsuneislife/kIRC";
          }}
        ></i>
        <span className="nav__build">kIRC v0.0.1 ptBR</span>
      </div>
    </main>
  );
}
