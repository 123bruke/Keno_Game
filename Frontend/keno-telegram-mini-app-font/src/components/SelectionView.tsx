import { useGameStore } from '../store/useGameStore';
import { NumberGrid, SelectedNumbers } from './Selection';
import { TicketSummary } from './Bet';
import { Play, Sparkles } from 'lucide-react';
import { tgWebApp } from '../utils/telegram';

interface SelectionViewProps {
  onPlayRound: () => void;
}

export function SelectionView({ onPlayRound }: SelectionViewProps) {
  const { selectedNumbers, betAmount, wallet, showToast } = useGameStore();

  const handlePlayClick = () => {
    if (selectedNumbers.length === 0) {
      showToast('Select at least 1 number to play!', 'info');
      return;
    }
    if (betAmount <= 0) {
      showToast('Please set a valid bet size!', 'info');
      return;
    }
    if (betAmount > wallet.balance) {
      showToast('Insufficient wallet balance!', 'error');
      return;
    }

    tgWebApp.haptic.impact('heavy');
    onPlayRound();
  };

  const isPlayDisabled = selectedNumbers.length === 0 || betAmount > wallet.balance;

  return (
    <div className="space-y-4 pb-24">
      {/* Visual Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Board Selector</h2>
          <p className="text-xs text-gray-500">Pick numbers manually or use Quick Pick chips</p>
        </div>
        <div className="flex items-center space-x-1.5 text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md font-display uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          <span>Multiplier Active</span>
        </div>
      </div>

      {/* Selected Numbers and Quick Tools */}
      <SelectedNumbers />

      {/* Grid */}
      <NumberGrid />

      {/* Prospective payouts and bet details */}
      <TicketSummary />

      {/* Big Action Button */}
      <button
        onClick={handlePlayClick}
        disabled={isPlayDisabled}
        className={`w-full py-4 rounded-2xl flex items-center justify-center space-x-2 text-sm font-bold shadow-lg transition-all cursor-pointer active:scale-[0.98] ${
          isPlayDisabled
            ? 'bg-gray-900 border border-gray-800 text-gray-500 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 hover:from-violet-500 hover:via-indigo-500 hover:to-indigo-600 text-white casino-glow-purple'
        }`}
      >
        <Play className={`w-4 h-4 ${isPlayDisabled ? 'text-gray-500' : 'text-violet-200'}`} fill="currentColor" />
        <span>
          {isPlayDisabled && betAmount > wallet.balance
            ? 'INSUFFICIENT BALANCE'
            : selectedNumbers.length === 0
            ? 'CHOOSE NUMBERS TO PLAY'
            : `PLAY ${selectedNumbers.length} PICKS FOR ${betAmount} TON`}
        </span>
      </button>
    </div>
  );
}
