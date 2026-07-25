import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { BarChart3, TrendingUp, Trophy, ArrowUpRight, Award, Zap } from 'lucide-react';
import { Player } from '../types';

interface AnalyticsDashboardProps {
  analyticsData: {
    revenueTrend: Array<{
      date: string;
      revenue: number;
      payouts: number;
      profit: number;
      rtp: number;
      houseEdge: number;
      betsCount: number;
      activeUsers: number;
    }>;
    betsPerHour: Array<{
      hour: string;
      bets: number;
      wins: number;
    }>;
    numberFrequency: Array<{
      ball: number;
      hits: number;
    }>;
    topWinners: Player[];
  };
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analyticsData }) => {
  const { revenueTrend, betsPerHour, numberFrequency, topWinners } = analyticsData;

  // Pie chart mock data for transaction types volume distribution
  const pieData = [
    { name: 'Bet Stakes', value: 65, color: '#8b5cf6' },
    { name: 'Player Cashouts', value: 22, color: '#f59e0b' },
    { name: 'Direct Deposits', value: 10, color: '#10b981' },
    { name: 'Admin Adjustments', value: 3, color: '#ec4899' }
  ];

  return (
    <div id="analytics-dashboard-module" className="space-y-6 select-none animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-100 font-sans">Business Intelligence</h2>
        <p className="text-xs text-slate-400">Deep mathematical analytics, player yield graphs, and frequency distribution ledgers.</p>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* RTP & House Edge Line Trends */}
        <div className="xl:col-span-2 p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl">
          <div className="flex justify-between items-center mb-4 border-b border-slate-900 pb-3">
            <div>
              <h3 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">Dynamic RTP & House Edge Performance</h3>
              <p className="text-[11px] text-slate-400">Lifetime expected mathematical margins vs. player cash-back trendlines.</p>
            </div>
            <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-400">
              <span className="flex items-center"><span className="w-2 h-2 rounded bg-indigo-500 mr-1.5"></span>RTP (Goal: 96.5%)</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded bg-amber-500 mr-1.5"></span>Edge (Goal: 3.5%)</span>
            </div>
          </div>

          <div className="h-64 w-full font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b' }} />
                <Line type="monotone" dataKey="rtp" name="Player RTP" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="houseEdge" name="House Advantage" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Distribution Pie */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl flex flex-col">
          <div className="mb-4">
            <h3 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">Liquidity Distribution</h3>
            <p className="text-[11px] text-slate-400">Share of financial flows in hot reserve caches.</p>
          </div>

          <div className="flex-1 h-44 flex items-center justify-center relative font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-[10px] text-slate-500 font-mono block">Aggregate Volume</span>
              <span className="text-sm font-black text-slate-200">14.8K TON</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[10px] font-mono mt-4 pt-3 border-t border-slate-900/60">
            {pieData.map((entry, i) => (
              <div key={i} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }}></span>
                <span className="text-slate-400 truncate">{entry.name}: {entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bets Per Hour Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl">
          <div className="mb-4">
            <h3 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">Hourly Stake Load Limits</h3>
            <p className="text-[11px] text-slate-400">Comparing active bets stakes vs. wins output per hour matrix.</p>
          </div>

          <div className="h-64 w-full font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={betsPerHour} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="purpleBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c084fc" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b' }} />
                <Bar dataKey="bets" name="Bets Stakes Volume" fill="url(#purpleBar)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High Rollers List */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl">
          <div className="mb-4 flex justify-between items-center pb-2 border-b border-slate-900">
            <div>
              <h3 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>VIP High Rollers</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Top players by total wins aggregate.</p>
            </div>
          </div>

          <div className="space-y-4">
            {topWinners.map((player, idx) => (
              <div key={player.telegramId} className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-900/40 last:border-0 last:pb-0">
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 rounded bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center font-bold text-[10px]">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-200 font-sans block">@{player.username}</span>
                    <span className="text-[9px] text-slate-500 font-mono">TG: {player.telegramId}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-emerald-400 block">+{player.totalWins.toFixed(2)} TON</span>
                  <span className="text-[9px] text-slate-500 font-mono">Winrate: {player.winRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
