import { useEffect, useRef, useState } from 'react';

export default function VideoRecord({}){
    const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);

  const startVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current.srcObject = stream;

    // Initialize MediaRecorder
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorderRef.current = recorder;

    // Collect data as it becomes available
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setRecordedChunks((prev) => prev.concat(e.data));
      }
    };

    // When stopped, create a playable URL
    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    };

    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    // Stop the camera hardware
    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    setRecording(false);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted style={{ width: '400px' }} />
      <br />
      {!recording ? (
        <button onClick={startVideo}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
      
      {videoUrl && (
        <div>
          <h3>Preview:</h3>
          <video src={videoUrl} controls style={{ width: '400px' }} />
          <br />
          <a href={videoUrl} download="my-video.webm">Download Video</a>
        </div>
      )}
    </div>
  );
}