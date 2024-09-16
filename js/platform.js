// platform.js
class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityY = 2;
    }

    update() {
        // Move platform downwards
        this.y += this.velocityY;

        // If platform goes off the screen, reset its position
        if (this.y > canvas.height) {
            this.y = -this.height;
            this.x = Math.random() * (canvas.width - this.width);
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'orange';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Generate multiple platforms
function generatePlatforms() {
    const platforms = [];
    for (let i = 0; i < 5; i++) {
        let x = Math.random() * (canvas.width - 70);
        let y = i * 120;
        platforms.push(new Platform(x, y, 70, 10));
    }
    return platforms;
}
