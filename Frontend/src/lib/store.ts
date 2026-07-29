import { create } from "zustand";

export type Tab = "home" | "game" | "history" | "wallet" | "fair" | "profile" | "admin" | "settings";
export type GameMode = "INSTANT" | "CLASSIC";
export type Language = "am" | "en";

export interface AuthUser {
  id: string;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
}

interface AppState {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  selectedNumbers: number[];
  toggleNumber: (num: number) => void;
  setSelection: (numbers: number[]) => void;
  clearSelection: () => void;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  quickPickCount: number;
  setQuickPickCount: (count: number) => void;
  currentUser: AuthUser | null;
  setCurrentUser: (user: AuthUser | null) => void;
  showDevLogin: boolean;
  setShowDevLogin: (show: boolean) => void;
  // User Preferences & Settings
  language: Language;
  setLanguage: (lang: Language) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  vibrationEnabled: boolean;
  toggleVibration: () => void;
  clientSeed: string;
  setClientSeed: (seed: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: "home",
  setActiveTab: (tab) => set({ activeTab: tab }),
  gameMode: "INSTANT",
  setGameMode: (mode) => set({ gameMode: mode }),
  selectedNumbers: [],
  toggleNumber: (num) =>
    set((s) => ({
      selectedNumbers: s.selectedNumbers.includes(num)
        ? s.selectedNumbers.filter((n) => n !== num)
        : s.selectedNumbers.length < 10
          ? [...s.selectedNumbers, num].sort((a, b) => a - b)
          : s.selectedNumbers,
    })),
  setSelection: (numbers) => set({ selectedNumbers: numbers.sort((a, b) => a - b) }),
  clearSelection: () => set({ selectedNumbers: [] }),
  betAmount: 10,
  setBetAmount: (amount) => set({ betAmount: amount }),
  quickPickCount: 5,
  setQuickPickCount: (count) => set({ quickPickCount: count }),
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  showDevLogin: false,
  setShowDevLogin: (show) => set({ showDevLogin: show }),
  // Preferences defaults
  language: "am",
  setLanguage: (lang) => set({ language: lang }),
  soundEnabled: true,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  vibrationEnabled: true,
  toggleVibration: () => set((s) => ({ vibrationEnabled: !s.vibrationEnabled })),
  clientSeed: "keno_player_seed_777",
  setClientSeed: (seed) => set({ clientSeed: seed }),
}));
