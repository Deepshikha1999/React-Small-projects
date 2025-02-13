import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';

export default function Circle({ }) {
    const CircleSizeRef = useRef()
    const [dimensions, setDimensions] = useState([])
    useEffect(() => {
        setDimensions([CircleSizeRef.current.offsetWidth, CircleSizeRef.current.offsetHeight])
    }, [])
    if (dimensions.length != 0) {
        console.log(dimensions)
    }

    const radius = 10; // Increased for better visibility
    const gridSize = 50; // Reduced for performance
    const CirclePixels = Array.from({ length: gridSize }, (_, i) =>
        Array.from({ length: gridSize }, (_, j) => {
            const center = gridSize / 2;
            const distance = Math.sqrt((i - center) ** 2 + (j - center) ** 2);
            return distance <= radius ? (
                <div
                    className="pixel"
                    key={`${i}_${j}`}
                    style={{
                        backgroundColor: "darkslateblue",
                    }}
                ></div>
            ) : <div
            className="pixel"
            key={`${i}_${j}`}
            style={{
                backgroundColor: "transparent",
            }}
        ></div>;
        })
    );

    return (
        <div ref={CircleSizeRef} className="Circle" style={{ display: "grid", gridTemplateColumns: `repeat(${gridSize}, 5px)` }}>
            {CirclePixels} {/* Flatten the array to prevent React warnings */}
        </div>
    );
}