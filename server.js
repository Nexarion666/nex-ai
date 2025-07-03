const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// 🔓 Autoriser les requêtes depuis d'autres origines (CORS)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// 🚀 Route principale
app.get("/", (req, res) => {
  res.send("Bienvenue sur Nex-AI 🎉 Le site est EN LIGNE !");
});

// 🎯 Route protégée /generate
app.get("/generate", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token !== "123456abcXYZ") {
    return res.status(403).send("🚫 Accès refusé : Token invalide");
  }

  res.send("✅ Génération réussie depuis /generate !");
});

// 🎧 Écoute le port
app.listen(port, () => {
  console.log(`Nex-AI live sur le port ${port}`);
});