import { RoadmapBoard } from "../components/roadmap/RoadmapBoard.jsx";
import { useRoadmap } from "../features/analytics/useAnalytics.js";
import { useAppStore } from "../store/appStore.js";

export function RoadmapPage() {
  const { selectedTeamId } = useAppStore();
  const { data } = useRoadmap(selectedTeamId);
  return (
    <div>
      <RoadmapBoard data={data} />
    </div>
  );
}
