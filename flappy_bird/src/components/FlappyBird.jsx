import { useState, useEffect, useRef } from "react";
import Bird from "./FlappyBirdComponents/Bird";
import Clouds from "./FlappyBirdComponents/Clouds";
import Walls from "./FlappyBirdComponents/Walls";

export default function FlappyBird({ setStatus,setScore,setMessage,startGame }) {
    const birdRef = useRef(null);
    const [pos, setPos] = useState(100);
    const [clouds, setClouds] = useState([]);
    const [walls, setWalls] = useState([]);

    const cloudsRef = useRef([]); // Store refs for clouds
    const wallsRef = useRef([]); // Store refs for walls

    // Generate walls
    useEffect(() => {
        const generatedWalls = Array.from({ length: Math.floor(window.innerWidth / 200) }, (_, i) => ({
            id: i,
            left: i * 200,
        }));
        setWalls(generatedWalls);
    }, []);

    // Generate clouds
    useEffect(() => {
        const generatedClouds = Array.from({ length: Math.floor(window.innerWidth / 350) }, (_, i) => ({
            id: i,
            left: i * 350,
            top: Math.floor(Math.random() * 300),
        }));
        setClouds(generatedClouds);
    }, []);

    useEffect(() => {
        if (!birdRef.current) return; // Ensure birdRef is set before using it

        const timeinterval = setInterval(() => {
            if (birdRef.current.offsetLeft >= pos) {
                setScore(prevScore => prevScore + 1);
                setPos(prevPos => prevPos + 100);
            }
        }, 250);

        return () => clearInterval(timeinterval); // Cleanup interval on unmount
    }, [pos]); // Re-run effect when `pos` changes

    // Collision Detection
    useEffect(() => {
        const checkCollision = () => {
            if (!birdRef.current) return;

            const birdRect = birdRef.current.getBoundingClientRect();
            const gameBoardRect = document.querySelector(".GameBoard").getBoundingClientRect();

            // 🚨 **Check if the bird goes out of screen (top or bottom)**
            if (birdRect.top <= gameBoardRect.top || birdRect.bottom >= gameBoardRect.bottom || birdRect.left <= gameBoardRect.left || birdRect.right >= gameBoardRect.right) {
                console.log("Game Over - Out of Screen");
                setMessage("YOU WIN")
                setStatus(true)
                return;
            }
            // Check collision with clouds
            for (let i = 0; i < cloudsRef.current.length; i++) {
                const cloud = cloudsRef.current[i];
                if (cloud) {
                    const cloudRect = cloud.getBoundingClientRect();
                    if (
                        birdRect.left <= cloudRect.right &&
                        birdRect.right >= cloudRect.left &&
                        birdRect.top <= cloudRect.bottom &&
                        birdRect.bottom >= cloudRect.top
                    ) {
                        console.log("Game Over - Cloud Collision");
                        setMessage("Ooouuuchhh Clouds")
                        setStatus(true)
                        return;
                    }
                }
            }

            // Check collision with walls
            for (let i = 0; i < wallsRef.current.length; i++) {
                const wall = wallsRef.current[i];
                if (wall) {
                    const wallRect = wall.getBoundingClientRect();
                    if (
                        birdRect.left <= wallRect.right &&
                        birdRect.right >= wallRect.left &&
                        birdRect.top <= wallRect.bottom &&
                        birdRect.bottom >= wallRect.top
                    ) {
                        console.log("Game Over - Wall Collision");
                        setMessage("Ooouuuchhh these walls")
                        setStatus(true)
                        return;
                    }
                }
            }
        };

        const interval = setInterval(checkCollision, 50);
        return () => clearInterval(interval);
    }, [clouds, walls]);
    // console.log("Cloud Refs Assigned:", cloudsRef.current);
    return (
        <div className="GameBoard">
            {startGame && <Bird birdRef={birdRef} />}
            {/* Render Walls with refs */}
            {walls.map((wall, i) => (
                <Walls
                    key={wall.id}
                    ref={(el) => (wallsRef.current[i] = el)}
                    stylesheet={{
                        position: "absolute",
                        bottom: "0",
                        left: `${wall.left}px`,
                        animation: `heightEffect ${1.5 * i}s infinite ease-in-out`,
                    }}
                />
            ))}

            {/* Render Clouds with refs */}
            {clouds.map((cloud, i) => (
                <Clouds
                    key={cloud.id}
                    ref={(el) => (cloudsRef.current[i] = el)}
                    stylesheet={{
                        position: "absolute",
                        top: `${cloud.top}px`,
                        left: `${cloud.left}px`,
                    }}
                />
            ))}
        </div>
    );
}
