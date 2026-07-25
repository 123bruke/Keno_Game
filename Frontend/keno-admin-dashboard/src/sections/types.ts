export interface GameSettings {
  numberRangeMin: number;
  numberRangeMax: number;
  maxSelection: number;
  minBet: number;
  maxBet: number;
  drawCount: number;
  drawIntervalSeconds: number;
  gameMode: 'auto' | 'manual';
  ticketLimits: number;
  rtpPercentage: number;
  houseEdge: number;
  jackpotAmount: number;
}

export interface PayoutRule {
  id: string;
  selected: number;
  matched: number;
  multiplier: number;
  status: 'enabled' | 'disabled';
}

export type GameStatus = 'betting' | 'drawing' | 'paused' | 'completed' | 'cancelled';

export interface LiveGameRound {
  roundNumber: number;
  status: GameStatus;
  countdown: number;
  drawProgress: number; // number of balls drawn so far (e.g. 0 to 20)
  winningNumbers: number[];
  activePlayersCount: number;
  totalBetsAmount: number;
  totalPrizePool: number;
  serverSeedHash: string;
}

export interface KenoTicket {
  ticketId: string;
  telegramId: string;
  username: string;
  selectedNumbers: number[];
  betAmount: number;
  matches: number;
  prize: number;
  status: 'pending' | 'won' | 'lost';
  createdTime: string;
  roundNumber: number;
}

export interface Player {
  telegramId: string;
  username: string;
  walletBalance: number;
  bonusBalance: number;
  totalBets: number;
  totalWins: number;
  winRate: number; // percentage (e.g. 42.5)
  registrationDate: string;
  lastLogin: string;
  status: 'active' | 'suspended';
}

export interface WalletInfo {
  telegramId: string;
  username: string;
  walletBalance: number;
  bonusBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingTransactionsCount: number;
  isFrozen: boolean;
}

export type TransactionType = 'deposit' | 'bet' | 'win' | 'refund' | 'withdrawal';

export interface Transaction {
  transactionId: string;
  telegramId: string;
  username: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

export interface ProvablyFairState {
  currentServerSeed: string;
  currentServerSeedHash: string;
  currentClientSeed: string;
  currentNonce: number;
  previousSeeds: Array<{
    serverSeed: string;
    serverSeedHash: string;
    clientSeed: string;
    nonce: number;
    roundNumber: number;
    winningNumbers: number[];
    timestamp: string;
  }>;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  source: 'game_engine' | 'wallet_service' | 'auth' | 'admin_action' | 'system';
  message: string;
}

export type AdminRole = 'Super Admin' | 'Admin' | 'Finance Manager' | 'Support' | 'Moderator';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: AdminRole;
  status: 'active' | 'suspended';
  lastActive: string;
}

export interface SecuritySession {
  id: string;
  username: string;
  ipAddress: string;
  device: string;
  location: string;
  timestamp: string;
  status: 'success' | 'failed';
}

export interface SystemSettings {
  appName: string;
  currency: string;
  timeZone: string;
  maintenanceMode: boolean;
  language: string;
  telegramBotToken: string;
  telegramBotUsername: string;
  redisHost: string;
  redisPort: number;
  postgresHost: string;
  postgresDb: string;
  backupIntervalHours: number;
}

export interface NotificationAnnouncement {
  id: string;
  title: string;
  content: string;
  target: 'all' | 'active_today' | 'high_rollers';
  channel: 'push' | 'telegram' | 'in_app';
  status: 'sent' | 'scheduled' | 'draft';
  sentAt?: string;
  scheduledAt?: string;
}
