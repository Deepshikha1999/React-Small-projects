const styles = {
    PhotoWithFilter: {
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Darker for better focus
        display: "flex",
        justifyContent: "space-between", // Pushes content and bars apart
        alignItems: "center",
        backdropFilter: "blur(15px)",
        flexDirection: "column",
        overflow: "hidden",
    },

    preview: {
        position: "relative", // Needed for absolute arrow positioning
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: "10px",
    },

    photoCard: {
        width: "85vw",           // Responsive width
        maxWidth: "400px",       // Limit size on desktop
        aspectRatio: "2 / 3",    // Force 400:600 ratio automatically
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        backgroundColor: "#fff",
        objectFit: "contain",
        display: "block",
        transform: "scaleX(-1)"
    },

    video: {
        width: "85vw",
        maxWidth: "400px",
        aspectRatio: "2 / 3",
        objectFit: "cover", // Ensures video fills the 2:3 frame without stretching
        borderRadius: "16px",
        backgroundColor: "#000",
        transform: "scaleX(-1)", // Mirror effect
    },

    // Specific styles for the navigation arrows
    arrowIcon: {
        position: "absolute",
        width: "45px",
        height: "45px",
        cursor: "pointer",
        zIndex: 10,
        backgroundColor: "rgba(255, 255, 255, 0.2)", // Glass effect
        borderRadius: "50%",
        padding: "10px",
        backdropFilter: "blur(5px)",
    },
    leftArrow: {
        left: "5vw",
    },
    rightArrow: {
        right: "5vw",
    },

    controlBar: {
        height: '90px',
        backgroundColor: '#D9C99A',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        paddingBottom: "env(safe-area-inset-bottom)", // Mobile notch support
    },

    icon: {
        width: '55px',
        height: '55px',
        cursor: 'pointer',
        padding: "12px"
    },
    info: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        minWidth: '100px',
        textAlign: 'center'
    },
    downloadLabel: {
        fontSize: '0.6rem',
        marginTop: '5px',
        color: '#fff',
        backgroundColor: '#000',
        padding: '4px 8px',
        borderRadius: '4px',
        cursor: 'pointer',
        textAlign: 'center'
    }
};

export default styles;