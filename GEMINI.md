# GEMINI.md - ChooseWho Project

## Artificial Intelligence Context

This project was architected and implemented by **Antigravity**, a powerful agentic AI coding assistant designed by Google DeepMind.

### Development Mandates

- **Zero Dependency**: The application must remain free of external libraries or frameworks to ensure maximum performance and zero maintenance overhead.
- **Mobile-First Touch Architecture**: Primary interactions are driven by the `Touch Events API`. Mouse events (Pointer Fine) are supported on desktop for player management and game controls.
- **Visual Excellence**: Adheres to the "Premium Dark" aesthetic, utilizing glowing borders, smooth CSS transitions, and high-contrast neon colors.

### Core Logic Overview

The application utilizes a `Map` to track active touches/players by their unique `identifier`.
- `touchstart / mousedown`: Adds a player reference, creates a DOM indicator.
- `touchmove / mousemove`: Updates indicator positions.
- `touchend / mouseup`: Removes/finalizes player reference.
- **Selection Modes**:
    - `Winner`: Randomly picks one indicator as the winner (visual pulse).
    - `Order`: Shuffles and assigns numerical ranks to every indicator.
- **Selection History**: persistent selection results (localized indicators) are displayed in a **modal-based** history list (Stopwatch icon).
- **Interaction Modes**:
    - `Free`: Standard touch-anywhere logic.
    - `Grid`: Fixed slots for structured elimination.
- **Selection Targets**:
    - `First` (`| <`): Picks a winner instantly.
    - `Last` (`> |`): Sequentially eliminates players until one remains (Explosion mode).
- **Desktop Controls**: Manual "Start" and "Reset" buttons are dynamically revealed on pointer-fine devices.
- **Visual Timers**: SVG circular indicators overlay the touch points, synchronized with the countdown (`state.timerDuration`, default 2.0s, adjustable 1-3s in Settings).
- **Shape Geometry**: Unique SVG shapes (Circle, Triangle, etc.) assigned based on finger placement order (1-8).
- **Audio Engine**: Synthesizes tones (sine/triangle/square/sawtooth) and procedural noise (explosions) using the Web Audio API.
- **Haptic Feedback**: High-fidelity vibration pulses (where supported) synchronized with timer ticks and selection results.

### Progress Trace

- [x] Implementation of `app.js` v2.0
- [x] 8-Finger Support
- [x] Grid Mode & Elimination Logic
- [x] New Themes: Cyber, Mono, Retro v2
- [x] Order-based SVG Shape Rendering
- [x] Per-mode History system
- [x] Tournament scoring (Issue #21), per-mode persistent scores with Reset Scores
- [x] PWA and offline caching (Issue #19)
- [x] Settings modal (volume, language, timer, theme, install)
- [ ] Open: Issue #15 Advanced Settings and Granularity
- [ ] Open: Issue #20 Custom Icon & Shape Library
- [ ] Open: Issue #29 Haptics and animations
- [x] Final Handover

### Maintenance Recommendations

When updating the UI, prioritize CSS over JS for animations to leverage hardware acceleration. For new features, ensure the `touch-action: none` property is maintained on the root container.
