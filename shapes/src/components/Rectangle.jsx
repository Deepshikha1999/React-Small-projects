import { useEffect } from 'react';
import { useState } from 'react';
import {useRef} from 'react';

export default function Rectangle({}){
    const RectangleSizeRef = useRef()
    const [dimensions,setDimensions] = useState([])
    useEffect(()=>{
        setDimensions([RectangleSizeRef.current.offsetWidth,RectangleSizeRef.current.offsetHeight])
    },[])
    if (dimensions.length!=0){
        console.log(dimensions)
    }

    const [lengthRect,breadthRect] = [20,10]
    const rectanglePixels = Array.from({ length: breadthRect }, (_,i) => Array.from({ length: lengthRect }, (_,j) => <div className="pixel" key={i+""+j} style={{backgroundColor:'darkslateblue'}}></div>));
    return <div ref = {RectangleSizeRef} className="Rectangle">
        {/* <div className="pixel"></div> */}
        {rectanglePixels}
    </div>
}