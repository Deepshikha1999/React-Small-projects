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
        backgroundColor: "#000",
        touchAction: 'none', // Critical: Tells the browser NOT to scroll the page when touching this element
        userSelect: 'none',  // Prevents the "copy/paste" highlight from appearing
        WebkitTapHighlightColor: 'transparent',
    },
    controlBar: {
        height: '80px', // Fixed height is safer for bottom bars
        minHeight: '80px',
        backgroundColor: '#D9C99A',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        
        // Critical for Mobile:
        position: 'fixed', // Pins it to the bottom
        bottom: 0,
        left: 0,
        zIndex: 1000,
        
        // safe-area-inset adds extra padding ONLY on phones with notches
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 10px)', 
        boxShadow: '0 -2px 10px rgba(0,0,0,0.2)', // Adds depth so it pops against the preview
    },
    
    icon: {
        width: '3.5rem',  // Increased size for easier finger taps
        height: '3.5rem',
        cursor: 'pointer',
        padding: "0.8rem",
        objectFit: 'contain', // Prevents icon distortion
        transition: 'transform 0.1s ease', // Feedback when tapped
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