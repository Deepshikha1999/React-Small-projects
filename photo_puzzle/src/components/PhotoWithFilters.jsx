import { useEffect, useRef, useState } from "react";
import styles from "../styles/PhotoWithFilters";
import FILTERS from "../misc/filters";
import CARDS from "../misc/photocards";
import right from "../assets/right_arrow.png";
import left from "../assets/left_arrow.png";
import camera from "../../public/camera.png";
import reset from "../assets/reset.png";

const KEYS_CARD = Object.keys(CARDS);
const KEYS_FILTER = Object.keys(FILTERS);
const constraints = {
    video: {
        width: { ideal: 600 },  // Request higher to keep quality
        height: { ideal: 900 }, // Matches the 2:3 ratio
        facingMode: "user"      // Front camera
    }
};
export default function PhotoWithFilters({ }) {
    const [photo, setPhoto] = useState(null);
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const bgRef = useRef({});
    const [activeFilter, setActiveFilter] = useState(0);
    const [currentCat, setCurrentCat] = useState(0);
    const videoRef = useRef(null);
    const tempCanvas = useRef(null);
    const photoSize = useRef(null);

    useEffect(() => {
        if (photo) {
            if (!canvasRef.current || !isLoaded) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            canvas.width = 400;
            canvas.height = 600;

            ctxRef.current = ctx;
            createCard(ctx, 400, 600);
        }
        else {
            navigator.mediaDevices.getUserMedia(constraints)
                .then((stream) => {
                    videoRef.current.srcObject = stream;
                })
                .catch((err) => alert("Error in accessing camera: ", err));
        }

    }, [photo]);

    const takePhoto = () => {
        const video = videoRef.current;
        const canvas = tempCanvas.current;

        if (!video || !canvas) return;

        canvas.width = video.videoWidth / 2;
        canvas.height = (video.videoHeight/video.videoWidth) * (video.videoWidth / 2);
        photoSize.current = {
            width: canvas.width,
            height: canvas.height
        }
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

    const handleRetake = () => {
        setPhoto(null);
    }

    useEffect(() => {
        let keys = Object.keys(CARDS).filter((key, index) => CARDS[key].url != null);
        if (keys.length === 0) {
            setIsLoaded(true);
            return;
        }
        let count = 0;
        const handleCount = () => {
            count++;
            if (count == keys.length) {
                setIsLoaded(true)
            }
        }

        keys.forEach((key, index) => {
            let url = CARDS[key].url;
            const img = new Image();
            img.src = url;
            img.onload = handleCount;
            img.onerror = handleCount;
            bgRef.current[key] = img;
        })
    }, [])

    const createCard = (ctx, width, height) => {
        const bgImg = bgRef.current[KEYS_CARD[currentCat]];
        if (!bgImg?.complete) return;

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(bgImg, 0, 0, width, height);

        if (photo && photoSize.current) {
            // Drawing the Frame
            const [fw, fh] = [photoSize.current.width, photoSize.current.height];
            const [fx, fy] = [width / 2 - fw / 2, height / 2 - fh / 2];

            ctx.fillStyle = "#F0F1F2";
            ctx.beginPath();
            ctx.roundRect(fx, fy, fw, fh, 16);
            ctx.fill();
            const userImg = new Image();
            userImg.src = photo;
            userImg.onload = () => {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(fx + 10, fy + 10, fw - 20, fh - 20, 10);
                ctx.clip();
                ctx.filter = FILTERS[KEYS_FILTER[activeFilter]] || "none";
                ctx.drawImage(userImg, fx + 10, fy + 10, fw - 20, fh - 20);
                ctx.restore();
            };
        }
    }

    useEffect(() => {
        if (!photo || !canvasRef.current || !isLoaded) return;

        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        const { width, height } = canvas;
        ctxRef.current = ctx;

        createCard(ctx, width, height);

    }, [photo, isLoaded, activeFilter, currentCat])

    const handleNextCard = () => {
        setCurrentCat(prev => prev == KEYS_CARD.length - 2 ? 0 : prev + 1)
    }

    const handlePrevCard = () => {
        setCurrentCat(prev => prev == 0 ? KEYS_CARD.length - 2 : prev - 1)
    }

    const handleNextFilter = () => {
        setActiveFilter(prev => prev == KEYS_FILTER.length - 1 ? 0 : prev + 1)
    }

    const handlePrevFilter = () => {
        setActiveFilter(prev => prev == 0 ? KEYS_FILTER.length - 1 : prev - 1)
    }

    useEffect(() => {
        // Find the active button and scroll it to the center of the bar
        const activeBtn = document.querySelector(`button[data-filter="${activeFilter}"]`);
        if (activeBtn) {
            activeBtn.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        }
    }, [activeFilter]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // 1. Convert canvas to a data URL (PNG format)
        const imageURL = canvas.toDataURL("image/png");

        // 2. Create a virtual 'a' tag
        const link = document.createElement("a");
        link.href = imageURL;

        // 3. Set the filename (using the current category name for flair)
        const fileName = `photocard_${KEYS_CARD[currentCat] || 'capture'}.png`;
        link.download = fileName;

        // 4. Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="PhotoWithFilter" style={styles.PhotoWithFilter}>
            <div style={styles.preview} styles={styles.icon}>
                {!photo ? <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={styles.video}
                /> : <><img src={left} alt="left arrow" style={styles.icon} onClick={handlePrevCard} />
                    <canvas ref={canvasRef} style={styles.photoCard}></canvas>
                    <img src={right} alt="right arrow" style={styles.icon} onClick={handleNextCard} /></>}
            </div>

            {/** Hidden canvas */}
            <canvas ref={tempCanvas} style={{ display: "none" }}></canvas>

            <div style={styles.controlBar}>
                {!photo && <img src={camera} alt="Photo" style={styles.icon} onClick={takePhoto} />}
                {
                    photo &&
                    <>
                        <img src={left} alt="left arrow" style={styles.icon} onClick={handlePrevFilter} />
                        {/* <div style={styles.info}>{KEYS_FILTER[activeFilter]}</div> */}
                        <div style={styles.info}>
                            {KEYS_FILTER[activeFilter]}
                            {/* Small download button under the filter name */}
                            <div onClick={handleDownload} style={styles.downloadLabel}>SAVE PHOTO</div>
                        </div>
                        <img src={reset} alt="Flip" style={styles.icon} onClick={handleRetake} />
                        <img src={right} alt="right arrow" style={styles.icon} onClick={handleNextFilter} />
                    </>
                }
            </div>
        </div>
    )
}