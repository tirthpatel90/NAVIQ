"""
Database Repository for NAVIQ
Handles all database operations for the application.
"""

import sqlite3
from typing import List, Dict, Optional, Any
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db_setup import get_connection


class DatabaseRepository:
    """Repository class for database operations."""
    
    # ============== ROLES ==============
    
    def get_all_roles(self) -> List[Dict]:
        """Get all roles from the database."""
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM roles ORDER BY name")
        roles = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return roles
    
    def get_role_by_name(self, name: str) -> Optional[Dict]:
        """Get a role by its name."""
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM roles WHERE name = ?", (name,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None
    
    def get_role_by_id(self, role_id: int) -> Optional[Dict]:
        """Get a role by its ID."""
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM roles WHERE id = ?", (role_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None
    
    def add_role(self, name: str, description: str = "", icon: str = "code", color: str = "#7f9a7d") -> int:
        """Add a new role."""
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO roles (name, description, icon, color)
            VALUES (?, ?, ?, ?)
        ''', (name, description, icon, color))
        role_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return role_id
    
    def update_role(self, role_id: int, name: str = None, description: str = None, 
                    icon: str = None, color: str = None) -> bool:
        """Update a role."""
        conn = get_connection()
        cursor = conn.cursor()
        
        updates = []
        values = []
        
        if name is not None:
            updates.append("name = ?")
            values.append(name)
        if description is not None:
            updates.append("description = ?")
            values.append(description)
        if icon is not None:
            updates.append("icon = ?")
            values.append(icon)
        if color is not None:
            updates.append("color = ?")
            values.append(color)
        
        if not updates:
            conn.close()
            return False
        
        values.append(role_id)
        query = f"UPDATE roles SET {', '.join(updates)} WHERE id = ?"
        cursor.execute(query, values)
        conn.commit()
        success = cursor.rowcount > 0
        conn.close()
        return success
    
    def delete_role(self, role_id: int) -> bool:
        """Delete a role and all related data."""
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM roles WHERE id = ?", (role_id,))
        conn.commit()
        success = cursor.rowcount > 0
        conn.close()
        return success
    
    # ============== INTERVIEW QUESTIONS ==============
    
    def get_questions_for_role(self, role_name: str) -> List[Dict]:
        """Get all interview questions for a specific role."""
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT iq.* FROM interview_questions iq
            JOIN roles r ON iq.role_id = r.id
            WHERE r.name = ?
            ORDER BY iq.difficulty, iq.focus
        ''', (role_name,))
        questions = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return questions
    
    def get_questions_by_role_id(self, role_id: int) -> List[Dict]:
        """Get all interview questions for a role by ID."""
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT * FROM interview_questions
            WHERE role_id = ?
            ORDER BY difficulty, focus
        ''', (role_id,))
        questions = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return questions
    
    def add_question(self, role_id: int, question: str, focus: str = "", 
                     difficulty: str = "Intermediate", answer: str = "", follow_up: str = "") -> int:
        """Add a new interview question."""
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO interview_questions (role_id, question, focus, difficulty, answer, follow_up)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (role_id, question, focus, difficulty, answer, follow_up))
        question_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return question_id
    
    def update_question(self, question_id: int, **kwargs) -> bool:
        """Update an interview question."""
        conn = get_connection()
        cursor = conn.cursor()
        
        allowed_fields = ['question', 'focus', 'difficulty', 'answer', 'follow_up']
        updates = []
        values = []
        
        for field in allowed_fields:
            if field in kwargs and kwargs[field] is not None:
                updates.append(f"{field} = ?")
                values.append(kwargs[field])
        
        if not updates:
            conn.close()
            return False
        
        values.append(question_id)
        query = f"UPDATE interview_questions SET {', '.join(updates)} WHERE id = ?"
        cursor.execute(query, values)
        conn.commit()
        success = cursor.rowcount > 0
        conn.close()
        return success
    
    def delete_question(self, question_id: int) -> bool:
        """Delete an interview question."""
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM interview_questions WHERE id = ?", (question_id,))
        conn.commit()
        success = cursor.rowcount > 0
        conn.close()
        return success
    
    # ============== ROADMAPS ==============
    
    def get_roadmap_for_role(self, role_name: str) -> Optional[Dict]:
        """Get roadmap with milestones for a role."""
        conn = get_connection()
        cursor = conn.cursor()
        
        # Get roadmap
        cursor.execute('''
            SELECT rm.*, r.name as role_name FROM roadmaps rm
            JOIN roles r ON rm.role_id = r.id
            WHERE r.name = ?
        ''', (role_name,))
        roadmap_row = cursor.fetchone()
        
        if not roadmap_row:
            conn.close()
            return None
        
        roadmap = dict(roadmap_row)
        roadmap_id = roadmap['id']
        
        # Get milestones
        cursor.execute('''
            SELECT * FROM milestones
            WHERE roadmap_id = ?
            ORDER BY order_index
        ''', (roadmap_id,))
        milestones = []
        
        for m_row in cursor.fetchall():
            milestone = dict(m_row)
            milestone_id = milestone['id']
            
            # Get outcomes
            cursor.execute('''
                SELECT outcome FROM milestone_outcomes
                WHERE milestone_id = ?
            ''', (milestone_id,))
            milestone['outcomes'] = [row['outcome'] for row in cursor.fetchall()]
            
            # Get resources
            cursor.execute('''
                SELECT resource, resource_url FROM milestone_resources
                WHERE milestone_id = ?
            ''', (milestone_id,))
            milestone['resources'] = [row['resource'] for row in cursor.fetchall()]
            
            milestones.append(milestone)
        
        roadmap['milestones'] = milestones
        conn.close()
        return roadmap
    
    def add_roadmap(self, role_id: int, overview: str = "") -> int:
        """Add a new roadmap."""
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO roadmaps (role_id, overview)
            VALUES (?, ?)
        ''', (role_id, overview))
        roadmap_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return roadmap_id
    
    def add_milestone(self, roadmap_id: int, title: str, details: str = "", 
                      order_index: int = 0, outcomes: List[str] = None, 
                      resources: List[str] = None) -> int:
        """Add a milestone to a roadmap."""
        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO milestones (roadmap_id, title, details, order_index)
            VALUES (?, ?, ?, ?)
        ''', (roadmap_id, title, details, order_index))
        milestone_id = cursor.lastrowid
        
        if outcomes:
            for outcome in outcomes:
                cursor.execute('''
                    INSERT INTO milestone_outcomes (milestone_id, outcome)
                    VALUES (?, ?)
                ''', (milestone_id, outcome))
        
        if resources:
            for resource in resources:
                cursor.execute('''
                    INSERT INTO milestone_resources (milestone_id, resource)
                    VALUES (?, ?)
                ''', (milestone_id, resource))
        
        conn.commit()
        conn.close()
        return milestone_id
    
    # ============== STUDY TOPICS ==============
    
    def get_all_study_topics(self) -> List[Dict]:
        """Get all study topics with their resources."""
        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM study_topics ORDER BY title")
        topics = []
        
        for t_row in cursor.fetchall():
            topic = dict(t_row)
            topic_id = topic['id']
            
            cursor.execute('''
                SELECT type, title, detail, url FROM study_resources
                WHERE topic_id = ?
            ''', (topic_id,))
            topic['resources'] = [dict(row) for row in cursor.fetchall()]
            topics.append(topic)
        
        conn.close()
        return topics
    
    def add_study_topic(self, title: str, summary: str = "", subhead: str = "", 
                        icon: str = "book") -> int:
        """Add a new study topic."""
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO study_topics (title, summary, subhead, icon)
            VALUES (?, ?, ?, ?)
        ''', (title, summary, subhead, icon))
        topic_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return topic_id
    
    def add_study_resource(self, topic_id: int, title: str, type_: str = "Docs", 
                           detail: str = "", url: str = "") -> int:
        """Add a resource to a study topic."""
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO study_resources (topic_id, type, title, detail, url)
            VALUES (?, ?, ?, ?, ?)
        ''', (topic_id, type_, title, detail, url))
        resource_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return resource_id
    
    # ============== CAREER INSIGHTS ==============
    
    def get_career_insights(self, category: str = None) -> List[Dict]:
        """Get career insights, optionally filtered by category."""
        conn = get_connection()
        cursor = conn.cursor()
        
        if category:
            cursor.execute('''
                SELECT * FROM career_insights WHERE category = ?
            ''', (category,))
        else:
            cursor.execute("SELECT * FROM career_insights")
        
        insights = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return insights
    
    def add_career_insight(self, category: str, label: str, value: str, meta: str = "") -> int:
        """Add a career insight."""
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO career_insights (category, label, value, meta)
            VALUES (?, ?, ?, ?)
        ''', (category, label, value, meta))
        insight_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return insight_id
    
    def update_career_insight(self, insight_id: int, **kwargs) -> bool:
        """Update a career insight."""
        conn = get_connection()
        cursor = conn.cursor()
        
        allowed_fields = ['category', 'label', 'value', 'meta']
        updates = []
        values = []
        
        for field in allowed_fields:
            if field in kwargs and kwargs[field] is not None:
                updates.append(f"{field} = ?")
                values.append(kwargs[field])
        
        if not updates:
            conn.close()
            return False
        
        values.append(insight_id)
        query = f"UPDATE career_insights SET {', '.join(updates)} WHERE id = ?"
        cursor.execute(query, values)
        conn.commit()
        success = cursor.rowcount > 0
        conn.close()
        return success
    
    def delete_career_insight(self, insight_id: int) -> bool:
        """Delete a career insight."""
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM career_insights WHERE id = ?", (insight_id,))
        conn.commit()
        success = cursor.rowcount > 0
        conn.close()
        return success


# Create a singleton instance
db_repository = DatabaseRepository()
