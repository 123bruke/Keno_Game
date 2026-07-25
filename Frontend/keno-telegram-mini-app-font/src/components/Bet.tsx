import { Coins, Award } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { tgWebApp } from '../utils/telegram';

// Keno Multipliers table for displaying prospective winnings
export const CASINO_MULTIPLIERS: { [key: number]: { [match: number]: number } } = {
  1: { 1: 3.0 },
  2: { 1: 1.0, 2: 9.0 },
  3: { 1: 1.0, 2: 2.5, 3: 16.0 },
  4: { 1: 0.5, 2: 2.0, 3: 5.0, 4: 50.0 },
  5: { 2: 1.5, 3: 3.5, 4: 15.0, 5: 250.0 },
  6: { 2: 1.0, 3: 2.5, 4: 7.0, 5: 60.0, 6: 1000.0 },
  7: { 2: 1.0, 3: 1.5, 4: 5.0, 5: 20.0, 6: 150.0, 7: 3000.0 },
  8: { 2: 0.5, 3: 1.0, 4: 4.0, 5: 10.0, 6: 50.0, 7: 500.0, 8: 10000.0 },
  9: { 3: 1.0, 4: 2.5, 5: 5.0, 6: 25.0, 7: 150.0, 8: 1000.0, 9: 25000.0 },
  10: { 3: 1.0, 4: 1.5, 5: 4.0, 6: 15.0, 7: 80.0, 8: 500.0, 9: 2500.0, 10: 100000.0 },
};

export function BetAmountCard() {
  const { betAmount, setBetAmount, wallet } = useGameStore();

  const handleAdjust = (amount: number) => {
    tgWebApp.haptic.impact('soft');
    const newBet = Math.max(1, Math.min(wallet.balance, parseFloat((betAmount + amount).toFixed(2))));
    setBetAmount(newBet);
  };

  const handleDouble = () => {
    tgWebApp.haptic.impact('soft');
    const newBet = Math.min(wallet.balance, parseFloat((betAmount * 2).toFixed(2)));
    setBetAmount(Math.max(1, newBet));
  };

  const handleHalf = () => {
    tgWebApp.haptic.impact('soft');
    const newBet = parseFloat((betAmount / 2).toFixed(2));
    setBetAmount(Math.max(1, newBet));
  };

  const handleMin = () => {
    tgWebApp.haptic.impact('soft');
    setBetAmount(1);
  };

  const handleMax = () => {
    tgWebApp.haptic.impact('soft');
    setBetAmount(Math.max(1, Math.floor(wallet.balance)));
  };

  const chipsPresets = [1, 5, 10, 50, 100];

  return (
    <div className="rounded-2xl glass-card p-4 border border-violet-500/10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-display flex items-center space-x-1.5">
          <Coins className="w-3.5 h-3.5 text-violet-400" />
          <span>Select Bet Size</span>
        </span>
        <span className="text-xs font-mono font-bold text-violet-300 bg-violet-950/30 px-2 py-0.5 rounded border border-violet-500/10">
          MAX: {wallet.balance.toFixed(0)} TON
        </span>
      </div>

      {/* Bet input & quick operations */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative rounded-xl border border-gray-800 focus-within:border-violet-500/40 bg-gray-950 overflow-hidden">
          <input
            type="number"
            value={betAmount === 0 ? '' : betAmount}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setBetAmount(isNaN(val) ? 0 : Math.max(0, val));
            }}
            placeholder="Bet size"
            className="w-full bg-transparent border-0 focus:outline-none px-3.5 py-2.5 text-base font-mono font-bold text-white"
            min="1"
            max={wallet.balance}
            step="any"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 font-display">TON</span>
        </div>

        <button
          onClick={handleHalf}
          className="px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-xs font-bold text-gray-400 hover:text-white cursor-pointer active:scale-95"
        >
          ½
        </button>
        <button
          onClick={handleDouble}
          className="px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-xs font-bold text-gray-400 hover:text-white cursor-pointer active:scale-95"
        >
          2x
        </button>
        <button
          onClick={handleMin}
          className="px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-xs font-bold text-gray-400 hover:text-white cursor-pointer active:scale-95"
        >
          MIN
        </button>
        <button
          onClick={handleMax}
          className="px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-xs font-bold text-gray-400 hover:text-white cursor-pointer active:scale-95"
        >
          MAX
        </button>
      </div>

      {/* Chips presetter */}
      <div className="grid grid-cols-5 gap-1.5 mt-3">
        {chipsPresets.map((chip) => (
          <button
            key={chip}
            onClick={() => handleAdjust(chip)}
            className="py-1.5 rounded-lg bg-violet-950/10 hover:bg-violet-950/20 border border-violet-500/10 text-xs font-mono font-bold text-violet-300 hover:text-violet-200 active:scale-95"
          >
            +{chip}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TicketSummary() {
  const { selectedNumbers, betAmount } = useGameStore();
  const pickCount = selectedNumbers.length;

  const currentPayouts = CASINO_MULTIPLIERS[pickCount] || {};
  const hasPayouts = Object.keys(currentPayouts).length > 0;

  return (
    <div className="rounded-2xl glass-card p-4 border border-violet-500/10 flex flex-col h-full justify-between">
      <div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-display flex items-center space-x-1.5 mb-2.5">
          <Award className="w-3.5 h-3.5 text-violet-400" />
          <span>Prospective Payouts</span>
        </span>

        {pickCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-gray-800 rounded-xl bg-gray-950/20">
            <span className="text-[11px] font-medium text-gray-500 max-w-[180px] leading-relaxed">
              Select 1 to 10 numbers to view the prize multiplier table
            </span>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[145px] overflow-y-auto pr-1">
            {/* Table Header */}
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2">
              <span>Matches</span>
              <span>Multiplier</span>
              <span>Possible Prize</span>
            </div>

            {/* List */}
            {Object.entries(currentPayouts)
              .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
              .map(([match, mult]) => {
                const prize = parseFloat((betAmount * mult).toFixed(2));
                return (
                  <div
                    key={match}
                    className="flex justify-between items-center bg-gray-950/40 border border-gray-900/50 px-2.5 py-1.5 rounded-lg"
                  >
                    <span className="text-xs font-bold text-gray-300 font-display">
                      {match} {parseInt(match) === 1 ? 'Match' : 'Matches'}
                    </span>
                    <span className="text-xs font-mono font-bold text-violet-400">
                      x{mult.toFixed(1)}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400 text-glow-gold">
                      {prize.toLocaleString()} TON
                    </span>
                  </div>
                );
              })}

            {!hasPayouts && (
              <div className="text-center py-2 text-[10px] text-gray-500">
                No winning matches for {pickCount} picks.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-500 uppercase font-display leading-none">Total Stake</span>
          <span className="text-sm font-bold font-mono text-gray-200 mt-0.5">{betAmount} TON</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] font-bold text-gray-500 uppercase font-display leading-none">Max Potential Winnings</span>
          <span className="text-sm font-bold font-mono text-amber-400 text-glow-gold mt-0.5">
            {hasPayouts
              ? (betAmount * Math.max(...Object.values(currentPayouts))).toLocaleString(undefined, { maximumFractionDigits: 2 })
              : '0'}{' '}
            TON
          </span>
        </div>
      </div>
    </div>
  );
}
