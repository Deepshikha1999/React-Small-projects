import { useEffect, useRef, useState } from "react";
import camera from "../../public/camera.png";
import reset from "../assets/reset.png";
import start from "../assets/start.png";
import styles from "../styles/PhotoPuzzle";

const shuffleArray = (array) => {
    const shuffled = [...array]; // Create a copy so you don't mutate the original
    for (let i = shuffled.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements shuffled[i] and shuffled[j]
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const n = 4;
export default function PhotoPuzzle({ }) {
    const [photo, setPhoto] = useState(null);
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const [startGame, setStartGame] = useState(false);
    const gameCanvasRef = useRef(null);
    const ctxRef = useRef(null);
    const imageRef = useRef(null);
    const originalImageArrayRef = useRef([]);
    const jumbledImageArrayRef = useRef([]);
    const selectedRef = useRef(null);

    useEffect(() => {
        if (photo) {
            const image = new Image();
            image.src = photo;
            image.onload = () => {
                const canvas = gameCanvasRef.current;
                const ctx = canvas.getContext("2d");

                // Match canvas size to image size
                canvas.width = image.width;
                canvas.height = image.height;

                // Draw it!
                ctx.drawImage(image, 0, 0);

                imageRef.current = image;
                ctxRef.current = ctx;
            }
        }
        else {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    videoRef.current.srcObject = stream;
                })
                .catch((err) => alert("Error in accessing camera: ", err));
        }

    }, [photo]);

    const takePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const data = canvas.toDataURL("image/png");
        setPhoto(data);

        // Stop the camera stream to save battery
        const stream = video.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }

    const handleStart = () => {
        if (!imageRef.current || !gameCanvasRef.current || !ctxRef.current || !photo || startGame) {
            return;
        }

        const ctx = ctxRef.current;
        const image = imageRef.current;

        ctx.clearRect(0, 0, image.width, image.height);
        let arr = [];
        for (let j = 0; j < n; j++) {
            for (let i = 0; i < n; i++) {
                arr.push({
                    i: i,
                    j: j
                })
            }
        }

        let j_arr = shuffleArray(arr);

        originalImageArrayRef.current = arr;
        jumbledImageArrayRef.current = j_arr;

        const h = image.height / n;
        const w = image.width / n;
        j_arr.forEach((p, index) => {
            const destX = (index % n) * w;
            const destY = Math.floor(index / n) * h;

            const sourceX = p.i * w;
            const sourceY = p.j * h;

            ctx.drawImage(
                image,
                sourceX, sourceY, w, h,
                destX, destY, w, h
            );

            ctx.strokeStyle = "white";
            ctx.lineWidth = 1;
            ctx.strokeRect(destX, destY, w, h);
        });

        setStartGame(true);
    }

    const handleShuffle = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        if (!imageRef.current || !gameCanvasRef.current || !ctxRef.current || !startGame) {
            return;
        }

        const ctx = ctxRef.current;
        const j_arr = jumbledImageArrayRef.current;
        const image = imageRef.current;

        const h = image.height / n;
        const w = image.width / n;

        let match = -1;
        j_arr.forEach((p, index) => {
            const destX = (index % n) * w;
            const destY = Math.floor(index / n) * h;

            if (destX < offsetX && destX + w > offsetX && destY < offsetY && destY + h > offsetY) {
                match = index;
            }
        });

        if (match === -1) return;
        if (selectedRef.current === null) {
            selectedRef.current = match;
        }
        else {
            if (selectedRef.current !== match) {
                [j_arr[match], j_arr[selectedRef.current]] = [j_arr[selectedRef.current], j_arr[match]];
            }
            selectedRef.current = null;
        }

        jumbledImageArrayRef.current = j_arr;
        ctx.clearRect(0, 0, image.width, image.height)
        j_arr.forEach((p, index) => {
            const destX = (index % n) * w;
            const destY = Math.floor(index / n) * h;

            const sourceX = p.i * w;
            const sourceY = p.j * h;

            ctx.drawImage(
                image,
                sourceX, sourceY, w, h,
                destX, destY, w, h
            );

            if (selectedRef.current === index) {
                ctx.strokeStyle = "yellow";
                ctx.lineWidth = 5;
            } else {
                ctx.strokeStyle = "white";
                ctx.lineWidth = 0.5;
            }
            ctx.strokeRect(destX, destY, w, h);
        });

        const isWin = checkAllInPlace(j_arr);
        if (isWin) {
            console.log("All done");
            setStartGame(false);
            selectedRef.current = null;
        }

    }

    const checkAllInPlace = (arr) => {
        const o_arr = originalImageArrayRef.current;

        const won = arr.every((p, index) =>
            p.i === o_arr[index].i && p.j === o_arr[index].j
        );

        if (won) {
            const ctx = ctxRef.current;
            const image = imageRef.current;
            ctx.drawImage(image, 0, 0);
            ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
            ctx.fillRect(0, 0, image.width, image.height);
        }

        return won;
    };

    const handleRetake = () => {
        setStartGame(false);
        setPhoto(null);
    }

    return (
        <div className="PhotoPuzzle" style={styles.PhotoPuzzle}>

            <div className="preview" style={styles.preview}>
                {!photo ? <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={styles.video}
                /> :
                    <canvas
                        ref={gameCanvasRef}
                        style={styles.video}
                        onClick={handleShuffle}></canvas>
                }
            </div>

            {/** Hidden canvas */}
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

            <div style={styles.controlBar}>
                <img src={camera} alt="Photo" style={styles.icon} onClick={takePhoto} />
                <img src={start} alt="Start" style={styles.startBtn} onClick={handleStart} />
                <img src={reset} alt="Flip" style={styles.icon} onClick={handleRetake} />
            </div>
        </div>
    )
}