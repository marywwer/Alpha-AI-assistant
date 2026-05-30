import { create } from 'zustand';

export const useAppStore = create((set) => ({
  isSidebarCollapsed: false,
  selectedTeamId: 'Выбор команды',
  token: localStorage.getItem('token'),
  user: null,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
  setSelectedTeamId: (selectedTeamId) => set({ selectedTeamId }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }))
}));
