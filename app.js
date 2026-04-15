/**
 * ChooseWho - First Player Selector
 * Core Logic - Vanilla JS
 */

const CONFIG = {
    COUNTDOWN_MS: 3000,
    MAX_TOUCHES: 6,
    COLORS: [
        '#00f2ff', // Cyan
        '#ff00ff', // Magenta
        '#39ff14', // Lime
        '#ffce00', // Amber
        '#bc13fe', // Purple
        '#ff3131'  // Crimson
    ]
};

const state = {
    touches: new Map(), // identifier -> { x, y, element, colorIndex }
    timerId: null,
    isCounting: false,
    isSelected: false,
    colorAvailability: [true, true, true, true, true, true]
};

const dom = {
    overlay: document.getElementById('touch-overlay'),
    statusText: document.getElementById('status-text'),
    countdown: document.getElementById('countdown-timer'),
    app: document.getElementById('app')
};

function init() {
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: false });
}

function handleTouchStart(e) {
    if (state.isSelected) {
        // If selection is done, ignore new touches until all fingers are removed
        return;
    }

    // Prevent default browser behavior (zoom/scroll)
    if (e.cancelable) e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        
        if (state.touches.size >= CONFIG.MAX_TOUCHES) continue;

        const colorIndex = state.colorAvailability.findIndex(available => available);
        if (colorIndex === -1) continue;

        state.colorAvailability[colorIndex] = false;

        const element = document.createElement('div');
        element.className = `finger-indicator indicator-${colorIndex}`;
        element.style.left = `${touch.clientX}px`;
        element.style.top = `${touch.clientY}px`;
        dom.overlay.appendChild(element);

        // Force reflow for animation
        void element.offsetWidth;
        element.classList.add('active');

        state.touches.set(touch.identifier, {
            x: touch.clientX,
            y: touch.clientY,
            element,
            colorIndex
        });
    }

    resetTimer();
}

function handleTouchMove(e) {
    if (e.cancelable) e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const data = state.touches.get(touch.identifier);
        
        if (data) {
            data.x = touch.clientX;
            data.y = touch.clientY;
            data.element.style.left = `${data.x}px`;
            data.element.style.top = `${data.y}px`;
        }
    }
}

function handleTouchEnd(e) {
    if (e.cancelable) e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const data = state.touches.get(touch.identifier);

        if (data) {
            if (!state.isSelected) {
                // If not in selected state, remove the indicator immediately
                data.element.classList.remove('active');
                setTimeout(() => data.element.remove(), 200);
                state.colorAvailability[data.colorIndex] = true;
            }
            state.touches.delete(touch.identifier);
        }
    }

    // If selection was made and all fingers are gone, reset the game state
    if (state.isSelected && state.touches.size === 0) {
        resetGame();
    } else if (!state.isSelected) {
        resetTimer();
    }
}

function resetTimer() {
    // Clear existing timer
    if (state.timerId) {
        clearTimeout(state.timerId);
        state.timerId = null;
    }

    if (state.touches.size >= 2) {
        state.isCounting = true;
        dom.statusText.textContent = 'Hold steady...';
        dom.statusText.style.opacity = '1';
        
        state.timerId = setTimeout(selectWinner, CONFIG.COUNTDOWN_MS);
    } else {
        state.isCounting = false;
        dom.statusText.textContent = state.touches.size === 1 ? 'Waiting for more fingers...' : 'Place fingers to start';
        dom.statusText.style.opacity = '0.6';
    }
}

function selectWinner() {
    if (state.touches.size < 2) return;

    state.isSelected = true;
    state.isCounting = false;
    dom.statusText.textContent = 'Winner Selected!';

    const identifiers = Array.from(state.touches.keys());
    const winnerId = identifiers[Math.floor(Math.random() * identifiers.length)];

    state.touches.forEach((data, id) => {
        if (id === winnerId) {
            data.element.classList.add('winner');
        } else {
            data.element.classList.add('lost');
        }
    });

    // Provide haptic feedback if available
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 200]);
    }
}

function resetGame() {
    state.isSelected = false;
    state.isCounting = false;
    state.colorAvailability = [true, true, true, true, true, true];
    dom.overlay.innerHTML = '';
    dom.statusText.textContent = 'Place fingers to start';
    dom.statusText.style.opacity = '0.6';
}

init();
