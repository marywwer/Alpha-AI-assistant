import { RoadmapBoard } from "../components/roadmap/RoadmapBoard.jsx";
import { useRoadmap } from "../features/analytics/useAnalytics.js";
import { useAppStore } from "../store/appStore.js";

export function RoadmapPage() {
  const { selectedTeamId } = useAppStore();
  const { data } = useRoadmap(selectedTeamId);
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Roadmap команды</h1>
      <RoadmapBoard data={data} />
      {/* <p className="mt-4 text-sm text-muted">
        Для production-версии сюда подключается dnd-kit, virtual scroll и API
        обновления карточек задач.
      </p> */}
    </div>
  );
}
