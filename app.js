/**
 * ChooseWho - First Player Selector
 * Core Logic - Vanilla JS
 */

const i18n = {
    en: {
        winner: 'Chosen',
        order: 'Order',
        die: 'Die',
        teams: 'Teams',
        clear: 'Clear',
        desktopPrompt: 'Click to add players',
        desktopWait: 'Add at least one more player',
        desktopReady: 'Ready to start?',
        mobilePrompt: 'Place fingers to start',
        mobileWait: 'Waiting for more fingers...',
        mobileReady: 'Hold steady...',
        winText: 'Chosen!',
        orderText: 'Turn Order Assigned!',
        dieText: 'Dice Rolled!',
        teamsText: 'Teams Assigned!',
        startBtn: 'Start',
        resetBtn: 'Reset',
        resetBoardBtn: 'Reset Board'
    },
    es: {
        winner: 'Elegido',
        order: 'Orden',
        die: 'Dado',
        teams: 'Equipos',
        clear: 'Borrar',
        desktopPrompt: 'Haz clic para agregar jugadores',
        desktopWait: 'Agrega un jugador más',
        desktopReady: '¿Listo para empezar?',
        mobilePrompt: 'Coloca los dedos',
        mobileWait: 'Esperando más dedos...',
        mobileReady: 'Mantenlo así...',
        winText: '¡Elegido!',
        orderText: '¡Turnos asignados!',
        dieText: '¡Dados lanzados!',
        teamsText: '¡Equipos asignados!',
        startBtn: 'Empezar',
        resetBtn: 'Reiniciar',
        resetBoardBtn: 'Limpiar Tablero'
    }
};

function t(key) {
    return i18n[state.lang] ? (i18n[state.lang][key] || i18n['en'][key]) : i18n['en'][key];
}

const CONFIG = {
    COUNTDOWN_MS: 3000,
    MAX_TOUCHES: 8,
    COLORS: [
        '#00f2ff', // Cyan
        '#ff00ff', // Magenta
        '#39ff14', // Lime
        '#ffce00', // Amber
        '#bc13fe', // Purple
        '#ff3131', // Crimson
        '#ffffff', // White
        '#ff7b00'  // Orange
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

        const isNeon = typeof state !== 'undefined' && state.theme === 'neon';
        const gainOffset = isNeon ? 1.5 : 1.0; // Boost Neon/Sine waves
        const finalVolume = volume * (state.volume * 2) * gainOffset;

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
        const isRetro = typeof state !== 'undefined' && state.theme === 'retro';
        this.playTone(isRetro ? 150 : 200, isRetro ? 'square' : 'sine', 0.1, 0.05);
    },

    playTick() {
        const isRetro = typeof state !== 'undefined' && state.theme === 'retro';
        this.playTone(isRetro ? 300 : 400, isRetro ? 'square' : 'sine', 0.05, 0.03);
        // Haptic pulse synchronized with tick
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    },

    playWin() {
        const isRetro = typeof state !== 'undefined' && state.theme === 'retro';
        this.playTone(isRetro ? 330 : 440, isRetro ? 'sawtooth' : 'triangle', 0.5, 0.1);
        setTimeout(() => this.playTone(isRetro ? 494 : 660, isRetro ? 'sawtooth' : 'triangle', 0.6, 0.08), 100);
        setTimeout(() => this.playTone(isRetro ? 660 : 880, isRetro ? 'sawtooth' : 'triangle', 0.8, 0.06), 200);
    },

    playExplosion() {
        if (!this.ctx) return;
        if (state.isMuted) return;
        
        const duration = 0.5;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(1000, this.ctx.currentTime);
        noiseFilter.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + duration);

        const noiseEnvelope = this.ctx.createGain();
        noiseEnvelope.gain.setValueAtTime(state.volume * 1.5, this.ctx.currentTime);
        noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseEnvelope);
        noiseEnvelope.connect(this.ctx.destination);

        noise.start();
        noise.stop(this.ctx.currentTime + duration);
    }
};

const state = {
    touches: new Map(), // identifier -> { x, y, element, colorIndex, order }
    timerId: null,
    tickInterval: null,
    isCounting: false,
    isSelected: false,
    colorAvailability: new Array(CONFIG.MAX_TOUCHES).fill(true),
    history: JSON.parse(localStorage.getItem('chooseWhoHistoryV2') || '{}'),
    mode: 'winner', // 'winner' | 'order' | 'die' | 'teams'
    interactionMode: 'free', // 'free' | 'grid'
    selectionTarget: 'first', // 'first' | 'last'
    isDesktop: window.matchMedia('(pointer: fine)').matches,
    volume: parseFloat(localStorage.getItem('chooseWhoVolume') ?? '0.5'),
    isMuted: localStorage.getItem('chooseWhoMuted') === 'true',
    lang: localStorage.getItem('chooseWhoLang') || 'en',
    theme: localStorage.getItem('chooseWhoTheme') || 'neon'
};

const dom = {
    overlay: document.getElementById('touch-overlay'),
    statusText: document.getElementById('status-text'),
    countdown: document.getElementById('countdown-timer'),
    app: document.getElementById('app'),
    historyList: document.getElementById('history-list'),
    historyOverlay: document.getElementById('history-overlay'),
    historyBtn: document.getElementById('history-btn'),
    settingsModal: document.getElementById('settings-modal'),
    settingsBtn: document.getElementById('settings-btn'),
    closeSettingsBtn: document.getElementById('close-settings-btn'),
    modeBtns: document.querySelectorAll('.mode-btn'),
    targetToggle: document.getElementById('target-toggle'),
    gridToggle: document.getElementById('grid-toggle'),
    gridContainer: document.getElementById('grid-container'),
    clearHistoryBtn: document.getElementById('clear-history'),
    desktopControls: document.getElementById('desktop-controls'),
    startBtn: document.getElementById('start-btn'),
    resetBoardBtn: document.getElementById('reset-board-btn'),
    volumeSlider: document.getElementById('volume-slider'),
    muteBtn: document.getElementById('mute-btn'),
    langSelect: document.getElementById('lang-select'),
    themeSelect: document.getElementById('theme-select')
};

function init() {
    // Mode Buttons
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
            updateHistoryUI(); // Update history view for the current mode
        };
        btn.addEventListener('touchstart', handler, { passive: false });
        btn.addEventListener('click', handler);
    });

    // Clear History
    const clearHandler = (e) => {
        e.stopPropagation();
        if (e.type === 'touchstart') e.preventDefault();
        clearHistory();
        AudioEngine.init();
        AudioEngine.playTick();
    };
    dom.clearHistoryBtn.addEventListener('touchstart', clearHandler, { passive: false });
    dom.clearHistoryBtn.addEventListener('click', clearHandler);

    // Volume Controls
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

    // Language
    if (dom.langSelect) {
        dom.langSelect.value = state.lang;
        dom.langSelect.addEventListener('change', (e) => {
            state.lang = e.target.value;
            localStorage.setItem('chooseWhoLang', state.lang);
            updateUILanguage();
        });
    }

    // Touch Events
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    
    // Settings Modal
    if (dom.settingsBtn && dom.settingsModal && dom.closeSettingsBtn) {
        dom.settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dom.settingsModal.classList.remove('hidden');
        });
        dom.settingsBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dom.settingsModal.classList.remove('hidden');
        }, { passive: false });
        
        dom.closeSettingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dom.settingsModal.classList.add('hidden');
        });
        dom.closeSettingsBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dom.settingsModal.classList.add('hidden');
        }, { passive: false });
    }

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

    if (dom.themeSelect) {
        dom.themeSelect.value = state.theme;
        document.body.className = `theme-${state.theme}`;
        dom.themeSelect.addEventListener('change', (e) => {
            state.theme = e.target.value;
            localStorage.setItem('chooseWhoTheme', state.theme);
            document.body.className = `theme-${state.theme}`;
            // Reflow colors/adjustments if needed
        });
    }

    if (dom.targetToggle) {
        dom.targetToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            state.selectionTarget = state.selectionTarget === 'first' ? 'last' : 'first';
            dom.targetToggle.querySelector('.first-symbol').classList.toggle('hidden', state.selectionTarget !== 'first');
            dom.targetToggle.querySelector('.last-symbol').classList.toggle('hidden', state.selectionTarget !== 'last');
            
            // "Last" mode forces Grid interaction
            if (state.selectionTarget === 'last' && state.interactionMode === 'free') {
                toggleInteractionMode('grid');
            }
            
            AudioEngine.playTick();
        });
    }

    if (dom.gridToggle) {
        dom.gridToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            // Don't allow free mode if target is "last"
            if (state.selectionTarget === 'last' && state.interactionMode === 'grid') {
                return;
            }
            toggleInteractionMode(state.interactionMode === 'free' ? 'grid' : 'free');
            AudioEngine.playTick();
        });
    }

    if (dom.historyBtn) {
        dom.historyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dom.historyOverlay.classList.toggle('hidden');
            AudioEngine.playTick();
        });
    }

    updateUILanguage();
    updateHistoryUI();
}

function toggleInteractionMode(mode) {
    state.interactionMode = mode;
    dom.gridToggle.classList.toggle('active', mode === 'grid');
    dom.gridContainer.classList.toggle('hidden', mode !== 'grid');
    if (mode === 'grid') {
        generateGrid();
    } else {
        dom.gridContainer.innerHTML = '';
    }
    resetGame();
}

function generateGrid() {
    dom.gridContainer.innerHTML = '';
    const size = CONFIG.MAX_TOUCHES;
    const cols = size > 4 ? 2 : 1;
    const rows = Math.ceil(size / cols);
    
    dom.gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    dom.gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    
    for (let i = 0; i < size; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.index = i;
        dom.gridContainer.appendChild(cell);
    }
}

function updateUILanguage() {
    document.documentElement.lang = state.lang;
    document.querySelector('.mode-btn[data-mode="winner"]').textContent = t('winner');
    document.querySelector('.mode-btn[data-mode="order"]').textContent = t('order');
    document.querySelector('.mode-btn[data-mode="die"]').textContent = t('die');
    document.querySelector('.mode-btn[data-mode="teams"]').textContent = t('teams');
    dom.clearHistoryBtn.textContent = t('clear');
    if (state.isDesktop) {
        if (!state.isSelected && !state.isCounting) {
            dom.startBtn.textContent = t('startBtn');
            dom.resetBoardBtn.textContent = state.touches.size > 0 ? t('resetBoardBtn') : t('resetBtn');
        }
    }
    updateStatus();
}

function updateVolumeUI() {
    if (!dom.muteBtn) return;
    dom.muteBtn.textContent = state.isMuted ? '🔇' : '🔊';
    dom.volumeSlider.value = state.isMuted ? 0 : state.volume * 100;
}

function updateHistoryUI() {
    if (!dom.historyList) return;
    dom.historyList.innerHTML = '';
    
    const modeHistory = state.history[state.mode] || [];
    
    if (modeHistory.length === 0) {
        dom.clearHistoryBtn.classList.remove('visible');
        dom.historyList.innerHTML = '<div style="opacity: 0.5; font-size: 0.7rem;">NO HISTORY</div>';
        return;
    }

    dom.clearHistoryBtn.classList.add('visible');

    [...modeHistory].reverse().forEach(colorIndex => {
        const item = document.createElement('div');
        item.className = `history-item indicator-${colorIndex}`;
        dom.historyList.appendChild(item);
    });
}

function clearHistory() {
    state.history[state.mode] = [];
    localStorage.setItem('chooseWhoHistoryV2', JSON.stringify(state.history));
    updateHistoryUI();
}

function getAppCoordinates(clientX, clientY) {
    const rect = dom.app.getBoundingClientRect();
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function createIndicator(clientX, clientY, identifier) {
    if (state.touches.size >= CONFIG.MAX_TOUCHES) return null;

    let targetX = clientX;
    let targetY = clientY;
    let gridCell = null;

    if (state.interactionMode === 'grid') {
        const cell = document.elementFromPoint(clientX, clientY)?.closest('.grid-cell');
        if (!cell || cell.classList.contains('occupied') || cell.classList.contains('unavailable')) return null;
        
        const rect = cell.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
        gridCell = cell;
        cell.classList.add('occupied');
    }

    const colorIndex = state.colorAvailability.findIndex(available => available);
    if (colorIndex === -1) return null;

    state.colorAvailability[colorIndex] = false;
    const order = state.touches.size + 1;

    const element = document.createElement('div');
    element.className = `finger-indicator indicator-${colorIndex}`;
    
    const coords = getAppCoordinates(targetX, targetY);
    element.style.left = `${coords.x}px`;
    element.style.top = `${coords.y}px`;
    
    element.innerHTML = `
        <svg class="shape-svg" viewBox="0 0 120 120">
            ${getShapeSVG(order)}
            <circle class="timer-circle" cx="60" cy="60" r="57"></circle>
        </svg>
        <div class="rank-text"></div>
    `;

    dom.overlay.appendChild(element);
    void element.offsetWidth; // Force reflow
    element.classList.add('active');

    const touchData = { x: coords.x, y: coords.y, element, colorIndex, order, gridCell };
    state.touches.set(identifier, touchData);
    
    AudioEngine.playTouch();
    if (navigator.vibrate) {
        navigator.vibrate(5);
    }
    return touchData;
}

function getShapeSVG(order) {
    switch (order) {
        case 1: return '<circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" stroke-width="4"></circle>';
        case 2: return '<line x1="40" y1="40" x2="80" y2="40" stroke="currentColor" stroke-width="4"/><line x1="40" y1="80" x2="80" y2="80" stroke="currentColor" stroke-width="4"/>';
        case 3: return '<polygon points="60,30 90,80 30,80" fill="none" stroke="currentColor" stroke-width="4"/>';
        case 4: return '<rect x="35" y="35" width="50" height="50" fill="none" stroke="currentColor" stroke-width="4"/>';
        case 5: return '<polygon points="60,25 95,50 82,90 38,90 25,50" fill="none" stroke="currentColor" stroke-width="4"/>';
        case 6: return '<polygon points="60,25 90,40 90,80 60,95 30,80 30,40" fill="none" stroke="currentColor" stroke-width="4"/>';
        case 7: return '<polygon points="60,20 85,35 95,65 75,90 45,90 25,65 35,35" fill="none" stroke="currentColor" stroke-width="4"/>';
        case 8: return '<polygon points="60,20 88,32 100,60 88,88 60,100 32,88 20,60 32,32" fill="none" stroke="currentColor" stroke-width="4"/>';
        default: return '';
    }
}

function removeIndicator(identifier) {
    const data = state.touches.get(identifier);
    if (data) {
        data.element.classList.remove('active');
        if (data.gridCell) data.gridCell.classList.remove('occupied');
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
    if (e.target.closest('#top-bar') || e.target.closest('#history-overlay') || e.target.closest('#desktop-controls') || e.target.closest('#settings-modal') || e.target.closest('#settings-btn')) {
        return;
    }

    AudioEngine.init();
    createIndicator(e.clientX, e.clientY, `mouse_${Date.now()}`);
    updateStatus();
}

function handleTouchStart(e) {
    if (e.target.closest('#top-bar') || e.target.closest('#history-overlay') || e.target.closest('#desktop-controls') || e.target.closest('#settings-modal') || e.target.closest('#settings-btn')) {
        return;
    }

    AudioEngine.init();
    if (state.isSelected) resetGame();
    if (e.cancelable) e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i++) {
        createIndicator(e.changedTouches[i].clientX, e.changedTouches[i].clientY, e.changedTouches[i].identifier);
    }

    if (!state.isSelected) resetTimer();
}

function handleTouchMove(e) {
    if (e.target.closest('#top-bar') || e.target.closest('#history-overlay') || e.target.closest('#desktop-controls') || e.target.closest('#settings-modal') || e.target.closest('#settings-btn')) {
        return;
    }

    if (e.cancelable) e.preventDefault();
    if (state.isSelected) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const data = state.touches.get(touch.identifier);
        if (data) {
            const coords = getAppCoordinates(touch.clientX, touch.clientY);
            data.x = coords.x;
            data.y = coords.y;
            data.element.style.left = `${data.x}px`;
            data.element.style.top = `${data.y}px`;
        }
    }
}

function handleTouchEnd(e) {
    if (e.target.closest('#top-bar') || e.target.closest('#history-overlay') || e.target.closest('#desktop-controls') || e.target.closest('#settings-modal') || e.target.closest('#settings-btn')) {
        return;
    }

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
            dom.statusText.textContent = t('desktopPrompt');
            dom.statusText.style.opacity = '0.6';
        } else if (state.touches.size === 1) {
            dom.statusText.textContent = t('desktopWait');
            dom.statusText.style.opacity = '0.8';
        } else {
            dom.statusText.textContent = t('desktopReady');
            dom.statusText.style.opacity = '1';
        }
    } else {
        if (state.touches.size === 0) {
            dom.statusText.textContent = t('mobilePrompt');
            dom.statusText.style.opacity = '0.6';
        } else if (state.touches.size === 1) {
            dom.statusText.textContent = t('mobileWait');
            dom.statusText.style.opacity = '0.8';
        } else {
            dom.statusText.textContent = t('mobileReady');
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

    if (state.selectionTarget === 'last') {
        runEliminationSequence();
    } else {
        finalizeSelection();
    }
}

async function runEliminationSequence() {
    dom.statusText.textContent = 'ELIMINATING...';
    
    const identifiers = Array.from(state.touches.keys());
    const shuffled = [...identifiers].sort(() => Math.random() - 0.5);
    
    // Eliminate all but one
    const toEliminate = shuffled.slice(0, shuffled.length - 1);
    const survivorId = shuffled[shuffled.length - 1];

    for (const id of toEliminate) {
        const data = state.touches.get(id);
        if (data) {
            data.element.classList.remove('counting');
            data.element.classList.add('exploding');
            if (data.gridCell) {
                data.gridCell.classList.add('unavailable');
                data.gridCell.classList.remove('occupied');
            }
            AudioEngine.playExplosion();
            if (navigator.vibrate) navigator.vibrate(50);
            await new Promise(r => setTimeout(r, 600));
        }
    }

    // Finalize with the survivor
    state.isSelected = true;
    state.isCounting = false;
    dom.statusText.textContent = 'THE LAST ONE!';
    
    const survivorData = state.touches.get(survivorId);
    if (survivorData) {
        survivorData.element.classList.remove('counting');
        survivorData.element.classList.add('winner');
        logHistory(survivorData.colorIndex);
    }
    
    AudioEngine.playWin();
}

function finalizeSelection() {
    state.isSelected = true;
    state.isCounting = false;
    dom.statusText.textContent = state.mode === 'winner' ? t('winText') : (state.mode === 'order' ? t('orderText') : (state.mode === 'die' ? t('dieText') : t('teamsText')));

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
    } else if (state.mode === 'teams') {
        const shuffled = [...identifiers].sort(() => Math.random() - 0.5);
        winnerId = shuffled[0];
        const half = Math.ceil(shuffled.length / 2);
        const team1 = new Set(shuffled.slice(0, half));
        
        state.touches.forEach((data, id) => {
            data.element.classList.remove('counting');
            data.element.classList.add('show-rank');
            data.element.querySelector('.rank-text').style.fontSize = ''; 
            
            if (team1.has(id)) {
                data.element.querySelector('.rank-text').textContent = 'T1';
            } else {
                data.element.querySelector('.rank-text').textContent = 'T2';
            }
        });
    }

    AudioEngine.playWin();

    const winnerData = state.touches.get(winnerId);
    if (winnerData) {
        logHistory(winnerData.colorIndex);
    }

    if (navigator.vibrate) navigator.vibrate([100, 50, 200]);

    if (state.isDesktop) {
        dom.resetBoardBtn.textContent = t('resetBoardBtn');
        dom.resetBoardBtn.classList.remove('hidden');
    }
}

function logHistory(colorIndex) {
    if (!state.history[state.mode]) state.history[state.mode] = [];
    state.history[state.mode].push(colorIndex);
    if (state.history[state.mode].length > 20) state.history[state.mode].shift();
    localStorage.setItem('chooseWhoHistoryV2', JSON.stringify(state.history));
    updateHistoryUI();
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
        dom.resetBoardBtn.textContent = t('resetBtn');
    }
    
    updateStatus();
}

init();
