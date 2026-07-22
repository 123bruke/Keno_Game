import { create } from 'zustand';

export type SidebarTab =
  | 'dashboard'
  | 'game-settings'
  | 'live-games'
  | 'tickets'
  | 'players'
  | 'wallets'
  | 'transactions'
  | 'payout-tables'
  | 'provably-fair'
  | 'analytics'
  | 'reports'
  | 'user-management'
  | 'security'
  | 'system-logs'
  | 'notifications'
  | 'settings';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AdminStore {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),
  toasts: [],
  addToast: (title, message, type = 'success') => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      toasts: [...state.toasts, { id, title, message, type }],
    }));
    // Auto remove toast
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
