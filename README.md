# MorseByte

MorseByte is a fully offline, cross-platform Electron desktop app for translating between text, Morse code, and binary. It features a modern responsive UI, light/dark theme toggle, live conversion, clipboard helpers, and export to `.txt`.

## Features
- Text ↔ Morse, Text ↔ Binary conversions
- Live updates while typing and manual "Convert" button
- Clipboard copy/paste, clear, and export to `.txt`
- UTF-8 or ASCII binary encoding
- Light/dark glass-style UI with responsive layout
- Offline-first; no network dependencies

## Project Structure
```
MorseByte/
├─ package.json
├─ README.md
└─ src/
   ├─ index.html     # UI markup
   ├─ styles.css     # Modern responsive styling
   ├─ renderer.js    # Conversion logic & UI bindings
   ├─ main.js        # Electron app entry
   └─ preload.js     # Secure bridges for clipboard/export
```

## Installation
1. Ensure Node.js (>=18) and npm are installed.
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the App (development)
```bash
npm start
```
This launches the Electron window with live conversion.

## Building Distributables
Electron Builder scripts target all major platforms. Run from the project root:
- macOS: `npm run build:mac`
- Windows: `npm run build:win`
- Linux: `npm run build:linux`

Or build all at once (from a platform that supports cross-packaging):
```bash
npm run build
```

> Note: For platform-specific packaging, run the matching script on that OS for best results (e.g., mac build on macOS).

## Usage Tips
- Select the desired conversion mode and encoding from the header controls.
- Input goes in the left text area; output appears on the right in real-time.
- Morse expects letters separated by spaces and words separated by `/`.
- Binary expects 8-bit chunks separated by spaces (e.g., `01001000 01101001`).
- Export saves the current output as `conversion.txt` via the system file dialog.

## Offline Behavior
All conversion logic and UI assets are bundled locally; no internet connection is required for any feature.
