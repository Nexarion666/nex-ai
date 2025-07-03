const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour autorisation
app.use((req, res, next) => {
  const auth = req.headers["authorization"];
  if (auth === "Bearer 123456abcXYZ") {
    next();
  } else {
    res.status(403).send("Accès refusé");
  }
});

// Route d'accueil
app.get("/", (req, res) => {
  res.send("Bienvenue sur Nex-AI !");
});

// ✅ Route /generate corrigée
app.get("/generate", (req, res) => {
  res.send("Génération réussie depuis /generate ✅");
});

app.listen(PORT, () => {
  console.log(`Serveur en ligne sur le port ${PORT}`);
});