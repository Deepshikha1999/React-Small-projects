const styles = {
    PhotoPuzzle: {
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(15px)",
        flexDirection: "column",
    },
    preview: {
        flex: 1, // Fills the remaining screen height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: "20px",
    },
    video: {
        maxWidth: "100%",
        maxHeight: "100%",
        // borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        backgroundColor: "#000"
    },
    controlBar: {
        height: '100px',
        backgroundColor: '#D9C99A',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
    },
    icon: {
        width: '50px',
        height: '50px',
        cursor: 'pointer',
        padding: "10px"
    },
    startBtn: {
        width: '100px', // The start button is usually larger
        cursor: 'pointer',
    },
    placeholderText: {
        color: '#666',
        fontSize: '1.2rem',
    }
};

export default styles;