# feat/enhanced-controls Work Trace

## 1. Planned Work
- **TODO List**:
    - [x] Winner indicator lingering (until next touch)
    - [x] Local session history
    - [x] Timer animation (progress ring)
    - [x] Gentle sounds (Web Audio API)
    - [x] Turn Order Mode (assigned ranks)
    - [x] Haptic feedback (on ticks)
    - [x] Desktop Support (mouse click to add/remove players, manual start/reset)
    - [ ] Move history UI to top-bar next to mode toggle
- **File List**:
    - `index.html`: Added history, mode toggle, and desktop control UI elements.
    - `style.css`: Styles for mode toggle, history display, progress ring, rank text, and desktop controls.
    - `app.js`: Core logic for sounds, timer animation, game modes, history, and desktop support.
    - `PROJECT.md`: Updated completion status.
    - `GEMINI.md`: Updated AI context with new features.
    - `docs/traces/feat-enhanced-controls-work-trace.md`: Trace document for feature tracking.
- **Rationale**:
    - Enhance player feedback, game versatility, and cross-device compatibility for tabletop gaming.

## 2. In Progress Work
- [ ] Move history UI to top-bar next to mode toggle

## 3. Completed Work
- **Summary**:
    - Implemented all gameplay enhancements and visual feedback improvements.
    - Added comprehensive desktop support (mouse interaction, start/reset buttons).
    - Added standalone issues for future roadmap items.
- **Revised Rationale**:
    - Replaced existing touch/timer logic with a more robust system that supports multiple modes, visual timers, and desktop environments.

## 4. Issues and Out of Scope
### 4a) Potential Blockers
- None identified during development.

### 4b) Opportunities
The following roadmap items were identified and formalized as standalone issues:
- [#1: Customizable UI Themes and Soundscapes](https://github.com/higherkey/choosewho/issues/1)
- [#2: Teams Mode](https://github.com/higherkey/choosewho/issues/2)
- [#3: Support for multiple languages](https://github.com/higherkey/choosewho/issues/3)
- [#4: Roll a Die Mode](https://github.com/higherkey/choosewho/issues/4)
- [Opportunity] Make the history display more compact when moved to the top.
