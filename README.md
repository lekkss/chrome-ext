# Chrome Extensions Explorer

A collection of Chrome extensions built with React, TypeScript, and Vite to explore and understand browser extension development.

## 🚀 Projects

### 1. Calculator Extension

A sleek, modern calculator that's always just a click away in your browser.

**Features:**

- Clean, modern UI with Tailwind CSS
- Basic arithmetic operations
- Responsive design
- History display for calculations
- Error handling

### 2. Smart Clipboard Manager

A powerful clipboard history manager that helps you keep track of everything you copy.

**Features:**

- Real-time clipboard monitoring
- Search functionality
- 24-hour history retention
- Background syncing
- Clean, modern interface
- Instant copy back to clipboard

## 🛠️ Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Chrome Extension APIs

## 🏗️ Project Structure

## 🚦 Getting Started

1. Clone the repository:

```bash
git clone [your-repo-url]
```

2. Install dependencies:

```bash
npm install
```

3. Choose which extension to try:
   - Open `src/App.tsx`
   - Import and use the desired feature:

```typescript
// For Calculator:
import Calculator from "./features/Calculator";

function App() {
  return <Calculator />;
}

// OR for Smart Clipboard:
import SmartClipboard from "./features/SmartClipboard";

function App() {
  return <SmartClipboard />;
}
```

4. Build the extension:

```bash
npm run build
```

5. Load the extension in Chrome:
   - Open Chrome
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder
