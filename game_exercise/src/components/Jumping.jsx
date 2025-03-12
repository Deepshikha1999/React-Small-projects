import { useEffect, useRef, useState } from "react"
import jumpImg from "../assets/JumpingDog.png"

export default function Jumping({ }) {
    const jumpingRef = useRef(null)
    const frameWidth = 500;
    const frameHeight = 650;
    const totalFrames = [4, 2];
    const frameSpeed = 100;

    useEffect(() => {
        const jumpCanva = jumpingRef.current;
        if (!jumpCanva) return;

        const ctx = jumpCanva.getContext("2d");
        const image = new Image();
        image.src = jumpImg;

        let frameIndexWidth = 0;
        let frameIndexHeight = 0;
        let animationId;

        const animate = () => {
            ctx.clearRect(0, 0, frameWidth, frameHeight)

            ctx.drawImage(
                image,
                frameIndexWidth * frameWidth, frameIndexHeight * frameHeight,
                frameWidth, frameHeight,
                0, 0,
                frameWidth, frameHeight
            );

            frameIndexWidth = (frameIndexWidth + 1) % totalFrames[0];
            if (frameIndexWidth == 0)
                frameIndexHeight = (frameIndexHeight + 1) % totalFrames[1];
            animationId = setTimeout(() => requestAnimationFrame(animate), frameSpeed)
        };

        image.onload = () => animate();

        return () => clearTimeout(animationId);

    }, [])

    return (
        <canvas ref={jumpingRef} height={frameHeight} width={frameWidth} style={{
            transform: "scale(0.7)"
        }}></canvas>
    )
}