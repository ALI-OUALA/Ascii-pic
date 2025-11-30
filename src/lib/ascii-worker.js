self.onmessage = (e) => {
    const { imageData, options } = e.data;
    const { width, height, data } = imageData;
    const { resolution, characters, contrast, minBrightness, weight } = options;

    const charGrid = [];
    const gridSize = resolution; // This is actually the step size (e.g. 12px)

    for (let y = 0; y < height; y += gridSize) {
        for (let x = 0; x < width; x += gridSize) {
            // Sample pixel brightness
            const i = (Math.floor(y) * width + Math.floor(x)) * 4;
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            // Calculate grayscale
            let gray = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

            // Apply contrast
            gray = Math.max(minBrightness, Math.min(1, (gray - 0.5) * contrast + 0.5));

            // Pick character
            const charIndex = Math.floor(Math.random() * characters.length);
            const char = characters.charAt(charIndex);

            charGrid.push({
                x,
                y,
                char,
                brightness: gray,
                weight: gray * weight,
                isWordChar: false // Placeholder for now
            });
        }
    }

    self.postMessage({ charGrid });
};
