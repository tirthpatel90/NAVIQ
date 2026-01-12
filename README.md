
# NAVIQ - Navigate Your Career with Clarity

A stunning, modern career navigation platform with SQLite database, React frontend with 3D effects, and AI-powered guidance.

![NAVIQ](https://img.shields.io/badge/NAVIQ-Career%20Intelligence-7f9a7d?style=for-the-badge)

## ✨ Features

- **🗺️ Learning Roadmaps** - Personalized step-by-step career paths
- **📚 Study Resources** - Curated learning materials organized by topic
- **💡 Interview Prep** - Real-world questions with detailed answers
- **📊 Career Insights** - Data-driven analytics and progress tracking
- **🤖 AI Career Guide** - Intelligent assistant for career guidance
- **🎨 Stunning UI** - 3D effects, 2D canvas animations, glassmorphism

## 🛠️ Tech Stack

### Backend
- **Python 3.8+** with Flask
- **SQLite** database (easily manage data in VS Code)
- **Flask-CORS** for cross-origin support

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Three Fiber** for 3D graphics
- **Canvas API** for 2D animations

## 🚀 Quick Start

### Option 1: Run Everything
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Run Separately

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python database/seed_data.py  # Initialize database with sample data
python app.py
```

**Frontend:**
```bash
cd frontend-react
npm install
npm run dev
```

## 📂 Project Structure

```
NAVIQ/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── database/
│   │   ├── db_setup.py        # Database schema
│   │   ├── seed_data.py       # Sample data seeder
│   │   └── naviq.db           # SQLite database (auto-created)
│   └── repository/
│       └── db_repo.py         # Database operations
├── frontend-react/
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/            # Three.js 3D components
│   │   │   ├── canvas/        # 2D canvas animations
│   │   │   └── Layout.jsx     # Main layout
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── styles/            # CSS files
│   └── package.json
├── frontend/                  # Legacy frontend (HTML/CSS/JS)
└── start.sh                   # Quick start script
```

## 🗄️ Database Management

The SQLite database (`backend/database/naviq.db`) can be easily managed in VS Code:

1. Install the **SQLite Viewer** extension
2. Open `naviq.db` to view/edit data
3. Use the API endpoints to add/remove data programmatically

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/roles` | Get all roles |
| POST | `/api/roles` | Create a new role |
| PUT | `/api/roles/:id` | Update a role |
| DELETE | `/api/roles/:id` | Delete a role |
| GET | `/api/interview?role=X` | Get interview questions |
| POST | `/api/interview` | Add a question |
| PUT | `/api/interview/:id` | Update a question |
| DELETE | `/api/interview/:id` | Delete a question |
| GET | `/api/roadmap?goal=X&days=30` | Get learning roadmap |
| GET | `/api/roadmap/goals` | Get all available goals |
| GET | `/api/study` | Get study topics |
| POST | `/api/study` | Create study topic |
| GET | `/api/insights` | Get career insights |
| POST | `/api/insights` | Create insight |
| PUT | `/api/insights/:id` | Update insight |
| DELETE | `/api/insights/:id` | Delete insight |

## 🎨 Design Features

### 3D Effects
- Floating orbs with distortion materials
- Animated particle fields
- Interactive 3D scene on home page

### 2D Canvas Animations
- Particle network with mouse interaction
- Gradient blob animations
- Wave animations

### UI Components
- Glassmorphism cards
- Smooth scroll animations
- Dark/Light mode toggle
- Responsive design for all screens

## 🔧 Configuration

### Backend Port
Edit `backend/app.py`:
```python
app.run(debug=True, port=5000)
```

### Frontend API URL
Edit `frontend-react/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000'
```

## 📝 Adding Data via VS Code

You can directly edit the SQLite database:

1. Install "SQLite Viewer" or "SQLite" extension in VS Code
2. Navigate to `backend/database/naviq.db`
3. Double-click to open and view/edit tables
4. Changes are reflected immediately in the app

Or use the REST API with tools like Postman or curl:

```bash
# Add a new role
curl -X POST http://localhost:5000/api/roles \
  -H "Content-Type: application/json" \
  -d '{"name": "Full Stack Developer", "description": "Build complete applications", "icon": "🚀", "color": "#3B82F6"}'

# Add an interview question
curl -X POST http://localhost:5000/api/interview \
  -H "Content-Type: application/json" \
  -d '{"role_id": 1, "question": "What is your experience with...", "difficulty": "Intermediate", "focus": "Experience"}'
```

## 📄 License

MIT License - feel free to use this project for learning and personal projects!

---

Made with ❤️ for career navigators everywhere
  ```bash
  pip install -r backend/requirements.txt
  ```
- Run the Flask application as a package so imports remain consistent:
  ```bash
  python -m backend.app
  ```
- The backend server will start on `http://127.0.0.1:5000`.

### 2. Frontend Setup

- Open the `frontend/index.html` file directly in your web browser.
- The Naviq interface will call the local backend via `fetch()` and render interview decks plus roadmaps.

## How to Run with Docker (Backend Only)

This will containerize the backend service. The frontend can still be run by opening `index.html` in the browser.

### 1. Build the Docker Image

- Make sure you have Docker installed and running.
- From the root of the project (`smart-career-platform/`), run:
  ```bash
  docker build -t smart-career-backend -f docker/Dockerfile .
  ```

### 2. Run the Docker Container

- Run the container, mapping port 5000 on your host to port 5000 in the container:
  ```bash
  docker run -p 5000:5000 smart-career-backend
  ```
- The backend will be accessible at `http://localhost:5000`.
=======

