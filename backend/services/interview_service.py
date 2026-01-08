from backend.repository.file_repo import FileRepository

class InterviewService:
    """
    Service layer for handling interview-related business logic.
    It uses a repository to fetch data, keeping the service
    independent of the data storage implementation.
    """
    def __init__(self, repository: FileRepository):
        self._repository = repository

    def get_questions_for_role(self, role):
        """
        Fetches all questions and filters them by the specified role.
        
        Args:
            role (str): The role to get questions for.

        Returns:
            list: A list of questions for the given role, or None if the role is not found.
        """
        all_questions = self._repository.get_interview_questions()
        return all_questions.get(role)
