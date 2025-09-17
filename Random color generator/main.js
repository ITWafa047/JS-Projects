const swatch = document.getElementById('swatch');
const hexEl = document.getElementById('hex');
const rgbEl = document.getElementById('rgb');
const generateBtn = document.getElementById('generate');
const copyBtn = document.getElementById('copy');
const paletteEl = document.getElementById('palette');
const randomTextBtn = document.getElementById('randomText');

let lastPalette = JSON.parse(localStorage.getItem('palette')) || [];
let useAutoText = true;

function randomHex() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return { hex: rgbToHex(r, g, b), rgb: `rgb(${r}, ${g}, ${b})`, r, g, b };
}

function componentToHex(c) {
    return c.toString(16).padStart(2, '0');
}

function rgbToHex(r, g, b) {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function contrastColor(r, g, b) {
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance > 150 ? '#000' : '#fff';
}

function applyColor({ hex, rgb, r, g, b }) {
    swatch.style.background = hex;
    hexEl.textContent = hex.toUpperCase();
    rgbEl.textContent = rgb;
    document.body.style.background = `rgba(${r}, ${g}, ${b}, 0.06)`;
    if (useAutoText) {
        const txt = contrastColor(r, g, b);
        hexEl.style.color = txt;
        rgbEl.style.color = txt;
    }
    else {
        hexEl.style.color = '';
        rgbEl.style.color = '';
    }
    pushPalette(hex);
}

function pushPalette(hex) {
    lastPalette = lastPalette.filter(h => h !== hex);
    lastPalette.unshift(hex);
    if (lastPalette.length > 5) lastPalette.pop();
    localStorage.setItem('palette', JSON.stringify(lastPalette));
    renderPalette();
}

function renderPalette() {
    paletteEl.innerHTML = '';
    lastPalette.forEach(hex => {
        const d = document.createElement('div');
        d.className = 'pcolor';
        d.style.background = hex;
        d.title = hex;
        d.addEventListener('click', () => {
            const rgb = hexToRgb(hex);
            applyColor({ hex, rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, r: rgb.r, g: rgb.g, b: rgb.b });
        });
        paletteEl.appendChild(d);
    });
}

function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return { r, g, b };
}

async function copyHex() {
    const hex = hexEl.textContent; // 1
    try {
        await navigator.clipboard.writeText(hex); // 2
        copyBtn.textContent = 'Copied!'; // 3
        setTimeout(() => copyBtn.textContent = 'copy HEX', 1200); // 4
    } catch (e) {
        alert('copy failed. HEX: ' + hex); // 5
    }
}

function generate() {
    const c = randomHex();
    applyColor(c);
}

swatch.addEventListener('click', copyHex);
generateBtn.addEventListener('click', generate);
copyBtn.addEventListener('click', copyHex);
randomTextBtn.addEventListener('click', () => {
    useAutoText = !useAutoText;
    randomTextBtn.textContent = useAutoText ? 'Toggle text color' : 'Toggle text color';

    const rgbParts = rgbEl.textContent.match(/\d+/g);
    if (rgbParts) {
        applyColor({
            hex: hexEl.textContent,
            rgb: rgbEl.textContent,
            r: +rgbParts[0],
            g: +rgbParts[1],
            b: +rgbParts[2]
        });
    }
});

if (lastPalette.length) renderPalette();
generate();