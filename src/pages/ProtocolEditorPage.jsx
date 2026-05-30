import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';

export function ProtocolEditorPage() {
  return <Card><h1 className="mb-4 text-2xl font-bold">Редактор протокола встречи</h1><textarea className="min-h-[520px] w-full rounded-xl border border-border p-4 font-mono text-sm" defaultValue={`# Протокол встречи\n\n## Решения\n- Утвердить цели спринта\n- Проверить задачи без документации\n\n## Action items\n- Алексей — подготовить GitHub-метрики\n- Мария — обновить Confluence-страницы`} /><div className="mt-4"><Button>Сохранить</Button></div></Card>;
}
