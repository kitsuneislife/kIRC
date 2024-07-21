import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../toolbox/UserContext";
import axios from "axios";

const path = "https://cdn.pollux.gg/";

const colorPalette = [
  ["#FF8080", "#80FF80", "#8080FF", "#80FFFF"],
  ["#FF80FF", "#FFFF80", "#FFFFFF", "#808080"],
];

const ProfileEdit = () => {
  const { user } = useContext(UserContext);
  const [userProfile, setUserProfile] = useState(null);
  const [userBackgrounds, setUserBackgrounds] = useState([]);
  const [userMedals, setUserMedals] = useState([]);
  const [initialProfile, setInitialProfile] = useState(null);
  const [btDis, setBtDis] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(user.id);
        const [userData, backgrounds, medalsResponse] = await Promise.all([
          axios.get(`${window.location.origin}:3001/api/user/${user.id}`, {
            withCredentials: true,
          }),
          axios.get(`${window.location.origin}:3001/api/user/${user.id}/bgs`, {
            withCredentials: true,
          }),
          axios.get(
            `${window.location.origin}:3001/api/user/${user.id}/medals`,
            { withCredentials: true },
          ),
        ]);

        if (backgrounds.data.length == 0)
          backgrounds.data = [
            {
              _id: "5a87b4d69eb025877471a394",
              id: "whales",
              code: "5zhr3HWlQB4OmyCBFyHbFuoIhxrZY6l6",
              droppable: true,
              buyable: true,
              type: "background",
              name: "Whales",
              tags: "whales simple",
              rarity: "C",
              public: true,
              meta: {
                legacy: true,
              },
              event: null,
            },
          ];
        if (medalsResponse.data.length == 0)
          medalsResponse.data = [
            {
              _id: "5ccaf233f126010c759ed01e",
              name: "Brazil",
              icon: "brazil",
              category: "flags",
              buyable: true,
              droppable: true,
              type: "medal",
              tags: "country flag",
              rarity: "SR",
              howto: "",
              public: false,
              BUNDLE: "World Flags 2.0",
              event: null,
            },
          ];

        const userMedalsData = medalsResponse.data || [];
        const equippedMedals = userData.data.profile.medals.map(
          (medalIndex) => {
            return userMedalsData.find((medal) => medal.icon === medalIndex);
          },
        );

        setUserProfile(userData.data);
        setInitialProfile(userData.data);
        setUserBackgrounds(backgrounds.data || []);
        setUserMedals(userMedalsData);
        setUserProfile((prevProfile) => ({
          ...prevProfile,
          profile: {
            ...prevProfile.profile,
            medals: equippedMedals,
          },
        }));
        setInitialProfile((prevProfile) => ({
          ...prevProfile,
          profile: {
            ...prevProfile.profile,
            medals: equippedMedals,
          },
        }));
      } catch (error) {
        console.error("Erro ao receber informações da API", error);
      }
    };

    fetchData();
  }, [user.id]);

  const isEqual = (obj1, obj2) => {
    return (
      obj1.tagLine === obj2.tagLine &&
      obj1.about === obj2.about &&
      obj1.color === obj2.color &&
      obj1.background === obj2.background &&
      obj1.medals.length === obj2.medals.length &&
      obj1.medals.every((medal, index) => medal === obj2.medals[index])
    );
  };

  const handleChange = (field, value) => {
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      profile: {
        ...prevProfile.profile,
        [field]: value,
      },
    }));
  };

  const handlePaletteColorClick = (color) => {
    handleChange("color", color);
  };

  const handleBackgroundChange = (event) => {
    const { value } = event.target;
    handleChange("background", value);
  };

  const handleEquipMedal = (medal) => {
    const index = userProfile.profile.medals.findIndex(
      (medal) => medal === null,
    );
    const newIndex = index !== -1 ? index : userProfile.profile.medals.length;

    if (newIndex < 9) {
      const updatedMedals = [...userProfile.profile.medals];
      updatedMedals[newIndex] = medal;
      handleChange("medals", updatedMedals);
    }
  };

  const handleUnequipMedal = (index) => {
    const updatedMedals = userProfile.profile.medals.filter(
      (_, idx) => idx !== index,
    );
    handleChange("medals", updatedMedals);
  };

  const handleDiscardChanges = () => {
    setUserProfile(initialProfile);
  };

  const handleSaveChanges = async () => {
    setBtDis(true);
    try {
      const response = await axios({
        method: "put",
        url: `${window.location.origin}:3001/api/user/`,
        data: {
          initialProfile,
          userProfile,
        },
      });
      /*const response = await axios.put(
        `${window.location.origin}:3001/api/user/`,
        { initialProfile, userProfile },
        { withCredentials: true },
      );*/
      setInitialProfile(userProfile);
      setBtDis(false);
      console.log("Alterações salvas com sucesso!", response.data);
    } catch (error) {
      setBtDis(false);
      console.error("Erro ao salvar alterações:", error);
    }
  };

  if (!userProfile) return <div>Carregando...</div>;
  
  const changesPending = !isEqual(userProfile.profile, initialProfile.profile);

  return (
    <main className="profile__main">
      <div className="profile__header">
        <div className="profile__header--left">
          <div className="profile__header__box--edit">
            <div className="profile__header__avatar">
              <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}/>
            </div>
            <div className="profile__header__nametag">
              <span>{userProfile.username}</span>
              <img
                src={`${path}/flairs/${userProfile.profile.flair}.png`}
                alt="Flair"
              />
            </div>
          </div>
          <div className="profile__header__form">
            <input
              className="profile__tagline__input"
              type="text"
              name="tagLine"
              placeholder="Tagline"
              value={userProfile.profile.tagLine}
              onChange={(e) => handleChange("tagLine", e.target.value)}
              maxLength={32}
              onInput={(e) => {
                e.target.value = e.target.value.replace(
                  /[^a-zA-Z0-9 !@#$%&*()/*\-+<>?À-ÿ]/g,
                  "",
                );
              }}
              required
            />
            <textarea
              className="profile__ptxt__input"
              type="text"
              name="about"
              placeholder="Texto pessoal"
              value={userProfile.profile.about}
              onChange={(e) => handleChange("about", e.target.value)}
              maxLength={128}
              onInput={(e) => {
                e.target.value = e.target.value.replace(
                  /[^a-zA-Z0-9 !@#$%&*()/*\-+<>?À-ÿ]/g,
                  "",
                );
              }}
              required
            />
          </div>
          <div
            className="profile__header__color"
            style={{
              borderLeft: `5px solid ${userProfile.profile.color}`,
            }}
          >
            <div className="profile__header__color__viewer">
              <input
                type="color"
                className="profile__header__color__input"
                style={{
                  background: `${userProfile.profile.color}`,
                }}
                value={userProfile.profile.color}
                onChange={(e) => handleChange("color", e.target.value)}
              />
            </div>
            <div className="profile__header__palette">
              {colorPalette.map((row, rowIndex) => (
                <div className="row" key={rowIndex}>
                  {row.map((color, index) => (
                    <div
                      key={index}
                      className="profile__header__palette__option"
                      style={{
                        backgroundColor: color,
                      }}
                      onClick={() => handlePaletteColorClick(color)}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="profile__header--right">
          <div className="phr__separator">
            <div
              className="profile__header__banner--edit"
              style={{
                border: `1px solid ${userProfile.profile.color}`,
                backgroundImage: `url(${path}/backdrops/${userProfile.profile.background}.png)`,
              }}
            >
              <select
                className="profile__header__banner__select"
                value={userProfile.profile.background}
                onChange={handleBackgroundChange}
              >
                {userBackgrounds.map((background) => (
                  <option key={background.code} value={background.code}>
                    {background.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="phr__separator">
            <div
              className="profile__header__sticker"
              style={{
                border: `1px solid ${userProfile.profile.color}`,
              }}
            >
              <img
                src={`${path}/stickers/${userProfile.profile.sticker}.png`}
                alt="Sticker"
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
                <div
                  key={index}
                  className="profile__header__medal"
                  onClick={() => handleUnequipMedal(index)}
                >
                  {userProfile.profile.medals[index] && (
                    <img
                      src={`${path}/medals/${userProfile.profile.medals[index].icon}.png`}
                      alt={`Medal ${userProfile.profile.medals[index].name}`}
                      title={userProfile.profile.medals[index].name}
                      draggable
                    />
                  )}
                </div>
              ))}
              <span>Medalhas</span>
            </div>
          </div>
          <div className="phr__separator">
            <div
              className="profile__header__medals"
              style={{
                border: `1px solid ${userProfile.profile.color}`,
              }}
            >
              {userMedals?.map((medal, index) => (
                <div key={medal.code} className="phm--all">
                  <img
                    src={`${path}/medals/${medal.icon}.png`}
                    alt={`Medal ${medal.name}`}
                    title={medal.name}
                    draggable
                    onClick={() => handleEquipMedal(medal)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {changesPending && (
        <div className="profile__save__modal">
          <span>Você possui alterações que não foram salvas.</span>
          <div>
            <button
              className={`button--cancel ${btDis && "button--disabled"}`}
              onClick={handleDiscardChanges}
            >
              <span>Descartar</span>
            </button>
            <button
              onClick={handleSaveChanges}
              className={btDis && "button--disabled"}
            >
              <span>Salvar</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProfileEdit;
