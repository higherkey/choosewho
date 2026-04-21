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
    },
    fr: {
        winner: 'Choisi', order: 'Ordre', die: 'Dé', teams: 'Équipes', clear: 'Effacer',
        desktopPrompt: 'Cliquez pour ajouter', desktopWait: 'Ajoutez un joueur', desktopReady: 'Prêt ?',
        mobilePrompt: 'Posez vos doigts', mobileWait: 'Attente...', mobileReady: 'Ne bougez plus...',
        winText: 'Choisi !', orderText: 'Ordre assigné !', dieText: 'Dés lancés !', teamsText: 'Équipes assignées !',
        startBtn: 'Démarrer', resetBtn: 'Réinitialiser', resetBoardBtn: 'Réinitialiser'
    },
    de: {
        winner: 'Gewählt', order: 'Reihenfolge', die: 'Würfel', teams: 'Teams', clear: 'Löschen',
        desktopPrompt: 'Klicken zum Hinzufügen', desktopWait: 'Noch ein Spieler', desktopReady: 'Bereit?',
        mobilePrompt: 'Finger platzieren', mobileWait: 'Warten...', mobileReady: 'Stillhalten...',
        winText: 'Gewählt!', orderText: 'Reihenfolge festgelegt!', dieText: 'Gewürfelt!', teamsText: 'Teams zugewiesen!',
        startBtn: 'Start', resetBtn: 'Zurücksetzen', resetBoardBtn: 'Brett zurücksetzen'
    },
    it: {
        winner: 'Scelto', order: 'Ordine', die: 'Dado', teams: 'Squadre', clear: 'Cancella',
        desktopPrompt: 'Clicca per aggiungere', desktopWait: 'Aggiungi un giocatore', desktopReady: 'Pronto?',
        mobilePrompt: 'Posiziona le dita', mobileWait: 'In attesa...', mobileReady: 'Resta fermo...',
        winText: 'Scelto!', orderText: 'Ordine assegnato!', dieText: 'Dadi lanciati!', teamsText: 'Squadre assegnate!',
        startBtn: 'Inizia', resetBtn: 'Ripristina', resetBoardBtn: 'Ripristina'
    },
    zh: {
        winner: '已选中', order: '顺序', die: '骰子', teams: '分队', clear: '清除',
        desktopPrompt: '点击添加玩家', desktopWait: '再添加一名玩家', desktopReady: '准备好了吗？',
        mobilePrompt: '放置手指开始', mobileWait: '等待更多手指...', mobileReady: '保持稳定...',
        winText: '已选中！', orderText: '顺序已分配！', dieText: '骰子已掷！', teamsText: '分队已完成！',
        startBtn: '开始', resetBtn: '重置', resetBoardBtn: '重置面板'
    },
    ja: {
        winner: '選ばれました', order: '順番', die: 'サイコロ', teams: 'チーム', clear: 'クリア',
        desktopPrompt: 'クリックしてプレイヤーを追加', desktopWait: 'もう一人追加してください', desktopReady: '準備はいいですか？',
        mobilePrompt: '指を置いて開始', mobileWait: '待機中...', mobileReady: 'そのまま...',
        winText: '選ばれました！', orderText: '順番が決定しました！', dieText: 'サイコロを振りました！', teamsText: 'チームが決定しました！',
        startBtn: 'スタート', resetBtn: 'リセット', resetBoardBtn: 'リセット'
    },
    ko: {
        winner: '선택됨', order: '순서', die: '주사위', teams: '팀', clear: '초기화',
        desktopPrompt: '클릭하여 플레이어 추가', desktopWait: '한 명 더 추가하세요', desktopReady: '준비되셨나요?',
        mobilePrompt: '손가락을 올려 시작하세요', mobileWait: '기다리는 중...', mobileReady: '움직이지 마세요...',
        winText: '선택됨!', orderText: '순서가 지정되었습니다!', dieText: '주사위가 던져졌습니다!', teamsText: '팀이 배정되었습니다!',
        startBtn: '시작', resetBtn: '초기화', resetBoardBtn: '보드 초기화'
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
            this.ctx = new (globalThis.AudioContext || globalThis.webkitAudioContext)();
        }
    },

    playTone(freq, type, duration, volume = 0.1) {
        if (!this.ctx) return;
        if (state.isMuted) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const isNeon = state?.theme === 'neon';
        const gainOffset = isNeon ? 1.5 : 1; // Boost Neon/Sine waves
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
        if (state.theme === 'retro') {
            this.playTone(150, 'square', 0.1, 0.05);
        } else if (state.theme === 'cyber') {
            this.playTone(300, 'sawtooth', 0.05, 0.03);
            setTimeout(() => this.playTone(150, 'sawtooth', 0.05, 0.02), 30);
        } else if (state.theme === 'mono') {
            this.playTone(1000, 'square', 0.01, 0.02);
        } else {
            this.playTone(200, 'sine', 0.1, 0.05);
        }
    },

    playTick() {
        if (state.theme === 'retro') {
            this.playTone(300, 'square', 0.05, 0.03);
        } else if (state.theme === 'cyber') {
            this.playTone(600, 'sawtooth', 0.02, 0.02);
        } else if (state.theme === 'mono') {
            this.playTone(1200, 'square', 0.005, 0.02);
        } else {
            this.playTone(400, 'sine', 0.05, 0.03);
        }
        
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    },

    playWin() {
        const isRetro = state?.theme === 'retro';
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
    timerDuration: Number.parseFloat(localStorage.getItem('chooseWhoTimer') ?? '2.0'),
    isDesktop: globalThis.matchMedia('(pointer: fine)').matches,
    volume: Number.parseFloat(localStorage.getItem('chooseWhoVolume') ?? '0.5'),
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
    gridResetBtn: document.getElementById('grid-reset-btn'),
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
            state.volume = Number.parseInt(e.target.value) / 100;
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

    // PWA Install Button
    const installAppBtn = document.getElementById('install-app-btn');
    if (installAppBtn) {
        installAppBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (globalThis.deferredPrompt) {
                globalThis.deferredPrompt.prompt();
                await globalThis.deferredPrompt.userChoice;
                globalThis.deferredPrompt = null;
                document.getElementById('install-row').style.display = 'none';
            }
        });
    }

    globalThis.addEventListener('beforeinstallprompt', (e) => {
        // We will NOT prevent default, allowing the standard browser infobar
        // but we will also show our custom button
        globalThis.deferredPrompt = e;
        const installRow = document.getElementById('install-row');
        if (installRow) installRow.style.display = 'flex';
    });

    // Timer Slider
    const timerSlider = document.getElementById('timer-slider');
    const timerValueDisplay = document.getElementById('timer-value');
    if (timerSlider && timerValueDisplay) {
        timerSlider.value = state.timerDuration;
        timerValueDisplay.textContent = `${state.timerDuration.toFixed(1)}s`;
        timerSlider.addEventListener('input', (e) => {
            state.timerDuration = Number.parseFloat(e.target.value);
            timerValueDisplay.textContent = `${state.timerDuration.toFixed(1)}s`;
            localStorage.setItem('chooseWhoTimer', state.timerDuration);
            AudioEngine.playTick();
        });
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
    globalThis.addEventListener('touchstart', handleTouchStart, { passive: false });
    globalThis.addEventListener('touchmove', handleTouchMove, { passive: false });
    globalThis.addEventListener('touchend', handleTouchEnd, { passive: false });
    globalThis.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    
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
        globalThis.addEventListener('mousedown', handleMouseDown);
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

    if (dom.gridResetBtn) {
        dom.gridResetBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            resetGame(true);
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
    highlightLastWinners();
}

function toggleInteractionMode(mode) {
    state.interactionMode = mode;
    dom.gridToggle.classList.toggle('active', mode === 'grid');
    if (dom.gridResetBtn) dom.gridResetBtn.classList.toggle('hidden', mode !== 'grid');
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
        cell.className = `grid-cell indicator-${i}`;
        cell.dataset.index = i;
        dom.gridContainer.appendChild(cell);
    }
    highlightLastWinners();
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

function highlightLastWinners() {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('last-winner');
    });

    if (state.interactionMode !== 'grid') return;

    const modeHistory = state.history[state.mode] || [];
    if (modeHistory.length === 0) return;

    const lastWinnerIndex = modeHistory[modeHistory.length - 1];
    const winnerCell = dom.gridContainer.querySelector(`.grid-cell.indicator-${lastWinnerIndex}`);
    if (winnerCell) {
        winnerCell.classList.add('last-winner');
    }
}

function clearHistory() {
    state.history[state.mode] = [];
    localStorage.setItem('chooseWhoHistoryV2', JSON.stringify(state.history));
    updateHistoryUI();
    highlightLastWinners();
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

    const colorIndex = state.interactionMode === 'grid' && gridCell 
        ? Number.parseInt(gridCell.dataset.index) 
        : state.colorAvailability.findIndex(Boolean);

    if (colorIndex === -1 || colorIndex === undefined) return null;

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
            <circle class="timer-circle" cx="60" cy="60" r="57" style="transition-duration: ${state.timerDuration}s;"></circle>
        </svg>
        <div class="rank-text"></div>
    `;

    dom.overlay.appendChild(element);
    element.getBoundingClientRect(); // Force reflow
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
        if (data.gridCell) {
            data.gridCell.classList.remove('occupied');
        }
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

    // Check for indicator or occupied grid cell to remove
    const indicator = e.target.closest('.finger-indicator');
    const occupiedCell = state.interactionMode === 'grid' ? e.target.closest('.grid-cell.occupied') : null;

    if (indicator || occupiedCell) {
        const entry = Array.from(state.touches.entries()).find(([_, data]) => 
            (indicator && data.element === indicator) || (occupiedCell && data.gridCell === occupiedCell)
        );
        
        if (entry) {
            removeIndicator(entry[0]);
            updateStatus();
            updateUILanguage(); // Refresh desktop button text
            return;
        }
    }

    // Don't add indicators if clicking on UI
    if (e.target.closest('#top-bar') || e.target.closest('#history-overlay') || e.target.closest('#desktop-controls') || e.target.closest('#settings-modal') || e.target.closest('#settings-btn')) {
        return;
    }

    AudioEngine.init();
    createIndicator(e.clientX, e.clientY, `mouse_${Date.now()}`);
    updateStatus();
    updateUILanguage(); // Refresh desktop button text
}

function handleTouchStart(e) {
    if (e.target.closest('#top-bar') || e.target.closest('#history-overlay') || e.target.closest('#desktop-controls') || e.target.closest('#settings-modal') || e.target.closest('#settings-btn')) {
        return;
    }

    AudioEngine.init();
    if (state.isSelected) resetGame();
    if (e.cancelable) e.preventDefault();

    for (const touch of e.changedTouches) {
        createIndicator(touch.clientX, touch.clientY, touch.identifier);
    }

    if (!state.isSelected) resetTimer();
}

function handleTouchMove(e) {
    if (e.target.closest('#top-bar') || e.target.closest('#history-overlay') || e.target.closest('#desktop-controls') || e.target.closest('#settings-modal') || e.target.closest('#settings-btn')) {
        return;
    }

    if (e.cancelable) e.preventDefault();
    if (state.isSelected) return;

    for (const touch of e.changedTouches) {
        const data = state.touches.get(touch.identifier);
        if (data) {
            const coords = getAppCoordinates(touch.clientX, touch.clientY);
            
            if (state.interactionMode === 'grid' && data.gridCell) {
                const rect = data.gridCell.getBoundingClientRect();
                const appRect = dom.app.getBoundingClientRect();
                
                // Clamp coordinates to the grid cell bounds (relative to app container)
                const minX = rect.left - appRect.left;
                const maxX = rect.right - appRect.left;
                const minY = rect.top - appRect.top;
                const maxY = rect.bottom - appRect.top;
                
                data.x = Math.max(minX, Math.min(coords.x, maxX));
                data.y = Math.max(minY, Math.min(coords.y, maxY));
            } else {
                data.x = coords.x;
                data.y = coords.y;
            }

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

    for (const touch of e.changedTouches) {
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
    } else if (state.touches.size === 0) {
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
        data.element.style.animationDuration = `${state.timerDuration}s`;
        data.element.classList.add('counting');
        data.element.getBoundingClientRect();
    });

    AudioEngine.playTick();
    state.tickInterval = setInterval(() => AudioEngine.playTick(), 1000);
    state.timerId = setTimeout(selectWinner, state.timerDuration * 1000);

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
    state.isSelected = true; // Lock the session immediately to prevent race conditions
    dom.statusText.textContent = 'ELIMINATING...';
    
    const identifiers = Array.from(state.touches.keys());
    
    // Pick exactly ONE to eliminate this round
    const eliminatedId = identifiers[Math.floor(Math.random() * identifiers.length)];

    const data = state.touches.get(eliminatedId);
    if (data) {
        data.element.classList.remove('counting');
        data.element.classList.add('exploding');
        if (data.gridCell) {
            // Persistent 'out' state for elimination
            data.gridCell.classList.add('unavailable');
        }
        AudioEngine.playExplosion();
        if (navigator.vibrate) navigator.vibrate(50);
        await new Promise(r => setTimeout(r, 600));
    }

    if (!state.isSelected) return; // Check one last time before finalization

    // Mark others as safe (winner styling is used for safe players)
    state.touches.forEach((d, id) => {
        if (id !== eliminatedId) {
            d.element.classList.remove('counting');
            d.element.classList.add('winner');
        }
    });

    state.isSelected = true;
    state.isCounting = false;
    
    let remainingGridCount = 0;
    if (state.interactionMode === 'grid') {
        remainingGridCount = document.querySelectorAll('.grid-cell:not(.unavailable)').length;
    }
    
    if (state.interactionMode === 'grid' && remainingGridCount === 1) {
        dom.statusText.textContent = 'SURVIVOR!';
        const survivorCell = document.querySelector('.grid-cell:not(.unavailable)');
        if (survivorCell) {
            logHistory(Number.parseInt(survivorCell.dataset.index));
        }
        AudioEngine.playWin();
    } else {
        dom.statusText.textContent = 'ELIMINATED!';
        AudioEngine.playTick(); // End of round sound
    }
    
    if (state.isDesktop) {
        dom.resetBoardBtn.textContent = 'Next Round';
        dom.resetBoardBtn.classList.remove('hidden');
    }
}

function finalizeSelection() {
    state.isSelected = true;
    state.isCounting = false;
    
    let textKey = 'teamsText';
    if (state.mode === 'winner') textKey = 'winText';
    else if (state.mode === 'order') textKey = 'orderText';
    else if (state.mode === 'die') textKey = 'dieText';
    
    dom.statusText.textContent = t(textKey);

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
    highlightLastWinners();
}

function resetGame(fullReset = false) {
    if (state.tickInterval) clearInterval(state.tickInterval);
    if (state.timerId) clearTimeout(state.timerId);
    state.tickInterval = null;
    state.timerId = null;
    
    state.isSelected = false;
    state.isCounting = false;
    
    dom.overlay.innerHTML = '';
    state.touches.clear();
    state.colorAvailability = new Array(CONFIG.MAX_TOUCHES).fill(true);
    
    if (fullReset || state.interactionMode !== 'grid') {
        state.colorAvailability = new Array(CONFIG.MAX_TOUCHES).fill(true);
        document.querySelectorAll('.grid-cell').forEach(cell => {
            cell.classList.remove('occupied', 'unavailable');
        });
    } else {
        // Round-by-round reset: clear 'occupied' so next round can start, but leave 'unavailable' intact
        document.querySelectorAll('.grid-cell').forEach(cell => {
            cell.classList.remove('occupied');
        });
    }

    if (state.isDesktop) {
        dom.startBtn.classList.remove('hidden');
        dom.resetBoardBtn.classList.remove('hidden');
        dom.resetBoardBtn.textContent = fullReset ? t('resetBtn') : 'Next Round';
    }
    
    updateStatus();
    updateHistoryUI();
    highlightLastWinners();
}

init();
