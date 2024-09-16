class Player {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.width = 50;
        this.height = 50;
        this.velocityY = 0;
        this.gravity = 0.6;
        this.bounceHeight = -12; // Consistent bounce height after landing
    }

    update(platforms) {
        // Apply gravity to make the player fall
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Check for platform collisions only when falling
        if (this.velocityY > 0) {
            platforms.forEach(platform => {
                if (this.isFalling() && this.checkCollision(platform)) {
                    this.landOnPlatform(platform);
                }
            });
        }
    }

    isFalling() {
        return this.velocityY > 0;
    }

    checkCollision(platform) {
        return (
            this.y + this.height >= platform.y &&  // Player is above the platform
            this.y + this.height <= platform.y + platform.height &&  // Player is not below the platform
            this.x + this.width > platform.x &&  // Player is within platform's width
            this.x < platform.x + platform.width // Player's other side is still on the platform
        );
    }

    landOnPlatform(platform) {
        // Set the player on top of the platform and apply the bounce
        this.y = platform.y - this.height;
        this.velocityY = this.bounceHeight; // Consistent bounce height

        // Increment the score when the player bounces on a platform
        score++;
        updateScoreDisplay(); // Update the score display
    }

    draw(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
