import { motion } from 'motion/react';
import { Clock, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { tgWebApp } from '../utils/telegram';

interface RecentHistoryProps {
  onViewHistoryTab: () => void;
}

export function RecentHistory({ onViewHistoryTab }: RecentHistoryProps) {
  const { history } = useGameStore();

  const recentTickets = history.slice(0, 3);

  return (
    <div className="rounded-2xl glass-card p-4 border border-violet-500/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-bold font-display text-gray-200">Recent Rounds</h3>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              tgWebApp.haptic.impact('soft');
              onViewHistoryTab();
            }}
            className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center space-x-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {recentTickets.map((ticket) => {
          const isWon = ticket.status === 'won';
          return (
            <motion.div
              key={ticket.id}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="p-3 rounded-xl bg-gray-950/40 border border-gray-900/60 flex items-center justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-900 px-1.5 py-0.5 rounded border border-gray-800">
                    Round #{ticket.roundNumber}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {new Date(ticket.createdAt).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
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
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider font-display flex items-center justify-end space-x-1">
                      <Trophy className="w-3 h-3" />
                      <span>x{ticket.multiplier.toFixed(1)}</span>
                    </span>
                    <p className="text-xs font-bold font-mono text-amber-400 text-glow-gold">
                      +{ticket.prizeAmount} TON
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-display">
                      LOST
                    </span>
                    <p className="text-xs font-bold font-mono text-gray-500">-{ticket.betAmount} TON</p>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}

        {recentTickets.length === 0 && (
          <div className="text-center py-6 border border-dashed border-gray-800 rounded-xl bg-gray-950/20">
            <span className="text-xs text-gray-500">No rounds played yet. Step onto the board!</span>
          </div>
        )}
      </div>
    </div>
  );
}
