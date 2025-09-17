let timerDisplay = document.getElementById("timer");
let startBtn = document.getElementById("start");
let pauseBtn = document.getElementById("Pause");
let resetBtn = document.getElementById("Reset");
let statusText = document.getElementById("status");

let workTime = 25 * 60;
let breakTime = 5 * 60;
let timeLeft = workTime;
let isWork = true;
let timeInterval;

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function startTimer(){
    if (!timeInterval){
        timeInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();

            if (timeLeft <= 0){
                clearInterval(timeInterval);
                timeInterval = null;
                isWork = !isWork;
                timeLeft = isWork ? workTime : breakTime;
                statusText.textContent = isWork ? "Focus Time 🍅" : "Break Time ☕";
                updateDisplay();
                startTimer();
            }
        },1000);
    }
}

function pauseTimer(){
    clearInterval(timeInterval);
    timeInterval = null;
}

function resetTimer(){
    clearInterval(timeInterval);
    timeInterval = null;
    isWork = true;
    timeLeft = workTime;
    statusText.textContent = "Focus Time 🍅";
    updateDisplay();
}

startBtn.addEventListener("click",startTimer);
pauseBtn.addEventListener("click",pauseTimer);
resetBtn.addEventListener("click",resetTimer);

updateDisplay();