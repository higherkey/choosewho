# Work Trace: feat/issue-21-tournament-mode

## 1. Planned Work

### TODO List
- [x] Initialize `sessionScores` in `state` and sync with `localStorage`
- [x] Implement `updateScore(index, mode)` helper function
- [x] Refactor `finalizeSelection` to update scores and handle indicator persistence
- [x] Refactor `runEliminationSequence` to update survivor score
- [x] Update `style.css` to redefine `.lost` class (dimmed instead of hidden)
- [x] Add `.score-badge` styling in `style.css`
- [x] Enhance `grid-cell` DOM generation in `app.js` to include score badges
- [x] Add "Reset Scores" button in `index.html` (Settings Modal)
- [x] Final verification of all selection modes (Winner, Order, Die, Teams)

### File List
- `app.js`: Core logic for scoring, state management, and DOM updates.
- `style.css`: Visual styling for indicators and score display.
- `index.html`: UI structure for settings and controls.

### Rationale
- **app.js**: Tracks player performance across rounds and updates the UI with score badges.
- **style.css**: Redefines the `lost` class to keep non-chosen circles visible (dimmed), ensuring clarity in Dice and Teams modes.
- **index.html**: Added a "Reset Scores" button to allow users to start fresh tournaments.

## 2. In Progress Work
- (Completed)

## 3. Completed Work
- **Logic**: Implemented `sessionScores` and `updateScore` in `app.js`. Added `clearScores` for tournament resets.
- **UI**: Added dynamic score badges to grid cells and a "Reset Scores" button in the Settings modal.
- **Persistence**: Fixed `removeIndicator` to prevent removal of elements once a winner is chosen, ensuring indicators persist.
- **Visuals**: Modified `.lost` class to use `opacity: 0.5` and `scale(0.9)` with robust specific styling to prevent disappearing.

## 4. Issues and Out of Scope
- **4a) Potential Blockers**: None.
- **4b) Opportunities**: None.
