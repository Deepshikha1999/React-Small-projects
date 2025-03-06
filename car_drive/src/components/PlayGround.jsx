import { useState } from "react";
import Car from "./Car";
import Road from "./Road";
import SideScene from "./SideScene";
import tree1 from "../assets/bush.png"
import tree2 from "../assets/bush2.png"
import colony from "../assets/house from the top.jpg"
import colony2 from "../assets/colony2.avif"
import pond from "../assets/pond.png"
import { useRef } from "react";

const IMG = [
    {
        key: "tree1",
        src: tree1,
        style: {
            height: "25vh",
            width: "15vw"
        }
    },
    {
        key: "tree2",
        src: tree2,
        style: {
            height: "20vh",
            width: "12vw"
        }
    },
    {
        key: "colony",
        src: colony,
        style: {
            height: "40vh",
            width: "20vw",
            border: "1em brown dashed"
        }
    },
    {
        key: "colony2",
        src: colony2,
        style: {
            height: "40vh",
            width: "20vw",
            border: "1.5em grey groove"
        }
    },
    { 
        key: "pond",
        src: pond,
        style: {
            height: "40vh",
            width: "20vw",
        }
    },
]

export default function PlayGround() {
    const stripsRef = useRef([]);
    const sideScenesRef = useRef([]);
    const carsRef = useRef([]);

    const [strips] = useState(Array.from({ length: 7 }, (_, i) => (
        <div key={i} className="Strips" ref={(el) => { stripsRef.current[i] = el; }} style={{
            height: "15vh",
            width: "2vw",
            backgroundColor: "white"
        }}></div>
    )));

    const [sideScenes] = useState(Array.from({ length: 5 }, (_, i) => {
        const index = Math.floor(Math.random() * IMG.length);
        return (
            <img className="Img" src={IMG[index].src} alt={IMG[index].key} 
                ref={(el) => { sideScenesRef.current[i] = el; }} 
                style={IMG[index].style} key={i} 
            />
        );
    }));

    return (
        <div className="PlayGround">
            <Car stripsRef={stripsRef} sideScenesRef={sideScenesRef} carsRef={carsRef} />
            <SideScene sideScenes={sideScenes} />
            <Road strips={strips} />
            <SideScene sideScenes={sideScenes} />
        </div>
    );
}