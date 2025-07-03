const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 10000;

// 👉 Middleware
app.use(cors()); // 🔓 Autorise toutes les origines (nécessaire pour HTML local)
app.use(express.static("public")); // Sert les fichiers HTML, CSS, etc.

const upload = multer({ dest: "uploads/" }); // Dossier temporaire pour les images

// 🧠 Spécifie à fluent-ffmpeg le chemin du binaire ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

// ✅ Crée le dossier 'output' s'il n'existe pas
if (!fs.existsSync("output")) {
  fs.mkdirSync("output");
}

// 🎬 Endpoint de génération
app.post("/generate", upload.single("image"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `output/${Date.now()}.mp4`;

  ffmpeg(inputPath)
    .loop(3) // Durée en secondes
    .outputOptions("-preset", "fast")
    .on("end", () => {
      console.log("✅ Vidéo prête :", outputPath);
      res.download(outputPath, () => {
        fs.unlinkSync(inputPath); // Nettoyage
        fs.unlinkSync(outputPath);
      });
    })
    .on("error", (err) => {
      console.error("❌ Erreur ffmpeg :", err.message);
      res.status(500).send("Erreur de traitement vidéo.");
    })
    .save(outputPath);
});

app.listen(port, () => {
  console.log(`🚀 Serveur actif sur http://localhost:${port}`);
});