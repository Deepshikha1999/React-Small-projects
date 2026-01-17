import { useEffect, useRef, useState } from "react"
import "./../styles/Sheet.css";
import imgSrc from "./../assets/IMG_1931.png";

export default function Sheet7({ }) {
    const canvasRef = useRef(null)
    const ctxRef = useRef(null)
    const lastTimeRef = useRef(0);
    const imgRef = useRef(null)
    const [backgroundSize, setBackgroundSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })
    const flipFlag = useRef(false);

    useEffect(() => {
        const disappear = (e) => {
            updateCanvas(e)
        }
        const backgroundChange = (e) => {
            setBackgroundSize({
                height: window.innerHeight,
                width: window.innerWidth,
            })
        }
        window.addEventListener("resize", backgroundChange)
        window.addEventListener("mousedown", disappear)
        return () => {
            window.removeEventListener("resize", backgroundChange)
            window.removeEventListener("mousedown", disappear)
        }
    }, [])


    useEffect(() => {
        if (!backgroundSize) return;
        const canvas = canvasRef.current;
        const ctx = !ctxRef.current ? canvas.getContext("2d") : ctxRef.current;
        ctxRef.current = ctx;
        const { width, height } = backgroundSize;
        canvas.width = width;
        canvas.height = height;


        ctx.fillStyle = "black";
        // ctx.fillRect(0, 0, width, height)

        // ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.strokeStyle = "rgba(0,0,0,0.7)";
        ctx.lineWidth = 1;

        const img = new Image();
        img.src = imgSrc;

        img.onload = () => {
            imgRef.current = img;
            let imageSize = {
                width: img.width,
                height: img.height
            }
            console.log(imageSize)
            // ctx.drawImage(img, 
            //     (width - imageSize.width) / 2, (height - imageSize.height) / 2
            //     )
            // ctx.drawImage(img,
            //     0, 0, 50, 50,
            //     (width - imageSize.width) / 2, (height - imageSize.height) / 2, 50, 50
            // )

            const tileSize = 50;
            const startX = (width - imageSize.width) / 2;
            const startY = (height - imageSize.height) / 2;

            // Draw tiles
            for (let sx = 0; sx < imageSize.width; sx += tileSize) {
                for (let sy = 0; sy < imageSize.height; sy += tileSize) {

                    ctx.drawImage(
                        img,
                        sx,
                        sy,
                        tileSize,
                        tileSize,
                        startX + sx,
                        startY + sy,
                        tileSize,
                        tileSize
                    );
                }
            }

            ctx.beginPath()
            for (let i = (width - imageSize.width) / 2; i <= (width + imageSize.width) / 2; i += 50) {
                ctx.moveTo(i, (height - imageSize.height) / 2)
                ctx.lineTo(i, (height + imageSize.height) / 2)
            }

            for (let i = (height - imageSize.height) / 2; i <= (height + imageSize.height) / 2; i += 50) {
                ctx.moveTo((width - imageSize.width) / 2, i)
                ctx.lineTo((width + imageSize.width) / 2, i)
            }
            ctx.stroke()



        };

    }, [backgroundSize])

    const updateCanvas = (e) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) {
            return;
        }
        const { width, height } = canvas;
        const img = imgRef.current;
        if (!img) return;

        const flag = flipFlag.current;
        let imageSize = {
            width: img.width,
            height: img.height
        }
        const tileSize = 50;
        const startX = (width - imageSize.width) / 2;
        const startY = (height - imageSize.height) / 2;

        ctx.clearRect(0, 0, width, height);
        if (flag) {
            for (let sx = 0; sx < imageSize.width; sx += tileSize) {
                for (let sy = 0; sy < imageSize.height; sy += tileSize) {

                    ctx.drawImage(
                        img,
                        sx,
                        sy,
                        tileSize,
                        tileSize,
                        startX + sx,
                        startY + sy,
                        tileSize,
                        tileSize
                    );
                }
            }
            ctx.strokeStyle = "black";
        }
        else {
            ctx.fillStyle = "black";
            ctx.fillRect(startX,startY,imageSize.width,imageSize.height)

            ctx.strokeStyle = "white";
        }
        ctx.beginPath()
            for (let i = (width - imageSize.width) / 2; i <= (width + imageSize.width) / 2; i += 50) {
                ctx.moveTo(i, (height - imageSize.height) / 2)
                ctx.lineTo(i, (height + imageSize.height) / 2)
            }

            for (let i = (height - imageSize.height) / 2; i <= (height + imageSize.height) / 2; i += 50) {
                ctx.moveTo((width - imageSize.width) / 2, i)
                ctx.lineTo((width + imageSize.width) / 2, i)
            }
            ctx.stroke()

        flipFlag.current = !flipFlag.current;
    }

    return (
        <div className="Sheet" style={{
            width: `${backgroundSize.width}px`,
            height: `${backgroundSize.height}px`

        }}>
            <canvas ref={canvasRef}></canvas>
            <div className = "message">Click to see changes !</div>
        </div>
    )
}