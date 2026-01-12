"""
NAVIQ Backend API
Flask application with SQLite database integration.
"""

import os
import sys

# Fix imports for running directly
if __package__ is None or __package__ == "":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(current_dir)
    if parent_dir not in sys.path:
        sys.path.insert(0, parent_dir)
    if current_dir not in sys.path:
        sys.path.insert(0, current_dir)

from flask import Flask, jsonify, request
from flask_cors import CORS
from repository.db_repo import db_repository
from database.db_setup import init_database

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize database on startup
init_database()


# ============== HEALTH CHECK ==============

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "message": "NAVIQ API is running"})


# ============== ROLES API ==============

@app.route('/api/roles', methods=['GET'])
def get_roles():
    """Get all available roles."""
    roles = db_repository.get_all_roles()
    return jsonify(roles)


@app.route('/api/roles/<int:role_id>', methods=['GET'])
def get_role(role_id):
    """Get a specific role by ID."""
    role = db_repository.get_role_by_id(role_id)
    if not role:
        return jsonify({"error": "Role not found"}), 404
    return jsonify(role)


@app.route('/api/roles', methods=['POST'])
def create_role():
    """Create a new role."""
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({"error": "Name is required"}), 400
    
    role_id = db_repository.add_role(
        name=data['name'],
        description=data.get('description', ''),
        icon=data.get('icon', 'code'),
        color=data.get('color', '#7f9a7d')
    )
    return jsonify({"id": role_id, "message": "Role created successfully"}), 201


@app.route('/api/roles/<int:role_id>', methods=['PUT'])
def update_role(role_id):
    """Update a role."""
    data = request.get_json()
    success = db_repository.update_role(
        role_id=role_id,
        name=data.get('name'),
        description=data.get('description'),
        icon=data.get('icon'),
        color=data.get('color')
    )
    if not success:
        return jsonify({"error": "Role not found or no changes made"}), 404
    return jsonify({"message": "Role updated successfully"})


@app.route('/api/roles/<int:role_id>', methods=['DELETE'])
def delete_role(role_id):
    """Delete a role and all related data."""
    success = db_repository.delete_role(role_id)
    if not success:
        return jsonify({"error": "Role not found"}), 404
    return jsonify({"message": "Role deleted successfully"})


# ============== INTERVIEW QUESTIONS API ==============

@app.route('/api/interview', methods=['GET'])
def get_interview_questions():
    """Get interview questions for a specific role."""
    role = request.args.get('role')
    if not role:
        return jsonify({"error": "Role parameter is required"}), 400
    
    questions = db_repository.get_questions_for_role(role)
    if not questions:
        # Return empty array if no questions found (not an error)
        return jsonify([])
    
    # Format response to match frontend expectations
    formatted = []
    for q in questions:
        formatted.append({
            "id": q['id'],
            "question": q['question'],
            "focus": q['focus'],
            "difficulty": q['difficulty'],
            "answer": q['answer'],
            "followUp": q['follow_up']
        })
    
    return jsonify(formatted)


@app.route('/api/interview/role/<int:role_id>', methods=['GET'])
def get_questions_by_role_id(role_id):
    """Get interview questions by role ID."""
    questions = db_repository.get_questions_by_role_id(role_id)
    return jsonify(questions)


@app.route('/api/interview', methods=['POST'])
def create_question():
    """Create a new interview question."""
    data = request.get_json()
    
    if not data or 'role_id' not in data or 'question' not in data:
        return jsonify({"error": "role_id and question are required"}), 400
    
    question_id = db_repository.add_question(
        role_id=data['role_id'],
        question=data['question'],
        focus=data.get('focus', ''),
        difficulty=data.get('difficulty', 'Intermediate'),
        answer=data.get('answer', ''),
        follow_up=data.get('follow_up', '')
    )
    return jsonify({"id": question_id, "message": "Question created successfully"}), 201


@app.route('/api/interview/<int:question_id>', methods=['PUT'])
def update_question(question_id):
    """Update an interview question."""
    data = request.get_json()
    success = db_repository.update_question(question_id, **data)
    if not success:
        return jsonify({"error": "Question not found or no changes made"}), 404
    return jsonify({"message": "Question updated successfully"})


@app.route('/api/interview/<int:question_id>', methods=['DELETE'])
def delete_question(question_id):
    """Delete an interview question."""
    success = db_repository.delete_question(question_id)
    if not success:
        return jsonify({"error": "Question not found"}), 404
    return jsonify({"message": "Question deleted successfully"})


# ============== ROADMAP API ==============

@app.route('/api/roadmap', methods=['GET'])
def get_roadmap():
    """Get roadmap for a specific goal/role."""
    goal = request.args.get('goal')
    days_str = request.args.get('days', '30')
    
    if not goal:
        return jsonify({"error": "Goal parameter is required"}), 400
    
    try:
        days = int(days_str)
    except ValueError:
        days = 30
    
    roadmap = db_repository.get_roadmap_for_role(goal)
    
    if not roadmap:
        return jsonify({"error": "Roadmap not found for this goal"}), 404
    
    # Calculate steps based on duration
    milestones = roadmap.get('milestones', [])
    total_milestones = len(milestones)
    
    if total_milestones == 0:
        return jsonify({
            "goal": goal,
            "days": days,
            "overview": roadmap.get('overview', ''),
            "milestones": []
        })
    
    # Distribute days across milestones
    days_per_milestone = days // total_milestones
    
    formatted_milestones = []
    current_day = 1
    
    for milestone in milestones:
        end_day = min(current_day + days_per_milestone - 1, days)
        formatted_milestones.append({
            "title": milestone['title'],
            "details": milestone['details'],
            "outcomes": milestone.get('outcomes', []),
            "resources": milestone.get('resources', []),
            "startDay": current_day,
            "endDay": end_day,
            "duration": f"Days {current_day}-{end_day}"
        })
        current_day = end_day + 1
    
    return jsonify({
        "goal": goal,
        "days": days,
        "overview": roadmap.get('overview', ''),
        "milestones": formatted_milestones
    })


@app.route('/api/roadmap/goals', methods=['GET'])
def get_roadmap_goals():
    """Get all available roadmap goals (roles with roadmaps)."""
    roles = db_repository.get_all_roles()
    goals = []
    for role in roles:
        roadmap = db_repository.get_roadmap_for_role(role['name'])
        if roadmap:
            goals.append({
                "name": role['name'],
                "icon": role['icon'],
                "color": role['color'],
                "overview": roadmap.get('overview', '')
            })
    return jsonify(goals)


# ============== STUDY TOPICS API ==============

@app.route('/api/study', methods=['GET'])
def get_study_topics():
    """Get all study topics with resources."""
    topics = db_repository.get_all_study_topics()
    return jsonify(topics)


@app.route('/api/study', methods=['POST'])
def create_study_topic():
    """Create a new study topic."""
    data = request.get_json()
    
    if not data or 'title' not in data:
        return jsonify({"error": "Title is required"}), 400
    
    topic_id = db_repository.add_study_topic(
        title=data['title'],
        summary=data.get('summary', ''),
        subhead=data.get('subhead', ''),
        icon=data.get('icon', 'book')
    )
    
    # Add resources if provided
    for resource in data.get('resources', []):
        db_repository.add_study_resource(
            topic_id=topic_id,
            title=resource.get('title', ''),
            type_=resource.get('type', 'Docs'),
            detail=resource.get('detail', ''),
            url=resource.get('url', '')
        )
    
    return jsonify({"id": topic_id, "message": "Study topic created successfully"}), 201


# ============== CAREER INSIGHTS API ==============

@app.route('/api/insights', methods=['GET'])
def get_career_insights():
    """Get career insights, optionally filtered by category."""
    category = request.args.get('category')
    insights = db_repository.get_career_insights(category)
    
    # Group by category for frontend
    if not category:
        grouped = {"readiness": [], "velocity": [], "market": []}
        for insight in insights:
            cat = insight.get('category', 'readiness')
            if cat in grouped:
                grouped[cat].append({
                    "id": insight['id'],
                    "label": insight['label'],
                    "value": insight['value'],
                    "meta": insight['meta']
                })
        return jsonify(grouped)
    
    return jsonify(insights)


@app.route('/api/insights', methods=['POST'])
def create_career_insight():
    """Create a new career insight."""
    data = request.get_json()
    
    if not data or 'category' not in data or 'label' not in data:
        return jsonify({"error": "Category and label are required"}), 400
    
    insight_id = db_repository.add_career_insight(
        category=data['category'],
        label=data['label'],
        value=data.get('value', ''),
        meta=data.get('meta', '')
    )
    return jsonify({"id": insight_id, "message": "Insight created successfully"}), 201


@app.route('/api/insights/<int:insight_id>', methods=['PUT'])
def update_career_insight(insight_id):
    """Update a career insight."""
    data = request.get_json()
    success = db_repository.update_career_insight(insight_id, **data)
    if not success:
        return jsonify({"error": "Insight not found or no changes made"}), 404
    return jsonify({"message": "Insight updated successfully"})


@app.route('/api/insights/<int:insight_id>', methods=['DELETE'])
def delete_career_insight(insight_id):
    """Delete a career insight."""
    success = db_repository.delete_career_insight(insight_id)
    if not success:
        return jsonify({"error": "Insight not found"}), 404
    return jsonify({"message": "Insight deleted successfully"})


# ============== LEGACY ENDPOINTS (for backward compatibility) ==============

@app.route('/interview', methods=['GET'])
def legacy_interview():
    """Legacy interview endpoint."""
    return get_interview_questions()


@app.route('/roadmap', methods=['GET'])
def legacy_roadmap():
    """Legacy roadmap endpoint."""
    return get_roadmap()


# Run the application
if __name__ == '__main__':
    # Seed database with initial data
    try:
        import subprocess
        seed_script = os.path.join(os.path.dirname(__file__), 'database', 'seed_data.py')
        subprocess.run([sys.executable, seed_script], check=True)
    except Exception as e:
        print(f"Note: Could not run seed script: {e}")
    
    app.run(debug=True, port=5000, host='0.0.0.0')
