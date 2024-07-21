
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { UserProvider, UserContext } from "../toolbox/UserContext";

export default function AppNav() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  return (
    <main className="app__nav">
      <div className="nav__row">
        <img src={Twemoji['package']} alt="Package" />
        <span>Inventário</span>
      </div>
      <div className="nav__row" onClick={() => { navigate(`/profile/${user.id}`) }}>
        <img src={Twemoji['ribbon']} alt="Ribbon" />
        <span>Perfil</span>
      </div>
      <div className="nav__row" onClick={() => { navigate(`/profile/edit`) }}>
        <img src={Twemoji['ribbon']} alt="Ribbon" />
        <span>Editar Perfil</span>
      </div>
      <div className="nav__row">
        <img src={Twemoji['card_file_box']} alt="Card File Box" />
        <span>aaaaaa</span>
        <i className="fa-solid fa-plus"></i>
      </div>
    </main>
  );
}
