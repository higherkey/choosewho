/**
 * ChooseWho - First Player Selector
 * Core Logic - Vanilla JS
 */

const CONFIG = {
    COUNTDOWN_MS: 2500,
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
        if (state.isMuted) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const finalVolume = volume * (state.volume * 2);

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(finalVolume, this.ctx.currentTime);
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
    mode: 'winner', // 'winner' or 'order'
    isDesktop: window.matchMedia('(pointer: fine)').matches,
    volume: parseFloat(localStorage.getItem('chooseWhoVolume') ?? '0.5'),
    isMuted: localStorage.getItem('chooseWhoMuted') === 'true'
};

const dom = {
    overlay: document.getElementById('touch-overlay'),
    statusText: document.getElementById('status-text'),
    countdown: document.getElementById('countdown-timer'),
    app: document.getElementById('app'),
    historyList: document.getElementById('history-list'),
    modeBtns: document.querySelectorAll('.mode-btn'),
    clearHistoryBtn: document.getElementById('clear-history'),
    desktopControls: document.getElementById('desktop-controls'),
    startBtn: document.getElementById('start-btn'),
    resetBoardBtn: document.getElementById('reset-board-btn'),
    volumeSlider: document.getElementById('volume-slider'),
    muteBtn: document.getElementById('mute-btn')
};

function init() {
    // Touch Events
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    
    // Mouse Events for Desktop
    if (state.isDesktop) {
        window.addEventListener('mousedown', handleMouseDown);
        dom.startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (state.touches.size >= 2) startTimer();
        });
        dom.resetBoardBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            resetGame();
        });
        
        // Initial UI State
        dom.desktopControls.classList.remove('hidden');
        updateStatus();
    }

    dom.modeBtns.forEach(btn => {
        const handler = (e) => {
            e.stopPropagation();
            if (e.type === 'touchstart') e.preventDefault();
            state.mode = btn.dataset.mode;
            dom.modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AudioEngine.init();
            AudioEngine.playTouch();
            if (state.isSelected) resetGame();
        };
        btn.addEventListener('touchstart', handler, { passive: false });
        btn.addEventListener('click', handler);
    });

    const clearHandler = (e) => {
        e.stopPropagation();
        if (e.type === 'touchstart') e.preventDefault();
        clearHistory();
        AudioEngine.init();
        AudioEngine.playTick();
    };
    dom.clearHistoryBtn.addEventListener('touchstart', clearHandler, { passive: false });
    dom.clearHistoryBtn.addEventListener('click', clearHandler);

    if (dom.volumeSlider && dom.muteBtn) {
        dom.volumeSlider.addEventListener('input', (e) => {
            state.volume = parseInt(e.target.value) / 100;
            localStorage.setItem('chooseWhoVolume', state.volume);
            if (state.isMuted && state.volume > 0) {
                state.isMuted = false;
                localStorage.setItem('chooseWhoMuted', 'false');
            }
            updateVolumeUI();
        });

        dom.muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            state.isMuted = !state.isMuted;
            localStorage.setItem('chooseWhoMuted', state.isMuted);
            updateVolumeUI();
        });
        updateVolumeUI();
    }

    updateHistoryUI();
}

function updateVolumeUI() {
    if (!dom.muteBtn) return;
    dom.muteBtn.textContent = state.isMuted ? '🔇' : '🔊';
    dom.volumeSlider.value = state.isMuted ? 0 : state.volume * 100;
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

function createIndicator(x, y, identifier) {
    if (state.touches.size >= CONFIG.MAX_TOUCHES) return null;

    const colorIndex = state.colorAvailability.findIndex(available => available);
    if (colorIndex === -1) return null;

    state.colorAvailability[colorIndex] = false;

    const element = document.createElement('div');
    element.className = `finger-indicator indicator-${colorIndex}`;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    
    element.innerHTML = `
        <svg class="timer-svg" viewBox="0 0 120 120">
            <circle class="timer-circle" cx="60" cy="60" r="57"></circle>
        </svg>
        <div class="rank-text"></div>
    `;

    dom.overlay.appendChild(element);
    void element.offsetWidth; // Force reflow
    element.classList.add('active');

    const touchData = { x, y, element, colorIndex };
    state.touches.set(identifier, touchData);
    
    AudioEngine.playTouch();
    return touchData;
}

function removeIndicator(identifier) {
    const data = state.touches.get(identifier);
    if (data) {
        data.element.classList.remove('active');
        setTimeout(() => {
            if (data.element.parentNode) data.element.remove();
        }, 200);
        state.colorAvailability[data.colorIndex] = true;
        state.touches.delete(identifier);
    }
}

function handleMouseDown(e) {
    if (state.isSelected) {
        resetGame();
        return;
    }

    // Don't add indicators if clicking on existing ones (they will be removed instead)
    if (e.target.closest('.finger-indicator')) {
        const indicator = e.target.closest('.finger-indicator');
        const id = Array.from(state.touches.entries()).find(([_, data]) => data.element === indicator)?.[0];
        if (id !== undefined) {
            removeIndicator(id);
            updateStatus();
        }
        return;
    }

    // Don't add indicators if clicking on UI
    if (e.target.closest('#mode-toggle') || e.target.closest('#history-overlay') || e.target.closest('#desktop-controls')) {
        return;
    }

    AudioEngine.init();
    createIndicator(e.clientX, e.clientY, `mouse_${Date.now()}`);
    updateStatus();
}

function handleTouchStart(e) {
    AudioEngine.init();
    if (state.isSelected) resetGame();
    if (e.cancelable) e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i++) {
        createIndicator(e.changedTouches[i].clientX, e.changedTouches[i].clientY, e.changedTouches[i].identifier);
    }

    if (!state.isSelected) resetTimer();
}

function handleTouchMove(e) {
    if (e.cancelable) e.preventDefault();
    if (state.isSelected) return;

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
        if (!state.isSelected) {
            removeIndicator(touch.identifier);
        }
    }

    if (!state.isSelected) resetTimer();
}

function updateStatus() {
    if (state.isDesktop) {
        if (state.touches.size === 0) {
            dom.statusText.textContent = 'Click to add players';
            dom.statusText.style.opacity = '0.6';
        } else if (state.touches.size === 1) {
            dom.statusText.textContent = 'Add at least one more player';
            dom.statusText.style.opacity = '0.8';
        } else {
            dom.statusText.textContent = 'Ready to start?';
            dom.statusText.style.opacity = '1';
        }
    } else {
        if (state.touches.size === 0) {
            dom.statusText.textContent = 'Place fingers to start';
            dom.statusText.style.opacity = '0.6';
        } else if (state.touches.size === 1) {
            dom.statusText.textContent = 'Waiting for more fingers...';
            dom.statusText.style.opacity = '0.8';
        } else {
            dom.statusText.textContent = 'Hold steady...';
            dom.statusText.style.opacity = '1';
        }
    }
}

function resetTimer() {
    if (state.timerId) clearTimeout(state.timerId);
    if (state.tickInterval) clearInterval(state.tickInterval);
    state.timerId = null;
    state.tickInterval = null;

    state.touches.forEach(data => data.element.classList.remove('counting'));

    if (state.touches.size >= 2) {
        startTimer();
    } else {
        state.isCounting = false;
        updateStatus();
    }
}

function startTimer() {
    state.isCounting = true;
    updateStatus();
    
    state.touches.forEach(data => {
        data.element.classList.add('counting');
        void data.element.offsetWidth;
    });

    AudioEngine.playTick();
    state.tickInterval = setInterval(() => AudioEngine.playTick(), 1000);
    state.timerId = setTimeout(selectWinner, CONFIG.COUNTDOWN_MS);

    if (state.isDesktop) {
        dom.startBtn.classList.add('hidden');
        dom.resetBoardBtn.classList.add('hidden');
    }
}

function selectWinner() {
    if (state.touches.size < 2) return;

    if (state.tickInterval) clearInterval(state.tickInterval);
    state.tickInterval = null;

    state.isSelected = true;
    state.isCounting = false;
    dom.statusText.textContent = state.mode === 'winner' ? 'Chosen!' : (state.mode === 'order' ? 'Turn Order Assigned!' : 'Dice Rolled!');

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
    } else if (state.mode === 'order') {
        const shuffled = [...identifiers].sort(() => Math.random() - 0.5);
        winnerId = shuffled[0];
        shuffled.forEach((id, index) => {
            const data = state.touches.get(id);
            data.element.classList.remove('counting');
            data.element.classList.add('show-rank');
            data.element.querySelector('.rank-text').textContent = index + 1;
            data.element.querySelector('.rank-text').style.fontSize = ''; 
            if (index === 0) data.element.classList.add('winner');
            else data.element.classList.add('lost');
        });
    } else if (state.mode === 'die') {
        const diceChars = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        let highestRoll = -1;
        const rolls = new Map();
        
        identifiers.forEach(id => {
            const rollIndex = Math.floor(Math.random() * 6);
            rolls.set(id, rollIndex);
            if (rollIndex > highestRoll) {
                highestRoll = rollIndex;
                winnerId = id;
            }
        });

        state.touches.forEach((data, id) => {
            const rollIndex = rolls.get(id);
            data.element.classList.remove('counting');
            data.element.classList.add('show-rank');
            data.element.querySelector('.rank-text').textContent = diceChars[rollIndex];
            data.element.querySelector('.rank-text').style.fontSize = '4.5rem';
            
            if (id === winnerId) data.element.classList.add('winner');
            else data.element.classList.add('lost');
        });
    }

    AudioEngine.playWin();

    const winnerData = state.touches.get(winnerId);
    if (winnerData) {
        state.history.push(winnerData.colorIndex);
        if (state.history.length > 20) state.history.shift();
        localStorage.setItem('chooseWhoHistory', JSON.stringify(state.history));
        updateHistoryUI();
    }

    if (navigator.vibrate) navigator.vibrate([100, 50, 200]);

    if (state.isDesktop) {
        dom.resetBoardBtn.textContent = 'Reset Board';
        dom.resetBoardBtn.classList.remove('hidden');
    }
}

function resetGame() {
    if (state.tickInterval) clearInterval(state.tickInterval);
    if (state.timerId) clearTimeout(state.timerId);
    state.tickInterval = null;
    state.timerId = null;
    
    state.isSelected = false;
    state.isCounting = false;
    state.colorAvailability = [true, true, true, true, true, true];
    dom.overlay.innerHTML = '';
    state.touches.clear();
    
    if (state.isDesktop) {
        dom.startBtn.classList.remove('hidden');
        dom.resetBoardBtn.classList.remove('hidden');
        dom.resetBoardBtn.textContent = 'Reset';
    }
    
    updateStatus();
}

init();
