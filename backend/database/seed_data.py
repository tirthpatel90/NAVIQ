"""
Seed data for NAVIQ database.
Run this script to populate the database with initial data.
"""

import sqlite3
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db_setup import get_connection, init_database

# Sample data for roles
ROLES = [
    {"name": "Python Developer", "description": "Master end-to-end Python engineering", "icon": "🐍", "color": "#306998"},
    {"name": "Web Developer", "description": "Design delightful, accessible web experiences", "icon": "🌐", "color": "#61DAFB"},
    {"name": "Data Scientist", "description": "Blend analytics with ML practices", "icon": "📊", "color": "#FF6B6B"},
    {"name": "DevOps Engineer", "description": "Build and maintain infrastructure", "icon": "⚙️", "color": "#FF9500"},
    {"name": "Cybersecurity Analyst", "description": "Protect systems and data", "icon": "🔐", "color": "#E74C3C"},
    {"name": "Mobile Developer", "description": "Create native and cross-platform apps", "icon": "📱", "color": "#3DDC84"},
    {"name": "Cloud Architect", "description": "Design scalable cloud solutions", "icon": "☁️", "color": "#00BCF2"},
    {"name": "AI/ML Engineer", "description": "Build intelligent systems", "icon": "🤖", "color": "#9B59B6"},
    {"name": "Product Manager", "description": "Drive product strategy and delivery", "icon": "🎯", "color": "#F1C40F"},
    {"name": "UX Designer", "description": "Craft user-centered experiences", "icon": "🎨", "color": "#E91E63"},
]

# Sample interview questions
INTERVIEW_QUESTIONS = {
    "Python Developer": [
        {
            "question": "Explain how Python's GIL affects CPU-bound threads and how you mitigate it.",
            "focus": "Runtime Internals",
            "difficulty": "Advanced",
            "answer": "The GIL allows only one bytecode instruction to execute at a time, so CPU-bound threads end up time-slicing and rarely scale. For parallel CPU work we move to multiprocessing, native extensions, or distribute work through Celery or Ray.",
            "follow_up": "Walk me through a workload where you still prefer threads over processes despite the GIL."
        },
        {
            "question": "Differentiate __new__ and __init__ and share a real example that needs both.",
            "focus": "Data Model",
            "difficulty": "Intermediate",
            "answer": "__new__ allocates and returns the instance, while __init__ configures it. Immutable subclasses (like extending tuple or str) often override __new__ to inject extra data while leaving __init__ minimal.",
            "follow_up": "How would you ensure subclasses cannot bypass your custom instantiation flow?"
        },
        {
            "question": "Compare asyncio, threading, and multiprocessing for IO heavy APIs.",
            "focus": "Concurrency",
            "difficulty": "Intermediate",
            "answer": "Asyncio keeps work on one thread with cooperative scheduling so it's great for tens of thousands of sockets. Threading is simpler for blocking SDKs. Multiprocessing isolates the interpreter for CPU-bound work but has higher IPC overhead.",
            "follow_up": "Describe when you would blend asyncio with worker pools in the same service."
        },
        {
            "question": "How do you structure a Python package so it stays deployable across environments?",
            "focus": "Packaging",
            "difficulty": "Advanced",
            "answer": "Use a src layout, pyproject metadata, dependency groups, and avoid environment-specific paths. Provide CLI entry points, health checks, and a contract for configuration so the artifact can move between bare metal, Docker, or serverless.",
            "follow_up": "What checks belong in CI to guard that packaging contract?"
        }
    ],
    "Web Developer": [
        {
            "question": "When would you stream HTML over HTTP/2 instead of returning JSON+SPA?",
            "focus": "Architecture",
            "difficulty": "Advanced",
            "answer": "Streaming HTML (or islands hydration) reduces input latency for content-heavy apps, keeps accessibility predictable, and lets you progressively enhance. I still send JSON for highly interactive dashboards where client state dominates.",
            "follow_up": "How would you monitor the back pressure of a streamed response?"
        },
        {
            "question": "Explain the difference between CSS logical properties and physical properties.",
            "focus": "Styling Systems",
            "difficulty": "Intermediate",
            "answer": "Logical properties (like margin-inline-start) adapt automatically to writing modes and direction, while physical ones (margin-left) assume LTR layout. Logical props are essential for localization and vertical scripts.",
            "follow_up": "Which legacy browsers still need fallbacks and how do you ship them?"
        },
        {
            "question": "What is the difference between service workers and Web Workers?",
            "focus": "Web Platform APIs",
            "difficulty": "Intermediate",
            "answer": "Service workers act as programmable network proxies with lifecycle events and survive page refreshes. Web Workers are in-page compute threads without network interception powers. I pair them by caching assets in the SW and pushing CPU heavy transforms into dedicated workers.",
            "follow_up": "Describe how you would debug synchronization bugs between them."
        }
    ],
    "Data Scientist": [
        {
            "question": "How do you detect data leakage in a feature pipeline?",
            "focus": "Model Validity",
            "difficulty": "Advanced",
            "answer": "Leakage happens when training features contain information unavailable at scoring time. I version feature views, freeze train/eval windows, and run permutation tests on suspicious features to see if they unrealistically boost metrics.",
            "follow_up": "Share a real bug where leakage slipped into production and how you caught it."
        },
        {
            "question": "Walk through evaluating a model beyond ROC-AUC for imbalanced fraud data.",
            "focus": "Evaluation",
            "difficulty": "Intermediate",
            "answer": "I inspect precision-recall curves, cost-weighted confusion matrices, and business-aware metrics like dollars recovered within analyst capacity.",
            "follow_up": "How would you justify a lower recall model that still saves more money?"
        }
    ],
    "DevOps Engineer": [
        {
            "question": "How do you design a progressive delivery strategy for a monolith moving to microservices?",
            "focus": "Deployment",
            "difficulty": "Advanced",
            "answer": "I introduce canary stages behind feature flags, move critical flows first, and add contract tests between decomposed services.",
            "follow_up": "Which metrics gate your promotion between progressive stages?"
        },
        {
            "question": "What is the golden signal approach to SRE and how do you tune alerts?",
            "focus": "Observability",
            "difficulty": "Intermediate",
            "answer": "Latency, traffic, errors, and saturation provide a balanced first layer. I pair them with service-level objectives so alerts trigger on error budgets.",
            "follow_up": "Walk through a time you deleted alerts to improve reliability."
        }
    ],
    "Cybersecurity Analyst": [
        {
            "question": "Outline how you'd respond to a zero-day exploit in a managed SaaS product.",
            "focus": "Incident Response",
            "difficulty": "Advanced",
            "answer": "Activate the IR plan, contain exposure by isolating affected services, validate compensating controls, and coordinate disclosure timelines with legal.",
            "follow_up": "How do you rehearse for this scenario ahead of time?"
        }
    ],
    "Mobile Developer": [
        {
            "question": "Compare SwiftUI with UIKit for long-lived apps.",
            "focus": "UI Architecture",
            "difficulty": "Intermediate",
            "answer": "Declarative stacks accelerate feature work and accessibility, but you still bridge into imperative APIs for edge cases.",
            "follow_up": "What metrics tell you the migration is worth the effort?"
        }
    ],
    "Cloud Architect": [
        {
            "question": "Design a multi-region active-active architecture for a stateful service.",
            "focus": "Distributed Systems",
            "difficulty": "Advanced",
            "answer": "Partition traffic with latency-based routing, replicate state through quorum databases or event streams, and define clear failure domains.",
            "follow_up": "How would you budget RPO/RTO targets per workload tier?"
        }
    ],
    "AI/ML Engineer": [
        {
            "question": "What is the difference between fine-tuning, adapters, and prompt engineering for LLMs?",
            "focus": "LLM Operations",
            "difficulty": "Advanced",
            "answer": "Prompting changes inputs only, adapters add lightweight trainable layers, and full fine-tuning updates every weight.",
            "follow_up": "Describe how you would monitor degradation after a fine-tune."
        }
    ],
    "Product Manager": [
        {
            "question": "How do you prioritize a roadmap when finance, sales, and UX have conflicting goals?",
            "focus": "Strategy",
            "difficulty": "Intermediate",
            "answer": "I anchor every debate to measurable outcomes, translate stakeholder requests into customer problems, and run scenarios to show trade-offs.",
            "follow_up": "Give an example where you deliberately chose the lower ROI item."
        }
    ],
    "UX Designer": [
        {
            "question": "How do you balance experimentation speed with accessibility compliance?",
            "focus": "Design Ops",
            "difficulty": "Intermediate",
            "answer": "We prototype fast but bake accessible primitives into the design system.",
            "follow_up": "When have you argued against shipping due to accessibility debt?"
        }
    ]
}

# Sample roadmaps
ROADMAPS = {
    "Python Developer": {
        "overview": "Master end-to-end Python engineering, from computer science depth to deployment-ready services.",
        "milestones": [
            {
                "title": "Computer Science Foundations",
                "details": "Refresh data structures, algorithms, and complexity trade-offs using Python for implementation drills.",
                "outcomes": ["Explain the runtime costs of lists, dicts, heaps, and graphs", "Implement recursion-to-iteration refactors without performance loss"],
                "resources": ["MIT OpenCourseWare 6.006", "Grokking Algorithms"]
            },
            {
                "title": "Idiomatic Python",
                "details": "Deep dive into the data model, context managers, and iterator/generator patterns.",
                "outcomes": ["Use descriptors, dataclasses, and protocols intentionally", "Author context managers with proper error handling"],
                "resources": ["Fluent Python", "Talk Python's Effective Py course"]
            },
            {
                "title": "Data Structures in Practice",
                "details": "Build reusable libraries for trees, graphs, and streaming analytics workloads.",
                "outcomes": ["Design custom containers with __slots__ and memory profiling", "Benchmark pure Python vs C-accelerated options"],
                "resources": ["pytest-benchmark docs", "CPython internals guide"]
            },
            {
                "title": "Object Modeling and APIs",
                "details": "Model business domains using clean boundaries, dataclasses, and pydantic style validation.",
                "outcomes": ["Translate messy requirements into cohesive class hierarchies", "Guarantee invariants through validators and type hints"],
                "resources": ["Cosmic Python", "Typing documentation"]
            },
            {
                "title": "Testing Excellence",
                "details": "Level up pytest skills, property tests, and contract tests for services.",
                "outcomes": ["Use fixtures and parametrization to shrink duplication", "Adopt property-based testing for critical algorithms"],
                "resources": ["pytest docs", "Hypothesis strategies guide"]
            },
            {
                "title": "Async and Concurrency",
                "details": "Blend asyncio, multiprocessing, and threading depending on workload types.",
                "outcomes": ["Instrument event loops for back-pressure insights", "Build resilient worker pools with graceful shutdown"],
                "resources": ["Asyncio official tutorial", "Ray.io patterns"]
            },
            {
                "title": "Web Framework Mastery",
                "details": "Construct APIs with Flask, FastAPI, or Django using layered architecture.",
                "outcomes": ["Isolate services and repositories for swap-friendly storage", "Ship OpenAPI docs with automated tests"],
                "resources": ["FastAPI docs", "Django for APIs"]
            },
            {
                "title": "Observability & DevOps",
                "details": "Instrument metrics, tracing, and logs; set up CI/CD for Python apps.",
                "outcomes": ["Export OpenTelemetry signals", "Harden pipelines with linting, tests, and security scans"],
                "resources": ["OpenTelemetry Python", "GitHub Actions hardening guide"]
            }
        ]
    },
    "Web Developer": {
        "overview": "Design delightful, accessible experiences across the full web stack with performance in mind.",
        "milestones": [
            {
                "title": "Modern HTML Semantics",
                "details": "Revisit semantic tags, document outlines, and ARIA roles for rich applications.",
                "outcomes": ["Structure content so screen readers announce context clearly", "Plan for localization-ready markup"],
                "resources": ["MDN HTML guides", "WebAIM tutorials"]
            },
            {
                "title": "CSS Architecture",
                "details": "Practice fluid layouts, container queries, and design token pipelines.",
                "outcomes": ["Ship responsive layouts without breakpoint bloat", "Leverage logical properties to support RTL"],
                "resources": ["Every Layout", "Modern CSS Solutions"]
            },
            {
                "title": "JavaScript Systems",
                "details": "Strengthen knowledge of modules, async patterns, and browser APIs.",
                "outcomes": ["Detect and fix event loop blocking work", "Use Web Workers and BroadcastChannel intentionally"],
                "resources": ["You Don't Know JS Yet", "web.dev articles"]
            },
            {
                "title": "React & Modern Frameworks",
                "details": "Build component-driven UIs with state management and routing.",
                "outcomes": ["Implement efficient re-rendering strategies", "Use hooks and context effectively"],
                "resources": ["React docs", "Next.js tutorials"]
            }
        ]
    },
    "Data Scientist": {
        "overview": "Blend rigorous analytics with production-minded machine learning practices.",
        "milestones": [
            {
                "title": "Math Refresh",
                "details": "Reinforce linear algebra, probability, and statistics for model intuition.",
                "outcomes": ["Translate proofs into implementable intuition", "Explain variance, bias, and covariance structures"],
                "resources": ["Khan Academy probability", "Linear Algebra Done Right"]
            },
            {
                "title": "Data Acquisition & Cleaning",
                "details": "Practice ingesting messy datasets, handling missingness, and documenting lineage.",
                "outcomes": ["Create reproducible data build tool (dbt) models", "Version datasets with Delta or LakeFS"],
                "resources": ["dbt learn", "Great Expectations"]
            },
            {
                "title": "Machine Learning Fundamentals",
                "details": "Train linear models, tree ensembles, and neural nets with hyperparameter rigor.",
                "outcomes": ["Establish baselines before complex approaches", "Run distributed training experiments"],
                "resources": ["scikit-learn", "XGBoost cheatsheet"]
            }
        ]
    }
}

# Study topics
STUDY_TOPICS = [
    {
        "title": "Distributed Systems",
        "summary": "Design trade-offs, message guarantees, and observability rituals.",
        "subhead": "Ground yourself in CAP, PACELC, and resilient queue design.",
        "icon": "🌐",
        "resources": [
            {"type": "Docs", "title": "CAP & PACELC Primer", "detail": "Free · Why consistency vs availability still matters."},
            {"type": "Video", "title": "Designing Resilient Queues", "detail": "18 min walkthrough with mental models."},
            {"type": "Guide", "title": "Incident Postmortem Playbook", "detail": "Calm, blameless review template."}
        ]
    },
    {
        "title": "Product Discovery",
        "summary": "Customer interviews, prioritization frames, and story mapping.",
        "subhead": "Use JTBD prompts and 2x2 matrices to clarify the next tiny bet.",
        "icon": "💡",
        "resources": [
            {"type": "Canvas", "title": "North Star Narrative", "detail": "Template for linking insights to bets."},
            {"type": "Guide", "title": "JTBD Interview Kit", "detail": "Calm scripts to reduce bias."}
        ]
    },
    {
        "title": "Secure Coding",
        "summary": "Threat modeling, secure defaults, and incident drills.",
        "subhead": "Pair high-signal checklists with red-team prompts.",
        "icon": "🔒",
        "resources": [
            {"type": "Checklist", "title": "Threat Modeling Canvas", "detail": "Map attack surfaces in under 20 min."},
            {"type": "Docs", "title": "Secrets Hygiene", "detail": "Designing practical guardrails."}
        ]
    },
    {
        "title": "Data Pipelines",
        "summary": "Batch vs streaming, governance, and calm on-call notes.",
        "subhead": "Design a telemetry spine that scales without noise.",
        "icon": "📊",
        "resources": [
            {"type": "Docs", "title": "Stream vs Batch Ledger", "detail": "Decision tree for hybrid stacks."},
            {"type": "Guide", "title": "Data Contract Rituals", "detail": "Lightweight governance cadence."}
        ]
    }
]

# Career insights
CAREER_INSIGHTS = [
    {"category": "readiness", "label": "Confidence score", "value": "82%", "meta": "Up 12% since last month"},
    {"category": "readiness", "label": "Interview decks", "value": "6 complete", "meta": "Focusing on systems + leadership"},
    {"category": "readiness", "label": "Scenario versatility", "value": "High", "meta": "Balanced technical + narrative"},
    {"category": "velocity", "label": "Roadmap cadence", "value": "Week 5 / 12", "meta": "67% momentum kept"},
    {"category": "velocity", "label": "Learning streak", "value": "9 days", "meta": "Avg 42 focused min"},
    {"category": "velocity", "label": "Feedback loops", "value": "Weekly", "meta": "PM + mentor syncs"},
    {"category": "market", "label": "Top role match", "value": "Product AI Lead", "meta": "23 aligned openings"},
    {"category": "market", "label": "Location fit", "value": "Hybrid or Remote", "meta": "Bay Area, Berlin, Singapore"},
    {"category": "market", "label": "Comp window", "value": "$210k - $275k", "meta": "Based on level + scope"},
]


def seed_database():
    """Seed the database with initial data."""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check if data already exists
    cursor.execute("SELECT COUNT(*) FROM roles")
    if cursor.fetchone()[0] > 0:
        print("Database already seeded. Skipping...")
        conn.close()
        return
    
    print("Seeding database...")
    
    # Insert roles
    for role in ROLES:
        cursor.execute('''
            INSERT INTO roles (name, description, icon, color)
            VALUES (?, ?, ?, ?)
        ''', (role["name"], role["description"], role["icon"], role["color"]))
    
    conn.commit()
    
    # Get role IDs
    cursor.execute("SELECT id, name FROM roles")
    role_map = {row["name"]: row["id"] for row in cursor.fetchall()}
    
    # Insert interview questions
    for role_name, questions in INTERVIEW_QUESTIONS.items():
        role_id = role_map.get(role_name)
        if not role_id:
            continue
        for q in questions:
            cursor.execute('''
                INSERT INTO interview_questions (role_id, question, focus, difficulty, answer, follow_up)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (role_id, q["question"], q["focus"], q["difficulty"], q["answer"], q["follow_up"]))
    
    conn.commit()
    
    # Insert roadmaps
    for role_name, roadmap_data in ROADMAPS.items():
        role_id = role_map.get(role_name)
        if not role_id:
            continue
        
        cursor.execute('''
            INSERT INTO roadmaps (role_id, overview)
            VALUES (?, ?)
        ''', (role_id, roadmap_data["overview"]))
        roadmap_id = cursor.lastrowid
        
        for idx, milestone in enumerate(roadmap_data["milestones"]):
            cursor.execute('''
                INSERT INTO milestones (roadmap_id, title, details, order_index)
                VALUES (?, ?, ?, ?)
            ''', (roadmap_id, milestone["title"], milestone["details"], idx))
            milestone_id = cursor.lastrowid
            
            for outcome in milestone.get("outcomes", []):
                cursor.execute('''
                    INSERT INTO milestone_outcomes (milestone_id, outcome)
                    VALUES (?, ?)
                ''', (milestone_id, outcome))
            
            for resource in milestone.get("resources", []):
                cursor.execute('''
                    INSERT INTO milestone_resources (milestone_id, resource)
                    VALUES (?, ?)
                ''', (milestone_id, resource))
    
    conn.commit()
    
    # Insert study topics
    for topic in STUDY_TOPICS:
        cursor.execute('''
            INSERT INTO study_topics (title, summary, subhead, icon)
            VALUES (?, ?, ?, ?)
        ''', (topic["title"], topic["summary"], topic["subhead"], topic["icon"]))
        topic_id = cursor.lastrowid
        
        for resource in topic.get("resources", []):
            cursor.execute('''
                INSERT INTO study_resources (topic_id, type, title, detail)
                VALUES (?, ?, ?, ?)
            ''', (topic_id, resource["type"], resource["title"], resource["detail"]))
    
    conn.commit()
    
    # Insert career insights
    for insight in CAREER_INSIGHTS:
        cursor.execute('''
            INSERT INTO career_insights (category, label, value, meta)
            VALUES (?, ?, ?, ?)
        ''', (insight["category"], insight["label"], insight["value"], insight["meta"]))
    
    conn.commit()
    conn.close()
    print("Database seeded successfully!")


if __name__ == "__main__":
    init_database()
    seed_database()
