# Analytics / Digest Frontend

Готовая стартовая архитектура фронтенда для модуля аналитики, AI-дайджестов, roadmap и протоколов встреч.

## Стек

- React + JavaScript
- Vite
- TailwindCSS
- React Router
- TanStack Query / React Query
- Zustand
- Recharts
- dnd-kit заложен в зависимости для будущего drag-and-drop roadmap
- react-markdown для ответов AI-ассистента

## Запуск

```bash
npm install
npm run dev
```

## Основные страницы

```text
/login                         Вход тимлида
/chat                          Чат с AI-ассистентом
/analytics/summary             Сводка команды
/analytics/roadmap             Roadmap команды
/meetings                      Создание и список встреч
/meetings/:meetingId           Заполненная форма встречи + переход в протокол
/meetings/:meetingId/protocol  Редактор протокола
```

## Архитектура папок

```text
src/
  app/                 router.jsx
  components/
    layout/            AppShell, Sidebar, TopBar
    ui/                базовые UI-компоненты
    kpi/               KPI-карточки
    charts/            Recharts-виджеты
    chat/              чат-интерфейс
    roadmap/           roadmap-board
  features/
    analytics/         query hooks для KPI, charts, roadmap
    chat/              query/mutation hooks для чата
    meetings/          query hooks встреч
    teams/             query hooks команд
  pages/               страницы роутера
  shared/
    api/               queryClient, mockApi
    config/            routes
    lib/               utils
  store/               Zustand-store
  data/                mockData
```

## Как подключать реальный backend

Сейчас `src/shared/api/mockApi.js` имитирует backend и возвращает analytics-ready DTO.
Для интеграции нужно заменить методы `api.*` на HTTP-запросы.

Рекомендуемый формат endpoint'ов:

```text
GET /api/teams
GET /api/team/:teamId/kpi
GET /api/team/:teamId/charts/status-distribution
GET /api/team/:teamId/charts/overdue-tasks
GET /api/team/:teamId/charts/team-efficiency
GET /api/team/:teamId/charts/member-load
GET /api/team/:teamId/roadmap
POST /api/team/:teamId/chat/messages
GET /api/team/:teamId/meetings
POST /api/team/:teamId/meetings
GET /api/meetings/:meetingId/protocol
PATCH /api/meetings/:meetingId/protocol
```

## Важные решения

### 1. Frontend получает только готовые DTO

Фронт не должен собирать аналитику из сырых Jira/GitHub/Confluence-сущностей. Backend заранее агрегирует данные и отдает DTO под конкретные виджеты.

### 2. Каждый виджет может иметь свой endpoint

Это упрощает кеширование, загрузку, polling и частичное обновление dashboard.

### 3. React Query отвечает за серверное состояние

Используется для:

- кеширования;
- loading/error states;
- refetchInterval для near realtime;
- background refetch.

### 4. Zustand отвечает за UI/global state

Используется для:

- выбранной команды;
- состояния sidebar;
- текущего пользователя/token.

### 5. Roadmap нужно развивать отдельно

В MVP сделана табличная структура. Для production-версии добавить:

- dnd-kit для drag-and-drop карточек;
- virtual scroll для большого количества участников;
- lazy loading по месяцам/неделям;
- скрытие или отдельный compact view для mobile.

## Что уже реализовано

- Login page.
- Общий layout с боковой панелью и верхними селекторами.
- Разные варианты sidebar для чата, аналитики и встреч.
- Chat UI с выбором роли: Аналитик / Разработчик / Тестировщик.
- Markdown-rendering ответов ассистента.
- KPI dashboard с hover-состояниями и trend indicators.
- 4 диаграммы на Recharts:
  - pie/donut по статусам;
  - vertical bar по просроченным задачам;
  - vertical bar по эффективности команд;
  - horizontal bar по загрузке участников.
- Roadmap page.
- Meetings page.
- Meeting details page.
- Protocol editor page.
