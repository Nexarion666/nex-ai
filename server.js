const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static"); // ✅ Chemin dynamique vers le binaire ffmpeg
const fs = require("fs");
const path = require("path");

const app = express();
const port = 10000;

// Dossier où seront stockées temporairement les images uploadées
const upload = multer({ dest: "uploads/" });

// 🔧 Lien entre fluent-ffmpeg et le bon binaire ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

// Permet de servir animate.html et autres fichiers statiques
app.use(express.static("public"));

// Endpoint POST /generate
app.post("/generate", upload.single("image"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `output/${Date.now()}.mp4`;

  // ✅ S'assure que le dossier "output" existe
  if (!fs.existsSync("output")) {
    fs.mkdirSync("output");
  }

  console.log("🔧 Traitement de l'image :", inputPath);

  ffmpeg(inputPath)
    .loop(3) // par exemple 3 secondes
    .outputOptions("-preset", "fast")
    .on("end", () => {
      console.log("✅ Vidéo générée :", outputPath);
      res.download(outputPath, () => {
        fs.unlinkSync(inputPath); // nettoie après envoi
        fs.unlinkSync(outputPath);
      });
    })
    .on("error", (err) => {
      console.error("❌ Erreur ffmpeg :", err.message);
      res.status(500).send("Erreur pendant le traitement vidéo.");
    })
    .save(outputPath);
});

app.listen(port, () => {
  console.log(`✅ Serveur actif sur le port ${port}`);
});