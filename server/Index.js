import express from "express";
import axios from "axios";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { initializeApp } from "@firebase/app";
import { getDatabase, ref, set, update, onValue } from "@firebase/database";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "fakekyde.firebaseapp.com",
  databaseURL: "https://fakekyde-default-rtdb.firebaseio.com",
  projectId: "fakekyde",
  storageBucket: "fakekyde.appspot.com",
  messagingSenderId: "486241215166",
  appId: "1:486241215166:web:c3ee4560340d9242ecf4ef",
  measurementId: "G-N38511HG81",
};

const fbapp = initializeApp(firebaseConfig);
const database = getDatabase(fbapp);

let URI =
  "https://522f218c-2579-4e40-884e-ff7107524681-00-1ikdcsak5olgv.janeway.replit.dev";
let authUrl = `https://discord.com/oauth2/authorize?client_id=705237517292798055&response_type=code&redirect_uri=https%3A%2F%2F522f218c-2579-4e40-884e-ff7107524681-00-1ikdcsak5olgv.janeway.replit.dev%3A3001%2Fauth%2Fcallback%2F&scope=identify`;

const app = express();

/*app.use(async(req, res, next) => {
  URI = req.headers.referer.slice(0, -1)
  next(); 
});*/

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = `${URI}:3001/auth/callback/`;
const FRONTEND_URI = URI;

// console.log(REDIRECT_URI);

app.use(cors({ origin: FRONTEND_URI, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/auth/user", (req, res) => {
  try {
    const userCookie = req.cookies.user;
    if (userCookie) {
      res.status(200).json(JSON.parse(userCookie));
    } else {
      res.status(404).json({ error: "Usuário não autenticado" });
    }
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/auth/discord", (req, res) => {
  res.redirect(authUrl);
});

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`,
      },
    });

    const user = userResponse.data;
    res.cookie("user", JSON.stringify(user), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.redirect(FRONTEND_URI);
  } catch (error) {
    console.error(error);
    res.send("Erro durante a autenticação.");
  }
});

app.get("/api/user/:id", async (req, res) => {
  try {
    let raw = await new Promise((resolve, reject) => {
      onValue(
        ref(database, `Users/${req.params.id}`),
        (snapshot) => {
          const data = snapshot.val();
          resolve(data);
        },
        { onlyOnce: true },
        (error) => {
          reject(error);
        },
      );
    });
    if (!raw) return res.status(404).send("User not found on Kanyon database");
    let user = {
      id: raw?.id ?? false,
      username: raw?.username || "Usuário",
      avatar:
        raw?.id && raw?.avatar
          ? `https://cdn.discordapp.com/avatars/${raw.id}/${raw.avatar}.png`
          : "https://cdn.discordapp.com/embed/avatars/0.png",
      level: 0,
      exp: 0,
      RBN: raw?.modules?.RBN || 0,
      JDE: raw?.modules?.JDE || 0,
      SPH: raw?.modules?.SPH || 0,
      isBlacklisted: false,
      profile: {
        background:
          raw?.modules?.favBackground || "5zhr3HWlQB4OmyCBFyHbFuoIhxrZY6l6",
        sticker: raw?.modules?.sticker || undefined,
        color: raw?.modules?.favColor || "#dd5383",
        flair: raw?.modules?.favFlair || "default",
        about:
          raw?.modules?.persotext ||
          "Eu não tenho um sobre-mim pois sou muuuuuito preguiçoso (a) pra colocar um c:",
        tagLine: raw?.modules?.tagLine || "",
        medals: Object.keys(raw?.modules?.medals ?? {}) || [],
      },
      inventorySize: false,
    };
    if (!user) return res.status(404).send("User not found on Kanyon database");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/api/user/:id/bgs", async (req, res) => {
  try {
    let raw = await new Promise((resolve, reject) => {
      onValue(
        ref(database, `Users/${req.params.id}/modules/backgroundInventory`),
        (snapshot) => {
          const data = snapshot.val();
          resolve(data);
        },
        { onlyOnce: true },
        (error) => {
          reject(error);
        },
      );
    });

    if (!raw) {
      return res.status(200).send([]);
    }

    const backgrounds = Object.values(raw);

    if (backgrounds.length === 0) {
      return res.status(200).send([]);
    }

    res.json(backgrounds);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/api/user/:id/medals", async (req, res) => {
  try {
    let raw = await new Promise((resolve, reject) => {
      onValue(
        ref(database, `Users/${req.params.id}/modules/medalInventory`),
        (snapshot) => {
          const data = snapshot.val();
          resolve(data);
        },
        { onlyOnce: true },
        (error) => {
          reject(error);
        },
      );
    });

    if (!raw) {
      return res.status(200).send([]);
    }

    const medals = Object.values(raw);

    if (medals.length === 0) {
      return res.status(200).send([]);
    }

    res.json(medals);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.put("/api/user/", async (req, res) => {
  try {
    let { initialProfile, userProfile } = req.body;
    if (!initialProfile || !userProfile)
      return res.status(400).send("Dados não fornecidos.");

    let path = `Users/${userProfile.id}`;
    let updates = {};
    updates[`${path}/modules/tagLine`] = userProfile.profile.tagLine;
    updates[`${path}/modules/persotext`] = userProfile.profile.about;
    updates[`${path}/modules/favBackground`] = userProfile.profile.background;
    updates[`${path}/modules/favColor`] = userProfile.profile.color;
    updates[`${path}/modules/medals`] = userProfile.profile.medals.reduce(
      (acc, medal) => {
        acc[medal.icon] = true;
        return acc;
      },
      {},
    );

    update(ref(database), updates);

    //console.log("Alterações realizadas com sucesso.");
    res.status(200).json({ message: "Alterações realizadas com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro no servidor");
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
