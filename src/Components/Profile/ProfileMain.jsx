import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const path = "https://cdn.pollux.gg/";

export default function AppMain() {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${window.location.origin}:3001/api/user/${userId}`,
          { withCredentials: true },
        );
        console.log(response.data);
        setUserProfile(response.data);
      } catch (error) {
        console.error("Erro ao receber informações da api", error);
      }
    };
    fetchUser();
  }, [userId]);

  if (!userProfile) {
    return <div>Carregando...</div>;
  }

  return (
    <main className="profile__main">
      <div className="profile__header">
        <div className="profile__header--left">
          <div
            className="profile__header__banner"
            style={{
              backgroundImage: `url(${path}/backdrops/${userProfile.profile.background}.png)`,
            }}
          >
            {" "}
          </div>
          <div className="profile__header__box">
            <div className="profile__header__avatar">
              <img src={userProfile.avatar} />
            </div>
            <div className="profile__header__nametag">
              <span>{userProfile.username}</span>
              <img src={`${path}/flairs/${userProfile.profile.flair}.png`} />
            </div>
          </div>
          <div className="profile__header__balance">
            <div className="profile__header__balance__cur">
              <div className="icon48 plx-rubine"></div>
              <span>{userProfile.RBN.toLocaleString("pt-BR")}</span>
            </div>
            <div className="profile__header__balance__cur">
              <div className="icon48 plx-sapphire"></div>
              <span>{userProfile.SPH.toLocaleString("pt-BR")}</span>
            </div>
            <div className="profile__header__balance__cur">
              <div className="icon48 plx-jade"></div>
              <span>{userProfile.JDE.toLocaleString("pt-BR")}</span>
            </div>
          </div>
          {/* <div className="profile__header__about">
            <span>{userProfile.profile.about}</span>
          </div> */}
        </div>
        <div className="profile__header--right">
          <div className="phr__separator">
            <div
              className="profile__header__sticker"
              style={{
                border: `1px solid ${userProfile.profile.color}`,
              }}
            >
              <img
                src={`${path}/stickers/${userProfile.profile.sticker}.png`}
              />
              {userProfile.profile.sticker ? (
                <span>{userProfile.profile.sticker}</span>
              ) : (
                <span>Nenhum</span>
              )}
            </div>
            <div
              className="profile__header__medals"
              style={{
                border: `1px solid ${userProfile.profile.color}`,
              }}
            >
              {[...Array(9)].map((_, index) => (
                <div className="profile__header__medal" key={index}>
                  {userProfile.profile.medals[index] && (
                    <img
                      src={`${path}/medals/${userProfile.profile.medals[index]}.png`}
                      alt={`Medal ${userProfile.profile.medals[index]}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
