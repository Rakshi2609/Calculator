console.log("🔥 Sexy Calculator Loaded! 🔥");
console.log("⌨️ Keyboard Shortcuts:");
console.log("• Numbers: 0-9");
console.log("• Operators: + - * /");
console.log("• Equals: Enter or =");
console.log("• Clear: Escape or C");
console.log("• Decimal: .");
console.log("• Backspace: Delete last character");

// Custom cursor tracker
const cursorTracker = document.getElementById('cursorTracker');
const cursorGlow = document.getElementById('cursorGlow');

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    cursorTracker.style.left = (x - 10) + 'px';
    cursorTracker.style.top = (y - 10) + 'px';
    
    cursorGlow.style.left = (x - 20) + 'px';
    cursorGlow.style.top = (y - 20) + 'px';
});

// Particle system
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = particle.style.height = Math.random() * 10 + 5 + 'px';
    particle.style.animationDuration = Math.random() * 3 + 5 + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    document.getElementById('particles').appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 8000);
}

// Create particles continuously
setInterval(createParticle, 300);

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    let buttonToHighlight = null;
    
    // Prevent default for calculator keys
    if ('0123456789+-*/.='.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        e.preventDefault();
    }
    
    // Handle number keys
    if ('0123456789'.includes(key)) {
        if (document.querySelector("input").value === '0' && key !== '0') {
            string = key;
        } else {
            string = string + key;
        }
        document.querySelector("input").value = string;
        buttonToHighlight = findButtonByText(key);
    }
    // Handle operators
    else if (key === '+') {
        string = string + '+';
        document.querySelector("input").value = string;
        buttonToHighlight = document.querySelector('.addition');
    }
    else if (key === '-') {
        string = string + '-';
        document.querySelector("input").value = string;
        buttonToHighlight = document.querySelector('.subtraction');
    }
    else if (key === '*') {
        string = string + '*';
        document.querySelector("input").value = string;
        buttonToHighlight = document.querySelector('.multiplication');
    }
    else if (key === '/') {
        string = string + '/';
        document.querySelector("input").value = string;
        buttonToHighlight = document.querySelector('.division');
    }
    else if (key === '.') {
        string = string + '.';
        document.querySelector("input").value = string;
        buttonToHighlight = document.querySelector('.point');
    }
    // Handle equals
    else if (key === 'Enter' || key === '=') {
        if (isValidExpression(string)) {
            try {
                const expression = string;
                const result = eval(sanitizeInput(string));
                
                if (isNaN(result) || !isFinite(result)) {
                    document.querySelector("input").value = "Error";
                    string = "";
                } else {
                    string = result.toString();
                    document.querySelector("input").value = string;
                    addToSavedHistory(expression, string);
                }
            } catch {
                document.querySelector("input").value = "Error";
                string = "";
            }
        }
        buttonToHighlight = document.querySelector('.equal');
    }
    // Handle clear
    else if (key === 'Escape' || key === 'c' || key === 'C') {
        if (string !== '') {
            showSavedHistory();
        }
        string = '';
        document.querySelector("input").value = '0';
        buttonToHighlight = document.querySelector('.clear');
    }
    // Handle backspace
    else if (key === 'Backspace') {
        string = string.slice(0, -1);
        document.querySelector("input").value = string || '0';
    }
    
    // Highlight pressed button with enhanced effects
    if (buttonToHighlight) {
        buttonToHighlight.classList.add('keyboard-pressed');
        buttonToHighlight.style.transform = 'scale(0.95)';
        buttonToHighlight.style.boxShadow = '0 0 30px 6px #ff00cc99, 0 0 40px 10px #33339999';
        
        // Create a sparkle effect
        createSparkles(buttonToHighlight);
        
        setTimeout(() => {
            buttonToHighlight.classList.remove('keyboard-pressed');
            buttonToHighlight.style.transform = '';
            buttonToHighlight.style.boxShadow = '';
        }, 300);
    }
});

// Helper function to find button by text content
function findButtonByText(text) {
    const buttons = document.querySelectorAll('.number');
    for (let button of buttons) {
        if (button.textContent.trim() === text) {
            return button;
        }
    }
    return null;
}

// Create sparkle effect for button presses
function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    const sparkleCount = 5;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = '#ff00cc';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '10000';
        sparkle.style.animation = 'sparkle 0.6s ease-out forwards';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 600);
    }
}

// Add sparkle animation CSS dynamically
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkle {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: scale(1) rotate(180deg) translateY(-20px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);



let string = ""; 
let savedHistory = [];

// Input validation functions
function isValidExpression(expr) {
    // Check for invalid patterns that cause NaN
    if (!expr || expr.trim() === '') return false;
    if (/[+\-*/]{2,}/.test(expr)) return false; // Multiple operators
    if (/^[+\-*/]/.test(expr.trim())) return false; // Starts with operator (except -)
    if (/[+\-*/]$/.test(expr.trim())) return false; // Ends with operator
    if (/\.\./.test(expr)) return false; // Multiple dots
    return true;
}

function sanitizeInput(input) {
    // Remove any non-calculator characters
    return input.replace(/[^0-9+\-*/.]/g, '');
}

function addToSavedHistory(expression, result) {
    const historyItem = { expression, result, timestamp: new Date() };
    savedHistory.unshift(historyItem);
    if (savedHistory.length > 20) savedHistory = savedHistory.slice(0, 20);
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const savedContainer = document.getElementById('savedHistory');
    
    // Update saved history
    if (savedContainer) {
        savedContainer.innerHTML = savedHistory.map(item => 
            `<div class="history-item" onclick="loadFromHistory('${item.expression}', '${item.result}')">
                <div class="expression">${item.expression}</div>
                <div class="result">= ${item.result}</div>
            </div>`
        ).join('');
    }
}

function loadFromHistory(expression, result) {
    string = result;
    document.querySelector("input").value = string;
}

function showSavedHistory() {
    // Show left panel
    const leftPanel = document.getElementById('historyLeft');
    if (leftPanel) {
        leftPanel.classList.add('show');
    }
}

// === GAMES SYSTEM ===
let currentGame = null;
let gameCanvas = null;
let gameCtx = null;
let gameLoop = null;

function toggleGames() {
    const gamesPanel = document.getElementById('gamesPanel');
    gamesPanel.classList.toggle('show');
}

function startGame(gameType) {
    closeGame(); // Close any existing game
    currentGame = gameType;
    
    const gameSelection = document.querySelector('.game-selection');
    const gameArea = document.getElementById('gameArea');
    gameCanvas = document.getElementById('gameCanvas');
    gameCtx = gameCanvas.getContext('2d');
    
    gameSelection.style.display = 'none';
    gameArea.classList.add('active');
    
    switch(gameType) {
        case 'maze': initMaze(); break;
        case 'flappy': initFlappy(); break;
        case 'snake': initSnake(); break;
        case 'pong': initPong(); break;
    }
}

function closeGame() {
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    
    const gameSelection = document.querySelector('.game-selection');
    const gameArea = document.getElementById('gameArea');
    
    gameSelection.style.display = 'grid';
    gameArea.classList.remove('active');
    currentGame = null;
    
    // Remove event listeners
    document.removeEventListener('keydown', gameKeyHandler);
    if (gameCanvas) {
        gameCanvas.removeEventListener('click', gameClickHandler);
    }
}

function restartGame() {
    if (currentGame) {
        const gameType = currentGame;
        closeGame();
        setTimeout(() => startGame(gameType), 100);
    }
}

let gameKeys = {};
function gameKeyHandler(e) {
    gameKeys[e.key] = true;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
}

function gameClickHandler(e) {
    // Handle game-specific clicks
}

// === MAZE GAME ===
let maze = {
    player: {x: 1, y: 1},
    goal: {x: 13, y: 18},
    width: 15,
    height: 20,
    grid: [],
    collectibles: [],
    collected: 0,
    totalCollectibles: 5
};

function initMaze() {
    generateComplexMaze();
    document.addEventListener('keydown', gameKeyHandler);
    gameLoop = setInterval(updateMaze, 120);
}

function generateComplexMaze() {
    // Initialize grid with all walls
    const grid = Array(maze.height).fill().map(() => Array(maze.width).fill(1));
    
    // Recursive backtracking maze generation
    const stack = [];
    const visited = Array(maze.height).fill().map(() => Array(maze.width).fill(false));
    
    // Start at (1,1)
    let current = {x: 1, y: 1};
    grid[current.y][current.x] = 0;
    visited[current.y][current.x] = true;
    
    const directions = [
        {x: 0, y: -2, wall: {x: 0, y: -1}}, // North
        {x: 2, y: 0, wall: {x: 1, y: 0}},   // East
        {x: 0, y: 2, wall: {x: 0, y: 1}},   // South
        {x: -2, y: 0, wall: {x: -1, y: 0}}  // West
    ];
    
    while (true) {
        // Get valid neighbors
        const neighbors = directions.filter(dir => {
            const nx = current.x + dir.x;
            const ny = current.y + dir.y;
            return nx > 0 && nx < maze.width-1 && ny > 0 && ny < maze.height-1 && !visited[ny][nx];
        });
        
        if (neighbors.length > 0) {
            // Choose random neighbor
            const dir = neighbors[Math.floor(Math.random() * neighbors.length)];
            const next = {x: current.x + dir.x, y: current.y + dir.y};
            const wall = {x: current.x + dir.wall.x, y: current.y + dir.wall.y};
            
            // Remove walls and mark as visited
            grid[next.y][next.x] = 0;
            grid[wall.y][wall.x] = 0;
            visited[next.y][next.x] = true;
            
            stack.push(current);
            current = next;
        } else if (stack.length > 0) {
            current = stack.pop();
        } else {
            break;
        }
    }
    
    // Ensure start and end are accessible
    grid[1][1] = 0;
    grid[maze.height-2][maze.width-2] = 0;
    
    // Create additional random paths for complexity
    for (let i = 0; i < 15; i++) {
        const x = Math.floor(Math.random() * (maze.width-2)) + 1;
        const y = Math.floor(Math.random() * (maze.height-2)) + 1;
        if (Math.random() < 0.3) grid[y][x] = 0;
    }
    
    maze.grid = grid;
    maze.player = {x: 1, y: 1};
    maze.goal = {x: maze.width-2, y: maze.height-2};
    
    // Generate collectibles
    maze.collectibles = [];
    maze.collected = 0;
    for (let i = 0; i < maze.totalCollectibles; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * (maze.width-2)) + 1;
            y = Math.floor(Math.random() * (maze.height-2)) + 1;
        } while (grid[y][x] === 1 || (x === 1 && y === 1) || (x === maze.goal.x && y === maze.goal.y));
        
        maze.collectibles.push({x, y, collected: false});
    }
}

function updateMaze() {
    const prevX = maze.player.x;
    const prevY = maze.player.y;
    
    if (gameKeys['ArrowUp'] && maze.grid[maze.player.y-1] && maze.grid[maze.player.y-1][maze.player.x] === 0) maze.player.y--;
    if (gameKeys['ArrowDown'] && maze.grid[maze.player.y+1] && maze.grid[maze.player.y+1][maze.player.x] === 0) maze.player.y++;
    if (gameKeys['ArrowLeft'] && maze.grid[maze.player.y] && maze.grid[maze.player.y][maze.player.x-1] === 0) maze.player.x--;
    if (gameKeys['ArrowRight'] && maze.grid[maze.player.y] && maze.grid[maze.player.y][maze.player.x+1] === 0) maze.player.x++;
    
    gameKeys = {};
    
    // Check for collectibles
    maze.collectibles.forEach(collectible => {
        if (!collectible.collected && collectible.x === maze.player.x && collectible.y === maze.player.y) {
            collectible.collected = true;
            maze.collected++;
        }
    });
    
    drawMaze();
    
    // Check win condition
    if (maze.player.x === maze.goal.x && maze.player.y === maze.goal.y) {
        if (maze.collected === maze.totalCollectibles) {
            alert(`🏆 Maze Complete! All ${maze.totalCollectibles} gems collected!`);
        } else {
            alert(`🎉 Maze Complete! Collected ${maze.collected}/${maze.totalCollectibles} gems`);
        }
        restartGame();
    }
}

function drawMaze() {
    gameCtx.fillStyle = '#0a0a0a';
    gameCtx.fillRect(0, 0, 300, 400);
    
    const cellW = 300 / maze.width;
    const cellH = 400 / maze.height;
    
    // Draw maze walls with gradient effect
    for (let y = 0; y < maze.height; y++) {
        for (let x = 0; x < maze.width; x++) {
            if (maze.grid[y] && maze.grid[y][x] === 1) {
                const gradient = gameCtx.createLinearGradient(x * cellW, y * cellH, (x + 1) * cellW, (y + 1) * cellH);
                gradient.addColorStop(0, '#ff00cc');
                gradient.addColorStop(1, '#333399');
                gameCtx.fillStyle = gradient;
                gameCtx.fillRect(x * cellW, y * cellH, cellW, cellH);
                
                // Add wall border
                gameCtx.strokeStyle = '#ff00cc99';
                gameCtx.lineWidth = 1;
                gameCtx.strokeRect(x * cellW, y * cellH, cellW, cellH);
            } else {
                // Draw floor with subtle pattern
                gameCtx.fillStyle = '#1a1a1a';
                gameCtx.fillRect(x * cellW, y * cellH, cellW, cellH);
            }
        }
    }
    
    // Draw collectibles (gems)
    maze.collectibles.forEach(collectible => {
        if (!collectible.collected) {
            gameCtx.fillStyle = '#ffff00';
            gameCtx.beginPath();
            gameCtx.arc(collectible.x * cellW + cellW/2, collectible.y * cellH + cellH/2, cellW/4, 0, Math.PI * 2);
            gameCtx.fill();
            
            // Add sparkle effect
            gameCtx.fillStyle = '#ffffff';
            gameCtx.fillRect(collectible.x * cellW + cellW/2 - 1, collectible.y * cellH + cellH/2 - 3, 2, 6);
            gameCtx.fillRect(collectible.x * cellW + cellW/2 - 3, collectible.y * cellH + cellH/2 - 1, 6, 2);
        }
    });
    
    // Draw goal with pulsing effect
    const time = Date.now() * 0.005;
    const pulse = Math.sin(time) * 0.2 + 0.8;
    gameCtx.fillStyle = `rgba(0, 255, 0, ${pulse})`;
    gameCtx.fillRect(maze.goal.x * cellW + 2, maze.goal.y * cellH + 2, cellW - 4, cellH - 4);
    
    // Goal border
    gameCtx.strokeStyle = '#00ff00';
    gameCtx.lineWidth = 2;
    gameCtx.strokeRect(maze.goal.x * cellW + 2, maze.goal.y * cellH + 2, cellW - 4, cellH - 4);
    
    // Draw player with glow effect
    gameCtx.shadowColor = '#333399';
    gameCtx.shadowBlur = 10;
    gameCtx.fillStyle = '#333399';
    gameCtx.fillRect(maze.player.x * cellW + 3, maze.player.y * cellH + 3, cellW - 6, cellH - 6);
    gameCtx.shadowBlur = 0;
    
    // Player border
    gameCtx.strokeStyle = '#ffffff';
    gameCtx.lineWidth = 1;
    gameCtx.strokeRect(maze.player.x * cellW + 3, maze.player.y * cellH + 3, cellW - 6, cellH - 6);
    
    // UI - Score and instructions
    gameCtx.fillStyle = '#ffffff';
    gameCtx.font = '12px Arial';
    gameCtx.fillText(`Gems: ${maze.collected}/${maze.totalCollectibles}`, 5, 15);
    gameCtx.fillText('Arrow keys to move', 5, 395);
}

// === CRAZY FLAPPY BIRD ===
let flappy = {
    bird: {x: 50, y: 200, vy: 0, trail: [], size: 16, color: '#ffff00', invincible: 0},
    pipes: [],
    powerUps: [],
    obstacles: [],
    particles: [],
    score: 0,
    combo: 0,
    gravity: 0.4,
    jump: -7,
    speed: 3,
    cameraShake: 0,
    backgroundScroll: 0,
    crazyMode: false,
    crazyTimer: 0
};

function initFlappy() {
    flappy.bird = {x: 50, y: 200, vy: 0, trail: [], size: 16, color: '#ffff00', invincible: 0};
    flappy.pipes = [];
    flappy.powerUps = [];
    flappy.obstacles = [];
    flappy.particles = [];
    flappy.score = 0;
    flappy.combo = 0;
    flappy.cameraShake = 0;
    flappy.backgroundScroll = 0;
    flappy.crazyMode = false;
    flappy.crazyTimer = 0;
    document.addEventListener('keydown', gameKeyHandler);
    gameCanvas.addEventListener('click', gameClickHandler);
    gameLoop = setInterval(updateFlappy, 16);
}

function updateFlappy() {
    // Crazy mode timer
    if (flappy.crazyMode) {
        flappy.crazyTimer--;
        if (flappy.crazyTimer <= 0) {
            flappy.crazyMode = false;
            flappy.gravity = 0.4;
            flappy.speed = 3;
        }
    }
    
    // Bird physics with crazy effects
    flappy.bird.vy += flappy.gravity + (flappy.crazyMode ? Math.sin(Date.now() * 0.01) * 0.2 : 0);
    flappy.bird.y += flappy.bird.vy;
    
    // Enhanced jumping with effects
    if (gameKeys[' '] || gameKeys['ArrowUp']) {
        flappy.bird.vy = flappy.jump + (flappy.crazyMode ? -2 : 0);
        gameKeys[' '] = gameKeys['ArrowUp'] = false;
        
        // Jump particles
        for (let i = 0; i < 5; i++) {
            flappy.particles.push({
                x: flappy.bird.x,
                y: flappy.bird.y + flappy.bird.size/2,
                vx: Math.random() * 4 - 2,
                vy: Math.random() * 4 + 2,
                color: flappy.bird.color,
                life: 20,
                size: Math.random() * 3 + 1
            });
        }
        
        if (flappy.combo > 0) flappy.cameraShake = 5;
    }
    
    // Bird trail effect
    flappy.bird.trail.push({x: flappy.bird.x, y: flappy.bird.y, alpha: 1});
    if (flappy.bird.trail.length > 8) flappy.bird.trail.shift();
    flappy.bird.trail.forEach(t => t.alpha *= 0.8);
    
    // Generate pipes with variety
    if (flappy.pipes.length === 0 || flappy.pipes[flappy.pipes.length-1].x < 200) {
        let gap = 80 + Math.random() * 40;
        if (flappy.crazyMode) gap += 20;
        
        const pipeY = Math.random() * (400 - gap - 100) + 50;
        const pipeType = Math.random();
        
        let pipe = {
            x: 300,
            topH: pipeY,
            botY: pipeY + gap,
            scored: false,
            color: '#00ff00'
        };
        
        // Special pipe types
        if (pipeType < 0.1) {
            pipe.moving = true;
            pipe.moveSpeed = 1;
            pipe.moveDir = 1;
            pipe.color = '#ff0000';
        } else if (pipeType < 0.2) {
            pipe.spinning = true;
            pipe.angle = 0;
            pipe.color = '#ff00ff';
        }
        
        flappy.pipes.push(pipe);
    }
    
    // Generate power-ups
    if (Math.random() < 0.03 && flappy.powerUps.length < 2) {
        const types = ['speed', 'invincible', 'crazy', 'shrink', 'magnet'];
        const type = types[Math.floor(Math.random() * types.length)];
        flappy.powerUps.push({
            x: 300,
            y: Math.random() * 300 + 50,
            type,
            collected: false,
            pulse: 0
        });
    }
    
    // Generate moving obstacles
    if (Math.random() < 0.02 && flappy.obstacles.length < 3) {
        flappy.obstacles.push({
            x: 300,
            y: Math.random() * 200 + 100,
            vx: -2 - Math.random() * 2,
            vy: (Math.random() - 0.5) * 2,
            size: 8 + Math.random() * 8,
            color: '#ff4444',
            spin: 0
        });
    }
    
    // Update pipes
    flappy.pipes.forEach(pipe => {
        pipe.x -= flappy.speed;
        
        if (pipe.moving) {
            pipe.topH += pipe.moveSpeed * pipe.moveDir;
            pipe.botY += pipe.moveSpeed * pipe.moveDir;
            if (pipe.topH < 20 || pipe.botY > 380) pipe.moveDir *= -1;
        }
        
        if (pipe.spinning) {
            pipe.angle += 0.1;
        }
    });
    flappy.pipes = flappy.pipes.filter(pipe => pipe.x > -60);
    
    // Update power-ups
    flappy.powerUps.forEach(powerUp => {
        powerUp.x -= flappy.speed;
        powerUp.pulse += 0.2;
        
        // Collect power-up
        if (!powerUp.collected && 
            Math.abs(powerUp.x - flappy.bird.x) < 20 && 
            Math.abs(powerUp.y - flappy.bird.y) < 20) {
            
            powerUp.collected = true;
            flappy.combo++;
            
            // Apply power-up effect
            switch(powerUp.type) {
                case 'speed': 
                    flappy.speed = Math.min(flappy.speed + 1, 8); 
                    break;
                case 'invincible': 
                    flappy.bird.invincible = 300; 
                    flappy.bird.color = '#00ffff';
                    break;
                case 'crazy': 
                    flappy.crazyMode = true; 
                    flappy.crazyTimer = 500; 
                    flappy.gravity = 0.2;
                    break;
                case 'shrink': 
                    flappy.bird.size = Math.max(flappy.bird.size - 2, 8); 
                    break;
                case 'magnet':
                    // Attract nearby power-ups
                    flappy.powerUps.forEach(p => {
                        if (!p.collected) {
                            const dx = flappy.bird.x - p.x;
                            const dy = flappy.bird.y - p.y;
                            const dist = Math.sqrt(dx*dx + dy*dy);
                            if (dist < 100) {
                                p.x += dx * 0.1;
                                p.y += dy * 0.1;
                            }
                        }
                    });
                    break;
            }
            
            // Power-up particles
            for (let i = 0; i < 15; i++) {
                flappy.particles.push({
                    x: powerUp.x, y: powerUp.y,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    color: '#ffff00',
                    life: 30,
                    size: Math.random() * 4 + 2
                });
            }
            
            flappy.cameraShake = 10;
        }
    });
    flappy.powerUps = flappy.powerUps.filter(p => p.x > -30);
    
    // Update obstacles
    flappy.obstacles.forEach(obs => {
        obs.x += obs.vx;
        obs.y += obs.vy;
        obs.spin += 0.2;
        
        // Bounce off walls
        if (obs.y < 0 || obs.y > 400) obs.vy *= -1;
    });
    flappy.obstacles = flappy.obstacles.filter(obs => obs.x > -50);
    
    // Update particles
    flappy.particles = flappy.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life--;
        return p.life > 0;
    });
    
    // Update invincibility
    if (flappy.bird.invincible > 0) {
        flappy.bird.invincible--;
        if (flappy.bird.invincible === 0) {
            flappy.bird.color = '#ffff00';
        }
    }
    
    // Camera shake
    if (flappy.cameraShake > 0) {
        flappy.cameraShake--;
    }
    
    // Background scroll
    flappy.backgroundScroll += flappy.speed * 0.5;
    
    drawFlappy();
    
    // Collision detection
    if (flappy.bird.y < 0 || flappy.bird.y + flappy.bird.size > 400) {
        if (flappy.bird.invincible === 0) {
            alert(`💀 CRAZY Game Over! Score: ${flappy.score} | Combo: ${flappy.combo}`);
            restartGame();
        } else {
            flappy.bird.y = Math.max(0, Math.min(400 - flappy.bird.size, flappy.bird.y));
            flappy.bird.vy = 0;
        }
    }
    
    // Pipe collision
    if (flappy.bird.invincible === 0) {
        flappy.pipes.forEach(pipe => {
            if (flappy.bird.x + flappy.bird.size > pipe.x && flappy.bird.x < pipe.x + 50) {
                if (flappy.bird.y < pipe.topH || flappy.bird.y + flappy.bird.size > pipe.botY) {
                    alert(`💀 CRAZY Game Over! Score: ${flappy.score} | Combo: ${flappy.combo}`);
                    restartGame();
                }
            }
        });
        
        // Obstacle collision
        flappy.obstacles.forEach(obs => {
            const dx = obs.x - (flappy.bird.x + flappy.bird.size/2);
            const dy = obs.y - (flappy.bird.y + flappy.bird.size/2);
            if (Math.sqrt(dx*dx + dy*dy) < obs.size + flappy.bird.size/2) {
                alert(`💀 CRAZY Game Over! Score: ${flappy.score} | Combo: ${flappy.combo}`);
                restartGame();
            }
        });
    }
    
    // Scoring with combo bonus
    flappy.pipes.forEach(pipe => {
        if (pipe.x + 50 < flappy.bird.x && !pipe.scored) {
            flappy.score += 1 + Math.floor(flappy.combo / 3);
            pipe.scored = true;
            flappy.cameraShake = 3;
        }
    });
}

function drawFlappy() {
    // Camera shake offset
    const shakeX = flappy.cameraShake > 0 ? (Math.random() - 0.5) * flappy.cameraShake : 0;
    const shakeY = flappy.cameraShake > 0 ? (Math.random() - 0.5) * flappy.cameraShake : 0;
    
    gameCtx.save();
    gameCtx.translate(shakeX, shakeY);
    
    // Crazy background
    if (flappy.crazyMode) {
        const gradient = gameCtx.createLinearGradient(0, 0, 300, 400);
        gradient.addColorStop(0, `hsl(${Date.now() * 0.1 % 360}, 70%, 30%)`);
        gradient.addColorStop(1, `hsl(${(Date.now() * 0.1 + 180) % 360}, 70%, 20%)`);
        gameCtx.fillStyle = gradient;
    } else {
        gameCtx.fillStyle = '#87CEEB';
    }
    gameCtx.fillRect(0, 0, 300, 400);
    
    // Moving background pattern
    gameCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = -1; i < 4; i++) {
        const x = (i * 100 - flappy.backgroundScroll) % 400;
        gameCtx.fillRect(x, 0, 2, 400);
    }
    
    // Draw bird trail
    flappy.bird.trail.forEach(t => {
        gameCtx.fillStyle = flappy.bird.color.replace(')', `, ${t.alpha})`).replace('rgb', 'rgba');
        gameCtx.fillRect(t.x, t.y, flappy.bird.size, flappy.bird.size);
    });
    
    // Draw pipes with effects
    flappy.pipes.forEach(pipe => {
        gameCtx.save();
        if (pipe.spinning) {
            gameCtx.translate(pipe.x + 25, pipe.topH);
            gameCtx.rotate(pipe.angle);
            gameCtx.translate(-25, -pipe.topH);
        }
        
        gameCtx.fillStyle = pipe.color;
        gameCtx.fillRect(pipe.x, 0, 50, pipe.topH);
        gameCtx.fillRect(pipe.x, pipe.botY, 50, 400 - pipe.botY);
        
        // Pipe glow for special pipes
        if (pipe.color !== '#00ff00') {
            gameCtx.shadowBlur = 10;
            gameCtx.shadowColor = pipe.color;
            gameCtx.fillRect(pipe.x, 0, 50, pipe.topH);
            gameCtx.fillRect(pipe.x, pipe.botY, 50, 400 - pipe.botY);
            gameCtx.shadowBlur = 0;
        }
        
        gameCtx.restore();
    });
    
    // Draw power-ups
    flappy.powerUps.forEach(powerUp => {
        if (!powerUp.collected) {
            const size = 12 + Math.sin(powerUp.pulse) * 3;
            const colors = {
                speed: '#ff0000',
                invincible: '#00ffff', 
                crazy: '#ff00ff',
                shrink: '#00ff00',
                magnet: '#ffaa00'
            };
            
            gameCtx.fillStyle = colors[powerUp.type];
            gameCtx.shadowBlur = 15;
            gameCtx.shadowColor = colors[powerUp.type];
            gameCtx.fillRect(powerUp.x - size/2, powerUp.y - size/2, size, size);
            gameCtx.shadowBlur = 0;
            
            // Power-up symbol
            gameCtx.fillStyle = '#ffffff';
            gameCtx.font = '10px Arial';
            gameCtx.textAlign = 'center';
            const symbols = {speed: '⚡', invincible: '🛡️', crazy: '🌟', shrink: '🔺', magnet: '🧲'};
            gameCtx.fillText(symbols[powerUp.type] || '?', powerUp.x, powerUp.y + 3);
        }
    });
    
    // Draw obstacles
    flappy.obstacles.forEach(obs => {
        gameCtx.save();
        gameCtx.translate(obs.x, obs.y);
        gameCtx.rotate(obs.spin);
        gameCtx.fillStyle = obs.color;
        gameCtx.fillRect(-obs.size/2, -obs.size/2, obs.size, obs.size);
        gameCtx.restore();
    });
    
    // Draw particles
    flappy.particles.forEach(p => {
        const alpha = p.life / 30;
        gameCtx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        gameCtx.fillRect(p.x, p.y, p.size, p.size);
    });
    
    // Draw bird with effects
    if (flappy.bird.invincible > 0) {
        gameCtx.shadowBlur = 20;
        gameCtx.shadowColor = flappy.bird.color;
    }
    
    gameCtx.fillStyle = flappy.bird.color;
    gameCtx.fillRect(flappy.bird.x, flappy.bird.y, flappy.bird.size, flappy.bird.size);
    
    if (flappy.bird.invincible > 0) {
        gameCtx.shadowBlur = 0;
        // Invincibility sparkles
        for (let i = 0; i < 3; i++) {
            const sparkleX = flappy.bird.x + Math.random() * flappy.bird.size;
            const sparkleY = flappy.bird.y + Math.random() * flappy.bird.size;
            gameCtx.fillStyle = '#ffffff';
            gameCtx.fillRect(sparkleX, sparkleY, 2, 2);
        }
    }
    
    gameCtx.restore();
    
    // UI
    gameCtx.fillStyle = '#ffffff';
    gameCtx.font = 'bold 16px Arial';
    gameCtx.textAlign = 'left';
    gameCtx.fillText(`Score: ${flappy.score}`, 5, 20);
    gameCtx.fillText(`Combo: ${flappy.combo}`, 5, 40);
    
    if (flappy.crazyMode) {
        gameCtx.fillStyle = '#ff00ff';
        gameCtx.fillText('CRAZY MODE!', 5, 60);
    }
    
    if (flappy.bird.invincible > 0) {
        gameCtx.fillStyle = '#00ffff';
        gameCtx.fillText(`Shield: ${Math.ceil(flappy.bird.invincible/60)}s`, 5, 80);
    }
    
    gameCtx.fillStyle = '#ffffff';
    gameCtx.font = '10px Arial';
    gameCtx.fillText('Space/↑ to jump', 5, 390);
}

// === SNAKE GAME ===
let snake = {
    body: [{x: 10, y: 10}],
    dx: 0, dy: 0,
    food: {x: 15, y: 15},
    score: 0
};

function initSnake() {
    snake.body = [{x: 10, y: 10}];
    snake.dx = 0; snake.dy = 0;
    snake.food = {x: 15, y: 15};
    snake.score = 0;
    document.addEventListener('keydown', gameKeyHandler);
    gameLoop = setInterval(updateSnake, 150);
}

function updateSnake() {
    if (gameKeys['ArrowUp'] && snake.dy === 0) { snake.dx = 0; snake.dy = -1; }
    if (gameKeys['ArrowDown'] && snake.dy === 0) { snake.dx = 0; snake.dy = 1; }
    if (gameKeys['ArrowLeft'] && snake.dx === 0) { snake.dx = -1; snake.dy = 0; }
    if (gameKeys['ArrowRight'] && snake.dx === 0) { snake.dx = 1; snake.dy = 0; }
    gameKeys = {};
    
    if (snake.dx === 0 && snake.dy === 0) return;
    
    const head = {x: snake.body[0].x + snake.dx, y: snake.body[0].y + snake.dy};
    snake.body.unshift(head);
    
    // Check food
    if (head.x === snake.food.x && head.y === snake.food.y) {
        snake.score++;
        snake.food = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 26)};
    } else {
        snake.body.pop();
    }
    
    drawSnake();
    
    // Collision
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 26 || 
        snake.body.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        alert(`🐍 Game Over! Score: ${snake.score}`);
        restartGame();
    }
}

function drawSnake() {
    gameCtx.fillStyle = '#000';
    gameCtx.fillRect(0, 0, 300, 400);
    
    // Snake
    gameCtx.fillStyle = '#00ff00';
    snake.body.forEach(segment => {
        gameCtx.fillRect(segment.x * 15, segment.y * 15, 14, 14);
    });
    
    // Food
    gameCtx.fillStyle = '#ff0000';
    gameCtx.fillRect(snake.food.x * 15, snake.food.y * 15, 14, 14);
    
    // Score
    gameCtx.fillStyle = '#fff';
    gameCtx.font = '16px Arial';
    gameCtx.fillText(`Score: ${snake.score}`, 10, 20);
}

// === PONG GAME ===
let pong = {
    paddle1: {x: 10, y: 150, w: 12, h: 60, vy: 0, speed: 6},
    paddle2: {x: 278, y: 150, w: 12, h: 60, vy: 0, speed: 4.5, isAI: true},
    ball: {x: 150, y: 200, dx: 4, dy: 3, size: 8, speed: 4, trail: []},
    score1: 0, score2: 0,
    gameMode: 'ai', // 'ai' or 'human'
    maxScore: 7,
    particles: []
};

function initPong() {
    pong.ball = {x: 150, y: 200, dx: 4, dy: 3, size: 8, speed: 4, trail: []};
    pong.paddle1.y = 150; pong.paddle2.y = 150;
    pong.score1 = 0; pong.score2 = 0;
    pong.particles = [];
    document.addEventListener('keydown', gameKeyHandler);
    gameLoop = setInterval(updatePong, 16);
}

function updatePong() {
    // Toggle game mode with spacebar
    if (gameKeys[' ']) {
        pong.paddle2.isAI = !pong.paddle2.isAI;
        gameKeys[' '] = false;
    }
    
    // Player 1 controls (always human) - W/S keys
    if (gameKeys['w'] || gameKeys['W']) {
        pong.paddle1.vy = -pong.paddle1.speed;
        gameKeys['w'] = gameKeys['W'] = false;
    } else if (gameKeys['s'] || gameKeys['S']) {
        pong.paddle1.vy = pong.paddle1.speed;
        gameKeys['s'] = gameKeys['S'] = false;
    } else {
        pong.paddle1.vy *= 0.8; // Smooth deceleration
    }
    
    // Player 2 controls
    if (pong.paddle2.isAI) {
        // Advanced AI with prediction and difficulty scaling
        const ballCenterY = pong.ball.y + pong.ball.size / 2;
        const paddleCenterY = pong.paddle2.y + pong.paddle2.h / 2;
        const difficulty = 0.75; // AI accuracy (0-1)
        
        // Predict where ball will be
        let predictedY = ballCenterY;
        if (pong.ball.dx > 0) { // Ball moving towards AI
            const timeToReach = (pong.paddle2.x - pong.ball.x) / pong.ball.dx;
            predictedY = pong.ball.y + pong.ball.dy * timeToReach;
            
            // Add some randomness to make AI beatable
            predictedY += (Math.random() - 0.5) * 20;
        }
        
        const targetY = predictedY * difficulty + ballCenterY * (1 - difficulty);
        const diff = targetY - paddleCenterY;
        
        if (Math.abs(diff) > 8) {
            pong.paddle2.vy = Math.sign(diff) * pong.paddle2.speed * 0.9;
        } else {
            pong.paddle2.vy *= 0.9;
        }
    } else {
        // Human player 2 - Arrow keys
        if (gameKeys['ArrowUp']) {
            pong.paddle2.vy = -pong.paddle2.speed;
            gameKeys['ArrowUp'] = false;
        } else if (gameKeys['ArrowDown']) {
            pong.paddle2.vy = pong.paddle2.speed;
            gameKeys['ArrowDown'] = false;
        } else {
            pong.paddle2.vy *= 0.8;
        }
    }
    
    // Update paddle positions
    pong.paddle1.y = Math.max(0, Math.min(340, pong.paddle1.y + pong.paddle1.vy));
    pong.paddle2.y = Math.max(0, Math.min(340, pong.paddle2.y + pong.paddle2.vy));
    
    // Ball trail effect
    pong.ball.trail.push({x: pong.ball.x, y: pong.ball.y});
    if (pong.ball.trail.length > 8) pong.ball.trail.shift();
    
    // Ball movement with speed increase
    pong.ball.x += pong.ball.dx;
    pong.ball.y += pong.ball.dy;
    
    // Ball collision with top/bottom
    if (pong.ball.y <= 0 || pong.ball.y >= 392) {
        pong.ball.dy = -pong.ball.dy;
        createPongParticles(pong.ball.x, pong.ball.y, '#ffffff');
    }
    
    // Enhanced paddle collision
    function checkPaddleCollision(paddle, isLeft) {
        const ballRight = pong.ball.x + pong.ball.size;
        const ballLeft = pong.ball.x;
        const ballTop = pong.ball.y;
        const ballBottom = pong.ball.y + pong.ball.size;
        
        const paddleRight = paddle.x + paddle.w;
        const paddleLeft = paddle.x;
        const paddleTop = paddle.y;
        const paddleBottom = paddle.y + paddle.h;
        
        if (ballBottom >= paddleTop && ballTop <= paddleBottom) {
            if (isLeft && ballLeft <= paddleRight && ballRight >= paddleLeft && pong.ball.dx < 0) {
                return true;
            } else if (!isLeft && ballRight >= paddleLeft && ballLeft <= paddleRight && pong.ball.dx > 0) {
                return true;
            }
        }
        return false;
    }
    
    // Paddle 1 collision
    if (checkPaddleCollision(pong.paddle1, true)) {
        const hitPos = (pong.ball.y + pong.ball.size/2 - pong.paddle1.y - pong.paddle1.h/2) / (pong.paddle1.h/2);
        pong.ball.dx = Math.abs(pong.ball.dx) * (1 + Math.abs(hitPos) * 0.2);
        pong.ball.dy = hitPos * 3 + pong.paddle1.vy * 0.3;
        pong.ball.x = pong.paddle1.x + pong.paddle1.w + 1;
        createPongParticles(pong.ball.x, pong.ball.y, '#ff00cc');
    }
    
    // Paddle 2 collision
    if (checkPaddleCollision(pong.paddle2, false)) {
        const hitPos = (pong.ball.y + pong.ball.size/2 - pong.paddle2.y - pong.paddle2.h/2) / (pong.paddle2.h/2);
        pong.ball.dx = -Math.abs(pong.ball.dx) * (1 + Math.abs(hitPos) * 0.2);
        pong.ball.dy = hitPos * 3 + pong.paddle2.vy * 0.3;
        pong.ball.x = pong.paddle2.x - pong.ball.size - 1;
        createPongParticles(pong.ball.x, pong.ball.y, '#333399');
    }
    
    // Scoring
    if (pong.ball.x < -10) { 
        pong.score2++; 
        resetPongBall();
        createPongParticles(0, pong.ball.y, '#333399');
    }
    if (pong.ball.x > 310) { 
        pong.score1++; 
        resetPongBall();
        createPongParticles(300, pong.ball.y, '#ff00cc');
    }
    
    // Update particles
    pong.particles = pong.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        return p.life > 0;
    });
    
    drawPong();
    
    if (pong.score1 >= pong.maxScore || pong.score2 >= pong.maxScore) {
        const winner = pong.score1 >= pong.maxScore ? 'Player 1' : (pong.paddle2.isAI ? 'AI' : 'Player 2');
        alert(`🏓 ${winner} Wins! Final Score: ${pong.score1}-${pong.score2}`);
        restartGame();
    }
}

function resetPongBall() {
    pong.ball.x = 150;
    pong.ball.y = 200 + (Math.random() - 0.5) * 100;
    pong.ball.dx = (Math.random() > 0.5 ? 1 : -1) * (4 + Math.random() * 2);
    pong.ball.dy = (Math.random() - 0.5) * 4;
    pong.ball.trail = [];
}

function createPongParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
        pong.particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            color,
            life: 30
        });
    }
}

function drawPong() {
    // Background with gradient
    const gradient = gameCtx.createLinearGradient(0, 0, 300, 400);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#1a1a1a');
    gameCtx.fillStyle = gradient;
    gameCtx.fillRect(0, 0, 300, 400);
    
    // Draw ball trail
    pong.ball.trail.forEach((pos, i) => {
        const alpha = i / pong.ball.trail.length * 0.5;
        gameCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        gameCtx.fillRect(pos.x, pos.y, pong.ball.size, pong.ball.size);
    });
    
    // Draw paddles with glow
    gameCtx.shadowBlur = 10;
    
    // Paddle 1 (Player)
    gameCtx.shadowColor = '#ff00cc';
    gameCtx.fillStyle = '#ff00cc';
    gameCtx.fillRect(pong.paddle1.x, pong.paddle1.y, pong.paddle1.w, pong.paddle1.h);
    
    // Paddle 2 (AI/Player 2)
    gameCtx.shadowColor = '#333399';
    gameCtx.fillStyle = '#333399';
    gameCtx.fillRect(pong.paddle2.x, pong.paddle2.y, pong.paddle2.w, pong.paddle2.h);
    
    gameCtx.shadowBlur = 0;
    
    // Ball with glow
    gameCtx.shadowBlur = 15;
    gameCtx.shadowColor = '#ffffff';
    gameCtx.fillStyle = '#ffffff';
    gameCtx.beginPath();
    gameCtx.arc(pong.ball.x + pong.ball.size/2, pong.ball.y + pong.ball.size/2, pong.ball.size/2, 0, Math.PI * 2);
    gameCtx.fill();
    gameCtx.shadowBlur = 0;
    
    // Center line with glow effect
    gameCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    gameCtx.lineWidth = 2;
    gameCtx.setLineDash([10, 10]);
    gameCtx.beginPath();
    gameCtx.moveTo(150, 0);
    gameCtx.lineTo(150, 400);
    gameCtx.stroke();
    gameCtx.setLineDash([]);
    
    // Draw particles
    pong.particles.forEach(p => {
        const alpha = p.life / 30;
        gameCtx.fillStyle = p.color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
        gameCtx.fillRect(p.x, p.y, 3, 3);
    });
    
    // Score with glow
    gameCtx.shadowBlur = 5;
    gameCtx.font = 'bold 24px Arial';
    
    gameCtx.shadowColor = '#ff00cc';
    gameCtx.fillStyle = '#ff00cc';
    gameCtx.fillText(pong.score1, 120, 35);
    
    gameCtx.shadowColor = '#333399';
    gameCtx.fillStyle = '#333399';
    gameCtx.fillText(pong.score2, 170, 35);
    
    gameCtx.shadowBlur = 0;
    
    // Game mode indicator
    gameCtx.fillStyle = '#ffffff';
    gameCtx.font = '10px Arial';
    gameCtx.fillText(pong.paddle2.isAI ? 'vs AI' : 'vs Human', 130, 55);
    gameCtx.fillText('W/S vs ↑↓', 125, 385);
}

let numbers = document.querySelectorAll(".number");

Array.from(numbers).forEach((number) => {
    // Enhanced hover effects
    number.addEventListener('mouseenter', () => {
        cursorTracker.style.transform = 'scale(1.5)';
        cursorGlow.style.transform = 'scale(1.8)';
    });
    
    number.addEventListener('mouseleave', () => {
        cursorTracker.style.transform = 'scale(1)';
        cursorGlow.style.transform = 'scale(1)';
    });
    
    number.addEventListener("click", (e) => {
        // Enhanced ripple effect
        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.left = e.offsetX + "px";
        ripple.style.top = e.offsetY + "px";
        number.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
        
        // Cursor pulse effect
        cursorTracker.style.transform = 'scale(2)';
        setTimeout(() => cursorTracker.style.transform = 'scale(1)', 200);

        // Get the actual button text content, not HTML
        const buttonValue = e.currentTarget.textContent.trim();
        console.log("Button clicked:", buttonValue);

        if (buttonValue === "=") {
            if (isValidExpression(string)) {
                try {
                    const expression = string;
                    const result = eval(sanitizeInput(string));
                    
                    if (isNaN(result) || !isFinite(result)) {
                        document.querySelector("input").value = "Error";
                        string = "";
                    } else {
                        string = result.toString();
                        document.querySelector("input").value = string;
                        addToSavedHistory(expression, string);
                    }
                } catch {
                    document.querySelector("input").value = "Error";
                    string = "";
                }
            } else {
                document.querySelector("input").value = "Invalid";
                setTimeout(() => {
                    document.querySelector("input").value = string;
                }, 1000);
            }
        }
        else if(buttonValue === 'Clear'){
            if (string !== '') {
                showSavedHistory();
            }
            string = '';
            document.querySelector("input").value = '0';
        }
        else {
            if (document.querySelector("input").value === '0' && '0123456789'.includes(buttonValue)) {
                string = buttonValue;
            } else {
                string = string + buttonValue;
            }
            document.querySelector("input").value = string;
        }
    });
});
