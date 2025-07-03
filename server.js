const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.static("."));

app.post("/generate", upload.single("init_image"), async (req, res) => {
  try {
    const form = new FormData();
    form.append("prompt", req.body.prompt);
    form.append("resolution", req.body.resolution || "512x512");
    form.append("duration", req.body.duration || "5");
    form.append("safe_mode", req.body.safe_mode === "false" ? "false" : "true");

    if (req.file) {
      form.append("init_image", fs.createReadStream(req.file.path));
    }

    const response = await fetch("https://api.venice.ai/v1/video/generate", {
      method: "POST",
      headers: {
        Authorization: "Bearer bd4ZEjRm_8EYpoWgJ9s-pOa1v9ObFOkH4lMcoPGe2e"
      },
      body: form
    });

    // 🔍 Voir la réponse brute même en cas d'erreur
    const text = await response.text();
    console.log("🔍 Réponse brute de Venice :", text);

    const data = JSON.parse(text);
    if (req.file) fs.unlinkSync(req.file.path);

    res.json(data);
  } catch (err) {
    console.error("❌ Erreur côté serveur :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.listen(3000, () => {
  console.log("✅ Serveur proxy lancé sur http://localhost:3000");
});