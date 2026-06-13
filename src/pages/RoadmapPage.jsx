import { RoadmapBoard } from "../components/roadmap/RoadmapBoard.jsx";
import { useRoadmap } from "../features/analytics/useAnalytics.js";
import { useAppStore } from "../store/appStore.js";

export function RoadmapPage() {
  const { selectedTeamId } = useAppStore();
  const { data, isLoading, isError } = useRoadmap(selectedTeamId);

  if (isLoading) {
    return <div>Загружаем roadmap...</div>;
  }

  if (isError) {
    return <div>Не удалось загрузить roadmap</div>;
  }

  return (
    <div>
      <RoadmapBoard data={data} />
    </div>
  );
}
