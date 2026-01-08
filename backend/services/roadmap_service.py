from backend.repository.file_repo import FileRepository

class RoadmapService:
    """
    Service layer for handling roadmap generation logic.
    It uses a repository to fetch data, keeping the service
    independent of the data storage implementation.
    """
    def __init__(self, repository: FileRepository):
        self._repository = repository

    def generate_roadmap(self, goal, days):
        """Generate a structured roadmap response for the given goal and duration."""
        all_topics = self._repository.get_roadmap_topics()
        goal_data = all_topics.get(goal)

        if not goal_data:
            return None

        milestones = goal_data.get("milestones", [])
        if not milestones:
            return None

        num_weeks = max(1, min(days // 7, len(milestones)))
        weeks = self._build_weeks(milestones, num_weeks)

        return {
            "goal": goal,
            "duration": days,
            "overview": goal_data.get("overview", ""),
            "resources": goal_data.get("resources", []),
            "weeks": weeks,
        }

    def _build_weeks(self, milestones, num_weeks):
        """Split milestones into evenly distributed weekly chunks."""
        weeks = []
        total_items = len(milestones)
        base = total_items // num_weeks
        remainder = total_items % num_weeks

        cursor = 0
        for week_index in range(1, num_weeks + 1):
            take = base + (1 if week_index <= remainder else 0)
            slice_items = milestones[cursor:cursor + take]
            cursor += take

            titles = ", ".join(item.get("title", "") for item in slice_items if item.get("title"))
            weeks.append(
                {
                    "title": f"Week {week_index}",
                    "summary": titles or "Deep practice and review",
                    "focus": slice_items,
                }
            )

        if cursor < total_items:
            weeks[-1]["focus"].extend(milestones[cursor:])
            extra_titles = ", ".join(item.get("title", "") for item in milestones[cursor:])
            weeks[-1]["summary"] = (
                weeks[-1]["summary"] + ", " + extra_titles if extra_titles else weeks[-1]["summary"]
            )

        return weeks
