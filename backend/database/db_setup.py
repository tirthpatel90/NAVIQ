"""
SQLite Database Setup for NAVIQ
This module handles database initialization and schema creation.
"""

import sqlite3
import os
from pathlib import Path

# Database file path
DB_DIR = Path(__file__).parent
DB_PATH = DB_DIR / "naviq.db"


def get_connection():
    """Get a database connection with row factory for dict-like access."""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_database():
    """Initialize the database with all required tables."""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Create roles table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            icon TEXT DEFAULT 'code',
            color TEXT DEFAULT '#7f9a7d',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create interview_questions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS interview_questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role_id INTEGER NOT NULL,
            question TEXT NOT NULL,
            focus TEXT,
            difficulty TEXT CHECK(difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
            answer TEXT,
            follow_up TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
        )
    ''')
    
    # Create roadmaps table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS roadmaps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role_id INTEGER NOT NULL,
            overview TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
        )
    ''')
    
    # Create milestones table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS milestones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            roadmap_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            details TEXT,
            order_index INTEGER DEFAULT 0,
            duration_days INTEGER DEFAULT 7,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE
        )
    ''')
    
    # Create milestone_outcomes table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS milestone_outcomes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            milestone_id INTEGER NOT NULL,
            outcome TEXT NOT NULL,
            FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE CASCADE
        )
    ''')
    
    # Create milestone_resources table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS milestone_resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            milestone_id INTEGER NOT NULL,
            resource TEXT NOT NULL,
            resource_url TEXT,
            FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE CASCADE
        )
    ''')
    
    # Create study_topics table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS study_topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            summary TEXT,
            subhead TEXT,
            icon TEXT DEFAULT 'book',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create study_resources table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS study_resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic_id INTEGER NOT NULL,
            type TEXT,
            title TEXT NOT NULL,
            detail TEXT,
            url TEXT,
            FOREIGN KEY (topic_id) REFERENCES study_topics(id) ON DELETE CASCADE
        )
    ''')
    
    # Create career_insights table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS career_insights (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT CHECK(category IN ('readiness', 'velocity', 'market')),
            label TEXT NOT NULL,
            value TEXT,
            meta TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f"Database initialized at: {DB_PATH}")


if __name__ == "__main__":
    init_database()
