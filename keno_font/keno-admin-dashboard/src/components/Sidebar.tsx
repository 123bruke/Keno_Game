import React from 'react';
import { useAdminStore, SidebarTab } from '../store/useStore';
import { 
  LayoutDashboard, Sliders, Play, Ticket, Users, 
  Wallet, ArrowLeftRight, Percent, ShieldCheck, 
  BarChart3, FileText, Shield, Lock, Terminal, 
  Bell, Settings, Coins
} from 'lucide-react';

interface SidebarItem {
  id: SidebarTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useAdminStore();

  const menuItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'game-settings', label: 'Game Settings', icon: Sliders },
    { id: 'live-games', label: 'Live Games', icon: Play },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'players', label: 'Players', icon: Users },
    { id: 'wallets', label: 'Wallets', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'payout-tables', label: 'Payout Tables', icon: Percent },
    { id: 'provably-fair', label: 'Provably Fair', icon: ShieldCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'user-management', label: 'User Management', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'system-logs', label: 'System Logs', icon: Terminal },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside id="sidebar-navigation" className="w-64 bg-slate-950 border-r border-slate-800 text-slate-100 flex flex-col h-screen sticky top-0 shrink-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center space-x-3 bg-gradient-to-r from-slate-950 via-indigo-950/20 to-slate-950">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)]">
          <Coins className="w-5 h-5 text-amber-300" />
        </div>
        <div>
          <h1 className="text-md font-bold tracking-tight bg-gradient-to-r from-purple-200 via-slate-100 to-indigo-200 bg-clip-text text-transparent">
            KENO <span className="text-amber-400">GOLD</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">ADMIN PORTAL</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              id={`sidebar-item-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-250 cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-900/40 to-indigo-900/40 text-purple-200 border-l-4 border-purple-500 pl-3 shadow-[0_4px_20px_rgba(124,58,237,0.1)]'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 pl-4 border-l-4 border-transparent'
              }`}
            >
              <IconComponent className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Branding */}
      <div className="p-4 border-t border-slate-900 text-center bg-slate-950/50">
        <p className="text-[10px] text-slate-500 font-mono">v1.2.0 • PROD ACTIVE</p>
      </div>
    </aside>
  );
};
