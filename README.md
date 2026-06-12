# ChooseWho

> A premium, mobile-first web application designed to determine the "First Player" for board games, card games, or any decision-making scenario.

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/richardlitt/standard-readme)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=flat-square)](https://higherkey.github.io/choosewho/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](#)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

ChooseWho is a zero-dependency, mobile-first touch application that makes finding the starting player, groups, or order fun and tactile.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Background

Built with a focus on high-fidelity visuals, tactile feedback, and ultra-low latency, the application uses advanced web APIs (Touch Events, Web Audio, Vibration) directly in the browser to deliver a premium user experience.

### Features
- **Multi-Touch Excellence**: Supports up to **8 simultaneous touches** with unique SVG shape geometries for each player.
- **Premium Aesthetics**: "Premium Dark" design system with neon glowing indicators, smooth 60fps CSS transitions, and hardware-accelerated animations.
- **Dynamic Modes**:
    - 🏆 **Winner**: Randomly selects a single player.
    - 🔢 **Order**: Shuffles all players and assigns a numerical turn order.
    - 👥 **Teams**: Automatically splits players into two balanced teams (T1/T2).
    - 🎲 **Roll a Die**: Assigns a random 1-6 value to every participant.
- **Advanced Engine**:
    - **Audio Synthesizer**: Procedural audio generation using the Web Audio API (Sine, Square, Sawtooth, Triangle).
    - **Haptic Feedback**: High-fidelity vibration pulses synchronized with the selection countdown.
    - **History System**: Persistent local storage for selection results, accessible via a modal-based history view.
- **PWA & Offline Support**: Fully installable as a Progressive Web App with offline caching for use anywhere.
- **Zero Dependencies**: 100% Vanilla JavaScript, CSS3, and HTML5. No external frameworks or libraries.

---

## Install

ChooseWho is a completely static, dependency-free web application.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/higherkey/choosewho.git
   cd choosewho
   ```
2. **Open the project:**
   Simply open `index.html` in any modern web browser.

---

## Usage

### Multi-Touch Gameplay (Mobile/Tablet)
1. Place 2 to 8 fingers on the screen.
2. Hold for **2.5 seconds** (visualized by circular progress timers).
3. The app will finalize the selection based on the active mode (Winner, Order, etc.).

### Desktop Support
- Click anywhere to add a simulated player.
- Use the **Start** and **Reset** buttons (revealed on desktop) to control the flow.
- Click a player indicator to remove it.

---

## Contributing

We welcome contributions! Please review `GEMINI.md` for guidelines on touch interactions, visual aesthetics, and project structures. Keep the codebase free of external dependencies.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

*Built with ❤️ by Antigravity*
