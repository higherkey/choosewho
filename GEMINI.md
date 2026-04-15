# GEMINI.md - ChooseWho Project

## Artificial Intelligence Context

This project was architected and implemented by **Antigravity**, a powerful agentic AI coding assistant designed by Google DeepMind.

### Development Mandates

- **Zero Dependency**: The application must remain free of external libraries or frameworks to ensure maximum performance and zero maintenance overhead.
- **Mobile-First Touch Architecture**: All interactions are driven by the `Touch Events API`. Mouse events are secondary or disregarded to maintain focus on the core mobile use case.
- **Visual Excellence**: Any further modifications should adhere to the "Premium Dark" aesthetic, utilizing glowing borders, smooth CSS transitions, and high-contrast neon colors.

### Core Logic Overview

The application utilizes a `Map` to track active touches by their unique `identifier`.
- `touchstart`: Adds a finger reference, creates a DOM indicator, and resets the countdown timer.
- `touchmove`: Updates indicator positions.
- `touchend/touchcancel`: Removes the finger reference and indicator, and resets the timer.
- **Selection Algorithm**: Uses `Math.random()` to pick a winner from the `keys()` of the active touches map once the 3-second timer expires.

### Maintenance Recommendations

When updating the UI, prioritize CSS over JS for animations to leverage hardware acceleration. For new features, ensure the `touch-action: none` property is maintained on the root container.
