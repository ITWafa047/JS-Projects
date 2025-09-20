const lengthEl = document.getElementById('length');
const lowercaseEl = document.getElementById('lowercase');
const uppercaseEl = document.getElementById('uppercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateBtn = document.getElementById('generate');
const copyBtn = document.getElementById('copy');
const passwordEl = document.getElementById('password');
const strengthEl = document.getElementById('strength');
const historyEl = document.getElementById('history');

if (!lengthEl || !lowercaseEl || !uppercaseEl || !numbersEl || !symbolsEl || !generateBtn || !copyBtn || !passwordEl || !strengthEl || !historyEl) {
    throw new Error('One or more required DOM elements are missing. Please check your HTML.');
}

let historyList = [];
try {
    const stored = localStorage.getItem('passwordHistory');
    if (stored) {
        historyList = JSON.parse(stored);
    }
} catch (error) {
    console.error('Error parsing password history:', error);
    localStorage.removeItem('passwordHistory'); // Clear invalid data
}

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

async function renderHistory(){
    historyEl.innerHTML = '';
    historyList.forEach((pwd) => {
        const li = document.createElement('li');
        li.textContent = pwd;
        li.style.cursor = 'pointer';
        li.classList.add('history-item');
        li.addEventListener('click', async () => {
            await navigator.clipboard.writeText(pwd);
            alert(`Copied: ${pwd}`);
        });
        historyEl.appendChild(li);
    });
}

function randInt(max) {
    return Math.floor(Math.random() * max);
}

function pickRandom(str) {
    return str.charAt(randInt(str.length));
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = randInt(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function estimateStrength(password) {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { text: 'weak', color: '#ef4444' };
    if (score <= 4) return { text: 'medium', color: '#f59e0b' };
    return { text: 'strong', color: '#10b981' };
}

function generatePassword() {
    const length = parseInt(lengthEl.value, 10);
    let available = '';
    const requiredChars = [];

    if (lowercaseEl.checked) {
        available += LOWERCASE;
        requiredChars.push(pickRandom(LOWERCASE));
    }

    if (uppercaseEl.checked) {
        available += UPPERCASE;
        requiredChars.push(pickRandom(UPPERCASE));
    }

    if (numbersEl.checked) {
        available += NUMBERS;
        requiredChars.push(pickRandom(NUMBERS));
    }

    if (symbolsEl.checked) {
        available += SYMBOLS;
        requiredChars.push(pickRandom(SYMBOLS));
    }

    if (available.length === 0) {
        alert('Please select at least one type of character (lowercase/uppercase/numbers/symbols).');
        return;
    }

    if (length < requiredChars.length) {
        alert('The length is too short for the selected options — the length will be adjusted automatically.');
    }

    const finalLength = Math.max(length, requiredChars.length);
    const passwordChars = [];

    for (const char of requiredChars) {
        passwordChars.push(char);
    }

    for (let i = passwordChars.length; i < finalLength; i++) {
        passwordChars.push(pickRandom(available));
    }

    shuffleArray(passwordChars);

    const password = passwordChars.join('');
    passwordEl.value = password;

    historyList.unshift(password);

    if(historyList.length > 5) historyList.pop();
    localStorage.setItem('passwordHistory',JSON.stringify(historyList));

    renderHistory();
    const strength = estimateStrength(password);
    strengthEl.textContent = `Strong Status: ${strength.text}`;
    strengthEl.style.background = `${strength.color}22`;
    strengthEl.style.color = strength.color;
}

async function copyPassword() {
    const pwd = passwordEl.value;
    if (!pwd) {
        alert('There is no password to copy. Please create one first.');
        return;
    }

    try {
        await navigator.clipboard.writeText(pwd);
        copyBtn.textContent = 'Copied';
        setTimeout(() => copyBtn.textContent = 'Copy', 1200);
    } catch (e) {
        alert(`Automatic copying failed. Please copy the password manually:\n ${pwd}`);
    }
}

generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyPassword);

window.addEventListener('load', () => {
    generatePassword();
    renderHistory();
});