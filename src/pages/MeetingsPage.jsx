import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useMeetings } from '../features/meetings/useMeetings.js';

export function MeetingsPage() {
  const { data: meetings = [] } = useMeetings();
  return <div className="grid gap-6 xl:grid-cols-[420px_1fr]"><Card><h1 className="mb-4 text-2xl font-bold">Новая встреча</h1><div className="space-y-3"><input className="w-full rounded-xl border border-border p-3" placeholder="Название встречи" /><input className="w-full rounded-xl border border-border p-3" type="datetime-local" /><textarea className="min-h-36 w-full rounded-xl border border-border p-3" placeholder="Повестка встречи" /><Button>Создать встречу</Button></div></Card><Card><h2 className="mb-4 text-xl font-semibold">Ваши встречи</h2><div className="space-y-3">{meetings.map((meeting) => <a key={meeting.id} href={`/meetings/${meeting.id}`} className="block rounded-xl border border-border p-4 transition hover:bg-slate-50"><div className="font-semibold">{meeting.title}</div><div className="text-sm text-muted">{meeting.date}</div></a>)}</div></Card></div>;
}
