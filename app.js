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

const AudioEngine = {
    ctx: null,
    
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    playTone(freq, type, duration, volume = 0.1) {
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    playTouch() {
        this.playTone(200, 'sine', 0.1, 0.05);
    },

    playTick() {
        this.playTone(400, 'sine', 0.05, 0.03);
        // Haptic pulse synchronized with tick
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    },

    playWin() {
        this.playTone(440, 'triangle', 0.5, 0.1);
        setTimeout(() => this.playTone(660, 'triangle', 0.6, 0.08), 100);
        setTimeout(() => this.playTone(880, 'triangle', 0.8, 0.06), 200);
    }
};

const state = {
    touches: new Map(), // identifier -> { x, y, element, colorIndex }
    timerId: null,
    tickInterval: null,
    isCounting: false,
    isSelected: false,
    colorAvailability: [true, true, true, true, true, true],
    history: JSON.parse(localStorage.getItem('chooseWhoHistory') || '[]'),
    mode: 'winner' // 'winner' or 'order'
};

const dom = {
    overlay: document.getElementById('touch-overlay'),
    statusText: document.getElementById('status-text'),
    countdown: document.getElementById('countdown-timer'),
    app: document.getElementById('app'),
    historyList: document.getElementById('history-list'),
    modeBtns: document.querySelectorAll('.mode-btn'),
    clearHistoryBtn: document.getElementById('clear-history')
};

function init() {
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    
    dom.modeBtns.forEach(btn => {
        btn.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            state.mode = btn.dataset.mode;
            dom.modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AudioEngine.init();
            AudioEngine.playTouch();
            if (state.isSelected) resetGame();
        });
    });

    dom.clearHistoryBtn.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        clearHistory();
        AudioEngine.init();
        AudioEngine.playTick();
    });

    updateHistoryUI();
}

function updateHistoryUI() {
    if (!dom.historyList) return;
    dom.historyList.innerHTML = '';
    
    if (state.history.length === 0) {
        dom.clearHistoryBtn.classList.remove('visible');
        dom.historyList.style.opacity = '0';
        return;
    }

    dom.clearHistoryBtn.classList.add('visible');
    dom.historyList.style.opacity = '0.4';

    state.history.slice(-10).reverse().forEach(colorIndex => {
        const item = document.createElement('div');
        item.className = `history-item indicator-${colorIndex}`;
        dom.historyList.appendChild(item);
    });
}

function clearHistory() {
    state.history = [];
    localStorage.removeItem('chooseWhoHistory');
    updateHistoryUI();
}

function handleTouchStart(e) {
    // Initialize audio on first user interaction
    AudioEngine.init();

    // If selection was done, reset the game on the next touch
    if (state.isSelected) {
        resetGame();
    }

    // Prevent default browser behavior (zoom/scroll)
    if (e.cancelable) e.preventDefault();

    let addedNew = false;
    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        
        if (state.touches.size >= CONFIG.MAX_TOUCHES) continue;

        const colorIndex = state.colorAvailability.findIndex(available => available);
        if (colorIndex === -1) continue;

        state.colorAvailability[colorIndex] = false;
        addedNew = true;

        const element = document.createElement('div');
        element.className = `finger-indicator indicator-${colorIndex}`;
        element.style.left = `${touch.clientX}px`;
        element.style.top = `${touch.clientY}px`;
        
        // Add timer SVG and rank placeholder
        element.innerHTML = `
            <svg class="timer-svg" viewBox="0 0 120 120">
                <circle class="timer-circle" cx="60" cy="60" r="57"></circle>
            </svg>
            <div class="rank-text"></div>
        `;

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

    if (addedNew) AudioEngine.playTouch();

    if (!state.isSelected) {
        resetTimer();
    }
}

function handleTouchMove(e) {
    if (e.cancelable) e.preventDefault();
    if (state.isSelected) return; // Ignore moves after selection

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
                setTimeout(() => {
                    if (data.element.parentNode) data.element.remove();
                }, 200);
                state.colorAvailability[data.colorIndex] = true;
                state.touches.delete(touch.identifier);
            }
            // If selected, we keep the data/element in state until resetGame is called by a new touch
        }
    }

    if (!state.isSelected) {
        resetTimer();
    }
}

function resetTimer() {
    // Clear existing timer and interval
    if (state.timerId) {
        clearTimeout(state.timerId);
        state.timerId = null;
    }
    if (state.tickInterval) {
        clearInterval(state.tickInterval);
        state.tickInterval = null;
    }

    // Reset counting class on all indicators
    state.touches.forEach(data => {
        data.element.classList.remove('counting');
        // Force reflow to reset transition if needed
        void data.element.offsetWidth;
    });

    if (state.touches.size >= 2) {
        state.isCounting = true;
        dom.statusText.textContent = 'Hold steady...';
        dom.statusText.style.opacity = '1';
        
        // Start counting animation
        state.touches.forEach(data => {
            data.element.classList.add('counting');
        });

        // Start ticking sound
        AudioEngine.playTick();
        state.tickInterval = setInterval(() => {
            AudioEngine.playTick();
        }, 1000);

        state.timerId = setTimeout(selectWinner, CONFIG.COUNTDOWN_MS);
    } else {
        state.isCounting = false;
        dom.statusText.textContent = state.touches.size === 1 ? 'Waiting for more fingers...' : 'Place fingers to start';
        dom.statusText.style.opacity = '0.6';
    }
}

function selectWinner() {
    if (state.touches.size < 2) return;

    if (state.tickInterval) {
        clearInterval(state.tickInterval);
        state.tickInterval = null;
    }

    state.isSelected = true;
    state.isCounting = false;
    dom.statusText.textContent = state.mode === 'winner' ? 'Winner Selected!' : 'Turn Order Assigned!';

    const identifiers = Array.from(state.touches.keys());
    let winnerId;

    if (state.mode === 'winner') {
        winnerId = identifiers[Math.floor(Math.random() * identifiers.length)];
        state.touches.forEach((data, id) => {
            data.element.classList.remove('counting');
            if (id === winnerId) {
                data.element.classList.add('winner');
            } else {
                data.element.classList.add('lost');
            }
        });
    } else {
        // Order Mode: Shuffle and assign ranks
        const shuffled = [...identifiers].sort(() => Math.random() - 0.5);
        winnerId = shuffled[0];
        shuffled.forEach((id, index) => {
            const data = state.touches.get(id);
            data.element.classList.remove('counting');
            data.element.classList.add('show-rank');
            data.element.querySelector('.rank-text').textContent = index + 1;
            if (index === 0) {
                data.element.classList.add('winner');
            } else {
                data.element.classList.add('lost');
            }
        });
    }

    AudioEngine.playWin();

    // Update history with the primary winner
    const winnerData = state.touches.get(winnerId);
    if (winnerData) {
        state.history.push(winnerData.colorIndex);
        if (state.history.length > 20) state.history.shift();
        localStorage.setItem('chooseWhoHistory', JSON.stringify(state.history));
        updateHistoryUI();
    }

    // Provide haptic feedback if available
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 200]);
    }
}

function resetGame() {
    if (state.tickInterval) {
        clearInterval(state.tickInterval);
        state.tickInterval = null;
    }
    if (state.timerId) {
        clearTimeout(state.timerId);
        state.timerId = null;
    }
    state.isSelected = false;
    state.isCounting = false;
    state.colorAvailability = [true, true, true, true, true, true];
    dom.overlay.innerHTML = '';
    state.touches.clear();
    dom.statusText.textContent = 'Place fingers to start';
    dom.statusText.style.opacity = '0.6';
}

init();
