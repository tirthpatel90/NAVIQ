
# NAVIQ — Smart Career Preparation Platform

Naviq is a full-stack web application that helps technologists, designers, and product leaders rehearse realistic interviews and generate detailed 30/60/90-day learning roadmaps.

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Python (Flask)
- **Data Storage**: JSON files

## Project Structure

```
smart-career-platform/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── backend/
│   ├── app.py
│   ├── services/
│   │   ├── interview_service.py
│   │   └── roadmap_service.py
│   ├── repository/
│   │   └── file_repo.py
│   └── data/
│       ├── interview_questions.json
│       └── roadmap_topics.json
│
├── docker/
│   └── Dockerfile
│
└── README.md
```

## Features

1. **Interview Studio** — Curated multi-discipline interview decks (engineering, security, product, UX) that include intent, difficulty, and follow-up prompts.
2. **Roadmap Generator** — A milestone-rich planner that outputs weekly action plans, outcomes, and resources for 30 / 60 / 90 day schedules.
3. **Repository + Services Architecture** — Clean separation so JSON storage can later be swapped for cloud databases without touching business logic.

## How to Run Locally

### 1. Backend Setup

- (Optional) Create and activate a virtual environment.
- Install the required Python packages using the provided requirements file:
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

