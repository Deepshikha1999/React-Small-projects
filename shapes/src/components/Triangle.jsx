import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';

export default function Triangle({ }) {
    const TriangleSizeRef = useRef()
    const [dimensions, setDimensions] = useState([])
    useEffect(() => {
        setDimensions([TriangleSizeRef.current.offsetWidth, TriangleSizeRef.current.offsetHeight])
    }, [])
    if (dimensions.length != 0) {
        console.log(dimensions)
    }

    const gridSize =15
    const TrianglePixels = Array.from({ length: gridSize }, (_, i) => Array.from({ length: gridSize }, (_, j) => {
        return null
    }));
    for (let i=1;i<gridSize;i++){
        for(let j=0;j<i;j++){
            TrianglePixels[i][j]=<div className="pixel" key={i + "" + j} style={{ backgroundColor: 'darkslateblue' }}></div>
        }
        for(let j=i;j<gridSize;j++){
            TrianglePixels[i][j]=<div className="pixel" key={i + "" + j} style={{ backgroundColor: 'transparent' }}></div>
        }
    }
    return <div ref={TriangleSizeRef} className="Triangle">
        {/* <div className="pixel"></div> */}
        {TrianglePixels}
    </div>
}