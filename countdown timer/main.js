const minuteInput = document.getElementById('minutes');
const startBtn = document.getElementById('start');

let pauseBtn = document.getElementById('pause');
let resetBtn = document.getElementById('reset');
const timerDisplay = document.getElementById('timer');

if (!pauseBtn) {
    pauseBtn = document.createElement('button');
    pauseBtn.id = 'pause';
    pauseBtn.textContent = 'Pause';
    pauseBtn.style.marginLeft = '10px';
    pauseBtn.style.padding = '10px 16px';
    pauseBtn.style.border = 'none';
    pauseBtn.style.borderRadius = '5px';
    pauseBtn.style.cursor = 'pointer';
    pauseBtn.style.background = '#f39c12';
    pauseBtn.style.color = '#fff';
    startBtn.insertAdjacentElement('afterend', pauseBtn);
}

if (!resetBtn) {
    resetBtn = document.createElement('button');
    resetBtn.id = 'reset';
    resetBtn.textContent = 'Reset';
    resetBtn.style.marginLeft = '10px';
    resetBtn.style.padding = '10px 16px';
    resetBtn.style.border = 'none';
    resetBtn.style.borderRadius = '5px';
    resetBtn.style.cursor = 'pointer';
    resetBtn.style.background = '#c0392b';
    resetBtn.style.color = '#fff';
    pauseBtn.insertAdjacentElement('afterend', resetBtn);
}

let totalSeconds = 0;
let remainingSecond = 0;
let interValid = null;
let isPaused = false;

function playBeep(duration = 300, frequency = 440, volume = 0.1) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = frequency;
        g.gain.value = volume;
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        setTimeout(() => {
            o.stop();
            ctx.close();
        }, duration);
    } catch (e) {
        console.log('Audio API not supported:', e);
        alert("Time's up!");
    }
}

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return `${mm}:${ss}`;
}

function updateDisplay() {
    timerDisplay.textContent = formatTime(remainingSecond);

    if (remainingSecond === 0) {
        timerDisplay.style.background = 'rgba(0,0,0,0.5)';
        timerDisplay.style.color = '#ffdddd';
    } else if (remainingSecond <= 10) {
        timerDisplay.style.background = 'rgba(200,30,30,0.7)';
        timerDisplay.style.color = '#fff';
    } else if (remainingSecond <= 60) {
        timerDisplay.style.background = 'rgba(243, 156, 18, 0.7)';
        timerDisplay.style.color = '#fff';
    } else {
        timerDisplay.style.background = 'rgba(0,0,0,0.3)';
        timerDisplay.style.color = '#fff';
    }
}

function startTimer() {
    if (interValid) return;
    const minutes = Number(minuteInput.value);
    if (!Number.isFinite(minutes) || minutes < 0) {
        alert('Enter the correct number of minutes ≥ 0');
        return;
    }
    totalSeconds = Math.floor(minutes * 60);
    remainingSecond = totalSeconds;

    if (totalSeconds === 0) {
        const raw = prompt('Want to enter seconds directly? Enter the number of seconds:', '30');
        const sec = Number(raw);
        if (Number.isFinite(sec) && sec > 0) {
            remainingSecond = Math.floor(sec);
        } else {
            alert('No good time. Start again.');
            return;
        }
    }

    minuteInput.disabled = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    isPaused = false;

    updateDisplay();

    interValid = setInterval(() => {
        if (!isPaused) {
            remainingSecond--;
            updateDisplay();

            if (remainingSecond <= 0) {
                clearInterval(interValid);
                interValid = null;
                minuteInput.disabled = false;
                startBtn.disabled = false;
                playBeep(600, 880, 0.12);
                setTimeout(() => playBeep(300, 880, 0.08), 400);
                alert("Time's up!");
            }
        }
    },1000);
}

function togglePause(){
    if (!interValid) return;
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
    pauseBtn.style.background = isPaused ? '#27ae60' : '#f39c12';
}

function resetTimer(){
    if (interValid){
        clearInterval(interValid);
        interValid = null;
    }
    remainingSecond = 0;
    totalSeconds = 0;
    isPaused = false;
    minuteInput.disabled = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
    pauseBtn.style.background = '#f39c12';
    resetBtn.disabled = true;
    minuteInput.value = '';
    updateDisplay();
}

startBtn.addEventListener('click',startTimer);
pauseBtn.addEventListener('click',togglePause);
resetBtn.addEventListener('click',resetTimer);

window.addEventListener('load',() => {
    timerDisplay.textContent = '00:00';
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    timerDisplay.style.transition = 'background 0.2s';
});