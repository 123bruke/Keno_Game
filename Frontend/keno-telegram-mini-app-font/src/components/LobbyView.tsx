import { motion } from 'motion/react';
import { Play, Sparkles, HelpCircle, Shield, Award } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { WalletCard } from './Wallet';
import { BetAmountCard } from './Bet';
import { RecentHistory } from './RecentHistory';
import { tgWebApp } from '../utils/telegram';

interface LobbyViewProps {
  onRoute: (view: 'play' | 'history' | 'fairness') => void;
  onPlayRound: () => void;
}

export function LobbyView({ onRoute, onPlayRound }: LobbyViewProps) {
  const { selectedNumbers, betAmount } = useGameStore();
  const pickCount = selectedNumbers.length;

  return (
    <div className="space-y-5 pb-24">
      {/* Immersive Casino Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 border border-violet-500/10 p-6 flex flex-col justify-between min-h-[160px] shadow-lg">
        {/* Decorative ambient elements */}
        <div className="absolute right-0 top-0 w-44 h-44 bg-violet-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[9px] font-black uppercase tracking-widest text-amber-400 font-display inline-flex items-center space-x-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Provably Fair Casino</span>
          </span>
          <h1 className="text-3xl font-black tracking-tight font-display bg-gradient-to-r from-white via-violet-100 to-violet-300 bg-clip-text text-transparent">
            KENO <span className="text-violet-400 text-glow">LOTTERY</span>
          </h1>
          <p className="text-xs text-violet-300/70 max-w-[250px] leading-relaxed">
            Select up to 10 lucky numbers and draw 20 balls to multiply your stake up to <span className="text-amber-400 font-extrabold font-mono text-glow-gold">100,000x</span>!
          </p>
        </div>

        {/* Floating elements */}
        <div className="absolute right-6 bottom-4 text-right z-10">
          <span className="text-[10px] font-mono text-gray-400 block uppercase tracking-wider leading-none">House Edge</span>
          <span className="text-sm font-black text-violet-400 font-mono mt-1 inline-block">1.00% (99% RTP)</span>
        </div>
      </div>

      {/* Wallet balance display card */}
      <WalletCard />

      {/* Bet size selector */}
      <BetAmountCard />

      {/* Primary Landing Action Button */}
      {pickCount > 0 ? (
        <button
          onClick={() => {
            tgWebApp.haptic.impact('heavy');
            onPlayRound();
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 transition-all duration-300 text-sm font-bold text-white shadow-lg casino-glow-purple flex items-center justify-center space-x-2.5 cursor-pointer active:scale-[0.98]"
        >
          <Play className="w-4 h-4 text-violet-100 fill-violet-100" />
          <span>PLAY CURRENT ROUND ({pickCount} Picks) • {betAmount} TON</span>
        </button>
      ) : (
        <button
          onClick={() => {
            tgWebApp.haptic.impact('medium');
            onRoute('play');
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all duration-300 text-sm font-bold text-white shadow-lg casino-glow-purple flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]"
        >
          <Play className="w-4 h-4 text-violet-100 fill-violet-100 animate-pulse" />
          <span>SELECT LUCKY NUMBERS</span>
        </button>
      )}

      {/* Recent history list preview */}
      <RecentHistory onViewHistoryTab={() => onRoute('history')} />

      {/* Quick Instruction Card */}
      <div className="rounded-2xl glass-card p-4 border border-violet-500/5 flex items-start space-x-3 bg-violet-950/5">
        <HelpCircle className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-bold text-gray-300 font-display">How to Play</span>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Choose your bet size, click numbers on the board grid to select, or click "Auto Tools" for automatic Quick Picks. Once drawn, 20 deterministic winning numbers will be generated via secure server cryptography. Matching your selected numbers with the drawn numbers earns multipliers according to the prize index.
          </p>
        </div>
      </div>
    </div>
  );
}
