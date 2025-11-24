const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const modeEl = document.getElementById('mode');
const encodingEl = document.getElementById('encoding');
const statusEl = document.getElementById('status');
const convertBtn = document.getElementById('convert');
const copyBtn = document.getElementById('copy');
const pasteBtn = document.getElementById('paste');
const clearBtn = document.getElementById('clear');
const saveBtn = document.getElementById('save');
const themeToggleBtn = document.getElementById('theme-toggle');
const root = document.documentElement;

const bridge = window.morseApi || {
  copy: async (text) => navigator.clipboard?.writeText(text || ''),
  paste: async () => (navigator.clipboard ? navigator.clipboard.readText() : ''),
  saveText: async (content) => {
    const blob = new Blob([content || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'conversion.txt';
    anchor.click();
    URL.revokeObjectURL(url);
    return 'conversion.txt';
  },
  platform: 'web'
};

const morseMap = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  0: '-----',
  1: '.----',
  2: '..---',
  3: '...--',
  4: '....-',
  5: '.....',
  6: '-....',
  7: '--...',
  8: '---..',
  9: '----.',
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  "'": '.----.',
  '!': '-.-.--',
  '/': '-..-.',
  '(': '-.--.',
  ')': '-.--.-',
  '&': '.-...',
  ':': '---...',
  ';': '-.-.-.',
  '=': '-...-',
  '+': '.-.-.',
  '-': '-....-',
  '_': '..--.-',
  '"': '.-..-.',
  '$': '...-..-',
  '@': '.--.-.',
  ' ': '/'
};

const reverseMorseMap = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]));

const textToMorse = (text) =>
  text
    .toUpperCase()
    .split('')
    .map((char) => {
      if (!morseMap[char]) throw new Error(`Unsupported character: ${char}`);
      return morseMap[char];
    })
    .join(' ');

const morseToText = (morse) => {
  if (!morse.trim()) return '';
  const tokens = morse.trim().split(/\s+/);
  const letters = tokens.map((token) => {
    if (token === '/' || token === '|') return ' ';
    if (!reverseMorseMap[token]) throw new Error(`Invalid Morse sequence: ${token}`);
    return reverseMorseMap[token];
  });
  return letters.join('').replace(/\s+/g, ' ');
};

const toBinaryChunks = (text, encoding) => {
  if (!text) return '';
  if (encoding === 'ascii') {
    return text
      .split('')
      .map((char) => char.charCodeAt(0) & 0xff)
      .map((code) => code.toString(2).padStart(8, '0'))
      .join(' ');
  }
  const encoder = new TextEncoder();
  return Array.from(encoder.encode(text))
    .map((byte) => byte.toString(2).padStart(8, '0'))
    .join(' ');
};

const fromBinaryChunks = (binary, encoding) => {
  if (!binary.trim()) return '';
  const tokens = binary.trim().split(/\s+/);
  if (tokens.some((token) => !/^([01]{8})$/.test(token))) {
    throw new Error('Binary input must be 8-bit chunks separated by spaces.');
  }

  const byteValues = tokens.map((token) => parseInt(token, 2));

  if (encoding === 'ascii') {
    return String.fromCharCode(...byteValues);
  }

  const decoder = new TextDecoder('utf-8', { fatal: true });
  return decoder.decode(new Uint8Array(byteValues));
};

const setStatus = (message, isError = false) => {
  statusEl.textContent = message;
  statusEl.style.color = isError ? '#ef4444' : 'var(--muted)';
};

const convert = () => {
  const mode = modeEl.value;
  const encoding = encodingEl.value;
  const input = inputEl.value;

  try {
    let result = '';
    switch (mode) {
      case 'text-to-morse':
        result = textToMorse(input);
        break;
      case 'morse-to-text':
        result = morseToText(input);
        break;
      case 'text-to-binary':
        result = toBinaryChunks(input, encoding);
        break;
      case 'binary-to-text':
        result = fromBinaryChunks(input, encoding);
        break;
      default:
        result = '';
    }
    outputEl.value = result;
    setStatus('Converted successfully.');
  } catch (error) {
    outputEl.value = '';
    setStatus(error.message, true);
  }
};

const applyPreferredTheme = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    root.classList.add('dark');
    themeToggleBtn.textContent = '☀️';
  }
};

const toggleTheme = () => {
  const isDark = root.classList.toggle('dark');
  themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
};

themeToggleBtn.addEventListener('click', toggleTheme);
modeEl.addEventListener('change', convert);
encodingEl.addEventListener('change', convert);
inputEl.addEventListener('input', convert);
convertBtn.addEventListener('click', convert);

copyBtn.addEventListener('click', async () => {
  await bridge.copy(outputEl.value);
  setStatus('Copied to clipboard.');
});

pasteBtn.addEventListener('click', async () => {
  inputEl.value = await bridge.paste();
  convert();
  setStatus('Pasted from clipboard.');
});

clearBtn.addEventListener('click', () => {
  inputEl.value = '';
  outputEl.value = '';
  setStatus('Cleared.');
});

saveBtn.addEventListener('click', async () => {
  const filePath = await bridge.saveText(outputEl.value);
  if (filePath) {
    setStatus(`Saved to ${filePath}`);
  } else {
    setStatus('Save canceled.');
  }
});

applyPreferredTheme();
convert();

