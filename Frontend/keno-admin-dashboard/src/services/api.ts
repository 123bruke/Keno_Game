import axios from 'axios';

const api = axios.create({
  baseURL: '', // Relative URLs work perfectly since the frontend and backend are hosted on the same server
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Dashboard Metrics
  getDashboard: () => api.get('/admin/dashboard').then(res => res.data),

  // Live Games
  getGames: () => api.get('/admin/games').then(res => res.data),
  startGame: () => api.post('/admin/game/start').then(res => res.data),
  pauseGame: () => api.post('/admin/game/pause').then(res => res.data),
  resumeGame: () => api.post('/admin/game/resume').then(res => res.data),
  endGame: () => api.post('/admin/game/end').then(res => res.data),
  cancelGame: () => api.post('/admin/game/cancel').then(res => res.data),

  // Tickets
  getTickets: (params?: { search?: string; status?: string; round?: string }) => 
    api.get('/admin/tickets', { params }).then(res => res.data),

  // Users & Players
  getUsers: (params?: { search?: string; role?: string }) => 
    api.get('/admin/users', { params }).then(res => res.data),
  suspendPlayer: (telegramId: string) => 
    api.post('/admin/players/suspend', { telegramId }).then(res => res.data),
  activatePlayer: (telegramId: string) => 
    api.post('/admin/players/activate', { telegramId }).then(res => res.data),
  adjustPlayerWallet: (telegramId: string, action: 'add' | 'remove' | 'reset', amount: number) => 
    api.post('/admin/players/wallet', { telegramId, action, amount }).then(res => res.data),

  // Wallets & Balance Metrics
  getWallets: () => api.get('/admin/wallets').then(res => res.data),

  // Transactions
  getTransactions: (params?: { search?: string; type?: string; status?: string }) => 
    api.get('/admin/transactions', { params }).then(res => res.data),

  // Reports Management
  getReports: (params?: { type?: string; format?: string }) => 
    api.get('/admin/reports', { params }).then(res => res.data),

  // Analytics Logs & Detail
  getAnalytics: () => api.get('/admin/analytics').then(res => res.data),

  // System Settings & Payout Tables
  getSettings: () => api.get('/admin/settings').then(res => res.data),
  saveSettings: (settings: { game?: any; system?: any }) => 
    api.post('/admin/settings', settings).then(res => res.data),

  // Payout management CRUD
  createPayout: (rule: { selected: number; matched: number; multiplier: number; status?: string }) => 
    api.post('/admin/payouts', rule).then(res => res.data),
  updatePayout: (id: string, rule: { selected?: number; matched?: number; multiplier?: number; status?: string }) => 
    api.put(`/admin/payouts/${id}`, rule).then(res => res.data),
  deletePayout: (id: string) => 
    api.delete(`/admin/payouts/${id}`).then(res => res.data),

  // Notifications Announcement creation
  postNotification: (notif: { title: string; content: string; target?: string; channel?: string; status?: string; scheduledAt?: string }) => 
    api.post('/admin/notifications', notif).then(res => res.data),

  // Provably Fair configuration
  getProvablyFair: () => api.get('/admin/provably-fair').then(res => res.data),
  rotateProvablyFairSeed: () => api.post('/admin/provably-fair/rotate').then(res => res.data),

  // Additional Helper APIs
  getLogs: (params?: { source?: string; level?: string; search?: string }) => 
    api.get('/admin/logs', { params }).then(res => res.data),
  getSecurity: () => api.get('/admin/security').then(res => res.data),
};
export default apiService;
