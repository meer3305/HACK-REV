document.getElementById("upload-audio").addEventListener("click", () => {
    document.getElementById("audio-input").click();
  });
  
  document.getElementById("audio-input").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      processAudio(file);
    }
  });
  
  document.getElementById("record-audio").addEventListener("click", () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Audio recording is not supported in your browser.");
      return;
    }
  
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      let audioChunks = [];
  
      mediaRecorder.start();
      updateStatus("Recording...");
  
      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });
  
      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        processAudio(audioBlob);
        updateStatus("Processing audio...");
      });
  
      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000); // Stop recording after 5 seconds
    });
  });
  
  function processAudio(audio) {
    updateStatus("Uploading audio for analysis...");
    const formData = new FormData();
    formData.append("audio", audio);
  
    fetch("https://your-backend-endpoint/analyze", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("trust-score").textContent = `Trust Score: ${data.trustScore}`;
        document.getElementById("classification").textContent = `Classification: ${data.classification}`;
        document.getElementById("result").classList.remove("hidden");
        updateStatus("Analysis complete.");
      })
      .catch((error) => {
        console.error(error);
        updateStatus("Error analyzing audio.");
      });
  }
  
  function updateStatus(message) {
    document.getElementById("status").textContent = message;
  }
  