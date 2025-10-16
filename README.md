# 🦆 Duck Hunt - Classic Arcade Game

A modern recreation of the classic Duck Hunt game with endless gameplay, combo system, and achievement rewards!

![Duck Hunt Game](https://img.shields.io/badge/Game-Duck%20Hunt-orange?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 🎮 Features

### Core Gameplay
- **Endless Mode**: Unlimited gameplay with continuously spawning ducks
- **Infinite Ammo**: No bullet limitations - shoot as much as you want!
- **Progressive Difficulty**: Game gets harder over time with faster ducks and spawn rates
- **Combo System**: Build combos by hitting ducks consecutively for bonus points
- **Smart Click Detection**: Only ducks are clickable - background elements won't interfere

### 🏆 Achievements
- **Master Hunter Certificate**: Unlock a professional certificate when you hit 100 ducks
- **Downloadable Certificate**: Save your achievement as a PNG image
- **Real-time Statistics**: Track score, accuracy, and max combo

### 🔧 Debug System
A comprehensive debug panel for testing and experimentation:
- Adjust score, stats, and combo values
- Control duck speed and spawn rates
- Modify game difficulty and points
- Quick action presets (God Mode, Slow Motion, Max Speed)
- Real-time monitoring of game state

### 🎨 Visual Features
- Classic retro Duck Hunt styling
- Smooth animations and visual effects
- Muzzle flash effects when shooting
- Combo popup notifications
- Falling duck animations
- Responsive design for all screen sizes

## 🚀 Getting Started

### Installation

1. **Clone or Download** this repository
2. **Open** `index.html` in any modern web browser
3. **Start Playing!** No installation or setup required

```bash
# Clone the repository
git clone https://github.com/suylakan/duck-hunt.git

# Navigate to the directory
cd duck-hunt

# Open in browser
# Simply double-click index.html or use a local server
```

### Browser Compatibility
- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

## 🎯 How to Play

### Basic Controls
1. **Click START GAME** to begin
2. **Click on ducks** to shoot them
3. **Build combos** by hitting ducks consecutively
4. **Avoid missing** - letting ducks escape resets your combo

### Scoring System
- **Base Points**: 100 points per duck
- **Combo Multiplier**: Every 3 consecutive hits increases your multiplier
- **Difficulty Bonus**: Points increase as difficulty rises
- **Formula**: `Points = 100 × (1 + ComboBonus × 1.5) × (1 + Difficulty × 0.1)`

### Game Mechanics
- Ducks spawn from both left and right sides
- Each duck has a limited lifetime (10 seconds by default)
- Ducks bounce off top and bottom of the screen
- Speed increases progressively
- Maximum 8 ducks can be active at once (default)

## 🏅 Achievements

### Master Hunter Certificate
Unlock when you successfully hunt **100 ducks**!

**Certificate Features:**
- Professional parchment-style design
- Gold rotating seal
- Your final score and accuracy
- Maximum combo achieved
- Current date
- Download as PNG image

## 🔧 Debug Mode

Press the **DEBUG** button to access advanced controls:

### Score & Stats
- Manually adjust score
- Set ducks hit/missed
- Control combo counter

### Speed Settings
- Duck speed (0.1 - 20x)
- Spawn rate (100ms - 10000ms)
- Duck lifetime

### Game Settings
- Max active ducks (1-50)
- Difficulty multiplier
- Base points per duck

### Quick Actions
- 🏆 **Get Certificate**: Instant 100 ducks achievement
- ⚡ **Max Speed**: Extreme difficulty mode
- 🐌 **Slow Motion**: Practice mode
- 🧹 **Clear Ducks**: Remove all active ducks
- 🦆 **Spawn 10**: Instant duck spawn
- 👑 **God Mode**: 10,000 score, 200 ducks, 50x combo
- 🔄 **Reset**: Return to default values

## 📁 Project Structure

```
duck-hunt-game/
│
├── index.html          # Main HTML file
├── style.css           # All styling and animations
├── script.js           # Game logic and functionality
└── README.md           # This file
```

## 🎨 Customization

### Changing Duck Speed
```javascript
// In script.js
settings.baseDuckSpeed = 3; // Default is 2
```

### Adjusting Spawn Rate
```javascript
// In script.js
gameState.spawnRate = 1500; // Default is 2000ms
```

### Modifying Points
```javascript
// In script.js
settings.basePoints = 200; // Default is 100
```

## 🌟 Features Breakdown

### Visual Effects
- ✨ Muzzle flash on shooting
- 🎯 Duck hit animations
- 🦅 Duck escape animations
- 💥 Combo popup notifications
- 🌈 Smooth color transitions

### Audio Ready
The game includes placeholder sound functions ready for implementation:
- Hit sound
- Miss sound
- Escape sound
- Certificate unlock sound

### Responsive Design
- Desktop: Full-featured experience
- Tablet: Optimized layout
- Mobile: Touch-friendly controls

## 🐛 Known Issues

- Sound effects are placeholder (console logs only)
- Certificate download requires modern browser support

## 🚧 Future Enhancements

- [ ] Add sound effects
- [ ] Multiple duck types (different speeds/points)
- [ ] Power-ups system
- [ ] Leaderboard integration
- [ ] More achievement levels
- [ ] Difficulty presets (Easy/Medium/Hard)
- [ ] Background variations
- [ ] Dog character from original game

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

Created with ❤️ by Harun Berke Öztürk

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🎮 Game Tips

1. **Build Combos**: Focus on consecutive hits for maximum points
2. **Lead Your Shots**: Aim where the duck is going, not where it is
3. **Stay Calm**: As difficulty increases, patience is key
4. **Use Debug Mode**: Practice with slow motion before attempting high scores
5. **Watch Patterns**: Ducks bounce predictably - use this to your advantage

## 📊 Statistics

- Lines of Code: ~1000+
- Development Time: Custom built
- Technologies: Pure HTML5, CSS3, Vanilla JavaScript
- No dependencies or frameworks required!

## 🙏 Acknowledgments

- Inspired by the classic Nintendo Duck Hunt (1984)
- Retro gaming aesthetic
- Modern web technologies

---

**Enjoy the hunt! 🦆🎯**

*Try to beat your high score and unlock the Master Hunter Certificate!*

