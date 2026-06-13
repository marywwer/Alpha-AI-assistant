import { create } from "zustand";

export const useAppStore = create((set) => ({
  isSidebarCollapsed: false,

  selectedTeamId: "all",

  user: null,

  setUser: (user) => set({ user }),

  setSelectedTeamId: (selectedTeamId) => set({ selectedTeamId }),

  toggleSidebar: () =>
    set((state) => ({
      isSidebarCollapsed: !state.isSidebarCollapsed,
    })),
}));
