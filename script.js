// Simple two-player platformer with rectangle platforms
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');

    // Player settings
    const playerSize = 20;
    const players = [
        { x: 80, y: 560, vx: 0, vy: 0, color: '#1e90ff', controls: { left: 'a', right: 'd', up: 'w' }, onGround: false },
        { x: 300, y: 560, vx: 0, vy: 0, color: '#ff6347', controls: { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp' }, onGround: false }
    ];

    // Arrow state: 0 for player 1, 1 for player 2
    let arrowPlayer = 0;

    const gravity = 0.6;
    const moveSpeed = 3;
    const jumpPower = -9;

    // Rectangle platforms (smaller, more, varied)
    const platforms = [
        { x: 30, y: 580, w: 340, h: 12 },
        { x: 60, y: 520, w: 80, h: 12 },
        { x: 200, y: 500, w: 120, h: 12 },
        { x: 320, y: 470, w: 50, h: 12 },
        { x: 120, y: 440, w: 60, h: 12 },
        { x: 250, y: 410, w: 100, h: 12 },
        { x: 60, y: 370, w: 80, h: 12 },
        { x: 200, y: 340, w: 120, h: 12 },
        { x: 320, y: 310, w: 50, h: 12 },
        { x: 120, y: 280, w: 60, h: 12 },
        { x: 250, y: 250, w: 100, h: 12 },
        { x: 60, y: 210, w: 80, h: 12 },
        { x: 200, y: 180, w: 120, h: 12 },
        { x: 320, y: 150, w: 50, h: 12 },
        { x: 120, y: 120, w: 60, h: 12 },
        { x: 250, y: 90, w: 100, h: 12 }
    ];

    const keys = {};
    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);

    function drawPlatforms() {
        ctx.save();
        ctx.fillStyle = '#888';
        platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));
        ctx.restore();
    }

    function drawPlayers() {
        players.forEach((p, i) => {
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, playerSize, playerSize);
            // Draw arrow above the selected player
            if (i === arrowPlayer) {
                ctx.beginPath();
                ctx.moveTo(p.x + playerSize / 2, p.y - 12); // top
                ctx.lineTo(p.x + playerSize / 2 - 7, p.y - 2); // left
                ctx.lineTo(p.x + playerSize / 2 + 7, p.y - 2); // right
                ctx.closePath();
                ctx.fillStyle = '#ffd700';
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
            ctx.restore();
        });
    }
    // Check for player collision and swap arrow
    function checkPlayerTouch() {
        const [p1, p2] = players;
        if (
            Math.abs(p1.x - p2.x) < playerSize &&
            Math.abs(p1.y - p2.y) < playerSize
        ) {
            arrowPlayer = arrowPlayer === 0 ? 1 : 0;
        }
    }

    function platformCollision(p) {
        for (const plat of platforms) {
            if (
                p.x + playerSize > plat.x &&
                p.x < plat.x + plat.w &&
                p.y + playerSize > plat.y &&
                p.y + playerSize < plat.y + plat.h + 10 &&
                p.vy >= 0
            ) {
                p.y = plat.y - playerSize;
                p.vy = 0;
                p.onGround = true;
                return true;
            }
        }
        p.onGround = false;
        return false;
    }

    function updatePlayer(p) {
        // Horizontal movement
        if (keys[p.controls.left]) p.vx = -moveSpeed;
        else if (keys[p.controls.right]) p.vx = moveSpeed;
        else p.vx = 0;

        // Jump
        if (keys[p.controls.up] && p.onGround) {
            p.vy = jumpPower;
        }

        // Gravity
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;

        // Platform collision
        platformCollision(p);

        // Boundaries
        if (p.x < 0) p.x = 0;
        if (p.x + playerSize > canvas.width) p.x = canvas.width - playerSize;
        if (p.y + playerSize > canvas.height) {
            p.y = canvas.height - playerSize;
            p.vy = 0;
            p.onGround = true;
        }
    }

    function gameLoop() {
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        drawPlatforms();
        players.forEach(updatePlayer);
        checkPlayerTouch();
        drawPlayers();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
