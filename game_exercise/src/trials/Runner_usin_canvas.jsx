import { useEffect, useRef } from "react";
import runnerImg from "../assets/runner.png"; // Ensure the path is correct

export default function Runner_usin_canvas() {
    const canvasRef = useRef(null);
    const frameWidth = 150; // Adjust to match one frame's width
    const frameHeight = 150; // Adjust to match one frame's height
    const totalFrames = 8; // Total frames in the sprite sheet
    const frameSpeed = 100; // Time per frame in milliseconds

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const image = new Image();
        image.src = runnerImg; // Ensure this correctly loads the image

        let frameIndex = 0;
        let animationId;
        
        const animate = () => {
            ctx.clearRect(0, 0, frameWidth, frameHeight); // Clear previous frame

            // Draw the specific frame from the sprite sheet
            ctx.drawImage(
                image,
                frameIndex * frameWidth, 0, // Crop X position
                frameWidth, frameHeight,    // Crop width & height
                0, 0,                       // Draw at (0,0) on canvas
                frameWidth, frameHeight     // Canvas display size
            );

            frameIndex = (frameIndex + 1) % totalFrames; // Loop animation
            animationId = setTimeout(() => requestAnimationFrame(animate), frameSpeed);
        };

        image.onload = () => animate(); // Start animation when image loads

        return () => clearTimeout(animationId); // Cleanup on unmount
    }, []);

    return <canvas ref={canvasRef} width={frameWidth} height={frameHeight} />;
}
