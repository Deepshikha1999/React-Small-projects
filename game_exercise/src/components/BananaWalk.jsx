import { useEffect, useRef } from "react"
import bananaImg from "../assets/BananaWalk.png"
export default function BananaWalk({ }) {
    const bananaWalkRef = useRef(null)
    const frameHeight = 450;
    const frameWidth = 500;
    const totalFrames = [2, [4, 4]];
    const frameSpeed = 100;

    useEffect(() => {
        const bananaCanva = bananaWalkRef.current;
        if (!bananaCanva) return;

        const ctx = bananaCanva.getContext("2d");
        const image = new Image();
        image.src = bananaImg;

        let frameWidthIndex = 0;
        let frameHeightIndex = 0;
        let animationId;

        const animate = () => {
            ctx.clearRect(0, 0, frameWidth, frameHeight)

            ctx.drawImage(
                image,
                frameWidthIndex * frameWidth, frameHeightIndex * frameHeight,
                frameWidth, frameHeight,
                0, 0,
                frameWidth, frameHeight
            );

            frameWidthIndex = (frameWidthIndex + 1) % totalFrames[1][frameHeightIndex];
            if (frameWidthIndex == 0) {
                frameHeightIndex = (frameHeightIndex + 1) % totalFrames[0];
            }
            animationId = setTimeout(() => requestAnimationFrame(animate), frameSpeed)
        };

        image.onload = () => animate()
        return () => clearTimeout(animationId)
    }, [])

    return (
        <canvas ref={bananaWalkRef} height={frameHeight} width={frameWidth} style={{
            transform: "scale(0.7)"
        }}></canvas>
    )
}