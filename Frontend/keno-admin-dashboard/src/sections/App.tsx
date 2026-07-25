import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAdminStore, SidebarTab } from './store/useStore';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardOverview } from './components/DashboardOverview';
import { GameSettingsModule } from './components/GameSettingsModule';
import { PayoutManagement } from './components/PayoutManagement';
import { LiveGameMonitoring } from './components/LiveGameMonitoring';
import { TicketManagement } from './components/TicketManagement';
import { PlayerManagement } from './components/PlayerManagement';
import { WalletManagement } from './components/WalletManagement';
import { TransactionsModule } from './components/TransactionsModule';
import { ProvablyFairManagement } from './components/ProvablyFairManagement';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ReportsModule } from './components/ReportsModule';
import { NotificationsModule } from './components/NotificationsModule';
import { SettingsAndSecurity } from './components/SettingsAndSecurity';
import { apiService } from './services/api';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function DashboardContent() {
  const queryClientInstance = useQueryClient();
  const { activeTab, setActiveTab, toasts, removeToast } = useAdminStore();
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);

  // Queries
  const { data: dashboardData, isLoading: isLoadingDashboard, refetch: refetchDashboard } = useQuery({
    queryKey: ['dashboard'],
    queryFn: apiService.getDashboard,
  });

  const { data: gameData, refetch: refetchGames } = useQuery({
    queryKey: ['games'],
    queryFn: apiService.getGames,
    refetchInterval: 1000, // Poll active game engine loop every 1s for ticking clocks and animations!
  });

  const { data: ticketsData, isLoading: isLoadingTickets, refetch: refetchTickets } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => apiService.getTickets(),
  });

  const { data: usersData, refetch: refetchUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.getUsers(),
  });

  const { data: walletsData, isLoading: isLoadingWallets, refetch: refetchWallets } = useQuery({
    queryKey: ['wallets'],
    queryFn: apiService.getWallets,
  });

  const { data: transactionsData, isLoading: isLoadingTx, refetch: refetchTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => apiService.getTransactions(),
  });

  const { data: settingsData, isLoading: isLoadingSettings, refetch: refetchSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: apiService.getSettings,
  });

  const { data: provablyFairData, refetch: refetchPF } = useQuery({
    queryKey: ['provably-fair'],
    queryFn: apiService.getProvablyFair,
  });

  const { data: analyticsData, isLoading: isLoadingAnalytics, refetch: refetchAnalytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: apiService.getAnalytics,
  });

  const handleRefreshAll = async () => {
    setIsRefreshingAll(true);
    await Promise.all([
      refetchDashboard(),
      refetchGames(),
      refetchTickets(),
      refetchUsers(),
      refetchWallets(),
      refetchTransactions(),
      refetchSettings(),
      refetchPF(),
      refetchAnalytics(),
    ]);
    setIsRefreshingAll(false);
  };

  // Helper Mutation wrappers
  const handleSaveSettings = async (settings: any) => {
    await apiService.saveSettings(settings);
    queryClientInstance.invalidateQueries({ queryKey: ['settings'] });
    queryClientInstance.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const handleCreatePayout = async (rule: any) => {
    await apiService.createPayout(rule);
    queryClientInstance.invalidateQueries({ queryKey: ['settings'] });
  };

  const handleUpdatePayout = async (id: string, rule: any) => {
    await apiService.updatePayout(id, rule);
    queryClientInstance.invalidateQueries({ queryKey: ['settings'] });
  };

  const handleDeletePayout = async (id: string) => {
    await apiService.deletePayout(id);
    queryClientInstance.invalidateQueries({ queryKey: ['settings'] });
  };

  const handleStartDraw = async () => {
    await apiService.startGame();
    queryClientInstance.invalidateQueries({ queryKey: ['games'] });
  };

  const handlePauseDraw = async () => {
    await apiService.pauseGame();
    queryClientInstance.invalidateQueries({ queryKey: ['games'] });
  };

  const handleResumeDraw = async () => {
    await apiService.resumeGame();
    queryClientInstance.invalidateQueries({ queryKey: ['games'] });
  };

  const handleEndDraw = async () => {
    await apiService.endGame();
    queryClientInstance.invalidateQueries({ queryKey: ['games'] });
    queryClientInstance.invalidateQueries({ queryKey: ['dashboard'] });
    queryClientInstance.invalidateQueries({ queryKey: ['tickets'] });
    queryClientInstance.invalidateQueries({ queryKey: ['wallets'] });
    queryClientInstance.invalidateQueries({ queryKey: ['transactions'] });
  };

  const handleCancelRound = async () => {
    await apiService.cancelGame();
    queryClientInstance.invalidateQueries({ queryKey: ['games'] });
    queryClientInstance.invalidateQueries({ queryKey: ['tickets'] });
    queryClientInstance.invalidateQueries({ queryKey: ['wallets'] });
    queryClientInstance.invalidateQueries({ queryKey: ['transactions'] });
  };

  const handleSuspendPlayer = async (tgId: string) => {
    await apiService.suspendPlayer(tgId);
    queryClientInstance.invalidateQueries({ queryKey: ['users'] });
    queryClientInstance.invalidateQueries({ queryKey: ['wallets'] });
  };

  const handleActivatePlayer = async (tgId: string) => {
    await apiService.activatePlayer(tgId);
    queryClientInstance.invalidateQueries({ queryKey: ['users'] });
    queryClientInstance.invalidateQueries({ queryKey: ['wallets'] });
  };

  const handleAdjustWallet = async (tgId: string, action: 'add' | 'remove' | 'reset', amount: number) => {
    await apiService.adjustPlayerWallet(tgId, action, amount);
    queryClientInstance.invalidateQueries({ queryKey: ['wallets'] });
    queryClientInstance.invalidateQueries({ queryKey: ['users'] });
    queryClientInstance.invalidateQueries({ queryKey: ['transactions'] });
  };

  const handlePostNotification = async (notif: any) => {
    await apiService.postNotification(notif);
    queryClientInstance.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const handleRotatePFSeed = async () => {
    const res = await apiService.rotateProvablyFairSeed();
    queryClientInstance.invalidateQueries({ queryKey: ['provably-fair'] });
    return res;
  };

  // Render Loader Skeletons while fetching initial stats
  const isGlobalLoading = isLoadingDashboard || !gameData || isLoadingSettings;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Console view */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopBar onRefreshAll={handleRefreshAll} isRefreshing={isRefreshingAll} />

        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-900">
          {isGlobalLoading ? (
            <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-purple-500 animate-spin"></div>
              <p className="text-xs font-mono text-slate-400">Loading Keno telemetry clusters...</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {activeTab === 'dashboard' && dashboardData && (
                <DashboardOverview data={dashboardData} onRefresh={refetchDashboard} isLoading={isLoadingDashboard} />
              )}
              {activeTab === 'game-settings' && settingsData && (
                <GameSettingsModule initialSettings={settingsData.gameSettings} onSave={(g) => handleSaveSettings({ game: g })} isSaving={isLoadingSettings} />
              )}
              {activeTab === 'live-games' && gameData && (
                <LiveGameMonitoring 
                  currentRound={gameData.currentRound} 
                  onStartDraw={handleStartDraw}
                  onPauseDraw={handlePauseDraw}
                  onResumeDraw={handleResumeDraw}
                  onEndDraw={handleEndDraw}
                  onCancelRound={handleCancelRound}
                  isLoading={isRefreshingAll}
                />
              )}
              {activeTab === 'tickets' && ticketsData && (
                <TicketManagement tickets={ticketsData} isLoading={isLoadingTickets} />
              )}
              {activeTab === 'players' && usersData && (
                <PlayerManagement 
                  players={usersData.players} 
                  onSuspend={handleSuspendPlayer}
                  onActivate={handleActivatePlayer}
                  onAdjustWallet={handleAdjustWallet}
                  isLoading={isGlobalLoading}
                />
              )}
              {activeTab === 'wallets' && walletsData && (
                <WalletManagement wallets={walletsData} onAdjustWallet={handleAdjustWallet} isLoading={isLoadingWallets} />
              )}
              {activeTab === 'transactions' && transactionsData && (
                <TransactionsModule transactions={transactionsData} isLoading={isLoadingTx} />
              )}
              {activeTab === 'payout-tables' && settingsData && (
                <PayoutManagement 
                  payoutRules={settingsData.payoutRules} 
                  onCreate={handleCreatePayout}
                  onUpdate={handleUpdatePayout}
                  onDelete={handleDeletePayout}
                  isLoading={isLoadingSettings}
                />
              )}
              {activeTab === 'provably-fair' && provablyFairData && (
                <ProvablyFairManagement provablyFair={provablyFairData} onRotateSeeds={handleRotatePFSeed} isLoading={isGlobalLoading} />
              )}
              {activeTab === 'analytics' && analyticsData && (
                <AnalyticsDashboard analyticsData={analyticsData} />
              )}
              {activeTab === 'reports' && (
                <ReportsModule />
              )}
              {activeTab === 'notifications' && dashboardData && (
                <NotificationsModule 
                  notifications={[
                    { id: 'notif_1', title: '🚀 Mega Jackpot Night!', content: 'Double the jackpot pool tonight between 18:00 and 22:00 UTC. Grab your tickets now!', target: 'all', channel: 'telegram', status: 'sent', sentAt: '2026-07-20T12:00:00Z' },
                    { id: 'notif_2', title: '🛠️ Scheduled Core Maintenance', content: 'We will be undergoing brief wallet maintenance on July 22nd, 04:00-05:00 UTC. Deposits will be temporarily paused.', target: 'all', channel: 'push', status: 'scheduled', scheduledAt: '2026-07-21T08:00:00Z' },
                    { id: 'notif_3', title: '🎁 VIP Loyalty Reward', content: 'Special 10 TON bonus added to your wallet. Thanks for being a top player!', target: 'high_rollers', channel: 'telegram', status: 'sent', sentAt: '2026-07-19T15:00:00Z' }
                  ]} 
                  onSubmitNotification={handlePostNotification} 
                  isLoading={isGlobalLoading} 
                />
              )}
              {/* Settings, Security, System Logs, User roles mapped to Unified Control panel tabs */}
              {(activeTab === 'settings' || activeTab === 'user-management' || activeTab === 'security' || activeTab === 'system-logs') && settingsData && (
                <SettingsAndSecurity 
                  initialSystemSettings={settingsData.systemSettings} 
                  onSaveSystemSettings={(s) => handleSaveSettings({ system: s })}
                  isSaving={isLoadingSettings}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Floated Admin Toasts Banners */}
      <div id="floating-toasts" className="fixed bottom-6 right-6 z-50 space-y-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto w-full p-4 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200"
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />}

            <div className="flex-1 text-xs">
              <h5 className="font-bold text-slate-100">{toast.title}</h5>
              <p className="text-slate-400 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
}
