# ✈ Wandr — AI Trip Planner

A professional, luxury-themed AI-powered trip planning web app built with **React + Vite**, powered by **Google Gemini AI**.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Gemini API Key

Open `src/gemini.js` and replace the placeholder with your actual key:

```js
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"; // 🔑 Replace this
```

> 🔒 The API key only lives in the source code — it is **never** displayed on the website.

### 3. Run the app
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
├── gemini.js              ← Gemini API key & prompt logic
├── main.jsx               ← React entry point
├── App.jsx                ← Main app state machine
├── App.css
├── index.css              ← Global styles & CSS variables
└── components/
    ├── Header.jsx / .css  ← Hero header
    ├── TripForm.jsx / .css ← Planning form
    ├── Loading.jsx / .css ← Loading screen
    ├── ItineraryResult.jsx / .css ← Generated itinerary
    └── Footer.jsx / .css  ← Footer
```

---

## 🏗 Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder.

---

## 🔑 Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Paste it into `src/gemini.js`

---

## 🎨 Tech Stack

- **React 18** + **Vite 5**
- **Google Gemini 2.0 Flash** API
- **Cormorant Garamond** + **DM Sans** fonts
- Pure CSS animations (no animation library required)
