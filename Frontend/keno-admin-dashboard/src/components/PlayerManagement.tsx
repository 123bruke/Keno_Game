import React, { useState } from 'react';
import { useAdminStore } from '../store/useStore';
import { Search, ShieldAlert, ShieldCheck, Wallet, RotateCcw, ChevronLeft, ChevronRight, UserMinus, Plus, Minus } from 'lucide-react';
import { Player } from '../types';

interface PlayerManagementProps {
  players: Player[];
  onSuspend: (telegramId: string) => Promise<void>;
  onActivate: (telegramId: string) => Promise<void>;
  onAdjustWallet: (telegramId: string, action: 'add' | 'remove' | 'reset', amount: number) => Promise<void>;
  isLoading: boolean;
}

export const PlayerManagement: React.FC<PlayerManagementProps> = ({
  players, onSuspend, onActivate, onAdjustWallet, isLoading
}) => {
  const { addToast } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Balance adjust modal fields
  const [adjustAmount, setAdjustAmount] = useState('10');
  const [isAdjusting, setIsAdjusting] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredPlayers = players.filter(p => 
    p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.telegramId.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlayers = filteredPlayers.slice(startIndex, startIndex + itemsPerPage);

  const handleToggleStatus = async (player: Player) => {
    try {
      if (player.status === 'active') {
        await onSuspend(player.telegramId);
        addToast('Security Block', `Player @${player.username} has been suspended.`, 'warning');
      } else {
        await onActivate(player.telegramId);
        addToast('Security Unlock', `Player @${player.username} is now active.`, 'success');
      }
      // Sync selected player detail if open
      if (selectedPlayer && selectedPlayer.telegramId === player.telegramId) {
        setSelectedPlayer(prev => prev ? { ...prev, status: prev.status === 'active' ? 'suspended' : 'active' } : null);
      }
    } catch (err) {
      addToast('Action Failed', 'Failed to change player status.', 'error');
    }
  };

  const handleAdjustWallet = async (action: 'add' | 'remove' | 'reset') => {
    if (!selectedPlayer) return;
    const amountVal = parseFloat(adjustAmount);
    if (action !== 'reset' && (isNaN(amountVal) || amountVal <= 0)) {
      addToast('Validation', 'Please input a valid positive adjustment amount.', 'error');
      return;
    }

    if (action === 'reset' && !window.confirm(`Warning: Reset wallet balance for @${selectedPlayer.username} to 0 TON?`)) return;

    try {
      await onAdjustWallet(selectedPlayer.telegramId, action, amountVal);
      setIsAdjusting(false);
      addToast('Wallet Adjusted', `Successfully completed wallet ${action} action for @${selectedPlayer.username}`, 'success');
      
      // Update selected player in view
      setSelectedPlayer(prev => {
        if (!prev) return null;
        let nextBal = prev.walletBalance;
        if (action === 'add') nextBal += amountVal;
        if (action === 'remove') nextBal = Math.max(0, nextBal - amountVal);
        if (action === 'reset') nextBal = 0;
        return { ...prev, walletBalance: nextBal };
      });
    } catch (err) {
      addToast('Action Failed', 'Failed to adjust player wallet.', 'error');
    }
  };

  return (
    <div id="player-management-module" className="space-y-6 select-none animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-100 font-sans">Player Administration</h2>
          <p className="text-xs text-slate-400">Suspend/activate users, manage account locks, and review player profiles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Players List (Left/Center) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search Telegram ID or Username..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
              />
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Total Count: {filteredPlayers.length}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-900/60 pb-3">
                    <th className="pb-3 font-medium">Player ID</th>
                    <th className="pb-3 font-medium">Username</th>
                    <th className="pb-3 font-medium">Balance</th>
                    <th className="pb-3 font-medium">Win Rate</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/40">
                  {paginatedPlayers.map((player) => (
                    <tr 
                      key={player.telegramId} 
                      onClick={() => setSelectedPlayer(player)}
                      className={`hover:bg-slate-900/15 transition-all cursor-pointer ${selectedPlayer?.telegramId === player.telegramId ? 'bg-purple-950/10' : ''}`}
                    >
                      <td className="py-3 text-slate-300 font-bold">{player.telegramId}</td>
                      <td className="py-3 text-slate-200 font-sans font-semibold">@{player.username}</td>
                      <td className="py-3 text-purple-400 font-extrabold">{player.walletBalance.toFixed(2)} TON</td>
                      <td className="py-3 text-amber-500 font-bold">{player.winRate}%</td>
                      <td className="py-3">
                        {player.status === 'active' ? (
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 px-2.5 py-0.5 rounded-full font-sans">Active</span>
                        ) : (
                          <span className="text-[10px] text-rose-400 bg-rose-950/20 border border-rose-900/40 px-2.5 py-0.5 rounded-full font-sans">Suspended</span>
                        )}
                      </td>
                      <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleToggleStatus(player)}
                          className={`p-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition ${
                            player.status === 'active' 
                              ? 'bg-rose-950/10 hover:bg-rose-950/30 text-rose-400 border-rose-900/40' 
                              : 'bg-emerald-950/10 hover:bg-emerald-950/30 text-emerald-400 border-emerald-900/40'
                          }`}
                          title={player.status === 'active' ? 'Suspend Player' : 'Activate Player'}
                        >
                          {player.status === 'active' ? <UserMinus className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedPlayers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">No players found matching query.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-900 text-xs text-slate-400">
                <span>Page {currentPage} of {totalPages}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Player Profile Detail Panel (Right Column) */}
        <div>
          {selectedPlayer ? (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-2xl space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-900 pb-3 flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-widest">Player Profile</h3>
                  <p className="text-sm font-bold text-slate-100 font-sans mt-0.5">@{selectedPlayer.username}</p>
                </div>
                <div className="text-[10px] font-mono text-slate-500">ID: {selectedPlayer.telegramId}</div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3.5 text-xs font-mono">
                <div className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl">
                  <span className="text-[9px] text-slate-500 block">Staked (Total)</span>
                  <span className="font-bold text-slate-300 mt-1 block">{selectedPlayer.totalBets} TON</span>
                </div>
                <div className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl">
                  <span className="text-[9px] text-slate-500 block">Winnings (Total)</span>
                  <span className="font-bold text-emerald-400 mt-1 block">{selectedPlayer.totalWins.toFixed(2)} TON</span>
                </div>
                <div className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl">
                  <span className="text-[9px] text-slate-500 block">Win Percentage</span>
                  <span className="font-bold text-amber-500 mt-1 block">{selectedPlayer.winRate}%</span>
                </div>
                <div className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl">
                  <span className="text-[9px] text-slate-500 block">Wallet Cash</span>
                  <span className="font-bold text-purple-400 mt-1 block">{selectedPlayer.walletBalance.toFixed(2)} TON</span>
                </div>
              </div>

              {/* Login Telemetry */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-900/40">
                  <span className="text-slate-500">Registered date:</span>
                  <span className="text-slate-300 font-medium">{new Date(selectedPlayer.registrationDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Last activity:</span>
                  <span className="text-slate-300 font-medium">{new Date(selectedPlayer.lastLogin).toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Wallet Adjust Controls */}
              <div className="border-t border-slate-900 pt-4 space-y-3">
                <h4 className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-purple-400" />
                  <span>Administrative Wallet Controls</span>
                </h4>

                {isAdjusting ? (
                  <div className="space-y-3 p-3 bg-slate-900/40 border border-slate-900 rounded-xl animate-in slide-in-from-top-1.5 duration-150">
                    <div>
                      <label className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block mb-1">Deduction / Addition amount</label>
                      <input
                        type="number"
                        value={adjustAmount}
                        onChange={(e) => setAdjustAmount(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAdjustWallet('add')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-slate-100 text-xs py-1.5 rounded-lg font-semibold flex items-center justify-center space-x-1 cursor-pointer transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Credit</span>
                      </button>
                      <button
                        onClick={() => handleAdjustWallet('remove')}
                        className="flex-1 bg-rose-600 hover:bg-rose-500 text-slate-100 text-xs py-1.5 rounded-lg font-semibold flex items-center justify-center space-x-1 cursor-pointer transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                        <span>Debit</span>
                      </button>
                    </div>
                    <button
                      onClick={() => setIsAdjusting(false)}
                      className="w-full text-center text-[10px] text-slate-500 hover:text-slate-400 font-mono mt-1"
                    >
                      Cancel adjust
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsAdjusting(true)}
                      className="bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5 text-purple-400" />
                      <span>Adjust Cash</span>
                    </button>
                    <button
                      onClick={() => handleAdjustWallet('reset')}
                      className="bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                      <span>Reset Wallet</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center border border-dashed border-slate-900 rounded-3xl text-slate-600">
              <ShieldAlert className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-xs font-mono max-w-[200px] mx-auto leading-relaxed">Select a player from the table to view details and execute admin actions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
