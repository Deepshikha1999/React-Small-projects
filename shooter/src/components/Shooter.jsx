import { useEffect, useRef, useState } from 'react'

export default function Shooter({ gunRef, setBloodSplatter }) {
    // const gunRef = useRef(null);
    const [gunPointPosition, setGunPointPosition] = useState(null);
    const [shoot, setShoot] = useState(false)
    const [zoom, setZoom] = useState(false)

    useEffect(() => {
        if (gunRef.current) {
            setGunPointPosition(prev => ({
                top: gunRef.current.offsetTop, left: gunRef.current.offsetLeft
            }))
        }
    }, [])

    function handleGunPosition(event) {
        // const gunSize = 500;
        setGunPointPosition(prev => ({
            // top: event.clientY - gunSize / 2,
            // left: event.clientX - gunSize / 2
            top: event.clientY,
            left: event.clientX
        }))
    }
    function handleShoot(event) {
        setShoot((prevShoot) => !prevShoot)
        if (event.type === "mousedown") {
            setBloodSplatter((prevArr) => [...prevArr, {
                top: event.clientY,
                left: event.clientX,
                timeSpan: 1000
            }]);
        }

    }

    function handleZoom(event) {
        if (event.key == "+")
            setZoom(true)
        else if (event.key == "-") {
            setZoom(false)
        }
    }
    useEffect(() => {
        const appElement = document.querySelector(".App");
        if (appElement) {
            window.addEventListener("mousemove", handleGunPosition);
            appElement.addEventListener("mousedown", handleShoot);
            appElement.addEventListener("mouseup", handleShoot);
            window.addEventListener("keydown", handleZoom)
        }
        return () => {
            if (appElement) {
                window.removeEventListener("mousemove", handleGunPosition);
                appElement.removeEventListener("mousedown", handleShoot);
                appElement.removeEventListener("mouseup", handleShoot);
                appElement.removeEventListener("keydown", handleZoom)
            }
        };
    }, [])

    return (
        <>
            {
                gunPointPosition && <div ref={gunRef}
                    className='GunPoint'
                    style={{
                        top: `${gunPointPosition.top}px`,
                        left: `${gunPointPosition.left}px`,
                        transform: `${shoot ? 'scaleX(1.2) scaleY(1.2)' : zoom ? 'scaleX(2) scaleY(2)' : 'scale(1)'}`,
                        backgroundColor: `${shoot ? "rgba(255, 0, 0 ,0.7)" : "rgba(255, 0, 0 ,0)"}`
                    }}
                    id="Gun"
                ></div>
            }
        </>
    )
}
