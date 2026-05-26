# ✈ Wandr — AI Trip Planner

A full-stack, luxury-themed AI-powered trip planning web app. Plan beautiful day-by-day travel itineraries, save your trips, and explore destinations — all in one elegant interface.

**Live Demo:** https://ai-trip-planner-henna-five.vercel.app

---

## ✨ Features

- 🤖 **AI Itinerary Generation** — Powered by OpenRouter (DeepSeek) AI
- 🖼️ **Destination Photos** — Auto-fetched from Unsplash API
- 🗺️ **Interactive Map** — Shows your destination on a live map
- 🌤️ **Live Weather** — Real-time weather for your destination
- 🌙 **Dark Mode** — Toggle between light and dark theme
- ✈️ **Animated Loading** — World map animation while AI plans your trip
- 🔐 **Auth System** — Sign up / Login with JWT authentication
- 💾 **Save Trips** — Save your itineraries to your account
- 📋 **My Trips** — View and manage all your saved trips

---

## 🏗 Tech Stack

### Frontend
- React 18 + Vite
- CSS3 (custom design system)
- OpenRouter AI API (DeepSeek model)
- Unsplash API (photos)
- OpenWeatherMap API (weather)
- Leaflet (maps)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)

---

## 📁 Project Structure

```
ai-trip-planner/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── TripForm.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── ItineraryResult.jsx
│   │   │   ├── WeatherWidget.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── MyTrips.jsx
│   │   │   ├── TripMap.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── gemini.js
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
└── backend/
    ├── models/
    │   ├── User.js
    │   └── Trip.js
    ├── routes/
    │   ├── auth.js
    │   └── trips.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── server.js
    ├── .env
    └── package.json
```

---

## 🚀 Local Setup (Step by Step)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- API keys (see below)

---

### 1. Clone the repo

```bash
git clone https://github.com/AVNEESH707/ai-trip-planner.git
cd ai-trip-planner
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Start backend:

```bash
npm run dev
# ✅ MongoDB connected
# ✅ Server running on port 5000
```

---

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_OPENROUTER_API_KEY=your_openrouter_key
VITE_UNSPLASH_KEY=your_unsplash_access_key
VITE_WEATHER_KEY=your_openweathermap_key
```

Start frontend:

```bash
npm run dev
# Open http://localhost:5173
```

---

## 🔑 Getting API Keys

| API | Link | Free Tier |
|-----|------|-----------|
| OpenRouter | https://openrouter.ai | ✅ Free credits |
| Unsplash | https://unsplash.com/developers | ✅ 50 req/hour |
| OpenWeatherMap | https://openweathermap.org/api | ✅ Free tier |
| MongoDB Atlas | https://cloud.mongodb.com | ✅ Free 512MB |

---

## 🌐 Deployment

- **Frontend** → Vercel
- **Backend** → Render (or Railway)

Add all `.env` variables to your deployment platform's environment settings.

---

## 📦 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| POST | `/api/trips/save` | Save a trip | ✅ |
| GET | `/api/trips/my-trips` | Get all saved trips | ✅ |
| DELETE | `/api/trips/:id` | Delete a trip | ✅ |

---

## 👨‍💻 Author

**Avneesh Kumar**

- GitHub: https://github.com/AVNEESH707
- LinkedIn: https://linkedin.com/in/avneesh-kumar-3a50b325b

---

## ⚠️ Important

Never commit your `.env` files to GitHub. Make sure `.gitignore` includes:

```
.env
node_modules/
dist/
```
