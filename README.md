# ChooseWho

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-success.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=flat-square)](https://higherkey.github.io/choosewho/)

A premium, mobile-first web application designed to determine the "First Player" for board games, card games, or any decision-making scenario. Built with a focus on high-fidelity visuals, tactile feedback, and ultra-low latency.

## ✨ Features

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

## 🕹️ How to Use

1. **Touch Interaction**: Place 2 to 8 fingers on the screen.
2. **Countdown**: Hold for **2.5 seconds** (visualized by circular progress timers).
3. **Selection**: The app will finalize the selection based on the active mode (Winner, Order, etc.).
4. **Desktop Support**:
    - Click anywhere to add a simulated player.
    - Use the **Start** and **Reset** buttons (revealed on desktop) to control the flow.
    - Click a player indicator to remove it.

## 🛠️ Technical Stack

- **Core**: HTML5, Vanilla JavaScript (ES6+), CSS3.
- **APIs**: Touch Events API, Web Audio API, Vibration API, Service Worker API (PWA), LocalStorage.
- **Design**: Flexbox/Grid layout, SVG Shape Generation, Keyframe Animations.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Built with ❤️ by Antigravity*
