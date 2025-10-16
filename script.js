// Game State
const gameState = {
    score: 0,
    ducksHit: 0,
    ducksMissed: 0,
    combo: 0,
    maxCombo: 0,
    activeDucks: [],
    isGameActive: false,
    isPaused: false,
    difficulty: 1,
    spawnRate: 2000,
    minSpawnRate: 500,
    certificateAwarded: false
};

// Game Settings
const settings = {
    baseDuckSpeed: 2,
    duckLifetime: 10000,
    basePoints: 100,
    comboMultiplier: 1.5,
    difficultyIncrement: 0.1,
    spawnRateDecrease: 50,
    maxActiveDucks: 8
};

// Spawn interval
let spawnInterval = null;

// DOM Elements
const elements = {
    score: document.getElementById('score'),
    ducksHitDisplay: document.getElementById('ducksHitDisplay'),
    missedDisplay: document.getElementById('missedDisplay'),
    comboDisplay: document.getElementById('comboDisplay'),
    ducksContainer: document.getElementById('ducksContainer'),
    gameCanvas: document.getElementById('gameCanvas'),
    startScreen: document.getElementById('startScreen'),
    pauseScreen: document.getElementById('pauseScreen'),
    certificateScreen: document.getElementById('certificateScreen'),
    debugPanel: document.getElementById('debugPanel'),
    startBtn: document.getElementById('startBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    resumeBtn: document.getElementById('resumeBtn'),
    restartBtn: document.getElementById('restartBtn'),
    continueCertBtn: document.getElementById('continueCertBtn'),
    downloadCertBtn: document.getElementById('downloadCertBtn'),
    debugBtn: document.getElementById('debugBtn'),
    closeDebugBtn: document.getElementById('closeDebugBtn'),
    finalScore: document.getElementById('finalScore'),
    totalHit: document.getElementById('totalHit'),
    totalMissed: document.getElementById('totalMissed'),
    certScore: document.getElementById('certScore'),
    certAccuracy: document.getElementById('certAccuracy'),
    certCombo: document.getElementById('certCombo'),
    certDate: document.getElementById('certDate')
};

// Duck SVG template
const duckSVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="55" rx="25" ry="20" fill="#8B4513"/>
    <circle cx="65" cy="40" r="15" fill="#654321"/>
    <circle cx="70" cy="38" r="3" fill="#000"/>
    <circle cx="71" cy="37" r="1" fill="#fff"/>
    <polygon points="75,40 85,38 85,42" fill="#FFA500"/>
    <ellipse cx="45" cy="50" rx="15" ry="10" fill="#654321" transform="rotate(-20 45 50)"/>
    <ellipse cx="30" cy="55" rx="8" ry="12" fill="#654321" transform="rotate(30 30 55)"/>
</svg>
`;

// Initialize game
function init() {
    elements.startBtn.addEventListener('click', startGame);
    elements.pauseBtn.addEventListener('click', togglePause);
    elements.resumeBtn.addEventListener('click', togglePause);
    elements.restartBtn.addEventListener('click', restartGame);
    elements.continueCertBtn.addEventListener('click', closeCertificate);
    elements.downloadCertBtn.addEventListener('click', downloadCertificate);
    elements.debugBtn.addEventListener('click', toggleDebugPanel);
    elements.closeDebugBtn.addEventListener('click', toggleDebugPanel);
    
    // Prevent context menu on canvas
    elements.gameCanvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Make canvas only respond to clicks on ducks
    elements.gameCanvas.addEventListener('mousedown', handleCanvasClick, true);
    
    // Prevent dragging of any elements
    document.addEventListener('dragstart', (e) => e.preventDefault());
    
    // Update debug panel periodically
    setInterval(updateDebugInfo, 100);
}

// Handle canvas click - only for background
function handleCanvasClick(e) {
    if (!gameState.isGameActive || gameState.isPaused) return;
    
    // Check if click target is a duck
    const target = e.target;
    const isDuckClick = target.closest('.duck');
    
    if (!isDuckClick) {
        // Miss shot effect
        createMuzzleFlash(e.clientX - elements.gameCanvas.getBoundingClientRect().left, 
                         e.clientY - elements.gameCanvas.getBoundingClientRect().top);
        playSound('miss');
    }
}

// Start game
function startGame() {
    elements.startScreen.classList.add('hidden');
    elements.pauseBtn.style.display = 'block';
    resetGame();
    gameState.isGameActive = true;
    startSpawning();
}

// Reset game
function resetGame() {
    gameState.score = 0;
    gameState.ducksHit = 0;
    gameState.ducksMissed = 0;
    gameState.combo = 0;
    gameState.maxCombo = 0;
    gameState.difficulty = 1;
    gameState.spawnRate = 2000;
    gameState.activeDucks = [];
    gameState.isPaused = false;
    gameState.certificateAwarded = false;
    
    // Clear all ducks
    elements.ducksContainer.innerHTML = '';
    
    updateUI();
}

// Start spawning ducks
function startSpawning() {
    // Initial duck
    createDuck();
    
    // Continuous spawning
    spawnInterval = setInterval(() => {
        if (!gameState.isGameActive || gameState.isPaused) return;
        
        // Only spawn if below max active ducks
        if (gameState.activeDucks.length < settings.maxActiveDucks) {
            createDuck();
            
            // Increase difficulty over time
            gameState.difficulty += settings.difficultyIncrement;
            
            // Decrease spawn rate (faster spawning) but not below minimum
            if (gameState.spawnRate > settings.minSpawnRate) {
                gameState.spawnRate = Math.max(
                    settings.minSpawnRate,
                    gameState.spawnRate - settings.spawnRateDecrease
                );
                
                // Update spawn interval
                clearInterval(spawnInterval);
                startSpawning();
            }
        }
    }, gameState.spawnRate);
}

// Create duck
function createDuck() {
    if (!gameState.isGameActive || gameState.isPaused) return;
    
    const duck = document.createElement('div');
    duck.className = 'duck';
    duck.innerHTML = duckSVG;
    
    // Random starting position
    const startX = Math.random() < 0.5 ? -100 : elements.gameCanvas.offsetWidth + 100;
    const startY = Math.random() * (elements.gameCanvas.offsetHeight * 0.6) + 50;
    
    duck.style.left = startX + 'px';
    duck.style.top = startY + 'px';
    
    // Random movement direction
    const direction = startX < 0 ? 1 : -1;
    const speedVariation = 0.5 + Math.random() * 0.5;
    const speed = (settings.baseDuckSpeed + gameState.difficulty * 0.5) * speedVariation;
    const verticalSpeed = (Math.random() - 0.5) * speed * 0.6;
    
    if (direction < 0) {
        duck.classList.add('flipped');
    }
    
    const duckData = {
        element: duck,
        x: startX,
        y: startY,
        speedX: speed * direction,
        speedY: verticalSpeed,
        isHit: false,
        lifetime: 0,
        id: Date.now() + Math.random()
    };
    
    gameState.activeDucks.push(duckData);
    elements.ducksContainer.appendChild(duck);
    
    // Add click handler with precise detection
    duck.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        shootDuck(duckData);
    }, true);
    
    // Prevent any child elements from being clickable
    const svgElements = duck.querySelectorAll('*');
    svgElements.forEach(el => {
        el.style.pointerEvents = 'none';
    });
    
    // Animate duck
    animateDuck(duckData);
}

// Animate duck
function animateDuck(duckData) {
    const animate = () => {
        if (!gameState.isGameActive || duckData.isHit) return;
        
        if (gameState.isPaused) {
            requestAnimationFrame(animate);
            return;
        }
        
        duckData.x += duckData.speedX;
        duckData.y += duckData.speedY;
        duckData.lifetime += 16;
        
        // Bounce off top and bottom
        const maxY = elements.gameCanvas.offsetHeight * 0.7;
        if (duckData.y < 0) {
            duckData.y = 0;
            duckData.speedY *= -1;
        } else if (duckData.y > maxY) {
            duckData.y = maxY;
            duckData.speedY *= -1;
        }
        
        duckData.element.style.left = duckData.x + 'px';
        duckData.element.style.top = duckData.y + 'px';
        
        // Check if duck escaped
        const escaped = Math.abs(duckData.x) > elements.gameCanvas.offsetWidth + 100;
        const timedOut = duckData.lifetime > settings.duckLifetime;
        
        if (escaped || timedOut) {
            duckEscaped(duckData);
            return;
        }
        
        requestAnimationFrame(animate);
    };
    
    animate();
}

// Shoot duck
function shootDuck(duckData) {
    if (!gameState.isGameActive || gameState.isPaused || duckData.isHit) return;
    
    // Mark duck as hit
    duckData.isHit = true;
    duckData.element.classList.add('hit');
    duckData.element.style.pointerEvents = 'none';
    
    // Update stats
    gameState.ducksHit++;
    gameState.combo++;
    
    // Calculate score with combo multiplier
    const comboBonus = Math.floor(gameState.combo / 3);
    const points = Math.floor(
        settings.basePoints * 
        (1 + comboBonus * settings.comboMultiplier) * 
        (1 + gameState.difficulty * 0.1)
    );
    
    gameState.score += points;
    
    // Update max combo
    if (gameState.combo > gameState.maxCombo) {
        gameState.maxCombo = gameState.combo;
    }
    
    // Create muzzle flash at duck position
    createMuzzleFlash(duckData.x + 30, duckData.y + 30);
    
    // Show combo popup for combos
    if (gameState.combo > 1) {
        showComboPopup(duckData.x + 30, duckData.y - 20, gameState.combo, points);
    }
    
    playSound('hit');
    updateUI();
    
    // Check for certificate milestone
    if (gameState.ducksHit === 100 && !gameState.certificateAwarded) {
        gameState.certificateAwarded = true;
        setTimeout(() => {
            showCertificate();
        }, 1500);
    }
    
    // Remove duck after animation
    setTimeout(() => {
        removeDuck(duckData);
    }, 1000);
}

// Duck escaped
function duckEscaped(duckData) {
    if (duckData.isHit) return;
    
    duckData.isHit = true;
    duckData.element.classList.add('escaped');
    duckData.element.style.pointerEvents = 'none';
    
    // Reset combo and increment missed
    gameState.combo = 0;
    gameState.ducksMissed++;
    
    playSound('escape');
    updateUI();
    
    setTimeout(() => {
        removeDuck(duckData);
    }, 1000);
}

// Remove duck
function removeDuck(duckData) {
    const index = gameState.activeDucks.indexOf(duckData);
    if (index > -1) {
        gameState.activeDucks.splice(index, 1);
    }
    
    if (duckData.element && duckData.element.parentNode) {
        duckData.element.parentNode.removeChild(duckData.element);
    }
}

// Toggle pause
function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    
    if (gameState.isPaused) {
        elements.pauseScreen.classList.remove('hidden');
        elements.finalScore.textContent = gameState.score;
        elements.totalHit.textContent = gameState.ducksHit;
        elements.totalMissed.textContent = gameState.ducksMissed;
    } else {
        elements.pauseScreen.classList.add('hidden');
    }
}

// Restart game
function restartGame() {
    // Clear spawn interval
    if (spawnInterval) {
        clearInterval(spawnInterval);
    }
    
    // Clear all ducks
    gameState.activeDucks.forEach(duckData => {
        if (duckData.element && duckData.element.parentNode) {
            duckData.element.parentNode.removeChild(duckData.element);
        }
    });
    
    elements.pauseScreen.classList.add('hidden');
    startGame();
}

// Update UI
function updateUI() {
    elements.score.textContent = gameState.score;
    elements.ducksHitDisplay.textContent = gameState.ducksHit;
    elements.missedDisplay.textContent = gameState.ducksMissed;
    elements.comboDisplay.textContent = gameState.combo;
    
    // Highlight combo when active
    if (gameState.combo > 2) {
        elements.comboDisplay.parentElement.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            elements.comboDisplay.parentElement.style.animation = '';
        }, 500);
    }
}

// Show certificate
function showCertificate() {
    gameState.isPaused = true;
    
    // Calculate accuracy
    const totalShots = gameState.ducksHit + gameState.ducksMissed;
    const accuracy = totalShots > 0 ? Math.round((gameState.ducksHit / totalShots) * 100) : 0;
    
    // Update certificate details
    elements.certScore.textContent = gameState.score;
    elements.certAccuracy.textContent = accuracy;
    elements.certCombo.textContent = gameState.maxCombo;
    
    // Set current date
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    elements.certDate.textContent = dateString;
    
    // Show certificate
    elements.certificateScreen.classList.remove('hidden');
    
    // Play celebration sound
    playSound('certificate');
}

// Close certificate
function closeCertificate() {
    elements.certificateScreen.classList.add('hidden');
    gameState.isPaused = false;
}

// Download certificate
function downloadCertificate() {
    // Create a canvas to draw the certificate
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#fff8dc';
    ctx.fillRect(0, 0, 800, 600);
    
    // Border
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 760, 560);
    
    ctx.strokeStyle = '#daa520';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 720, 520);
    
    // Title
    ctx.fillStyle = '#8b4513';
    ctx.font = 'bold 48px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 MASTER HUNTER 🏆', 400, 100);
    
    // Certificate text
    ctx.font = 'italic 24px "Courier New"';
    ctx.fillStyle = '#5c4033';
    ctx.fillText('This certifies that', 400, 160);
    
    ctx.font = 'bold 36px "Courier New"';
    ctx.fillStyle = '#8b4513';
    ctx.fillText('EXPERT MARKSMAN', 400, 220);
    
    ctx.font = 'italic 24px "Courier New"';
    ctx.fillStyle = '#5c4033';
    ctx.fillText('has successfully hunted', 400, 270);
    
    ctx.font = 'bold 40px "Courier New"';
    ctx.fillStyle = '#ff6600';
    ctx.fillText('100 DUCKS', 400, 330);
    
    ctx.font = 'italic 20px "Courier New"';
    ctx.fillStyle = '#5c4033';
    ctx.fillText('demonstrating exceptional skill, precision, and dedication', 400, 370);
    
    // Stats
    const accuracy = Math.round((gameState.ducksHit / (gameState.ducksHit + gameState.ducksMissed)) * 100);
    ctx.font = 'bold 22px "Courier New"';
    ctx.fillStyle = '#8b4513';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 150, 440);
    ctx.textAlign = 'center';
    ctx.fillText(`Accuracy: ${accuracy}%`, 400, 440);
    ctx.textAlign = 'right';
    ctx.fillText(`Max Combo: ${gameState.maxCombo}x`, 650, 440);
    
    // Footer
    ctx.font = '18px "Courier New"';
    ctx.fillStyle = '#5c4033';
    ctx.textAlign = 'left';
    ctx.fillText('___________________', 100, 520);
    ctx.fillText('Duck Hunt Official', 100, 545);
    
    ctx.textAlign = 'right';
    ctx.fillText(elements.certDate.textContent, 700, 520);
    
    // Download
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'Master_Hunter_Certificate.png';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    });
}

// Create muzzle flash
function createMuzzleFlash(x, y) {
    const flash = document.createElement('div');
    flash.className = 'muzzle-flash';
    flash.style.left = x + 'px';
    flash.style.top = y + 'px';
    elements.gameCanvas.appendChild(flash);
    
    setTimeout(() => {
        flash.remove();
    }, 100);
}

// Show combo popup
function showComboPopup(x, y, combo, points) {
    const popup = document.createElement('div');
    popup.className = 'combo-popup';
    popup.textContent = `${combo}x COMBO! +${points}`;
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    elements.gameCanvas.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 1000);
}

// Play sound (placeholder - you can add actual sound files)
function playSound(type) {
    // Placeholder for sound effects
    // You can implement Web Audio API or use HTML5 Audio here
    console.log(`Sound: ${type}`);
}

// Toggle debug panel
function toggleDebugPanel() {
    elements.debugPanel.classList.toggle('hidden');
    if (!elements.debugPanel.classList.contains('hidden')) {
        syncDebugInputs();
    }
}

// Sync debug inputs with current values
function syncDebugInputs() {
    document.getElementById('debugScore').value = gameState.score;
    document.getElementById('debugDucksHit').value = gameState.ducksHit;
    document.getElementById('debugDucksMissed').value = gameState.ducksMissed;
    document.getElementById('debugCombo').value = gameState.combo;
    document.getElementById('debugDuckSpeed').value = settings.baseDuckSpeed;
    document.getElementById('debugSpawnRate').value = gameState.spawnRate;
    document.getElementById('debugDuckLifetime').value = settings.duckLifetime;
    document.getElementById('debugMaxDucks').value = settings.maxActiveDucks;
    document.getElementById('debugDifficulty').value = gameState.difficulty;
    document.getElementById('debugBasePoints').value = settings.basePoints;
}

// Update debug info display
function updateDebugInfo() {
    if (!elements.debugPanel.classList.contains('hidden')) {
        document.getElementById('debugActiveDucks').textContent = gameState.activeDucks.length;
        document.getElementById('debugCurrentSpeed').textContent = settings.baseDuckSpeed.toFixed(1);
        document.getElementById('debugCurrentSpawn').textContent = gameState.spawnRate;
        document.getElementById('debugCertStatus').textContent = gameState.certificateAwarded ? 'Yes' : 'No';
    }
}

// Apply debug value
function applyDebugValue(type) {
    switch(type) {
        case 'score':
            gameState.score = parseInt(document.getElementById('debugScore').value) || 0;
            break;
        case 'ducksHit':
            gameState.ducksHit = parseInt(document.getElementById('debugDucksHit').value) || 0;
            break;
        case 'ducksMissed':
            gameState.ducksMissed = parseInt(document.getElementById('debugDucksMissed').value) || 0;
            break;
        case 'combo':
            gameState.combo = parseInt(document.getElementById('debugCombo').value) || 0;
            break;
        case 'duckSpeed':
            settings.baseDuckSpeed = parseFloat(document.getElementById('debugDuckSpeed').value) || 2;
            break;
        case 'spawnRate':
            const newRate = parseInt(document.getElementById('debugSpawnRate').value) || 2000;
            gameState.spawnRate = newRate;
            if (gameState.isGameActive && spawnInterval) {
                clearInterval(spawnInterval);
                startSpawning();
            }
            break;
        case 'duckLifetime':
            settings.duckLifetime = parseInt(document.getElementById('debugDuckLifetime').value) || 10000;
            break;
        case 'maxDucks':
            settings.maxActiveDucks = parseInt(document.getElementById('debugMaxDucks').value) || 8;
            break;
        case 'difficulty':
            gameState.difficulty = parseFloat(document.getElementById('debugDifficulty').value) || 1;
            break;
        case 'basePoints':
            settings.basePoints = parseInt(document.getElementById('debugBasePoints').value) || 100;
            break;
    }
    updateUI();
    console.log(`Applied ${type}:`, gameState[type] || settings[type]);
}

// Debug actions
function debugAction(action) {
    switch(action) {
        case 'setCertificate':
            gameState.ducksHit = 100;
            gameState.certificateAwarded = false;
            updateUI();
            showCertificate();
            console.log('Certificate milestone set!');
            break;
            
        case 'maxSpeed':
            settings.baseDuckSpeed = 10;
            gameState.spawnRate = 300;
            document.getElementById('debugDuckSpeed').value = 10;
            document.getElementById('debugSpawnRate').value = 300;
            if (gameState.isGameActive && spawnInterval) {
                clearInterval(spawnInterval);
                startSpawning();
            }
            console.log('Max speed mode activated!');
            break;
            
        case 'slowMode':
            settings.baseDuckSpeed = 0.5;
            gameState.spawnRate = 5000;
            document.getElementById('debugDuckSpeed').value = 0.5;
            document.getElementById('debugSpawnRate').value = 5000;
            if (gameState.isGameActive && spawnInterval) {
                clearInterval(spawnInterval);
                startSpawning();
            }
            console.log('Slow motion activated!');
            break;
            
        case 'clearDucks':
            gameState.activeDucks.forEach(duckData => {
                if (duckData.element && duckData.element.parentNode) {
                    duckData.element.parentNode.removeChild(duckData.element);
                }
            });
            gameState.activeDucks = [];
            console.log('All ducks cleared!');
            break;
            
        case 'spawn10':
            if (gameState.isGameActive) {
                for (let i = 0; i < 10; i++) {
                    setTimeout(() => createDuck(), i * 100);
                }
                console.log('Spawning 10 ducks!');
            } else {
                console.log('Start the game first!');
            }
            break;
            
        case 'godMode':
            gameState.score = 10000;
            gameState.ducksHit = 200;
            gameState.maxCombo = 50;
            updateUI();
            syncDebugInputs();
            console.log('God mode activated!');
            break;
            
        case 'resetAll':
            settings.baseDuckSpeed = 2;
            settings.duckLifetime = 10000;
            settings.basePoints = 100;
            settings.maxActiveDucks = 8;
            gameState.difficulty = 1;
            gameState.spawnRate = 2000;
            syncDebugInputs();
            if (gameState.isGameActive && spawnInterval) {
                clearInterval(spawnInterval);
                startSpawning();
            }
            console.log('All values reset to default!');
            break;
    }
}

// Initialize game when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
