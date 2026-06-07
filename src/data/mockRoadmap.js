export const TeamId = {
  ALL: "all",
  ROMASHKI: "romashki",
  ALPHA: "alpha",
  TEAM_1: "team-1",
};

export const roadmapMockByTeam = {
  [TeamId.ALL]: {
    lanes: [],
    startDate: "2026-01-01",
    endDate: "2026-12-31",
  },

  [TeamId.ROMASHKI]: {
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    lanes: [
      {
        id: "lane-1",
        title:
          "Разработать MVP для проекта “Агент поддержки руководителя команды разработки”",
        items: [
          {
            id: "item-1",
            title: "Провести анализ метрик Jira",
            startDate: "2026-05-06",
            endDate: "2026-05-16",
            completedAt: "2026-05-16",
            status: 2,
            priority: 1,
            jiraLink: "https://jira.example.com/task-1",
            assignee: {
              id: "user-1",
              name: "Борис",
              surname: "Иванов",
              avatarUrl: null,
            },
          },
        ],
      },

      {
        id: "lane-2",
        title:
          "Разработать MVP для проекта “Агент поддержки руководителя команды разработки”",
        items: [
          {
            id: "item-2",
            title: "Подготовить API протоколов встреч",
            startDate: "2026-05-13",
            endDate: "2026-05-24",
            completedAt: null,
            status: 1,
            priority: 2,
            jiraLink: "https://jira.example.com/task-2",
            assignee: {
              id: "user-2",
              name: "Илья",
              surname: "Петров",
              avatarUrl: null,
            },
          },
          {
            id: "item-3",
            title: "Собрать экран дайджеста",
            startDate: "2026-06-03",
            endDate: "2026-06-14",
            completedAt: null,
            status: 1,
            priority: 1,
            jiraLink: null,
            assignee: {
              id: "user-2",
              name: "Илья",
              surname: "Петров",
              avatarUrl: null,
            },
          },
        ],
      },

      {
        id: "lane-3",
        title:
          "Разработать MVP для проекта “Агент поддержки руководителя команды разработки”",
        items: [
          {
            id: "item-4",
            title: "Провести анализ метрик GitHub",
            startDate: "2026-06-10",
            endDate: "2026-06-21",
            completedAt: "2026-06-20",
            status: 2,
            priority: 2,
            jiraLink: null,
            assignee: {
              id: "user-3",
              name: "Мария",
              surname: "Смирнова",
              avatarUrl: null,
            },
          },
        ],
      },

      {
        id: "lane-4",
        title:
          "Разработать MVP для проекта “Агент поддержки руководителя команды разработки”",
        items: [
          {
            id: "item-5",
            title: "Сделать QA digest",
            startDate: "2026-05-20",
            endDate: "2026-06-02",
            completedAt: null,
            status: 1,
            priority: 3,
            jiraLink: "https://jira.example.com/task-5",
            assignee: {
              id: "user-4",
              name: "Ольга",
              surname: "Морозова",
              avatarUrl: null,
            },
          },
        ],
      },

      {
        id: "lane-5",
        title:
          "Разработать MVP для проекта “Агент поддержки руководителя команды разработки”",
        items: [
          {
            id: "item-6",
            title: "Подготовить презентацию MVP для демо",
            startDate: "2026-06-17",
            endDate: "2026-06-28",
            completedAt: null,
            status: 1,
            priority: 1,
            jiraLink: "https://jira.example.com/task-6",
            assignee: {
              id: "user-5",
              name: "Алексей",
              surname: "Соколов",
              avatarUrl: null,
            },
          },
        ],
      },
    ],
  },

  [TeamId.ALPHA]: {
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    lanes: [
      {
        id: "lane-1",
        title: "Запустить аналитику команды Alpha",
        items: [
          {
            id: "item-1",
            title: "Собрать KPI по команде",
            startDate: "2026-05-06",
            endDate: "2026-05-24",
            completedAt: "2026-05-23",
            status: 2,
            priority: 1,
            jiraLink: null,
            assignee: {
              id: "user-1",
              name: "Анна",
              surname: "Ким",
              avatarUrl: null,
            },
          },
        ],
      },
    ],
  },

  [TeamId.TEAM_1]: {
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    lanes: [
      {
        id: "lane-1",
        title: "MVP аналитики команды 1",
        items: [
          {
            id: "item-1",
            title: "Сверстать roadmap",
            startDate: "2026-06-03",
            endDate: "2026-06-21",
            completedAt: null,
            status: 1,
            priority: 2,
            jiraLink: "https://jira.example.com/task-7",
            assignee: {
              id: "user-1",
              name: "Иван",
              surname: "Орлов",
              avatarUrl: null,
            },
          },
        ],
      },
    ],
  },
};