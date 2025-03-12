import targetImg from "../../assets/target.png"

export default function Player({playerPos,ref}){
    return (
        <div ref={ref} className="Player" style = {{
            width : "3em",
            height: "3em",
            borderRadius : "50%",
            backgroundImage:`url(${targetImg})`,
            backgroundSize:"cover",
            backgroundRepeat:"no-repeat",
            top: `${playerPos.y}px`,
            left: `${playerPos.x}px`,
            transform:`scale(${playerPos.scale})`,
            position:"absolute",
            zIndex: "10"
        }}>
        </div>
    )
}