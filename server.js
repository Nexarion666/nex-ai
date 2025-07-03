const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

ffmpeg.setFfmpegPath(ffmpegPath);
if (!fs.existsSync("outputs")) fs.mkdirSync("outputs");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// Multer pour image + prompt texte
const upload = multer({ dest: "uploads/" });

app.post("/generate", upload.single("image"), (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token !== "123456abcXYZ") return res.status(403).send("Token invalide");

  const inputPath = req.file.path;
  const outputPath = path.join("outputs", Date.now() + ".mp4");
  const prompt = req.body.prompt?.trim();

  console.log("✅ Image reçue");
  console.log("🧠 Prompt reçu :", prompt || "(vide)");

  // → Ici on ne fait pas encore parler l’image, mais c’est prêt
  ffmpeg()
    .input(inputPath)
    .loop(5)
    .fps(25)
    .outputOptions("-pix_fmt yuv420p")
    .save(outputPath)
    .on("end", () => {
      res.sendFile(path.resolve(outputPath), () => {
        fs.unlinkSync(inputPath);
        setTimeout(() => fs.existsSync(outputPath) && fs.unlinkSync(outputPath), 10000);
      });
    })
    .on("error", (err) => {
      console.error("❌ Erreur ffmpeg :", err.message);
      res.status(500).send("Erreur lors de la génération vidéo.");
    });
});

app.listen(port, () => {
  console.log(`✅ Serveur actif sur le port ${port}`);
});