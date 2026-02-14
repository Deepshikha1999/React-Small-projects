import { useEffect, useRef, useState } from 'react';

export default function ClickPic({ }) {
    const [photo, setPhoto] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    //1. Start the camera
    useEffect(() => {
        if (photo) return;
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
            })
            .catch((err) => console.error("Error in accessing camera: ", err))
    }, [photo])

    const takePhoto = () => {
        const width = 500;
        const height = (videoRef.current.videoHeight / videoRef.current.videoWidth) * width;

        const canvas = canvasRef.current;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0, width, height);

        // // Convert to base64 URL
        const data = canvas.toDataURL('image/png');
        setPhoto(data);
    }

    // retake picture
    const retakePhoto = () => {
        setPhoto(null);
    }

    return (
        <div className="PhotoFrame">
            {!photo && <>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: '400px' }} />
                <button onClick={takePhoto} style={{ margin: '10px', padding: '10px' }}>Snap Photo!</button>
            </>}
            <canvas ref={canvasRef} style={{ display: 'none' }} ></canvas>
            {photo && (
                <div>
                    <img src={photo} alt="Captured" />
                    <button onClick={retakePhoto} style={{ margin: '10px', padding: '10px' }}>Retake!</button>
                </div>
            )}
        </div>
    )
}