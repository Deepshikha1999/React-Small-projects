import React, { useState, useRef } from "react";
import { FaMicrophone, FaStop, FaDownload } from "react-icons/fa";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        audioChunks.current = [];
      };

      mediaRecorder.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  const downloadAudio = () => {
    if (audioURL) {
      const link = document.createElement("a");
      link.href = audioURL;
      link.download = "recorded_audio.wav";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-bold">🎙️ React Vite Audio Recorder</h2>

      <button
        onClick={recording ? stopRecording : startRecording}
        className={`mt-4 px-4 py-2 rounded text-white ${
          recording ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {recording ? <FaStop /> : <FaMicrophone />}
        {recording ? " Stop Recording" : " Start Recording"}
      </button>

      {audioURL && (
        <div className="mt-4">
          <h3 className="text-lg">🔊 Recorded Audio:</h3>
          <audio controls src={audioURL} className="mt-2"></audio>
          <br />
          <button
            onClick={downloadAudio}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            <FaDownload /> Download Audio
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
