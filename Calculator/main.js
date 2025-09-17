const display = document.getElementById('display');
const keys = document.getElementById('keys');


let current = '0'; // current value displayed
let previous = null; // previous value for operations
let operator = null; // current operator (+,-,*,/)
let justCalculated = false; // flag to check if last operation was a calculation 

function updateDisplay(value = current) {
    display.value = value;
}

function inputDigit(d) {
    if (justCalculated && !operator) {
        current = d;
        justcalculated = false;
        return updateDisplay();
    }

    if (current === '0') {
        current = d;
    }
    else {
        current += d;
    }
    updateDisplay();
}

function inputDecimal() {
    if (justCalculated && !operator) {
        current = '0.';
        justCalculated = false;
        return updateDisplay();
    }
    if (!current.includes('.')) {
        current += '.';
        updateDisplay();
    }
}

function inputPercent() {
    const n = parseFloat(current);
    if (!isNaN(n)) {
        current = String(n / 100);
        updateDisplay();
    }
}

function chooseOperator(op) {
    if (operator && previous !== null && !justCalculated) {
        compute();
    }
    previous = current;
    operator = op;
    current = '0';
    justCalculated = false;
}

function backspace() {
    if (justCalculated) return;
    if (current.length > 1) {
        current = current.slice(0, -1);
    } else {
        current = '0';
    }
    updateDisplay();
}

function clearAll() {
    current = '0';
    previous = null;
    operator = null;
    justCalculated = false;
    updateDisplay();
}

function compute() {
    if (operator === null || previous === null) return;

    const a = parseFloat(previous);
    const b = parseFloat(current);
    let result;

    switch (operator) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '×': result = a * b; break;
        case '÷':
            if (b === 0) {
                updateDisplay('Cannot divide by zero');
                current = '0';
                previous = null;
                operator = null;
                justCalculated = true;
                return;
            }
            result = a / b; break;
            default: return;
    }

    const pretty = Number(result.toFixed(10) * 1);
    current = String(pretty);
    previous = null;
    operator = null;
    justCalculated = true;
    updateDisplay(current);
}

keys.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const type = btn.dataset.type;
    const value = btn.dataset.value;

    if (type === 'digit') return inputDigit(value);
    if (type === 'decimal') return inputDecimal();
    if (type === 'percent') return inputPercent();
    if (type === 'operator') return chooseOperator(value);
    if (type === 'delete') return backspace();
    if (type === 'clear') return clearAll();
    if (type === 'equals') return compute();
});

window.addEventListener('keydown', (e) => {
    const k = e.key;
    if (/^[0-9]$/.test(k)) return inputDigit(k);
    if (k === '.') return inputDecimal();
    if (k === 'Backspace') return backspace();
    if (k.toLowerCase() === 'c') return clearAll();
    if (k === '+' || k === '-') return chooseOperator(k);
    if (k === '*') return chooseOperator('×');
    if (k === '/') return chooseOperator('÷');
    if (k === '%') return inputPercent();
    if (k === 'Enter' || k === '=') return compute();
});


