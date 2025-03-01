import { useEffect, useRef, useState } from "react";
import Block from "./Block";
import Player from "./Player";

const g = 0.5;
const speedOfPlayer = 10
const jumpSpeed = 15

export default function Room({ }) {
    const roomRef = useRef(null)
    const playerRef = useRef(null)
    const [playerPos, setPlayerPos] = useState({ x: 50, y: 0 })
    const velocityRef = useRef({ x: 0, y: 0 })
    const [isJumping, setIsJumping] = useState(false)
    const blockRefs = useRef([])
    const [scrollX, setScrollX] = useState(0)
    const [blocks, setBlocks] = useState(Array.from({ length: 40 }, (_, i) => (
        {
            height: `${innerHeight - (200 + (i % 3) * 150)}px`,
            width: "300px",
            top: `${innerHeight - (200 + (i % 3) * 150)}px`, // Stagger height
            left: `${i * 500}px`, // Fixed spacing
            position: "absolute",
        }
    )))
    const keyPressed = useRef(new Set())
    const updateMovement = () => {
        if (keyPressed.current.has("a") || keyPressed.current.has("ArrowLeft")) {
            if (!collision(playerPos.x - speedOfPlayer, playerPos.y, playerPos).horizontalCollision) {
                velocityRef.current.x = -speedOfPlayer;
                setScrollX(oldScrollX => oldScrollX + speedOfPlayer);
            }
        }
        if (keyPressed.current.has("d") || keyPressed.current.has("ArrowRight")) {
            if (!collision(playerPos.x + speedOfPlayer, playerPos.y, playerPos).horizontalCollision) {
                velocityRef.current.x = speedOfPlayer;
                setScrollX(oldScrollX => oldScrollX - speedOfPlayer);
            }
        }
        if ((keyPressed.current.has("w") || keyPressed.current.has("ArrowUp") || keyPressed.current.has(" ")) && !isJumping) {
            // console.log(keyPressed.current)
            velocityRef.current.y = -1 * jumpSpeed
            setIsJumping(true);
        }
    }

    const collision = (new_x, new_y, oldPos) => {
        let isCollide = { horizontalCollision: false, verticalCollision: false };
    
        if (!blockRefs.current.length) return isCollide;
    
        const mapOfBlocks = blockRefs.current.map(block => block.getBoundingClientRect());
    
        for (const block of mapOfBlocks) {
            const isColliding =
                new_x + playerRef.current.clientWidth > block.left &&
                new_x < block.left + block.width &&
                new_y + playerRef.current.clientHeight > block.top &&
                new_y < block.top + block.height;
    
            if (isColliding) {
                const playerBottom = new_y + playerRef.current.clientHeight;
                const playerTop = new_y;
                const playerLeft = new_x;
                const playerRight = new_x + playerRef.current.clientWidth;
    
                const blockTop = block.top;
                const blockBottom = block.bottom;
                const blockLeft = block.left;
                const blockRight = block.right;
    
                if (velocityRef.current.y > 0 && playerBottom >= blockTop && playerTop < blockBottom) {
                    isCollide.verticalCollision = true;
                    break;
                }
    
                if (!isCollide.verticalCollision) {
                    if (velocityRef.current.x > 0 && playerRight >= blockLeft && oldPos.x + playerRef.current.clientWidth <= blockLeft) {
                        isCollide.horizontalCollision = true;
                    } else if (velocityRef.current.x < 0 && playerLeft <= blockRight && oldPos.x >= blockRight) {
                        isCollide.horizontalCollision = true;
                    }
                }
            }
        }
    
        return isCollide;
    };
    
    // Move blocks based on scroll
    useEffect(() => {
        const room = document.querySelector(".Room")?.getBoundingClientRect()
        if (!room || !playerRef.current) return;
        const [roomHeight, roomWidth] = [room.height, room.width]
        const [roomX, roomY] = [room.x, room.y]

        let animationFrame;
        const updatePlayer = () => {
            const mapOfBlocks = blockRefs.current.length && blockRefs.current.map((block, i) => {
                return block.getBoundingClientRect()
            })
            setPlayerPos((oldPos) => {
                let new_x = oldPos.x + velocityRef.current.x
                let new_y = oldPos.y + velocityRef.current.y
                const checkForBlocksCollision = mapOfBlocks.length > 0 ? (mapOfBlocks.map((block, i) => {
                    return {
                        block: block,
                        isColliding: (
                            new_x + playerRef.current.clientWidth >= block.left &&
                            new_x <= block.left + block.width &&
                            new_y + playerRef.current.clientHeight >= block.top &&
                            new_y <= block.top + block.height
                        )
                    }
                })) : [];
                // console.log(checkForBlocksCollision.some((block)=>(block.isBlockPresent)))
                if (new_y >= roomY + roomHeight - playerRef.current.clientHeight) {
                    new_y = roomY + roomHeight - playerRef.current.clientHeight
                    velocityRef.current.y = 0  //stop falling
                    setIsJumping(false)
                    new_x = Math.max(roomX + 100, Math.min(roomX + roomWidth / 2 - playerRef.current.clientWidth, new_x)); //keeps within the boundaries
                }
                else if (mapOfBlocks.length > 0 && checkForBlocksCollision.some((block) => (block.isColliding))) {

                    const playerBottom = new_y + playerRef.current.clientHeight;
                    const playerTop = new_y;
                    const playerLeftSide = new_x;
                    const playerRightSide = new_x + playerRef.current.clientWidth;
                    for (const block of checkForBlocksCollision) {
                        if (block.isColliding) {
                            const blockTop = block.block.top;
                            const blockBottom = block.block.bottom;
                            const blockLeft = block.block.left;
                            const blockRight = block.block.right;

                            let horizontalCollision = false;
                            let verticalCollision = false;
                            // Only allow landing if the player is falling and their feet touch the block
                            if (velocityRef.current.y > 0 && playerBottom >= blockTop && playerTop < blockBottom) {
                                new_y = blockTop - playerRef.current.clientHeight;
                                velocityRef.current.y = 0;
                                setIsJumping(false);
                                verticalCollision = true
                                break;
                            }
                            if (!verticalCollision) {
                                // Ensuring vertical overlap (only check side collisions if within block height)
                                if (velocityRef.current.x > 0 && playerRightSide >= block.left && oldPos.x + playerRef.current.clientWidth <= block.left) {
                                    new_x = block.left - playerRef.current.clientWidth;
                                    velocityRef.current.x = 0;
                                    horizontalCollision = true;
                                    velocityRef.current.y += g;
                                    break;
                                } else if (velocityRef.current.x < 0 && playerLeftSide <= block.right && oldPos.x >= block.right) {
                                    new_x = block.right;
                                    velocityRef.current.x = 0;
                                    horizontalCollision = true;
                                    velocityRef.current.y += g;
                                    break;
                                }
                                velocityRef.current.y += g;
                            }
                        }
                    }
                }
                else {
                    velocityRef.current.y += g //apply gravity while falling
                    new_x = Math.max(roomX + 100, Math.min(roomX + roomWidth / 2 - playerRef.current.clientWidth, new_x)); //keeps within the boundaries
                }

                return { x: new_x, y: new_y }
            })

            animationFrame = requestAnimationFrame(updatePlayer)
        }

        animationFrame = requestAnimationFrame(updatePlayer)
        return () => { cancelAnimationFrame(animationFrame) }
    }, [])

    useEffect(() => {
        const handleMovement = () => {
            updateMovement();
            requestAnimationFrame(handleMovement);
        }
        requestAnimationFrame(handleMovement);
    }, [])

    useEffect(() => {
        setBlocks((oldBlocks) =>
            oldBlocks.map((block, i) => ({
                ...block,
                left: `${i * 500 + scrollX}px`
            }))
        );
    }, [scrollX])

    function moveOnKeyDown(event) {
        keyPressed.current.add(event.key)
    }

    function moveOnKeyUp(event) {
        if (event.key == "a" || event.key == "ArrowLeft" || event.key == "d" || event.key == "ArrowRight") {
            velocityRef.current.x = 0
        }
        keyPressed.current.delete(event.key)
    }

    useEffect(() => {
        const handleKeyDown = (event) => moveOnKeyDown(event);
        const handleKeyUp = (event) => moveOnKeyUp(event);
        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
        }
    }, [])
    return (
        <div ref={roomRef} className="Room">
            <Player playerPos={playerPos} ref={playerRef} />
            {blocks.map((style, i) => {
                return <Block
                    ref={(el) => (blockRefs.current[i] = el)}
                    key={i}
                    style={style}
                />
            })}
        </div>
    )
}