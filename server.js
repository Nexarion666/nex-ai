const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// 🔓 Middleware modifié : accès libre à "/"
app.use((req, res, next) => {
  if (req.path === "/") return next(); // autorise la page d’accueil

  const auth = req.headers["authorization"];
  if (auth === "Bearer 123456abcXYZ") {
    next();
  } else {
    res.status(403).send("Accès refusé");
  }
});

// ✅ Page d’accueil ouverte à tous
app.get("/", (req, res) => {
  res.send("Bienvenue sur Nex-AI 🎉 Le site est EN LIGNE !");
});

// 🔐 Route protégée
app.get("/generate", (req, res) => {
  res.send("Génération réussie depuis /generate ✅");
});

app.listen(PORT, () => {
  console.log(`Serveur en ligne sur le port ${PORT}`);
});