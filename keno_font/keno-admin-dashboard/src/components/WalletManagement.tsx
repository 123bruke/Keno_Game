import React, { useState } from 'react';
import { useAdminStore } from '../store/useStore';
import { 
  Wallet, Landmark, ArrowUpRight, ArrowDownLeft, Clock, 
  Search, ShieldAlert, CheckCircle2, AlertTriangle, PlayCircle
} from 'lucide-react';
import { WalletInfo } from '../types';

interface WalletManagementProps {
  wallets: WalletInfo[];
  onAdjustWallet: (telegramId: string, action: 'add' | 'remove' | 'reset', amount: number) => Promise<void>;
  isLoading: boolean;
}

export const WalletManagement: React.FC<WalletManagementProps> = ({
  wallets, onAdjustWallet, isLoading
}) => {
  const { addToast } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<WalletInfo | null>(null);

  // Quick Deposit/Withdraw forms
  const [adjustAmount, setAdjustAmount] = useState('50');

  // Filter
  const filteredWallets = wallets.filter(w => 
    w.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.telegramId.includes(searchTerm)
  );

  // Compute total aggregates
  const totalBalance = wallets.reduce((s, w) => s + w.walletBalance, 0);
  const totalBonus = wallets.reduce((s, w) => s + w.bonusBalance, 0);
  const totalDeposited = wallets.reduce((s, w) => s + w.totalDeposits, 0);
  const totalWithdrawn = wallets.reduce((s, w) => s + w.totalWithdrawals, 0);
  const totalPendingWithdrawCount = wallets.reduce((s, w) => s + w.pendingTransactionsCount, 0);

  const handleAdjustBalance = async (action: 'add' | 'remove') => {
    if (!selectedWallet) return;
    const amountVal = parseFloat(adjustAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      addToast('Validation', 'Please provide a valid amount.', 'error');
      return;
    }

    try {
      await onAdjustWallet(selectedWallet.telegramId, action, amountVal);
      addToast('Wallet Sync', `Successfully adjusted @${selectedWallet.username} balance.`, 'success');
      
      // Update local selection
      setSelectedWallet(prev => {
        if (!prev) return null;
        let nextBal = prev.walletBalance;
        if (action === 'add') nextBal += amountVal;
        if (action === 'remove') nextBal = Math.max(0, nextBal - amountVal);
        return { ...prev, walletBalance: nextBal };
      });
    } catch (err) {
      addToast('Adjustment error', 'Failed to adjust balance.', 'error');
    }
  };

  return (
    <div id="wallet-management-module" className="space-y-6 select-none animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-100 font-sans">Wallet Management</h2>
        <p className="text-xs text-slate-400">Audit player ledger assets, monitor aggregate hot wallet holdings, and process credits.</p>
      </div>

      {/* Aggregate Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
          <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block">System Hot Wallet</span>
          <p className="text-md font-bold text-slate-100 tracking-tight leading-none mt-1.5 flex items-center gap-1">
            <Wallet className="w-4 h-4 text-purple-400" />
            <span>{(totalBalance + 50000).toFixed(2)} TON</span>
          </p>
          <span className="text-[8px] font-mono text-emerald-400 mt-1 block">Safe (Reserves: OK)</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
          <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block">Total Player Holdings</span>
          <p className="text-md font-bold text-slate-100 tracking-tight leading-none mt-1.5 flex items-center gap-1">
            <Landmark className="w-4 h-4 text-indigo-400" />
            <span>{totalBalance.toFixed(2)} TON</span>
          </p>
          <span className="text-[8px] font-mono text-slate-500 mt-1 block">Liability ledger assets</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
          <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block">Accumulated Deposits</span>
          <p className="text-md font-bold text-slate-100 tracking-tight leading-none mt-1.5 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            <span>{totalDeposited.toFixed(2)} TON</span>
          </p>
          <span className="text-[8px] font-mono text-emerald-400 mt-1 block">Inflows today</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
          <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block">Accumulated Withdraws</span>
          <p className="text-md font-bold text-slate-100 tracking-tight leading-none mt-1.5 flex items-center gap-1">
            <ArrowDownLeft className="w-4 h-4 text-rose-400" />
            <span>{totalWithdrawn.toFixed(2)} TON</span>
          </p>
          <span className="text-[8px] font-mono text-rose-400 mt-1 block">Outflows today</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
          <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block">Pending Approvals</span>
          <p className="text-md font-bold text-slate-100 tracking-tight leading-none mt-1.5 flex items-center gap-1">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{totalPendingWithdrawCount} requests</span>
          </p>
          <span className="text-[8px] font-mono text-slate-500 mt-1 block">Requires admin signoff</span>
        </div>
      </div>

      {/* Main ledger grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ledger table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search wallet ledger by Username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-900/60 pb-3">
                    <th className="pb-3 font-medium">Player</th>
                    <th className="pb-3 font-medium">Cash Balance</th>
                    <th className="pb-3 font-medium">Bonus Balance</th>
                    <th className="pb-3 font-medium">Deposited</th>
                    <th className="pb-3 font-medium">Withdrawn</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/40">
                  {filteredWallets.map((w) => (
                    <tr 
                      key={w.telegramId}
                      onClick={() => setSelectedWallet(w)}
                      className={`hover:bg-slate-900/15 cursor-pointer transition ${selectedWallet?.telegramId === w.telegramId ? 'bg-purple-950/10' : ''}`}
                    >
                      <td className="py-3 font-sans font-semibold text-slate-200">@{w.username}</td>
                      <td className="py-3 text-purple-400 font-extrabold">{w.walletBalance.toFixed(2)} TON</td>
                      <td className="py-3 text-slate-400">{w.bonusBalance.toFixed(2)} TON</td>
                      <td className="py-3 text-slate-400 font-bold">{w.totalDeposits.toFixed(2)} TON</td>
                      <td className="py-3 text-slate-400 font-bold">{w.totalWithdrawals.toFixed(2)} TON</td>
                      <td className="py-3">
                        {w.isFrozen ? (
                          <span className="text-[10px] text-rose-400 bg-rose-950/20 border border-rose-900/40 px-2.5 py-0.5 rounded-full font-sans">Frozen</span>
                        ) : (
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 px-2.5 py-0.5 rounded-full font-sans">Active</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Wallet Audit Column */}
        <div>
          {selectedWallet ? (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-900 pb-3 flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">Wallet Audit</h3>
                  <p className="text-sm font-bold text-slate-100 font-sans mt-0.5">@{selectedWallet.username}</p>
                </div>
                <div className="text-[10px] font-mono text-slate-500">TG: {selectedWallet.telegramId}</div>
              </div>

              {/* Status Banner */}
              {selectedWallet.isFrozen && (
                <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-xl flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-rose-300 leading-normal">
                    This account is restricted. Withdrawal requests and outgoing stakes from this address are halted.
                  </p>
                </div>
              )}

              {/* Balance adjust card */}
              <div className="space-y-3.5">
                <h4 className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">Adjust Balance</h4>
                
                <div className="p-3.5 bg-slate-900/40 border border-slate-900 rounded-xl space-y-3">
                  <div>
                    <label className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block mb-1">Adjustment Amount (TON)</label>
                    <input
                      type="number"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAdjustBalance('add')}
                      className="flex-1 bg-purple-600 hover:bg-purple-500 text-slate-100 text-xs py-2 rounded-lg font-semibold flex items-center justify-center space-x-1 cursor-pointer transition-all"
                    >
                      <span>Add (Credit)</span>
                    </button>
                    <button
                      onClick={() => handleAdjustBalance('remove')}
                      className="flex-1 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-300 text-xs py-2 rounded-lg font-medium flex items-center justify-center space-x-1 cursor-pointer transition-all"
                    >
                      <span>Subtract (Debit)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary telemetry */}
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-900/30">
                  <span className="text-slate-500">Pending withdrawals:</span>
                  <span className="font-bold text-slate-300">{selectedWallet.pendingTransactionsCount} transactions</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900/30">
                  <span className="text-slate-500">Lifetime Deposits:</span>
                  <span className="font-bold text-emerald-400">{selectedWallet.totalDeposits.toFixed(2)} TON</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Lifetime Withdrawals:</span>
                  <span className="font-bold text-rose-400">{selectedWallet.totalWithdrawals.toFixed(2)} TON</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center border border-dashed border-slate-900 rounded-3xl text-slate-600">
              <Landmark className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-xs font-mono max-w-[200px] mx-auto leading-relaxed">Select a wallet account from the ledger to view detailed assets telemetry and adjust liquidity.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
