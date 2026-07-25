import React, { useState } from 'react';
import { useAdminStore } from '../store/useStore';
import { Search, Filter, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionsModuleProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export const TransactionsModule: React.FC<TransactionsModuleProps> = ({ transactions, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredTx = transactions.filter(t => {
    const matchesSearch = 
      t.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.telegramId.includes(searchTerm);
    
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTx.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTx = filteredTx.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div id="transactions-module" className="space-y-6 select-none animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-100 font-sans">Transaction Ledger</h2>
        <p className="text-xs text-slate-400">View real-time cash inflows, bet stakes, payout wins, and account audits.</p>
      </div>

      {/* Advanced Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Transaction ID or User..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto justify-end">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 cursor-pointer focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="bet">Bet Stakes</option>
            <option value="win">Win Payouts</option>
            <option value="refund">Refunds</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 cursor-pointer focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-500 border-b border-slate-900/60 pb-3">
                <th className="pb-3 font-medium">Transaction ID</th>
                <th className="pb-3 font-medium">Date Stamp</th>
                <th className="pb-3 font-medium">Player</th>
                <th className="pb-3 font-medium">Transaction Type</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Bal. Before</th>
                <th className="pb-3 font-medium">Bal. After</th>
                <th className="pb-3 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/40">
              {paginatedTx.map((tx) => {
                const isPositive = tx.type === 'deposit' || tx.type === 'win' || tx.type === 'refund';
                return (
                  <tr key={tx.transactionId} className="hover:bg-slate-900/10 transition-all">
                    <td className="py-3 text-slate-300 font-bold">{tx.transactionId}</td>
                    <td className="py-3 text-slate-400 text-[10px]">
                      {new Date(tx.date).toLocaleString()}
                    </td>
                    <td className="py-3 text-slate-200 font-sans font-semibold">@{tx.username}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[9px] font-sans font-bold uppercase tracking-wide ${
                        tx.type === 'deposit' ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30' :
                        tx.type === 'win' ? 'bg-purple-950/20 text-purple-400 border border-purple-900/30' :
                        tx.type === 'bet' ? 'bg-slate-900 text-slate-400 border border-slate-800' :
                        tx.type === 'withdrawal' ? 'bg-rose-950/20 text-rose-400 border border-rose-900/30' :
                        'bg-blue-950/20 text-blue-400 border border-blue-900/30'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`py-3 font-extrabold ${isPositive ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {isPositive ? '+' : '-'}{tx.amount.toFixed(2)} TON
                    </td>
                    <td className="py-3 text-slate-500">{tx.balanceBefore.toFixed(2)} TON</td>
                    <td className="py-3 text-slate-400 font-bold">{tx.balanceAfter.toFixed(2)} TON</td>
                    <td className="py-3 text-right">
                      {tx.status === 'completed' ? (
                        <span className="text-emerald-400 text-[10px] font-sans font-semibold">Completed</span>
                      ) : tx.status === 'failed' ? (
                        <span className="text-rose-400 text-[10px] font-sans font-semibold">Failed</span>
                      ) : (
                        <span className="text-amber-400 text-[10px] font-sans font-semibold animate-pulse">Pending</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {paginatedTx.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No transactions found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-900 text-xs text-slate-400">
            <span>Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredTx.length)} of {filteredTx.length} items</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
