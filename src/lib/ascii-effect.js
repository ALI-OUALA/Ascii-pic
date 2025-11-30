export class AsciiEffect {
    constructor(canvas, image, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { willReadFrequently: true });
        this.image = image;

        // Options with defaults
        this.options = {
            gridSize: options.gridSize || 12,
            fontSize: options.fontSize || 10,
            characters: options.characters || "✦❍QWERTYUIOPASDFGHJKLZXCVBNM*+",
            fontFamily: options.fontFamily || "monospace",
            contrast: options.contrast || 1.2,
            minBrightness: options.minBrightness || 0.15,
            textOpacity: options.textOpacity || 0.55,
            invert: options.invert || false,
            textColor: options.textColor || "#ffffff",
            backgroundColor: options.backgroundColor || "#111111",
            ...options
        };

        this.width = canvas.width;
        this.height = canvas.height;

        // State
        this.charGrid = [];
        this.heat = {
            current: new Float32Array(0), // Will be resized
            active: false,
            maxValue: 0,
            lastTime: 0
        };

        this.scrambleActive = true;
        this.animationFrame = null;
        this.scrambleInterval = null;

        // Offscreen canvases
        this.staticCanvas = document.createElement('canvas');
        this.staticCtx = this.staticCanvas.getContext('2d');

        this.coverCanvas = document.createElement('canvas');
        this.coverCtx = this.coverCanvas.getContext('2d');

        this.init();
    }

    init() {
        this.resize();
        this.prepareCover();
        this.generateGrid();
        this.bindEvents();
        this.startLoop();
    }

    resize() {
        // Handle High DPI if needed, but for now keep 1:1 for simplicity of export
        this.staticCanvas.width = this.width;
        this.staticCanvas.height = this.height;
        this.coverCanvas.width = this.width;
        this.coverCanvas.height = this.height;

        // Initialize heat map
        const res = 96; // Heatmap resolution
        this.heat.res = res;
        this.heat.current = new Float32Array(res * res).fill(0);
    }

    prepareCover() {
        const { width, height } = this;
        const ctx = this.coverCtx;

        ctx.fillStyle = this.options.invert ? 'white' : 'black';
        ctx.fillRect(0, 0, width, height);

        // Draw image centered and covered
        const scale = Math.max(width / this.image.width, height / this.image.height);
        const sw = this.image.width * scale;
        const sh = this.image.height * scale;
        const ox = (width - sw) / 2;
        const oy = (height - sh) / 2;

        ctx.save();
        if (this.options.invert) {
            ctx.filter = 'invert(1)';
        }
        ctx.drawImage(this.image, ox, oy, sw, sh);
        ctx.restore();

        this.coverData = ctx.getImageData(0, 0, width, height);
    }

    generateGrid() {
        // Synchronous generation for now (Worker integration can be added if UI freezes)
        // We'll use the logic similar to the worker but here for immediate feedback in this version
        // or we can use the worker if we want. For the 'Effect' class, let's keep it self-contained
        // so it's easier to export.

        const { width, height } = this;
        const { gridSize, characters, contrast, minBrightness } = this.options;

        this.charGrid = [];

        for (let y = 0; y < height; y += gridSize) {
            for (let x = 0; x < width; x += gridSize) {
                const i = (Math.floor(y) * width + Math.floor(x)) * 4;
                const r = this.coverData.data[i];
                const g = this.coverData.data[i + 1];
                const b = this.coverData.data[i + 2];

                let gray = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

                // Contrast
                gray = Math.max(minBrightness, Math.min(1, (gray - 0.5) * contrast + 0.5));

                const char = characters.charAt(Math.floor(Math.random() * characters.length));

                this.charGrid.push({
                    x, y, char, brightness: gray
                });
            }
        }

        this.renderStatic();
    }

    renderStatic() {
        const ctx = this.staticCtx;
        const { width, height } = this;
        const { fontSize, fontFamily, textOpacity, invert, textColor, backgroundColor } = this.options;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = backgroundColor; // Background
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        this.charGrid.forEach(cell => {
            const { x, y, char, brightness } = cell;
            const size = fontSize * (0.5 + brightness * 0.5);

            ctx.font = `${size}px ${fontFamily}`;
            const alpha = Math.min(1, brightness * 1.5) * textOpacity;

            // Parse hex to rgb to add alpha
            const hexToRgb = (hex) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : { r: 255, g: 255, b: 255 };
            }

            const rgb = hexToRgb(textColor);
            ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;

            ctx.fillText(char, x + this.options.gridSize / 2, y + this.options.gridSize / 2);
        });
    }

    startLoop() {
        this.stopLoop();

        // Scramble interval
        this.scrambleInterval = setInterval(() => {
            if (this.scrambleActive && !this.heat.active) {
                this.scramble();
            }
        }, 100); // Faster scramble

        // Animation loop
        const loop = () => {
            this.updateHeat();
            this.render();
            this.animationFrame = requestAnimationFrame(loop);
        };
        loop();
    }

    stopLoop() {
        if (this.scrambleInterval) clearInterval(this.scrambleInterval);
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    }

    scramble() {
        // Randomly change some characters
        const count = Math.floor(this.charGrid.length * 0.05);
        const { characters } = this.options;

        for (let i = 0; i < count; i++) {
            const idx = Math.floor(Math.random() * this.charGrid.length);
            this.charGrid[idx].char = characters.charAt(Math.floor(Math.random() * characters.length));
        }
        this.renderStatic();
    }

    updateHeat() {
        // Simplified heat diffusion
        if (!this.heat.active && this.heat.maxValue <= 0) return;

        const { res, current } = this.heat;
        let max = 0;

        // Simple decay for now
        for (let i = 0; i < current.length; i++) {
            current[i] *= 0.95; // Decay
            if (current[i] < 0.01) current[i] = 0;
            if (current[i] > max) max = current[i];
        }

        this.heat.maxValue = max;
        if (max === 0) this.heat.active = false;
    }

    render() {
        const { ctx, width, height } = this;

        // Draw static grid
        ctx.drawImage(this.staticCanvas, 0, 0);

        // Draw heat reveal
        if (this.heat.maxValue > 0) {
            const gridSize = this.options.gridSize;
            const res = this.heat.res;

            for (let y = 0; y < height; y += gridSize) {
                for (let x = 0; x < width; x += gridSize) {
                    // Map x,y to heat grid
                    const hx = Math.floor((x / width) * res);
                    const hy = Math.floor((y / height) * res);
                    const val = this.heat.current[hy * res + hx];

                    if (val > 0.1) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(x, y, gridSize, gridSize);
                        ctx.clip();
                        ctx.drawImage(this.coverCanvas, 0, 0);
                        ctx.restore();
                    }
                }
            }
        }
    }

    bindEvents() {
        const onMove = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (this.width / rect.width);
            const y = (e.clientY - rect.top) * (this.height / rect.height);
            this.addHeat(x, y);
        };

        this.canvas.addEventListener('mousemove', onMove);
        this.canvas.addEventListener('touchmove', (e) => onMove(e.touches[0]));
    }

    addHeat(x, y) {
        this.heat.active = true;
        const res = this.heat.res;
        const cx = Math.floor((x / this.width) * res);
        const cy = Math.floor((y / this.height) * res);
        const radius = 8;

        for (let i = -radius; i <= radius; i++) {
            for (let j = -radius; j <= radius; j++) {
                if (cx + i >= 0 && cx + i < res && cy + j >= 0 && cy + j < res) {
                    const dist = Math.sqrt(i * i + j * j);
                    if (dist < radius) {
                        const idx = (cy + j) * res + (cx + i);
                        this.heat.current[idx] = Math.min(1, this.heat.current[idx] + 0.5 * (1 - dist / radius));
                    }
                }
            }
        }
    }

    destroy() {
        this.stopLoop();
        // Remove listeners if needed
    }

    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.init(); // Re-init to apply changes
    }
}
