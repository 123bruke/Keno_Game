import { create } from 'zustand';
import { Wallet, Ticket, GameState, ProvablyFairRecord } from '../types';

interface GameSettings {
  soundEnabled: boolean;
  autoPlay: boolean;
  maxSelectableNumbers: number;
  speed: 'normal' | 'fast';
}

interface GameStore {
  // Wallet
  wallet: Wallet;
  setWallet: (wallet: Partial<Wallet>) => void;
  adjustBalance: (amount: number) => void;

  // Selection
  selectedNumbers: number[];
  addSelectedNumber: (num: number) => void;
  removeSelectedNumber: (num: number) => void;
  setSelectedNumbers: (nums: number[]) => void;
  clearSelectedNumbers: () => void;
  quickPick: (count?: number) => void;

  // Bet Settings
  betAmount: number;
  setBetAmount: (amount: number) => void;

  // Game Status
  gameStatus: GameState['status'];
  setGameStatus: (status: GameState['status']) => void;
  currentRound: number;
  setRound: (round: number) => void;

  // Drawing
  winningNumbers: number[];
  drawnNumbers: number[];
  currentDrawBall: number | null;
  drawProgress: number;
  setWinningNumbers: (nums: number[]) => void;
  setDrawnNumbers: (nums: number[]) => void;
  addDrawnNumber: (num: number) => void;
  setCurrentDrawBall: (num: number | null) => void;
  setDrawProgress: (progress: number) => void;

  // Result & Last Ticket
  lastTicket: Ticket | null;
  setLastTicket: (ticket: Ticket | null) => void;

  // History
  history: Ticket[];
  setHistory: (history: Ticket[]) => void;
  addTicketToHistory: (ticket: Ticket) => void;

  // Provably Fair
  provablyFair: ProvablyFairRecord | null;
  setProvablyFair: (record: ProvablyFairRecord | null) => void;

  // User Settings
  settings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;

  // Loading / UI States
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' | null };
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;

  // Reset
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial Wallet
  wallet: {
    balance: 1000,
    currency: 'TON',
    address: 'EQA1...KenoTelegram',
  },
  setWallet: (wallet) =>
    set((state) => ({ wallet: { ...state.wallet, ...wallet } })),
  adjustBalance: (amount) =>
    set((state) => ({
      wallet: { ...state.wallet, balance: Math.max(0, state.wallet.balance + amount) },
    })),

  // Initial Selection
  selectedNumbers: [],
  addSelectedNumber: (num) =>
    set((state) => {
      if (state.selectedNumbers.includes(num)) return {};
      if (state.selectedNumbers.length >= state.settings.maxSelectableNumbers) {
        get().showToast(`Maximum of ${state.settings.maxSelectableNumbers} numbers selected`, 'info');
        return {};
      }
      return { selectedNumbers: [...state.selectedNumbers, num].sort((a, b) => a - b) };
    }),
  removeSelectedNumber: (num) =>
    set((state) => ({
      selectedNumbers: state.selectedNumbers.filter((n) => n !== num),
    })),
  setSelectedNumbers: (nums) => set({ selectedNumbers: nums.sort((a, b) => a - b) }),
  clearSelectedNumbers: () => set({ selectedNumbers: [] }),
  quickPick: (count) => {
    const { settings } = get();
    const pickCount = count || Math.min(settings.maxSelectableNumbers, 10);
    const pool = Array.from({ length: 80 }, (_, i) => i + 1);
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, pickCount).sort((a, b) => a - b);
    set({ selectedNumbers: picked });
    get().showToast(`Quick picked ${pickCount} numbers!`, 'success');
  },

  // Bet settings
  betAmount: 10,
  setBetAmount: (amount) => set({ betAmount: amount }),

  // Game Status
  gameStatus: 'lobby',
  setGameStatus: (status) => set({ gameStatus: status }),
  currentRound: 2048,
  setRound: (round) => set({ currentRound: round }),

  // Drawing State
  winningNumbers: [],
  drawnNumbers: [],
  currentDrawBall: null,
  drawProgress: 0,
  setWinningNumbers: (nums) => set({ winningNumbers: nums }),
  setDrawnNumbers: (nums) => set({ drawnNumbers: nums }),
  addDrawnNumber: (num) =>
    set((state) => {
      const newDrawn = [...state.drawnNumbers, num];
      return {
        drawnNumbers: newDrawn,
        drawProgress: (newDrawn.length / 20) * 100,
      };
    }),
  setCurrentDrawBall: (num) => set({ currentDrawBall: num }),
  setDrawProgress: (progress) => set({ drawProgress: progress }),

  // Result / Ticket
  lastTicket: null,
  setLastTicket: (ticket) => set({ lastTicket: ticket }),

  // History
  history: [],
  setHistory: (history) => set({ history }),
  addTicketToHistory: (ticket) =>
    set((state) => ({ history: [ticket, ...state.history] })),

  // Provably Fair
  provablyFair: null,
  setProvablyFair: (record) => set({ provablyFair: record }),

  // Settings
  settings: {
    soundEnabled: true,
    autoPlay: false,
    maxSelectableNumbers: 10,
    speed: 'normal',
  },
  updateSettings: (newSettings) =>
    set((state) => ({ settings: { ...state.settings, ...newSettings } })),

  // Loading / UI
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  toast: { message: '', type: null },
  showToast: (message, type) => {
    set({ toast: { message, type } });
    setTimeout(() => {
      const currentToast = get().toast;
      if (currentToast.message === message && currentToast.type === type) {
        set({ toast: { message: '', type: null } });
      }
    }, 3000);
  },
  hideToast: () => set({ toast: { message: '', type: null } }),

  // Reset helper
  resetGame: () =>
    set((state) => ({
      gameStatus: 'selection',
      winningNumbers: [],
      drawnNumbers: [],
      currentDrawBall: null,
      drawProgress: 0,
      lastTicket: null,
    })),
}));
