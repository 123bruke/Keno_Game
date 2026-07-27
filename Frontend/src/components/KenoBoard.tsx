import { useAppStore } from "../lib/store";

export default function KenoBoard({
  winningNumbers,
  revealedCount,
}: {
  winningNumbers?: number[];
  revealedCount?: number;
}) {
  const { selectedNumbers, toggleNumber } = useAppStore();
  const revealed = winningNumbers?.slice(0, revealedCount ?? 0) ?? [];

  return (
    <div className="glass-card rounded-2xl p-3 shadow-2xl border border-white/10">
      <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
        {Array.from({ length: 80 }, (_, i) => i + 1).map((num) => {
          const isSelected = selectedNumbers.includes(num);
          const isRevealed = revealed.includes(num);
          const isMatch = isSelected && isRevealed;

          let bgStyle = "bg-[#09090b] text-slate-300 hover:bg-[#12121c] border border-white/5";
          let glowClass = "";

          if (isMatch) {
            bgStyle = "bg-gradient-to-tr from-emerald-500 to-teal-400 text-black font-extrabold shadow-lg shadow-emerald-500/50 scale-105 animate-ball-pop border-emerald-300";
          } else if (isRevealed) {
            bgStyle = "bg-[#22D3EE] text-black font-bold shadow-md shadow-[#22D3EE]/40 border-[#22D3EE]";
            glowClass = "glow-cyan";
          } else if (isSelected) {
            bgStyle = "bg-[#C084FC] text-black font-bold shadow-md shadow-[#C084FC]/40 border-[#C084FC]";
            glowClass = "glow-purple";
          }

          return (
            <button
              key={num}
              onClick={() => toggleNumber(num)}
              disabled={isRevealed && isRevealed}
              className={`aspect-square rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center ${bgStyle} ${glowClass} disabled:cursor-not-allowed`}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
