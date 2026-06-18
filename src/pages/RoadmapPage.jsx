import { Loader2 } from "lucide-react";
import { RoadmapBoard } from "../components/roadmap/RoadmapBoard.jsx";
import { useRoadmap } from "../features/analytics/useAnalytics.js";
import { useAppStore } from "../store/appStore.js";

export function RoadmapPage() {
  const { selectedTeamId } = useAppStore();
  const { data, isLoading, isError } = useRoadmap(selectedTeamId);

  if (isLoading) {
    return (
      <div className="flex h-1/2 items-center justify-center">
        <Loader2
          className="h-10 w-10 animate-spin"
          style={{ color: "#FF0404" }}
        />
      </div>
    );
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
