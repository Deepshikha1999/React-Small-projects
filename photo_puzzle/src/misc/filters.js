const FILTERS = {
    none: "none",
    // Basic Adjustments
    bright: "brightness(150%)",
    highContrast: "contrast(200%)",
    lowLight: "brightness(70%) contrast(85%)",

    // Artistic Styles
    bw: "grayscale(100%)",
    sepia: "sepia(100%)",
    invert: "invert(100%)",
    noir: "grayscale(100%) contrast(150%) brightness(80%)",

    // Color Shifts
    warm: "sepia(30%) saturate(140%) brightness(110%)",
    cool: "hue-rotate(180deg) saturate(120%)",
    technicolor: "saturate(250%) contrast(110%)",

    // Abstract
    ghostly: "opacity(0.6) blur(2px) grayscale(50%)",
    psychedelic: "hue-rotate(90deg) saturate(300%) invert(10%)"
};

/**
 * 
 * ctx.filter = FILTERS[currentFilter]; // currentFilter is a piece of state
ctx.drawImage(image, sourceX, sourceY, w, h, destX, destY, w, h);
ctx.filter = "none";
 */


export default FILTERS;