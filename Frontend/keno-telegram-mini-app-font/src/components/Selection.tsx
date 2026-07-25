import { motion } from 'motion/react';
import { Sparkles, Trash2, Check } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { tgWebApp } from '../utils/telegram';

interface NumberButtonProps {
  number: number;
  isSelected: boolean;
  onToggle: (num: number) => void;
  key?: number;
}

export function NumberButton({ number, isSelected, onToggle }: NumberButtonProps) {
  return (
    <button
      onClick={() => {
        tgWebApp.haptic.impact('soft');
        onToggle(number);
      }}
      className={`relative w-full aspect-square rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center cursor-pointer select-none active:scale-90 ${
        isSelected
          ? 'bg-gradient-to-br from-violet-500 to-indigo-600 border border-violet-400 text-white shadow-[0_2px_10px_rgba(139,92,246,0.5)] z-10'
          : 'bg-casino-card hover:bg-gray-800/80 border border-gray-800/60 text-gray-400 hover:text-white'
      }`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {isSelected && (
        <motion.div
          layoutId={`selected-bg-${number}`}
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 -z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
        />
      )}
      <span>{number}</span>
      {isSelected && (
        <span className="absolute bottom-1 right-1 text-[7px] text-violet-200">
          <Check className="w-1.5 h-1.5" strokeWidth={4} />
        </span>
      )}
    </button>
  );
}

export function NumberGrid() {
  const { selectedNumbers, addSelectedNumber, removeSelectedNumber } = useGameStore();

  const numbers = Array.from({ length: 80 }, (_, i) => i + 1);

  const handleToggle = (num: number) => {
    if (selectedNumbers.includes(num)) {
      removeSelectedNumber(num);
    } else {
      addSelectedNumber(num);
    }
  };

  return (
    <div className="rounded-2xl glass-card p-4 border border-violet-500/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold font-display text-gray-200">Keno Selection Grid</h3>
          <span className="text-[10px] text-gray-500 font-medium">Pick 1 to 10 numbers</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-xs font-bold font-mono text-violet-400 bg-violet-950/20 px-2 py-0.5 rounded border border-violet-500/10">
            {selectedNumbers.length}
          </span>
          <span className="text-[10px] font-semibold text-gray-500">/ 10 selected</span>
        </div>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
        {numbers.map((num) => (
          <NumberButton
            key={num}
            number={num}
            isSelected={selectedNumbers.includes(num)}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}

export function SelectedNumbers() {
  const { selectedNumbers, clearSelectedNumbers, quickPick, settings } = useGameStore();

  const handleClear = () => {
    tgWebApp.haptic.impact('medium');
    clearSelectedNumbers();
  };

  const handleQuickPick = (count: number) => {
    tgWebApp.haptic.impact('heavy');
    quickPick(count);
  };

  return (
    <div className="rounded-2xl glass-card p-4 border border-violet-500/10 space-y-4">
      {/* Quick pick & clear bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-display">Auto Tools</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {selectedNumbers.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center space-x-1 py-1 px-2.5 rounded-lg border border-rose-500/10 bg-rose-950/10 hover:bg-rose-950/20 text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors active:scale-95"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Board</span>
            </button>
          )}

          <div className="flex space-x-1 bg-gray-950 p-1 rounded-lg border border-gray-800">
            {[1, 3, 5, 10].map((count) => (
              <button
                key={count}
                onClick={() => handleQuickPick(count)}
                className="py-1 px-2 rounded-md text-[10px] font-mono font-bold text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors cursor-pointer"
              >
                QP{count}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Pills container */}
      <div className="min-h-[44px] flex flex-wrap gap-1.5 p-2 rounded-xl bg-gray-950/40 border border-gray-900/50 items-center">
        {selectedNumbers.length === 0 ? (
          <span className="text-xs text-gray-600 font-medium px-1 flex-1 text-center py-1">
            No numbers selected yet. Click numbers on the grid or use Quick Pick.
          </span>
        ) : (
          selectedNumbers.map((num) => (
            <motion.span
              key={num}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 text-xs font-mono font-bold text-violet-300 flex items-center space-x-1"
            >
              <span>{num}</span>
            </motion.span>
          ))
        )}
      </div>
    </div>
  );
}
