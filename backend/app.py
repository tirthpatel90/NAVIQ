import os
import sys

if __package__ is None or __package__ == "":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(current_dir)
    if parent_dir not in sys.path:
        sys.path.insert(0, parent_dir)

from flask import Flask, jsonify, request
from flask_cors import CORS
from backend.services.interview_service import InterviewService
from backend.services.roadmap_service import RoadmapService
from backend.repository.file_repo import FileRepository

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all routes, allowing frontend to fetch data
CORS(app)

# Initialize repository and services
# This is where dependency injection would be useful in a larger app
repository = FileRepository()
interview_service = InterviewService(repository)
roadmap_service = RoadmapService(repository)

@app.route('/interview', methods=['GET'])
def get_interview_questions():
    """
    API endpoint to get interview questions for a specific role.
    Expects a 'role' query parameter.
    e.g., /interview?role=Python%20Developer
    """
    role = request.args.get('role')
    if not role:
        return jsonify({"error": "Role parameter is required"}), 400

    questions = interview_service.get_questions_for_role(role)

    if questions is None:
        return jsonify({"error": "Role not found"}), 404
    
    return jsonify(questions)

@app.route('/roadmap', methods=['GET'])
def get_roadmap():
    """
    API endpoint to generate a learning roadmap.
    Expects 'goal' and 'days' query parameters.
    e.g., /roadmap?goal=Python%20Developer&days=30
    """
    goal = request.args.get('goal')
    days_str = request.args.get('days')

    if not goal or not days_str:
        return jsonify({"error": "Goal and days parameters are required"}), 400

    try:
        days = int(days_str)
        if days not in [30, 60, 90]:
            raise ValueError
    except ValueError:
        return jsonify({"error": "Days must be 30, 60, or 90"}), 400

    roadmap = roadmap_service.generate_roadmap(goal, days)

    if roadmap is None:
        return jsonify({"error": "Goal not found"}), 404

    return jsonify(roadmap)

# This allows the script to be run directly for development
if __name__ == '__main__':
    # Runs the app on localhost, port 5000
    app.run(debug=True, port=5000)
