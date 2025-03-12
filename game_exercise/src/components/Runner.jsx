import { useEffect, useState } from "react";
import runnerImg1 from "../assets/cut_images_LMBK5oWJh5u4/image_part_001.png";
import runnerImg2 from "../assets/cut_images_LMBK5oWJh5u4/image_part_002.png";
import runnerImg3 from "../assets/cut_images_LMBK5oWJh5u4/image_part_003.png";
import runnerImg4 from "../assets/cut_images_LMBK5oWJh5u4/image_part_004.png";
import runnerImg5 from "../assets/cut_images_LMBK5oWJh5u4/image_part_005.png";
import runnerImg6 from "../assets/cut_images_LMBK5oWJh5u4/image_part_006.png";
import runnerImg7 from "../assets/cut_images_LMBK5oWJh5u4/image_part_007.png";
import runnerImg8 from "../assets/cut_images_LMBK5oWJh5u4/image_part_008.png";

const images = [runnerImg1, runnerImg2, runnerImg3, runnerImg4, runnerImg5, runnerImg6, runnerImg7, runnerImg8]

export default function Runner() {
    const [imgIndex, setImgIndex] = useState(0)
    useEffect(() => {
        const timeInterval = setInterval(() => {
            setImgIndex((currInd) => (currInd + 1) % images.length);
        }, 100)
        return () => { clearInterval(timeInterval) }
    }, [])
    return (
        <div className="runner">
            <img src={images[imgIndex]} alt={imgIndex} style={{
                height: "20vh"
            }} />
        </div>
    )
}
