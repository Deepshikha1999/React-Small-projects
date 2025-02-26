import { useState, forwardRef } from "react";

const RigidBody = forwardRef(({ playerRef }, rigidBodyRef) => {
    const [rigidBodyPos, setRigidBodyPos] = useState({ x: 0, y: 1000 });

    return (
        <div ref={rigidBodyRef} className="rigidBody" style={{
            position: "absolute",
            top: `${rigidBodyPos.y}px`,
            left: `${rigidBodyPos.x}px`
        }}></div>
    );
});

export default RigidBody;
