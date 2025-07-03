const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Autoriser toutes les requêtes (CORS)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// Préparer l’upload d’image
const upload = multer({ dest: "uploads/" });

// Route POST /generate qui reçoit une image et crée une vidéo
app.post("/generate", upload.single("image"), (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token !== "123456abcXYZ") return res.status(403).send("Token invalide");

  const inputPath = req.file.path;
  const outputPath = `outputs/${Date.now()}.mp4`;

  ffmpeg()
    .input(inputPath)
    .loop(5) // 5 secondes
    .fps(25)
    .outputOptions("-pix_fmt yuv420p")
    .save(outputPath)
    .on("end", () => {
      res.sendFile(path.resolve(outputPath), () => {
        fs.unlinkSync(inputPath); // Supprimer image après usage
        setTimeout(() => fs.unlinkSync(outputPath), 10000); // Supprimer vidéo après 10 sec
      });
    })
    .on("error", (err) => {
      console.error(err);
      res.status(500).send("Erreur génération vidéo");
    });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur live sur le port ${port}`);
});