const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

if (!fs.existsSync("outputs")) fs.mkdirSync("outputs");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

const upload = multer({ dest: "uploads/" });
ffmpeg.setFfmpegPath(ffmpegPath);

app.post("/generate", upload.single("image"), (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token !== "123456abcXYZ") return res.status(403).send("Token invalide");

  const inputPath = req.file.path;
  const outputPath = path.join("outputs", Date.now() + ".mp4");

  ffmpeg()
    .input(inputPath)
    .loop(5)
    .fps(25)
    .outputOptions("-pix_fmt yuv420p")
    .save(outputPath)
    .on("end", () => {
      res.sendFile(path.resolve(outputPath), () => {
        fs.unlinkSync(inputPath);
        setTimeout(() => fs.unlinkSync(outputPath), 10000);
      });
    })
    .on("error", (err) => {
      console.error(err);
      res.status(500).send("Erreur génération vidéo");
    });
});

app.listen(port, () => {
  console.log(`✅ Serveur en ligne sur le port ${port}`);
});