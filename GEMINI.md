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
- **Selection History**: persistent selection results (localized indicators) are displayed in a **top-aligned** history list integrated with the mode toggle.
- **Desktop Controls**: Manual "Start" and "Reset" buttons are dynamically revealed on pointer-fine devices.
- **Visual Timers**: SVG circular indicators overlay the touch points, synchronized with the 3000ms countdown.
- **Audio Engine**: Synthesizes tones (sine/triangle) using the Web Audio API for tactile feedback without audio files.
- **Haptic Feedback**: High-fidelity vibration pulses (where supported) synchronized with timer ticks and selection results.

### Maintenance Recommendations

When updating the UI, prioritize CSS over JS for animations to leverage hardware acceleration. For new features, ensure the `touch-action: none` property is maintained on the root container.
