import lego from "../assets/IMG_1795.png"

export default function Block({position}){
    return (
        <div className="block" style={{
            height: `${position.height}px`,
            width: `${position.width}px`,
            // backgroundColor: "black",
            backgroundImage:`url(${lego})`,
            backgroundRepeat:"no-repeat",
            backgroundSize:"100% 100%",
            position: "absolute",
            top: `${position.y}px`,
            left:`${position.x}px`
        }}></div>
    )
}