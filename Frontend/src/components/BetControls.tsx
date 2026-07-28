import { useAppStore } from "../lib/store";
import { playSound } from "../lib/sound";
import { useWallet, useQuickPick } from "../lib/hooks";
import { Zap, Trash2, Clock, Flame } from "lucide-react";

// Default multiplier table preview mapping
const MULTIPLIERS_PREVIEW: Record<number, Record<number, number>> = {
  1: { 1: 3.8 },
  2: { 2: 15 },
  3: { 2: 2, 3: 42 },
  4: { 2: 1, 3: 10, 4: 100 },
  5: { 3: 2, 4: 15, 5: 300 },
  6: { 3: 1, 4: 7, 5: 70, 6: 1000 },
  7: { 4: 3, 5: 20, 6: 200, 7: 4000 },
  8: { 4: 2, 5: 10, 6: 90, 7: 750, 8: 10000 },
  9: { 5: 5, 6: 40, 7: 300, 8: 2500, 9: 25000 },
  10: { 0: 2, 5: 2, 6: 15, 7: 100, 8: 500, 9: 3000, 10: 100000 },
};

export default function BetControls({
  onPlay,
  isPlaying,
}: {
  onPlay: () => void;
  isPlaying: boolean;
}) {
  const {
    selectedNumbers,
    setSelection,
    clearSelection,
    betAmount,
    gameMode,
    setGameMode,
    language,
  } = useAppStore();
  const { data: wallet } = useWallet();
  const quickPickMutation = useQuickPick();

  const count = selectedNumbers.length;
  const canPlay = count >= 1 && count <= 10 && betAmount > 0 && (wallet?.totalBalance ?? 1000) >= betAmount;
  const multiplierTable = MULTIPLIERS_PREVIEW[count] || {};

  const handleQuickPick = (numCount: number) => {
    quickPickMutation.mutate(numCount, {
      onSuccess: (numbers) => setSelection(numbers),
      onError: () => {
        // Fallback local quick pick
        const picked = new Set<number>();
        while (picked.size < numCount) {
          picked.add(Math.floor(Math.random() * 80) + 1);
        }
        setSelection(Array.from(picked));
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Game Mode Selector */}
      <div className="flex bg-[#09090b] p-1 rounded-xl border border-white/10">
        <button
          onClick={() => { playSound('select'); setGameMode("INSTANT"); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            gameMode === "INSTANT"
              ? "bg-[#C084FC] text-black shadow-md shadow-[#C084FC]/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Zap size={14} />
          {language === "am" ? "ፈጣን ኬኖ" : "Instant Keno"}
        </button>
        <button
          onClick={() => { playSound('select'); setGameMode("CLASSIC"); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            gameMode === "CLASSIC"
              ? "bg-[#22D3EE] text-black shadow-md shadow-[#22D3EE]/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Clock size={14} />
          {language === "am" ? "ክላሲክ ዙር" : "Classic Round"}
        </button>
      </div>

      {/* Multipliers Preview Bar */}
      {count > 0 && (
        <div className="glass-card rounded-xl p-2.5 border border-white/10">
          <div className="text-[11px] text-slate-400 mb-1.5 flex justify-between items-center">
            <span>{language === "am" ? `የክፍያ ማባዣ (${count} ተመርጧል)` : `Payout Multipliers (${count} selected)`}</span>
            <span className="text-[#C084FC] font-semibold">{language === "am" ? "ከፍተኛ" : "Max"} {(Math.max(...Object.values(multiplierTable), 0))}x</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {Object.entries(multiplierTable).map(([hit, mult]) => (
              <div
                key={hit}
                className="flex-1 min-w-[50px] bg-[#12121c] rounded-lg p-1.5 text-center border border-white/5"
              >
                <div className="text-[10px] text-slate-400">{hit} {language === "am" ? "ግጥሚያ" : "Hits"}</div>
                <div className="text-xs font-bold text-[#22D3EE]">{mult}x</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Pick & Selection Helpers */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-400">{language === "am" ? "ፈጣን ምርጫ:" : "Quick Pick:"}</span>
          {[3, 5, 7, 10].map((n) => (
            <button
              key={n}
              onClick={() => { playSound(); handleQuickPick(n); }}
              className="px-2 py-1 rounded-md bg-[#12121c] border border-white/10 text-xs font-bold text-[#C084FC] hover:bg-[#C084FC] hover:text-black transition-all"
            >
              {language === "am" ? `${n} ምረጥ` : `Pick ${n}`}
            </button>
          ))}
        </div>
        <button
          onClick={() => { playSound(); clearSelection(); }}
          disabled={selectedNumbers.length === 0}
          className="p-1.5 rounded-md bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 disabled:opacity-30 text-xs font-bold flex items-center gap-1"
          title={language === "am" ? "ምርጫ አጽዳ" : "Clear Selection"}
        >
          <Trash2 size={14} /> {language === "am" ? "አጽዳ" : "Clear"}
        </button>
      </div>

      {/* Active Wager Info Badge */}
      <div className="flex justify-between items-center text-xs text-slate-400 bg-[#09090b] px-3 py-2 rounded-xl border border-white/10">
        <span>{language === "am" ? "ንቁ ውርርድ (በመነሻ ገጽ የተዘጋጀ):" : "Active Wager (set in Home):"}</span>
        <span className="font-extrabold text-[#22D3EE] font-mono">{betAmount} ETB</span>
      </div>

      {/* Play Action Button */}
      <button
        onClick={() => { playSound('success'); onPlay(); }}
        disabled={!canPlay || isPlaying}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C084FC] via-[#22D3EE] to-[#C084FC] text-black font-extrabold text-base shadow-xl shadow-[#C084FC]/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Flame size={20} className="fill-black" />
        {isPlaying
          ? (language === "am" ? "ቁጥሮች እየወጡ ነው..." : "Drawing Numbers...")
          : gameMode === "INSTANT"
          ? (language === "am" ? `ፈጣን ተጫወት (${count} ቁጥሮች @ ${betAmount} ETB)` : `Play Instant (${count} numbers @ ${betAmount} ETB)`)
          : (language === "am" ? `የክላሲክ ትኬት አስገባ (${count} ቁጥሮች @ ${betAmount} ETB)` : `Queue Classic Ticket (${count} numbers @ ${betAmount} ETB)`)}
      </button>
    </div>
  );
}
