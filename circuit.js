const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let pathwalkers = [];

// Configuration
const walkerCount = 40;
const colorGold = '#f5c542';
const colorGoldDim = 'rgba(245, 197, 66, 0.4)';

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initWalkers();
}

class Walker {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.floor(Math.random() * width);
        this.y = Math.floor(Math.random() * height);
        this.px = this.x;
        this.py = this.y;
        this.speed = Math.random() * 2 + 1;
        // 0: up, 1: right, 2: down, 3: left
        this.direction = Math.floor(Math.random() * 4);
        this.steps = 0;
        this.changeDirAt = Math.floor(Math.random() * 50) + 20;

        // Trail storage for fading effect (optional, or just draw persistently with fade clear)
        // simpler for circuit: just draw current head with trail or clear softly
    }

    update() {
        this.px = this.x;
        this.py = this.y;

        // Move in Manhattan directions (90 degrees)
        if (this.direction === 0) this.y -= this.speed;
        else if (this.direction === 1) this.x += this.speed;
        else if (this.direction === 2) this.y += this.speed;
        else if (this.direction === 3) this.x -= this.speed;

        this.steps++;

        // Change direction occasionally
        if (this.steps >= this.changeDirAt) {
            this.steps = 0;
            this.changeDirAt = Math.floor(Math.random() * 50) + 20;
            // Pick a new perpendicular direction
            if (this.direction % 2 === 0) { // Moving vertically
                this.direction = Math.random() > 0.5 ? 1 : 3;
            } else { // Moving horizontally
                this.direction = Math.random() > 0.5 ? 0 : 2;
            }
        }

        // Reset if out of bounds
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.px, this.py);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = colorGold;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw head
        ctx.fillStyle = colorGold;
        ctx.fillRect(this.x - 1, this.y - 1, 3, 3);
    }
}

function initWalkers() {
    pathwalkers = [];
    for (let i = 0; i < walkerCount; i++) {
        pathwalkers.push(new Walker());
    }
    // Clear once initial
    ctx.fillStyle = '#0f0c02'; // Background color matches CSS
    ctx.fillRect(0, 0, width, height);
}

function animate() {
    // Fade out trail slowly
    ctx.fillStyle = 'rgba(15, 12, 2, 0.05)';
    ctx.fillRect(0, 0, width, height);

    pathwalkers.forEach(walker => {
        walker.update();
        walker.draw();
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();
animate();
