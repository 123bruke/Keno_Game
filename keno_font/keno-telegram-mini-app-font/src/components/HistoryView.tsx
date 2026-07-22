import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { gameService } from '../services/gameService';
import { History, Trophy, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Search, ShieldCheck } from 'lucide-react';
import { Modal } from './UI';
import { Ticket } from '../types';
import { tgWebApp } from '../utils/telegram';

export function HistoryView() {
  const { history, setHistory } = useGameStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);
  
  // Total summary stats
  const [stats, setStats] = useState({
    totalGames: 0,
    totalWinnings: 0,
    totalBets: 0,
  });
  
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const fetchHistory = async (page: number) => {
    try {
      setLoading(true);
      const res = await gameService.getHistory(page, limit);
      setHistory(res.history);
      setStats({
        totalGames: res.totalGames,
        totalWinnings: res.totalWinnings,
        totalBets: res.totalBets,
      });
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage]);

  const totalPages = Math.max(1, Math.ceil(stats.totalGames / limit));

  const handlePrevPage = () => {
    if (currentPage > 1) {
      tgWebApp.haptic.impact('soft');
      setCurrentPage((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      tgWebApp.haptic.impact('soft');
      setCurrentPage((p) => p + 1);
    }
  };

  const netReturn = stats.totalWinnings - stats.totalBets;
  const isNetPositive = netReturn >= 0;

  // Numbers 1 to 80 for detail board mapping
  const boardNumbers = Array.from({ length: 80 }, (_, i) => i + 1);

  return (
    <div className="space-y-4 pb-24">
      {/* Visual Header */}
      <div>
        <h2 className="text-xl font-bold font-display text-white">Bets Ledger</h2>
        <p className="text-xs text-gray-500">Review and verify previous drawing cards</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-xl glass-card p-3 border border-violet-500/5 text-center">
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block font-display">Rounds</span>
          <span className="text-base font-bold font-mono text-gray-200 mt-1 block">{stats.totalGames}</span>
        </div>

        <div className="rounded-xl glass-card p-3 border border-violet-500/5 text-center">
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block font-display">Winnings</span>
          <span className="text-base font-bold font-mono text-amber-400 text-glow-gold mt-1 block">
            {stats.totalWinnings.toFixed(1)}
          </span>
        </div>

        <div className="rounded-xl glass-card p-3 border border-violet-500/5 text-center">
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block font-display">Net ROI</span>
          <span
            className={`text-base font-bold font-mono flex items-center justify-center space-x-1 mt-1 block ${
              isNetPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isNetPositive ? (
              <TrendingUp className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>{isNetPositive ? '+' : ''}{netReturn.toFixed(1)}</span>
          </span>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-2">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-800 rounded-2xl bg-gray-950/20">
            <History className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500">No transactions recorded yet</p>
          </div>
        ) : (
          history.map((ticket) => {
            const isWon = ticket.status === 'won';
            return (
              <div
                key={ticket.id}
                onClick={() => {
                  tgWebApp.haptic.impact('light');
                  setSelectedTicket(ticket);
                }}
                className="p-3.5 rounded-2xl bg-gray-950/40 hover:bg-gray-950/70 border border-gray-900 hover:border-violet-500/20 transition-all duration-200 flex items-center justify-between cursor-pointer active:scale-[0.99]"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold text-violet-400 bg-violet-950/20 border border-violet-500/10 px-2 py-0.5 rounded-md">
                      Round #{ticket.roundNumber}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-gray-400">
                      Picks: <span className="font-mono text-gray-200">{ticket.selectedNumbers.length}</span>
                    </span>
                    <span className="text-gray-700">•</span>
                    <span className="text-xs font-semibold text-gray-400">
                      Hits:{' '}
                      <span className={`font-mono font-bold ${isWon ? 'text-amber-400' : 'text-gray-300'}`}>
                        {ticket.matches.length}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  {isWon ? (
                    <>
                      <span className="text-[9px] font-black text-amber-500 uppercase tracking-wider font-display bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded inline-flex items-center space-x-1">
                        <Trophy className="w-2.5 h-2.5" />
                        <span>x{ticket.multiplier.toFixed(1)}</span>
                      </span>
                      <p className="text-sm font-bold font-mono text-amber-400 text-glow-gold">
                        +{ticket.prizeAmount} TON
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider font-display bg-gray-900 px-1.5 py-0.5 rounded">
                        LOST
                      </span>
                      <p className="text-sm font-bold font-mono text-gray-500">-{ticket.betAmount} TON</p>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {stats.totalGames > limit && (
        <div className="flex items-center justify-between px-2 pt-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || loading}
            className={`p-2 rounded-xl border border-gray-800 bg-gray-950/40 text-gray-400 transition-colors ${
              currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono font-bold text-gray-400">
            PAGE {currentPage} <span className="text-gray-600">/</span> {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || loading}
            className={`p-2 rounded-xl border border-gray-800 bg-gray-950/40 text-gray-400 transition-colors ${
              currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Expanded Ticket Details Modal */}
      <Modal
        isOpen={selectedTicket !== null}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket ? `Ticket Details - #${selectedTicket.roundNumber}` : ''}
      >
        {selectedTicket && (
          <div className="space-y-5 pb-4">
            {/* Upper Stats bar */}
            <div className="grid grid-cols-2 gap-2 bg-gray-950/40 border border-gray-900 p-3 rounded-xl">
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider font-display">Bet Placement</span>
                <p className="text-base font-bold font-mono text-gray-200 mt-0.5">{selectedTicket.betAmount} TON</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider font-display">Outcome</span>
                {selectedTicket.status === 'won' ? (
                  <p className="text-base font-bold font-mono text-amber-400 text-glow-gold mt-0.5">
                    +{selectedTicket.prizeAmount} TON (x{selectedTicket.multiplier.toFixed(1)})
                  </p>
                ) : (
                  <p className="text-base font-bold font-mono text-gray-500 mt-0.5">Lost</p>
                )}
              </div>
            </div>

            {/* Selected vs Winning Display Board */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-display block">Board Highlights</span>
              <div className="grid grid-cols-10 gap-1 p-2 bg-gray-950/60 rounded-xl border border-gray-900">
                {boardNumbers.map((num) => {
                  const isDrawn = selectedTicket.winningNumbers.includes(num);
                  const isSelected = selectedTicket.selectedNumbers.includes(num);
                  const isMatched = isDrawn && isSelected;

                  return (
                    <div
                      key={num}
                      className={`aspect-square rounded-md text-[8px] font-mono font-bold flex items-center justify-center border transition-all ${
                        isMatched
                          ? 'bg-amber-500 border-amber-300 text-slate-950 font-black'
                          : isDrawn
                          ? 'bg-violet-600/30 border-violet-500/20 text-violet-300'
                          : isSelected
                          ? 'bg-violet-950 border-violet-500/20 text-violet-400'
                          : 'bg-transparent border-gray-900/40 text-gray-700'
                      }`}
                    >
                      {num}
                    </div>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="flex justify-center space-x-4 text-[10px] font-semibold text-gray-500 pt-1">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-violet-950 border border-violet-500/20"></div>
                  <span>Picked</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-violet-600/30 border border-violet-500/20"></div>
                  <span>Winning Balls</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-amber-500 border border-amber-300"></div>
                  <span>Hits</span>
                </div>
              </div>
            </div>

            {/* Cryptographic verification box */}
            <div className="p-3.5 rounded-xl bg-gray-950/80 border border-gray-900 space-y-2 text-left">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-display flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Fairness Ledger Proof</span>
              </span>
              
              <div className="space-y-1.5 font-mono text-[10px] text-gray-400">
                <div className="flex justify-between">
                  <span>Ticket ID:</span>
                  <span className="text-gray-300">{selectedTicket.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span className="text-gray-300">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
