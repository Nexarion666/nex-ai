const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 10000;

app.use(cors());
app.use(express.static("public"));
app.use("/output", express.static("output")); // Sert les vidéos générées

const upload = multer({ dest: "uploads/" });

ffmpeg.setFfmpegPath(ffmpegPath);

// Vérifie que les dossiers existent
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
if (!fs.existsSync("output")) fs.mkdirSync("output");

app.post("/generate", upload.single("image"), (req, res) => {
  const inputPath = req.file.path;
  const filename = `${Date.now()}.mp4`;
  const outputPath = path.join("output", filename);

  ffmpeg(inputPath)
    .loop(3)
    .outputOptions("-preset", "fast")
    .on("end", () => {
      fs.unlinkSync(inputPath);
      console.log("✅ Vidéo générée :", outputPath);
      res.json({ url: `/output/${filename}` });
    })
    .on("error", (err) => {
      console.error("❌ Erreur ffmpeg :", err.message);
      res.status(500).send("Erreur lors de la génération de la vidéo.");
    })
    .save(outputPath);
});

app.listen(port, () => {
  console.log(`🚀 Serveur actif sur http://localhost:${port}`);
});