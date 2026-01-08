import json
import os

class FileRepository:
    """
    A repository class to handle data access from JSON files.
    This abstracts the data source from the business logic.
    """
    def __init__(self):
        # Correctly determine the base directory relative to the current file's location
        # This makes the path resolution independent of where the script is run from
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self._questions_file = os.path.join(base_dir, 'data', 'interview_questions.json')
        self._roadmaps_file = os.path.join(base_dir, 'data', 'roadmap_topics.json')

    def get_interview_questions(self):
        """
        Reads and returns all interview questions from the JSON file.
        """
        with open(self._questions_file, 'r') as f:
            return json.load(f)

    def get_roadmap_topics(self):
        """
        Reads and returns all roadmap topics from the JSON file.
        """
        with open(self._roadmaps_file, 'r') as f:
            return json.load(f)
