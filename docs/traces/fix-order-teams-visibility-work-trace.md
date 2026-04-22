# Work Trace: fix/order-teams-visibility

## 1. Planned Work

### TODO List
- [x] Remove `lost` class (dimming) from Order mode participants.
- [x] Remove `lost` class (dimming) from Teams mode participants.
- [x] Final verification of visibility across all modes.

### File List
- `app.js`: Visibility logic for Order and Teams modes.

### Rationale
- **app.js**: Participants in Order and Teams modes should be fully visible to ensure results (rankings/teams) are easy to read.

## 2. In Progress Work
- (Completed)

## 3. Completed Work
- **Logic**: Updated `finalizeSelection` to skip the `lost` class for non-winners in `order` and `teams` modes.

## 4. Issues and Out of Scope
- (None)
