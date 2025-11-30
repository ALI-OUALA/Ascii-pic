export const generateStandaloneHTML = (imageBuffer, settings) => {
    // We need to embed the minimal JS required for the effect.
    // We'll basically inline a simplified version of AsciiEffect.

    const scriptContent = `
    class TextHeatReveal {
        constructor(canvas, imgSrc, options) {
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
            this.options = options;
            this.width = canvas.width;
            this.height = canvas.height;
            this.img = new Image();
            this.img.onload = () => this.init();
            this.img.src = imgSrc;
            
            this.heat = new Float32Array(96 * 96).fill(0);
            this.heatRes = 96;
        }
        
        init() {
            // Prepare offscreen canvases
            this.staticCanvas = document.createElement('canvas');
            this.staticCanvas.width = this.width;
            this.staticCanvas.height = this.height;
            this.staticCtx = this.staticCanvas.getContext('2d');
            
            this.coverCanvas = document.createElement('canvas');
            this.coverCanvas.width = this.width;
            this.coverCanvas.height = this.height;
            this.coverCtx = this.coverCanvas.getContext('2d');
            
            // Draw cover
            this.coverCtx.fillStyle = this.options.invert ? 'white' : 'black';
            this.coverCtx.fillRect(0, 0, this.width, this.height);
            const scale = Math.max(this.width / this.img.width, this.height / this.img.height);
            const sw = this.img.width * scale;
            const sh = this.img.height * scale;
            this.coverCtx.drawImage(this.img, (this.width-sw)/2, (this.height-sh)/2, sw, sh);
            this.coverData = this.coverCtx.getImageData(0,0,this.width,this.height);
            
            this.generateGrid();
            this.bindEvents();
            this.loop();
        }
        
        generateGrid() {
            this.charGrid = [];
            const { gridSize, characters, contrast, minBrightness, invert } = this.options;
            
            for(let y=0; y<this.height; y+=gridSize) {
                for(let x=0; x<this.width; x+=gridSize) {
                    const i = (Math.floor(y)*this.width + Math.floor(x))*4;
                    const r = this.coverData.data[i];
                    const g = this.coverData.data[i+1];
                    const b = this.coverData.data[i+2];
                    let gray = (r*0.299 + g*0.587 + b*0.114)/255;
                    gray = Math.max(minBrightness, Math.min(1, (gray-0.5)*contrast + 0.5));
                    
                    this.charGrid.push({
                        x, y, 
                        char: characters.charAt(Math.floor(Math.random()*characters.length)),
                        brightness: gray
                    });
                }
            }
            this.renderStatic();
        }
        
        renderStatic() {
            const ctx = this.staticCtx;
            const { fontSize, fontFamily, textOpacity, invert, gridSize } = this.options;
            
            ctx.clearRect(0,0,this.width,this.height);
            ctx.fillStyle = invert ? '#eee' : '#111';
            ctx.fillRect(0,0,this.width,this.height);
            ctx.font = \`\${fontSize}px \${fontFamily}\`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            this.charGrid.forEach(cell => {
                const size = fontSize * (0.5 + cell.brightness * 0.5);
                ctx.font = \`\${size}px \${fontFamily}\`;
                const alpha = Math.min(1, cell.brightness * 1.5) * textOpacity;
                ctx.fillStyle = invert ? \`rgba(0,0,0,\${alpha})\` : \`rgba(255,255,255,\${alpha})\`;
                ctx.fillText(cell.char, cell.x + gridSize/2, cell.y + gridSize/2);
            });
        }
        
        loop() {
            requestAnimationFrame(() => this.loop());
            this.updateHeat();
            this.render();
            
            // Random scramble
            if(Math.random() < 0.1) {
                const idx = Math.floor(Math.random() * this.charGrid.length);
                this.charGrid[idx].char = this.options.characters.charAt(Math.floor(Math.random()*this.options.characters.length));
                this.renderStatic();
            }
        }
        
        updateHeat() {
             for(let i=0; i<this.heat.length; i++) {
                this.heat[i] *= 0.95;
             }
        }
        
        render() {
            this.ctx.drawImage(this.staticCanvas, 0, 0);
            
            // Heat reveal
            const gridSize = this.options.gridSize;
            for(let y=0; y<this.height; y+=gridSize) {
                for(let x=0; x<this.width; x+=gridSize) {
                    const hx = Math.floor((x/this.width)*this.heatRes);
                    const hy = Math.floor((y/this.height)*this.heatRes);
                    if(this.heat[hy*this.heatRes+hx] > 0.1) {
                        this.ctx.save();
                        this.ctx.beginPath();
                        this.ctx.rect(x,y,gridSize,gridSize);
                        this.ctx.clip();
                        this.ctx.drawImage(this.coverCanvas, 0, 0);
                        this.ctx.restore();
                    }
                }
            }
        }
        
        bindEvents() {
            const addHeat = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const x = (e.clientX - rect.left) * (this.width/rect.width);
                const y = (e.clientY - rect.top) * (this.height/rect.height);
                
                const cx = Math.floor((x/this.width)*this.heatRes);
                const cy = Math.floor((y/this.height)*this.heatRes);
                const r = 8;
                for(let i=-r; i<=r; i++) {
                    for(let j=-r; j<=r; j++) {
                        if(cx+i>=0 && cx+i<this.heatRes && cy+j>=0 && cy+j<this.heatRes) {
                            const d = Math.sqrt(i*i+j*j);
                            if(d<r) this.heat[(cy+j)*this.heatRes+(cx+i)] += 0.5*(1-d/r);
                        }
                    }
                }
            };
            this.canvas.addEventListener('mousemove', addHeat);
            this.canvas.addEventListener('touchmove', (e) => addHeat(e.touches[0]));
        }
    }

    const canvas = document.getElementById('canvas');
    new TextHeatReveal(canvas, "${imageBuffer}", ${JSON.stringify(settings)});
  `;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ASCII Art Reveal</title>
    <style>
        body { margin: 0; background: ${settings.invert ? '#eee' : '#111'}; overflow: hidden; display: flex; justify-content: center; align-items: center; height: 100vh; }
        canvas { max-width: 100%; max-height: 100vh; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
    </style>
</head>
<body>
    <canvas id="canvas" width="800" height="800"></canvas>
    <script>
    ${scriptContent}
    </script>
</body>
</html>
  `;
};

export const generatePlainText = (grid, width, height, gridSize) => {
    let text = "";
    const cols = Math.floor(width / gridSize);
    const rows = Math.floor(height / gridSize);

    // Sort grid by y then x
    const sorted = [...grid].sort((a, b) => (a.y - b.y) || (a.x - b.x));

    let currentRow = 0;
    sorted.forEach(cell => {
        const row = Math.floor(cell.y / gridSize);
        if (row > currentRow) {
            text += "\n";
            currentRow = row;
        }
        text += cell.char;
    });

    return text;
};

export const generateImage = (canvas) => {
    return canvas.toDataURL('image/png');
};
