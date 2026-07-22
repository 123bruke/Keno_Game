export interface User {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
}

export interface Wallet {
  balance: number;
  currency: string;
  address?: string;
}

export interface Ticket {
  id: string;
  roundNumber: number;
  betAmount: number;
  selectedNumbers: number[];
  winningNumbers: number[];
  matches: number[];
  prizeAmount: number;
  multiplier: number;
  status: 'won' | 'lost' | 'pending';
  createdAt: string;
}

export interface GameState {
  currentRound: number;
  status: 'lobby' | 'selection' | 'drawing' | 'result';
  selectedNumbers: number[];
  winningNumbers: number[];
  drawnNumbers: number[]; // Numbers revealed so far during the animation
  maxSelectableNumbers: number;
  currentDrawBall: number | null;
  drawProgress: number; // percentage of draw complete
  betAmount: number;
  lastTicket: Ticket | null;
}

export interface ProvablyFairRecord {
  roundNumber: number;
  serverSeed?: string;
  serverSeedHash?: string;
  clientSeed: string;
  nonce: number;
  hash?: string;
  winningNumbers?: number[];
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win';
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

export interface KenoHistoryResponse {
  history: Ticket[];
  totalGames: number;
  totalWinnings: number;
  totalBets: number;
}
