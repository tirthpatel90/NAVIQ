#!/bin/bash

# NAVIQ - Complete Project Runner
# This script starts both backend and frontend

echo "🚀 Starting NAVIQ..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down NAVIQ...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python3 is required but not installed. Please install Python 3.8+"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed. Please install Node.js 18+"
    exit 1
fi

# Initialize and seed the database
echo -e "${BLUE}📦 Initializing database...${NC}"
cd "$SCRIPT_DIR/backend"
python3 -c "from database.db_setup import init_database; init_database()"
python3 database/seed_data.py 2>/dev/null || echo "Database already seeded or seed skipped"
echo ""

# Install backend dependencies if needed
echo -e "${BLUE}📦 Checking backend dependencies...${NC}"
pip3 install -q flask flask-cors 2>/dev/null
echo ""

# Start the backend
echo -e "${GREEN}🐍 Starting Flask backend on http://localhost:5000${NC}"
cd "$SCRIPT_DIR/backend"
python3 app.py &
BACKEND_PID=$!
sleep 2

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "Failed to start backend. Please check for errors."
    exit 1
fi

# Install frontend dependencies if needed
echo ""
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
cd "$SCRIPT_DIR/frontend-react"
if [ ! -d "node_modules" ]; then
    npm install
fi
echo ""

# Start the frontend
echo -e "${GREEN}⚛️  Starting React frontend on http://localhost:3000${NC}"
npm run dev &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}✅ NAVIQ is running!${NC}"
echo ""
echo "  Backend:  http://localhost:5000"
echo "  Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for processes
wait
