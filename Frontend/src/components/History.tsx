import { useState } from "react";
import { useHistory } from "../lib/hooks";
import { ChevronLeft, ChevronRight, Trophy, X, Calendar } from "lucide-react";

export default function History() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useHistory(page, 10);

  if (isLoading) {
    return <div className="text-center py-12 text-slate-400">Loading history...</div>;
  }

  const tickets = data?.items || data?.history || [];
  const total = data?.total || data?.totalGames || 0;
  const totalPages = data?.totalPages || Math.ceil(total / 10) || 1;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {tickets.map((t: any) => {
          const isWin = t.status === "WON" || t.status === "won" || Number(t.payout) > 0;
          const selected = t.selectedNumbers as number[];
          const betAmount = Number(t.betAmount);
          const payout = Number(t.payout || t.prizeAmount || 0);

          return (
            <div
              key={t.id}
              className="glass-card rounded-xl p-3 flex items-center gap-3 border border-white/10"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                  isWin ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                }`}
              >
                {isWin ? <Trophy size={16} /> : <X size={16} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">
                    Round #{t.game?.roundNumber || t.roundNumber || "N/A"}
                  </span>
                  <span className={`font-mono font-extrabold ${isWin ? "text-emerald-400" : "text-rose-400"}`}>
                    {isWin ? `+${payout.toFixed(2)} ETB` : `-${betAmount.toFixed(2)} ETB`}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Matches: {t.matches ?? 0}/{selected?.length ?? 0}</span>
                  <span className="text-[#22D3EE] font-bold">{t.multiplier ?? 0}x</span>
                </div>

                <div className="text-[10px] font-mono text-[#C084FC] mt-1 truncate">
                  Picks: {selected?.join(", ")}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {tickets.length === 0 && (
        <div className="text-center py-12 text-slate-400">No tickets played yet. Start playing!</div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg bg-[#12121c] text-slate-400 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-slate-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2 rounded-lg bg-[#12121c] text-slate-400 hover:text-white disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
