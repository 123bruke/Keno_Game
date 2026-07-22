import { motion, AnimatePresence } from 'motion/react';
import { Award, RefreshCw, Share2, Sparkles, Trophy, HelpCircle, ShieldCheck } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { tgWebApp } from '../utils/telegram';

interface WinningNumbersProps {
  numbers: number[];
  selectedNumbers?: number[];
}

export function WinningNumbers({ numbers, selectedNumbers = [] }: WinningNumbersProps) {
  return (
    <div className="grid grid-cols-10 gap-1.5 p-3 rounded-xl bg-gray-950/40 border border-gray-900/50">
      {numbers.map((num, idx) => {
        const isMatched = selectedNumbers.includes(num);
        return (
          <motion.div
            key={`${num}-${idx}`}
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: idx * 0.03 }}
            className={`aspect-square rounded-full flex items-center justify-center text-xs font-mono font-bold border select-none ${
              isMatched
                ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 border-amber-300 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                : 'bg-violet-950/40 border-violet-500/10 text-violet-300'
            }`}
          >
            {num}
          </motion.div>
        );
      })}
      {numbers.length === 0 && (
        <span className="col-span-10 text-center text-xs text-gray-600 py-4 font-medium">
          No winning numbers drawn yet
        </span>
      )}
    </div>
  );
}

export function MatchCounter() {
  const { selectedNumbers, drawnNumbers } = useGameStore();

  const matches = selectedNumbers.filter((n) => drawnNumbers.includes(n));
  const matchCount = matches.length;

  return (
    <div className="rounded-2xl glass-card p-4 border border-violet-500/10 flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-display">Active Matching</span>
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-lg font-bold text-gray-200">
            {matchCount} <span className="text-xs text-gray-500">/ {selectedNumbers.length} matches</span>
          </span>
        </div>
      </div>

      <div className="flex gap-1.5 max-w-[50%] overflow-x-auto py-1">
        {matches.map((num) => (
          <span
            key={num}
            className="w-6 h-6 rounded-full bg-amber-500 border border-amber-400 flex items-center justify-center text-[10px] font-mono font-bold text-slate-950 shadow-[0_0_8px_rgba(245,158,11,0.4)] animate-bounce"
          >
            {num}
          </span>
        ))}
        {matches.length === 0 && (
          <span className="text-[10px] font-semibold text-gray-500">Waiting for match hits...</span>
        )}
      </div>
    </div>
  );
}

export function DrawAnimation() {
  const { drawnNumbers, currentDrawBall, drawProgress, selectedNumbers } = useGameStore();

  const latestBall = currentDrawBall;
  const isMatch = latestBall !== null && selectedNumbers.includes(latestBall);

  // Render a mini 1-80 board where drawn numbers get highlighted
  const allNumbers = Array.from({ length: 80 }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      {/* Container / Tube swirling simulator */}
      <div className="relative h-44 rounded-2xl border border-violet-500/10 bg-[#070519] overflow-hidden flex flex-col items-center justify-center">
        {/* Swirling particle background SVG */}
        <div className="absolute inset-0 opacity-25">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="swirl" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0b071e" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="50%" cy="50%" r="80" fill="url(#swirl)" className="animate-pulse" />
          </svg>
        </div>

        {/* Flying random spheres in background to simulate lottery barrel */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full bg-violet-600/10 border border-violet-500/15"
              animate={{
                x: [Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100],
                y: [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
              }}
            />
          ))}
        </div>

        {/* Floating current revealed ball */}
        <AnimatePresence mode="wait">
          {latestBall ? (
            <motion.div
              key={latestBall}
              initial={{ scale: 0, y: 50, rotate: -180 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.8, y: -50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 15 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center border-4 select-none ${
                  isMatch
                    ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 border-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.8)]'
                    : 'bg-gradient-to-br from-violet-500 via-indigo-600 to-purple-800 border-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.6)]'
                }`}
              >
                <span
                  className={`text-3xl font-extrabold font-mono tracking-tight ${
                    isMatch ? 'text-slate-950' : 'text-white text-glow'
                  }`}
                >
                  {latestBall}
                </span>
              </div>
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider font-display mt-2 ${
                  isMatch ? 'text-amber-400 text-glow-gold' : 'text-violet-400'
                }`}
              >
                {isMatch ? '⭐ MATCH HIT ⭐' : 'DRAWN'}
              </span>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-2 z-10 px-4">
              <RefreshCw className="w-8 h-8 text-violet-500 animate-spin" />
              <p className="text-sm font-bold text-gray-300 font-display">Activating Provably Fair Lottery...</p>
              <span className="text-[10px] text-gray-500">Retrieving server seeds and preparing draw container</span>
            </div>
          )}
        </AnimatePresence>

        {/* Progress Bar overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-950/60">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 shadow-[0_0_8px_#8b5cf6]"
            style={{ width: `${drawProgress}%` }}
          />
        </div>
        <span className="absolute bottom-2 right-4 text-[10px] font-mono font-bold text-gray-500">
          {drawnNumbers.length} / 20 BALLS
        </span>
      </div>

      {/* Mini 1-80 Grid tracker */}
      <div className="rounded-2xl glass-card p-3 border border-violet-500/10">
        <div className="grid grid-cols-10 gap-1">
          {allNumbers.map((num) => {
            const isDrawn = drawnNumbers.includes(num);
            const isSelected = selectedNumbers.includes(num);
            const isMatched = isDrawn && isSelected;

            return (
              <div
                key={num}
                className={`aspect-square rounded-md text-[8px] font-mono font-bold flex items-center justify-center border transition-all duration-300 select-none ${
                  isMatched
                    ? 'bg-amber-500 border-amber-300 text-slate-950 font-black shadow-[0_0_6px_rgba(245,158,11,0.5)] scale-105 z-10'
                    : isDrawn
                    ? 'bg-violet-600 border-violet-400 text-white shadow-[0_0_4px_rgba(139,92,246,0.3)]'
                    : isSelected
                    ? 'bg-violet-950/50 border-violet-500/30 text-violet-300'
                    : 'bg-gray-950/30 border-gray-900/60 text-gray-700'
                }`}
              >
                {num}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function PrizeCard() {
  const { lastTicket, resetGame } = useGameStore();

  if (!lastTicket) return null;

  const isWin = lastTicket.status === 'won';
  const selectedCount = lastTicket.selectedNumbers.length;
  const matchCount = lastTicket.matches.length;

  const handleShare = () => {
    tgWebApp.haptic.impact('medium');
    const text = `🎰 Just played Keno on Telegram! Picked ${selectedCount} numbers, matched ${matchCount}, and won ${lastTicket.prizeAmount} TON! Play now!`;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="rounded-3xl glass-card border border-violet-500/15 p-6 relative overflow-hidden text-center space-y-6">
      {/* Particle overlay for win celebration */}
      {isWin && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-amber-400"
              initial={{ y: '100%', x: Math.random() * 300 - 150 }}
              animate={{ y: '-20%', x: Math.random() * 300 - 150 }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeOut',
              }}
              style={{ bottom: 0, left: '50%' }}
            />
          ))}
        </div>
      )}

      {/* Icon / Header Badge */}
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 15 }}
          className={`p-4 rounded-full border ${
            isWin
              ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 border-amber-300 text-slate-950 casino-glow-gold'
              : 'bg-gray-900 border-gray-800 text-gray-500'
          }`}
        >
          {isWin ? <Trophy className="w-10 h-10 animate-bounce" /> : <Award className="w-10 h-10" />}
        </motion.div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black font-display tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent uppercase">
          {isWin ? '🎰 CASINO VICTORY 🎰' : 'No Prize This Draw'}
        </h2>
        <p className="text-xs text-gray-400 font-medium">
          Matched <span className="font-mono font-bold text-gray-200">{matchCount}</span> of{' '}
          <span className="font-mono font-bold text-gray-200">{selectedCount}</span> selected numbers
        </p>
      </div>

      {/* Prize / Multiplier Displays */}
      {isWin ? (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 max-w-sm mx-auto flex flex-col justify-center items-center">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-display block mb-1">
            Total Multiplier Earned
          </span>
          <span className="text-3xl font-black font-mono text-amber-400 text-glow-gold">
            x{lastTicket.multiplier.toFixed(1)}
          </span>
          
          <div className="w-full border-t border-amber-500/15 mt-3 pt-3 flex justify-between items-center px-4">
            <span className="text-xs text-gray-400">Winning Payout:</span>
            <span className="text-lg font-black font-mono text-amber-400 text-glow-gold">
              +{lastTicket.prizeAmount.toLocaleString()} TON
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-gray-950/40 border border-gray-900/60 max-w-sm mx-auto flex justify-between items-center px-6">
          <span className="text-xs text-gray-500">Deducted Stake:</span>
          <span className="text-sm font-bold font-mono text-gray-400">-{lastTicket.betAmount} TON</span>
        </div>
      )}

      {/* Selected Numbers and Matches list display */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-display block">Your Board Hits</span>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {lastTicket.selectedNumbers.map((num) => {
            const isMatch = lastTicket.matches.includes(num);
            return (
              <span
                key={num}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                  isMatch
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-300 text-slate-950 shadow-md'
                    : 'bg-violet-950/20 border-violet-500/5 text-gray-500'
                }`}
              >
                {num}
              </span>
            );
          })}
        </div>
      </div>

      {/* Provably Fair verification code snapshot */}
      <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-900 text-left space-y-1.5 max-w-sm mx-auto">
        <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 uppercase font-bold tracking-wider">
          <span className="flex items-center space-x-1"><ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" /> <span>Provably Fair</span></span>
          <span>Round #{lastTicket.roundNumber}</span>
        </div>
        <div className="text-[10px] text-gray-400 flex justify-between font-mono">
          <span>Ticket ID:</span>
          <span className="text-gray-300">{lastTicket.id}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-3 max-w-sm mx-auto">
        <button
          onClick={handleShare}
          className="flex-1 py-3 px-4 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800 text-sm font-bold text-gray-300 hover:text-white transition-all flex items-center justify-center space-x-2 active:scale-95"
        >
          <Share2 className="w-4 h-4 text-gray-400" />
          <span>Share Win</span>
        </button>

        <button
          onClick={() => {
            tgWebApp.haptic.impact('heavy');
            resetGame();
          }}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all text-sm font-bold text-white shadow-md casino-glow-purple flex items-center justify-center space-x-2 active:scale-95"
        >
          <RefreshCw className="w-4 h-4 text-violet-200" />
          <span>Play Again</span>
        </button>
      </div>
    </div>
  );
}
