import React, { useEffect, useRef, useState } from "react";

const AudioFrequencyAnalyzer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      startAnalysis();
    } else {
      stopAnalysis();
    }
  }, [isRecording]);

  const startAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256; // Adjust FFT size (default: 2048)
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      source.connect(analyserRef.current);
      visualizeFrequency();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const visualizeFrequency = () => {
    if (!analyserRef.current) return;

    const updateFrequencyData = () => {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      console.log("Frequency Data:", dataArrayRef.current);
      requestAnimationFrame(updateFrequencyData);
    };

    updateFrequencyData();
  };

  const stopAnalysis = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-bold">🎤 Audio Frequency Analyzer</h2>
      <button
        className={`px-4 py-2 rounded text-white ${isRecording ? "bg-red-500" : "bg-green-500"}`}
        onClick={() => setIsRecording(!isRecording)}
      >
        {isRecording ? "Stop Analysis" : "Start Analysis"}
      </button>
    </div>
  );
};

export default AudioFrequencyAnalyzer;
