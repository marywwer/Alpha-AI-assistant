import {
  chats,
  currentUser,
  efficiencyByTeam,
  mockKpi,
  meetings,
  memberLoad,
  mockClosedTasksByType,
  mockLateDoneByTeam,
  mockMemberLoad,
  mockPriorityDoneTasks,
  overdueByTeam,
  roadmap,
  statusDistribution,
  teams,
} from "../../data/mockData.js";

const delay = (data, ms = 250) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const api = {
  login: async ({ login, password }) => {
    if (!login || !password) throw new Error("Введите логин и пароль");
    return delay({ token: "mock-token", user: currentUser });
  },
  getTeams: () => delay(teams),
  getCurrentUser: () => delay(currentUser),
  getChats: () => delay(chats),
  getMeetings: () => delay(meetings),
  getKpi: (teamId) => {
    const currentKpi = mockKpi[teamId] || mockKpi.romashki;

    return delay({
      teamId,
      metrics: currentKpi.metrics,
    });
  },
  getStatusDistribution: () =>
    delay({ chartData: statusDistribution, total: 150 }),
  getOverdueByTeam: () => delay(overdueByTeam),
  getEfficiencyByTeam: () => delay(efficiencyByTeam),
  getMemberLoad: (teamId) =>
    delay(mockMemberLoad[teamId] || mockMemberLoad.romashki),

  getRoadmap: () => delay(roadmap),

  getPriorityDoneTasks: (teamId) =>
    delay(mockPriorityDoneTasks[teamId] || mockPriorityDoneTasks.romashki),

  getClosedTasksByType: (teamId) =>
    delay(mockClosedTasksByType[teamId] || mockClosedTasksByType.romashki),

  getLateDoneByTeam: () => delay(mockLateDoneByTeam),
  sendChatMessage: ({ role, message }) => {
    const digestMap = {
      analyst:
        "### **Дайджест аналитика**\n - **Создано 8 страниц**\n - *Обновлено 14 страниц*\n - Риск: **слабая связка задач и документации**",
      developer:
        "### Дайджест разработчика\n- 47 коммитов за период\n- Средний размер коммита: 240 строк\n- 2 переоткрытых бага\n- Рекомендация: дробить крупные изменения",
      tester:
        "### Дайджест тестировщика\n- Закрыто 28 задач\n- Просрочено 5 задач\n- Переоткрыто 4 задачи\n- Рекомендация: усилить регрессионное покрытие",
    };
    return delay(
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: digestMap[role] || `Ответ по запросу: ${message}`,
      },
      500,
    );
  },
};
