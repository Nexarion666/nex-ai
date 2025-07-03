<!DOCTYPE html>
<html>
<head>
  <title>Générateur Vidéo IA</title>
</head>
<body>
  <h2>🎬 Générateur IA avec image (facultatif)</h2>

  <label>Prompt :</label><br>
  <input type="text" id="prompt" placeholder="Un robot dans un désert futuriste" size="50"><br><br>

  <label>Image (facultatif) :</label><br>
  <input type="file" id="image"><br><br>

  <button onclick="generer()">GÉNÉRER</button>

  <div id="resultat" style="margin-top:20px;"></div>

  <script>
    async function generer() {
      const prompt = document.getElementById("prompt").value;
      const imageInput = document.getElementById("image").files[0];
      const resultatDiv = document.getElementById("resultat");
      
      resultatDiv.innerHTML = "⏳ Génération en cours...";

      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("resolution", "512x512");
      formData.append("duration", 5);
      formData.append("safe_mode", false);
      if (imageInput) {
        formData.append("init_image", imageInput);
      }

      try {
        const res = await fetch("/generate", {
          method: "POST",
          body: formData
        });

        const data = await res.json();
        if (data.video_url) {
          resultatDiv.innerHTML = `
            <h3>✅ Vidéo générée :</h3>
            <video controls autoplay loop width="512">
              <source src="${data.video_url}" type="video/mp4">
              Ton navigateur ne supporte pas la vidéo.
            </video>`;
        } else {
          resultatDiv.innerHTML = "<p>❌ Erreur : aucune vidéo reçue.</p>";
          console.error(data);
        }
      } catch (error) {
        resultatDiv.innerHTML = "<p>❌ Erreur réseau ou requête échouée.</p>";
        console.error(error);
      }
    }
  </script>
</body>
</html>