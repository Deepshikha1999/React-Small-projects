import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react"

export default function Bird({birdRef}) {
    // const birdRef = useRef()
    const [birdsPosition, setBirdPosition] = useState({});
    const gravity = 30;
    useEffect(() => {
        if (birdRef.current) {
            setBirdPosition(prev => ({
                ...prev,
                top: birdRef.current.offsetTop,
                left: birdRef.current.offsetLeft
            }));
        }
    }, [])
    function handlePositionDown(e) {
        if (e.key === "ArrowUp") {
            setBirdPosition(prev => ({
                ...prev,
                top: prev.top - 50  // Move up by 10px
            }));
        }
    }
    useEffect(() => {
        window.addEventListener("keydown", handlePositionDown);
        return () => window.removeEventListener("keydown", handlePositionDown);
    }, []);

    useEffect(()=>{
            const gravityInterval = setInterval(() => {
                    setBirdPosition(prev => ({
                        ...prev,
                        top: Math.min(prev.top + gravity, window.innerHeight - 20),  // Move up by 10px
                        left: Math.min(prev.left + gravity,window.innerWidth)
                    }));
            }, 250);
            return ()=>clearInterval(gravityInterval)
    },[])

    return (
        <div ref={birdRef} 
        className="Bird" 
        tabIndex={0}
        style={{
            top: `${birdsPosition.top}px`,
            left: `${birdsPosition.left}px`,
        }}></div>
    )
}

       // if (e.key === "ArrowDown") {  // Move down only when the ArrowDown key is pressed
        //     console.log(e.key)
        //     console.log(birdsPosition)
        //     setBirdPosition(prev => {return {
        //         ...prev,
        //         top: prev.top + 20  // Move down by 10px
        //     }});
        // } 
        // else 