import React, { useState } from 'react';
import { useAdminStore } from '../store/useStore';
import { Search, Bell, AlertTriangle, ShieldCheck, RefreshCw, LogOut, CheckCircle } from 'lucide-react';

interface TopBarProps {
  onRefreshAll?: () => void;
  isRefreshing?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onRefreshAll, isRefreshing = false }) => {
  const { searchQuery, setSearchQuery, addToast } = useAdminStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, type: 'warn', title: 'Suspicious Bet Activity', desc: '@crypto_whale placed 100 TON bet on round 10245.', time: '2m ago' },
    { id: 2, type: 'info', title: 'System settings updated', desc: 'super_admin changed RTP parameters.', time: '12m ago' },
    { id: 3, type: 'success', title: 'Backup completed', desc: 'PostgreSQL DB backup verified successfully.', time: '1h ago' }
  ];

  const handleRefreshClick = () => {
    if (onRefreshAll) {
      onRefreshAll();
      addToast('Data Sync', 'Refreshed all admin metrics and lists', 'success');
    }
  };

  return (
    <header id="top-nav-bar" className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10 select-none">
      {/* Search Input Container */}
      <div className="flex items-center space-x-4 max-w-md w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Global search (tickets, players, transactions)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/80 transition-all"
          />
        </div>
      </div>

      {/* Actions and Profile Area */}
      <div className="flex items-center space-x-4">
        {/* Sync Status Button */}
        <button
          id="topbar-sync-button"
          onClick={handleRefreshClick}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-850 text-xs font-medium text-slate-400 hover:text-slate-200 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
          <span className="hidden sm:inline">Sync DB</span>
        </button>

        {/* Telegram Bot Live status */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="hidden md:inline">@KenoGoldBot:</span>
          <span>Online</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            id="notifications-bell"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-xl relative transition cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
          </button>

          {showNotifications && (
            <div id="notifications-dropdown" className="absolute right-0 mt-3 w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-900">
                <h4 className="text-xs font-bold font-mono tracking-wider text-purple-400 uppercase">Alert Centre</h4>
                <button 
                  onClick={() => setShowNotifications(false)} 
                  className="text-[10px] text-slate-500 hover:text-slate-300 font-mono"
                >
                  Dismiss all
                </button>
              </div>
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div key={notif.id} className="flex gap-2.5 text-xs pb-3 border-b border-slate-900/40 last:border-0 last:pb-0">
                    {notif.type === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                    {notif.type === 'info' && <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}
                    {notif.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                    
                    <div className="flex-1">
                      <p className="font-semibold text-[11px] text-slate-200">{notif.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{notif.desc}</p>
                      <span className="text-[9px] text-slate-500 font-mono mt-1 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown info */}
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
          <div className="hidden lg:block text-right">
            <p className="text-xs font-semibold text-slate-200 leading-tight">super_admin</p>
            <p className="text-[9px] font-mono text-purple-400 font-medium">SUPER ADMIN</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 flex items-center justify-center text-slate-100 font-bold text-sm shadow-[0_0_10px_rgba(124,58,237,0.2)]">
            SA
          </div>
        </div>
      </div>
    </header>
  );
};
