import cross from "../assets/cross.png";

export default function BackFunction({ setSelectedPage }) {
    return (
        <div className="BackButton"
            style={{
                background: `url(${cross})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
                width: "50px",
                height: "50px",
                position: "fixed",
                top: "10px",
                left: "10px",
                zIndex: "9999",
                cursor: "pointer"
            }}
            onClick={() => setSelectedPage(null)}
        >

        </div>
    )
}