export default function SideScene({sideScenes}) {

    return (
        <div className="SideScene" style={{
            height: "100vh",
            width: "25vw",
            zIndex: "0",
            backgroundColor: "green",
            display: "grid",
            gridTemplateRows: `repeat(${4}, 1fr)`,
            placeItems: "center",
            gap: "1em",
        }}>
            {sideScenes}
        </div>
    )
}