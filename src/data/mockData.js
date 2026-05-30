export const teams = [
  { id: 'romashki', name: 'Ромашки' },
  { id: 'alpha', name: 'Паргелий' },
  { id: 'team-1', name: 'Команда 1' }
];

export const currentUser = { firstName: 'Анна', lastName: 'Иванова', role: 'Тимлид' };

export const chats = [
  { id: 'chat-1', title: 'Дайджест аналитика' },
  { id: 'chat-2', title: 'Проверка задач QA' },
  { id: 'chat-3', title: 'Итоги разработки' }
];

export const meetings = [
  { id: 'meet-1', title: 'Планирование спринта', date: '2026-05-07' },
  { id: 'meet-2', title: 'Daily команды', date: '2026-05-06' }
];

export const kpi = [
  ['tasks_in_progress', 'Задачи в работе', 12, 3.5, 'up'],
  ['created_pages', 'Созданные страницы', 8, -1, 'down',],
  ['team_efficiency', 'Эффективность команды', 74.7, 2.1, 'up'],
  ['commit_count', 'Количество коммитов', 47, 5, 'up'],
  ['reopened_tasks', 'Переоткрытые задачи', 4, -2, 'down'],
  ['created_tasks', 'Созданные задачи', 31, 7, 'up'],
  ['done_tasks', 'Выполненные задачи', 28, 4, 'up'],
  ['overdue_tasks', 'Просроченные задачи', 5, -1.5, 'down'],
  ['avg_commit_size', 'Средний размер коммитов', 240, 8, 'up'],
  ['unassigned_tasks', 'Неназначенные задачи', 3, -3, 'down'],
  ['late_done_percent', '% задач, выполненных после срока', 11, -2, 'down'],
  ['team_interaction_quality', 'Качество взаимодействия команды', 86, 4, 'up'],
  ['reopened_bug_tasks', 'Переоткрытые задачи с типом “Баг”', 2, -1, 'down']
].map(([id, title, value, delta, trend]) => ({ id, title, value, delta, trend, lastUpdated: '2026-05-07T10:00:00Z' }));

export const mockPriorityDoneTasks = {
  all: [
    { name: "Highest", value: 18 },
    { name: "High", value: 26 },
    { name: "Medium", value: 34 },
    { name: "Low", value: 15 },
    { name: "Lowest", value: 7 },
  ],
  romashki: [
    { name: "Highest", value: 10 },
    { name: "High", value: 24 },
    { name: "Medium", value: 38 },
    { name: "Low", value: 20 },
    { name: "Lowest", value: 8 },
  ],
  alpha: [
    { name: "Highest", value: 8 },
    { name: "High", value: 19 },
    { name: "Medium", value: 31 },
    { name: "Low", value: 14 },
    { name: "Lowest", value: 6 },
  ],
  "team-1": [
    { name: "Highest", value: 5 },
    { name: "High", value: 16 },
    { name: "Medium", value: 27 },
    { name: "Low", value: 18 },
    { name: "Lowest", value: 9 },
  ],
};

export const mockClosedTasksByType = {
  romashki: {
    chartData: [
      { name: "Задача", value: 45, percentage: 45 },
      { name: "Баг", value: 30, percentage: 30 },
      { name: "История", value: 25, percentage: 25 },
    ],
    total: 100,
  },
  alpha: {
    chartData: [
      { name: "Задача", value: 38, percentage: 50 },
      { name: "Баг", value: 22, percentage: 29 },
      { name: "История", value: 16, percentage: 21 },
    ],
    total: 76,
  },
  "team-1": {
    chartData: [
      { name: "Задача", value: 31, percentage: 47 },
      { name: "Баг", value: 18, percentage: 27 },
      { name: "История", value: 17, percentage: 26 },
    ],
    total: 66,
  },
};

export const mockLateDoneByTeam = [
  { name: "Ромашки", value: 12 },
  { name: "Паргелий", value: 8 },
  { name: "Команда 1", value: 15 },
];

export const statusDistribution = [
  { name: 'В работе', value: 15, percentage: 10 },
  { name: 'К выполнению', value: 15, percentage: 10 },
  { name: 'Выполнено', value: 120, percentage: 80 }
];

export const overdueByTeam = [
  { name: "Ромашки", value: 5 },
  { name: "Паргелий", value: 8 },
  { name: "Команда 1", value: 3 },
];

export const efficiencyByTeam = [
  { name: "Ромашки", value: 74 },
  { name: "Паргелий", value: 68 },
  { name: "Команда 1", value: 81 },
];

export const memberLoad = [
  { name: 'Алексей', tasks: 9 },
  { name: 'Мария', tasks: 7 },
  { name: 'Илья', tasks: 11 },
  { name: 'Ольга', tasks: 5 }
];

export const mockMemberLoad = {
  romashki: [
    { name: "Анна", value: 32, tasks: 16 },
    { name: "Иван", value: 24, tasks: 12 },
    { name: "Мария", value: 18, tasks: 9 },
    { name: "Олег", value: 26, tasks: 13 },
  ],
  alpha: [
    { name: "Дмитрий", value: 28, tasks: 14 },
    { name: "Екатерина", value: 22, tasks: 11 },
    { name: "Сергей", value: 34, tasks: 17 },
    { name: "Полина", value: 16, tasks: 8 },
  ],
  "team-1": [
    { name: "Алексей", value: 30, tasks: 15 },
    { name: "Мария", value: 26, tasks: 13 },
    { name: "Илья", value: 24, tasks: 12 },
    { name: "Ольга", value: 20, tasks: 10 },
  ],
};

export const roadmap = {
  month: 'Март',
  weeks: [
    { id: 'w1', title: 'Неделя 1', dates: '02.03–06.03' },
    { id: 'w2', title: 'Неделя 2', dates: '09.03–13.03' },
    { id: 'w3', title: 'Неделя 3', dates: '16.03–20.03' },
    { id: 'w4', title: 'Неделя 4', dates: '23.03–27.03' }
  ],
  members: ['Алексей', 'Мария', 'Илья', 'Ольга'],
  tasks: [
    { id: 'r1', assignee: 'Алексей', weekId: 'w1', title: 'Аналитика Jira', status: 'В работе' },
    { id: 'r2', assignee: 'Мария', weekId: 'w2', title: 'Протоколы встреч', status: 'К выполнению' },
    { id: 'r3', assignee: 'Илья', weekId: 'w3', title: 'GitHub metrics API', status: 'В работе' },
    { id: 'r4', assignee: 'Ольга', weekId: 'w4', title: 'QA digest', status: 'Готово' }
  ]
};
