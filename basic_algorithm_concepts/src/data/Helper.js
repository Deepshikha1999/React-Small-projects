const generateUniqueWeights = (length, min, max) => {
    const weights = new Set();
    while (weights.size < length) {
        weights.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(weights);
};

export default generateUniqueWeights;