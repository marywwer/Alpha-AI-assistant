import { Link, useParams } from "react-router-dom";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";

export function MeetingDetailsPage() {
  const { meetingId } = useParams();
  return (
    <div className="space-y-6">
      <Card>
        <h1 className="mb-4 text-2xl font-bold">Запланированная встреча</h1>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-xl border border-border p-3"
            defaultValue="Планирование спринта"
          />
          <input
            className="rounded-xl border border-border p-3"
            defaultValue="2026-05-07 10:00"
          />
        </div>
        <textarea
          className="mt-3 min-h-28 w-full rounded-xl border border-border p-3"
          defaultValue="Обсудить цели спринта, риски, загрузку участников."
        />
      </Card>
      <Card>
        <h2 className="mb-3 text-xl font-semibold">Протокол</h2>
        <p className="mb-4 text-muted">
          Сводка встречи, решения, action items и ответственные.
        </p>
        <Link to={`/meetings/${meetingId}/protocol`}>
          <Button>Открыть и редактировать протокол</Button>
        </Link>
      </Card>
    </div>
  );
}
