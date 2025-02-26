import { useRef } from "react";
import Player from "./Player";
import RigidBody from "./RigidBody";
import { useState } from "react";
import { useEffect } from "react";

export default function PlayGround({ }) {
    // const rigidBodyRef = useRef(null);
    const [rigidBodyPos,setRigidBodyPos] = useState({x:0,y:1000})
    // useEffect(()=>{
    //     if(rigidBodyRef!=null){
    //         setRigidBodyPos({
    //             x:Math.round(rigidBodyRef.current.getBoundingClientRect().left),
    //             y:Math.round(rigidBodyRef.current.getBoundingClientRect().top)
    //         })
    //     }
    // },[rigidBodyRef])
    return (
        <div className="playGround">
            <Player obstaclePos = {rigidBodyPos}/>
            {/* <RigidBody ref={rigidBodyRef} /> */}
        </div>
    )
}