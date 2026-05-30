import { Card } from "../ui/Card.jsx";

export function RoadmapBoard({ data }) {
  if (!data) return null;

  return (
    <Card className="overflow-x-auto">
      <div className="mb-4 text-2xl font-bold">{data.month}</div>
      <div
        className="grid min-w-[980px]"
        style={{
          gridTemplateColumns: `180px repeat(${data.weeks.length}, minmax(180px, 1fr))`,
        }}
      >
        <div className="border-b border-border p-3 text-sm font-semibold text-muted">
          Участник
        </div>
        {data.weeks.map((week) => (
          <div key={week.id} className="border-b border-l border-border p-3">
            <div className="font-semibold">{week.title}</div>
            <div className="text-xs text-muted">{week.dates}</div>
          </div>
        ))}
        {data.members.map((member) => (
          <div className="contents" key={member}>
            <div className="border-b border-border p-3 font-medium">
              {member}
            </div>
            {data.weeks.map((week) => {
              const tasks = data.tasks.filter(
                (task) => task.assignee === member && task.weekId === week.id,
              );
              return (
                <div
                  key={`${member}-${week.id}`}
                  className="min-h-32 border-b border-l border-border p-3"
                >
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="mb-2 rounded-xl bg-[#F89E9E] p-3 text-sm shadow-sm"
                    >
                      <div className="font-semibold text-slate-900">
                        {task.title}
                      </div>
                      <div className="mt-1 text-xs text-muted">
                        {task.status}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Card>
  );
}
