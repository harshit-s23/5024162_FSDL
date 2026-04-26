# 🌱 EcoTask — Smart Carbon Footprint Tracker

A full-stack web app that helps users track, visualize, and reduce their carbon footprint through daily activity logging, gamification, and smart eco suggestions.

---

## 🗂️ Project Structure

```
ecotask/
├── backend/
│   ├── config/
│   │   └── database.js          # SQLite + Sequelize connection
│   ├── controllers/
│   │   ├── authController.js    # Register, Login, GetMe
│   │   ├── taskController.js    # CRUD + carbon log sync
│   │   └── dashboardController.js # Analytics & insights
│   ├── middleware/
│   │   └── auth.js              # JWT protect middleware
│   ├── models/
│   │   ├── User.js              # User model (badges, streak, score)
│   │   ├── Task.js              # Task model (category, carbonValue)
│   │   ├── CarbonLog.js         # Daily carbon log entries
│   │   └── index.js             # Associations
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── dashboard.js
│   ├── utils/
│   │   └── carbonEngine.js      # Carbon factors, scoring, badges, suggestions
│   ├── seed.js                  # Sample data seeder
│   ├── server.js                # Express entry point
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── dashboard/
    │   │   │   ├── EcoScoreRing.jsx   # Animated SVG ring
    │   │   │   ├── StatCard.jsx       # Metric cards
    │   │   │   ├── BadgeGrid.jsx      # Gamification badges
    │   │   │   └── SuggestionsPanel.jsx
    │   │   ├── tasks/
    │   │   │   ├── TaskModal.jsx      # Create/Edit modal
    │   │   │   └── TaskCard.jsx       # Task list item
    │   │   └── layout/
    │   │       └── Layout.jsx         # Sidebar + mobile nav
    │   ├── context/
    │   │   └── AuthContext.jsx        # Global auth state
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx      # Charts, score, insights
    │   │   └── TasksPage.jsx          # Full task management
    │   ├── utils/
    │   │   ├── api.js                 # Axios instance with JWT
    │   │   └── constants.js           # Categories, subcategories
    │   ├── App.jsx
    │   ├── index.js
    │   └── index.css
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- npm v9+

---

### Step 1 — Clone & Install

```bash
# Backend
cd ecotask/backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### Step 2 — Configure Environment

The `.env` file is already included in `backend/`:

```env
PORT=5000
JWT_SECRET=ecotask_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Change `JWT_SECRET` to something secure in production.

---

### Step 3 — Seed Demo Data (Optional)

```bash
cd ecotask/backend
node seed.js
```

This creates:
- Demo user: `demo@ecotask.com` / `demo123`
- 21 sample tasks across the last 7 days
- Pre-calculated carbon logs and eco score

---

### Step 4 — Run the App

**Terminal 1 — Backend:**
```bash
cd ecotask/backend
npm run dev       # uses nodemon for hot-reload
# or
npm start
```
Backend runs at: `http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd ecotask/frontend
npm start
```
Frontend runs at: `http://localhost:3000`

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | `{name, email, password}` | Create account |
| POST | `/api/auth/login` | `{email, password}` | Login |
| GET | `/api/auth/me` | — | Get current user |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (filterable by `?category=&date=&startDate=&endDate=`) |
| POST | `/api/tasks` | Create task + auto log carbon |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Full dashboard data (trends, categories, suggestions) |
| GET | `/api/dashboard/factors` | All carbon emission factors |

---

## 🧠 Carbon Calculation Logic

The engine (`backend/utils/carbonEngine.js`) uses real-world emission factors:

| Activity | Factor | Unit |
|----------|--------|------|
| Car (Petrol) | 0.21 kg CO₂ | per km |
| Car (Electric) | 0.05 kg CO₂ | per km |
| Bus | 0.089 kg CO₂ | per km |
| Train | 0.041 kg CO₂ | per km |
| Beef | 27.0 kg CO₂ | per kg |
| Vegan meal | 0.3 kg CO₂ | per meal |
| Electricity | 0.233 kg CO₂ | per kWh |
| Solar (generated) | −0.05 kg CO₂ | per kWh (saving) |
| Tree planted | −21.77 kg CO₂ | per tree/year |
| Recycling | −0.5 kg CO₂ | per kg (saving) |

**Eco Score Formula:**
```
dailyAvg = totalCarbon(30 days) / 30
ratio = dailyAvg / 13  (global avg is ~13 kg/day)
score = max(0, min(100, 100 − ratio × 50))
```

**Eco Levels:**
| Level | Score | Emoji |
|-------|-------|-------|
| Seedling | 0–30 | 🌱 |
| Sprout | 30–50 | 🌿 |
| Leaf | 50–65 | 🍃 |
| Tree | 65–80 | 🌳 |
| Forest | 80–90 | 🌲 |
| Earth Guardian | 90–100 | 🌍 |

---

## 🗃️ Database Schema (SQLite via Sequelize)

**Users**
```
id (UUID PK), name, email, password (hashed),
totalEcoScore, streak, lastActiveDate, badges (JSON), level
```

**Tasks**
```
id (UUID PK), userId (FK), title, description,
category (ENUM), subcategory, carbonValue, quantity, unit,
date, completed, isRecurring
```

**CarbonLogs**
```
id (UUID PK), userId (FK), taskId (FK),
date, category, carbonAmount, description
```

---

## 🎮 Gamification

| Badge | Condition | Emoji |
|-------|-----------|-------|
| First Step | Log 1 task | 🎯 |
| Week Warrior | 7-day streak | 🔥 |
| Carbon Saver | Save 10kg/week | 💚 |
| Green Commuter | Eco transport × 5 | 🚲 |
| Plant Power | Plant-based meals × 10 | 🥗 |
| Energy Saver | 20% energy reduction | ⚡ |
| Recycler Pro | Recycle 50kg | ♻️ |
| Earth Guardian | Score ≥ 90 | 🌍 |

---

## 🎨 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Hooks |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Charts | Recharts |
| HTTP | Axios |
| Toast | React Hot Toast |
| Backend | Node.js + Express |
| Auth | JWT (jsonwebtoken) |
| ORM | Sequelize |
| Database | SQLite3 |
| Dev | Nodemon |

---

## 🚀 Production Build

```bash
# Build frontend
cd frontend && npm run build

# Serve static files from Express (add to server.js):
# app.use(express.static(path.join(__dirname, '../frontend/build')));
```
