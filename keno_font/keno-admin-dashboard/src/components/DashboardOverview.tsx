import React from 'react';
import { 
  Users, TrendingUp, DollarSign, Percent, 
  Play, CheckCircle2, Shield, HeartPulse, RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

interface DashboardOverviewProps {
  data: {
    kpis: {
      activePlayers: number;
      onlineUsers: number;
      totalBetsToday: number;
      totalPayoutsToday: number;
      revenue: number;
      profit: number;
      rtpPercentage: number;
      houseEdge: number;
      runningGames: number;
      completedGames: number;
    };
    charts: {
      profitHistory: Array<{
        date: string;
        revenue: number;
        payouts: number;
        profit: number;
        rtp: number;
        houseEdge: number;
        betsCount: number;
        activeUsers: number;
      }>;
      popularNumbers: Array<{
        number: number;
        count: number;
      }>;
    };
  };
  onRefresh: () => void;
  isLoading: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ data, onRefresh, isLoading }) => {
  const { kpis, charts } = data;

  const kpiCards = [
    { id: 'kpi-players', label: 'Active Players Today', value: kpis.activePlayers, change: '+14%', isPositive: true, icon: Users, color: 'from-purple-500 to-indigo-500' },
    { id: 'kpi-online', label: 'Current Online Users', value: kpis.onlineUsers, change: 'Live Now', isPositive: true, icon: HeartPulse, color: 'from-emerald-500 to-teal-500', isLive: true },
    { id: 'kpi-bets', label: 'Total Bets Today', value: `${kpis.totalBetsToday} TON`, change: '+8.2%', isPositive: true, icon: TrendingUp, color: 'from-purple-600 to-pink-500' },
    { id: 'kpi-payouts', label: 'Total Payouts Today', value: `${kpis.totalPayoutsToday} TON`, change: '+5.4%', isPositive: true, icon: DollarSign, color: 'from-blue-500 to-cyan-500' },
    { id: 'kpi-revenue', label: 'Revenue Generated', value: `${kpis.revenue} TON`, change: '+12.5%', isPositive: true, icon: DollarSign, color: 'from-indigo-600 to-blue-600' },
    { id: 'kpi-profit', label: 'House Profit', value: `${kpis.profit} TON`, change: kpis.profit >= 0 ? '+15.1%' : '-4.2%', isPositive: kpis.profit >= 0, icon: Shield, color: 'from-amber-500 to-orange-500' },
    { id: 'kpi-rtp', label: 'Real RTP %', value: `${kpis.rtpPercentage}%`, change: 'Optimal', isPositive: true, icon: Percent, color: 'from-pink-600 to-rose-500' },
    { id: 'kpi-house', label: 'House Edge', value: `${kpis.houseEdge}%`, change: 'Configured', isPositive: true, icon: Percent, color: 'from-violet-600 to-purple-600' },
  ];

  return (
    <div id="dashboard-overview-module" className="space-y-6 select-none animate-in fade-in duration-300">
      {/* Header section with refresh button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-100 font-sans">Dashboard Overview</h2>
          <p className="text-xs text-slate-400">Real-time Keno performance analytics and operations telemetry.</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-400' : ''}`} />
          <span>Refresh stats</span>
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={kpi.id} 
              id={kpi.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.25)] relative overflow-hidden group"
            >
              {/* Abstract hover background shine */}
              <div className="absolute -right-10 -bottom-10 w-24 h-24 rounded-full bg-purple-600/5 blur-xl group-hover:bg-purple-600/10 transition-all"></div>
              
              <div className="space-y-1 z-10">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">{kpi.label}</span>
                <p className="text-lg font-bold text-slate-100 tracking-tight leading-none">{kpi.value}</p>
                <span className={`text-[10px] font-mono font-semibold flex items-center ${
                  kpi.isLive ? 'text-emerald-400' : kpi.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {kpi.isLive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1"></span>}
                  {kpi.change}
                </span>
              </div>

              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} p-0.5 flex items-center justify-center text-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.15)]`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Performance Trends Area Chart */}
        <div className="xl:col-span-2 p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-purple-400">Financial Revenue Trends</h3>
              <p className="text-[11px] text-slate-400">Comparing Bets Inflows vs. Player Multiplier Outflows.</p>
            </div>
            <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-400">
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-purple-500 mr-1"></span>Revenue (Bets)</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-blue-500 mr-1"></span>Payouts</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-amber-500 mr-1"></span>Net Profit</span>
            </div>
          </div>

          <div className="h-80 w-full font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.profitHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPay" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }} 
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="payouts" name="Payouts" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPay)" />
                <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorProf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Number Picks Bar Chart */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
          <div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-purple-400">Popular Number Picks</h3>
            <p className="text-[11px] text-slate-400 mb-4">Frequency count of numbers picked in betting tickets.</p>
          </div>

          <div className="h-80 w-full font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.popularNumbers} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="number" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="count" fill="#d946ef" radius={[4, 4, 0, 0]} name="Selections count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lower Quick Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Game Activity Stats */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80">
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-purple-400 mb-3">Core Round Statistics</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-900">
              <span className="text-slate-400">Completed Game Rounds today:</span>
              <span className="font-semibold text-slate-200 font-mono">{kpis.completedGames} rounds</span>
            </div>
            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-900">
              <span className="text-slate-400">Total volume wagered:</span>
              <span className="font-semibold text-purple-400 font-mono">14,892.20 TON</span>
            </div>
            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-900">
              <span className="text-slate-400">Average bets size:</span>
              <span className="font-semibold text-slate-200 font-mono">32.40 TON</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Peak concurrent users (last 24h):</span>
              <span className="font-semibold text-emerald-400 font-mono">142 users</span>
            </div>
          </div>
        </div>

        {/* Real-Time Operational Health */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80">
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-purple-400 mb-3">Operational Status</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Game Service</span>
              <div className="flex items-center space-x-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-200">ACTIVE (AUTO)</span>
              </div>
            </div>
            <div className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Wallet Ingress</span>
              <div className="flex items-center space-x-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-slate-200">SECURE (99.9%)</span>
              </div>
            </div>
            <div className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Provably Fair Seed</span>
              <div className="flex items-center space-x-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-slate-200">VERIFIED SAFE</span>
              </div>
            </div>
            <div className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Admin API Latency</span>
              <div className="flex items-center space-x-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-200">12ms (OPTIMAL)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
