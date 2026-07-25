import { motion } from 'motion/react';
import { Home, Grid, History, Shield, Settings, Wallet } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { tgWebApp } from '../utils/telegram';

interface NavigationBarProps {
  onOpenSettings: () => void;
}

export function NavigationBar({ onOpenSettings }: NavigationBarProps) {
  const { wallet, currentRound } = useGameStore();
  const user = tgWebApp.getUser();

  return (
    <header className="sticky top-0 z-40 w-full px-4 py-3 bg-casino-dark/80 backdrop-blur-md border-b border-gray-900 flex items-center justify-between">
      {/* User Info */}
      <div className="flex items-center space-x-2.5">
        <img
          src={user.photo_url || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80'}
          alt="Avatar"
          className="w-8 h-8 rounded-full border border-violet-500/30 object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-200 leading-none">
            {user.first_name} {user.last_name || ''}
          </span>
          <span className="text-[10px] font-mono text-violet-400">
            @{user.username || 'keno_player'}
          </span>
        </div>
      </div>

      {/* Round & Wallet Info */}
      <div className="flex items-center space-x-3">
        {/* Round Badge */}
        <div className="px-2 py-1 rounded-md bg-violet-950/40 border border-violet-500/10 flex items-center space-x-1.5">
          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider font-display">Round</span>
          <span className="text-[11px] font-mono text-violet-300">#{currentRound}</span>
        </div>

        {/* Small Wallet Display */}
        <div className="px-2.5 py-1 rounded-md bg-blue-950/40 border border-blue-500/10 flex items-center space-x-1.5">
          <Wallet className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-bold text-blue-300 font-mono">
            {wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] font-semibold text-blue-400">{wallet.currency}</span>
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg hover:bg-gray-800/80 transition-colors text-gray-400 hover:text-white"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

interface BottomTabBarProps {
  activeTab: 'lobby' | 'play' | 'history' | 'fairness';
  onTabChange: (tab: 'lobby' | 'play' | 'history' | 'fairness') => void;
}

export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  const tabs = [
    { id: 'lobby' as const, label: 'Lobby', icon: Home },
    { id: 'play' as const, label: 'Play', icon: Grid },
    { id: 'history' as const, label: 'History', icon: History },
    { id: 'fairness' as const, label: 'Fairness', icon: Shield },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0a27]/95 backdrop-blur-lg border-t border-gray-900/80 px-4 pb-safe pt-2.5 flex justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              tgWebApp.haptic.selection();
              onTabChange(tab.id);
            }}
            className="relative flex flex-col items-center flex-1 py-1 text-xs font-medium focus:outline-none transition-colors duration-200"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div
              className={`p-1.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-white bg-gradient-to-br from-violet-600/20 to-indigo-600/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-violet-500/20'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span
              className={`mt-1 text-[10px] tracking-wide transition-colors duration-300 ${
                isActive ? 'text-violet-400 font-bold' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </span>

            {/* Active Glow Accent Dot */}
            {isActive && (
              <motion.div
                layoutId="activeTabDot"
                className="absolute top-0 w-8 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full shadow-[0_0_8px_#8b5cf6]"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
