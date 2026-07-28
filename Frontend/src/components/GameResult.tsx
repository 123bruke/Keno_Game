import { Trophy, X, Sparkles } from "lucide-react";

export default function GameResult({
  result,
  onClose,
}: {
  result: {
    gameId: string;
    roundNumber: number;
    drawNumbers: number[];
    settledTickets: {
      ticketId: string;
      selectedNumbers: number[];
      drawNumbers: number[];
      matches: number;
      multiplier: number;
      betAmount: number;
      payout: number;
      won: boolean;
    }[];
    totalPayout: number;
  };
  onClose: () => void;
}) {
  const ticket = result.settledTickets[0];
  const isWin = (ticket?.payout ?? 0) > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="glass-card border border-[#C084FC]/30 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl shadow-[#C084FC]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isWin ? (
              <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400">
                <Trophy size={24} />
              </div>
            ) : (
              <div className="p-2 rounded-full bg-rose-500/20 text-rose-400">
                <X size={24} />
              </div>
            )}
            <div>
              <h3 className="text-lg font-extrabold text-white">
                {isWin ? "WINNER!" : "NO MATCH"}
              </h3>
              <p className="text-xs text-slate-400">Round #{result.roundNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Drawn Numbers Grid */}
        <div>
          <div className="text-xs text-slate-400 mb-2 flex justify-between">
            <span>Winning Draw (20 Numbers)</span>
            <span className="text-[#22D3EE] font-bold">{ticket?.matches ?? 0} Matched</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 max-h-48 overflow-y-auto pr-1">
            {result.drawNumbers.map((num) => {
              const matched = ticket?.selectedNumbers.includes(num);
              return (
                <div
                  key={num}
                  className={`aspect-square rounded-xl flex items-center justify-center text-xs font-extrabold transition-all ${
                    matched
                      ? "bg-gradient-to-tr from-emerald-500 to-teal-300 text-black shadow-md shadow-emerald-500/50 scale-105"
                      : "bg-[#12121c] text-[#22D3EE] border border-white/5"
                  }`}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>

        {/* Ticket Summary */}
        <div className="space-y-2 text-xs bg-[#000000] p-3 rounded-xl border border-white/10">
          <div className="flex justify-between">
            <span className="text-slate-400">Your Selection:</span>
            <span className="font-mono text-[#C084FC] font-bold">
              {ticket?.selectedNumbers.join(", ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Matches:</span>
            <span className="font-mono text-emerald-400 font-bold">
              {ticket?.matches ?? 0} / {ticket?.selectedNumbers.length ?? 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Bet Amount:</span>
            <span className="font-mono text-slate-200">{ticket?.betAmount} ETB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Multiplier:</span>
            <span className="font-mono text-[#22D3EE] font-bold">{ticket?.multiplier}x</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold border-t border-white/10 pt-2">
            <span>{isWin ? "Total Prize:" : "Outcome:"}</span>
            <span className={isWin ? "text-emerald-400" : "text-rose-400"}>
              {isWin ? `+${ticket?.payout.toFixed(2)} ETB` : `-${ticket?.betAmount} ETB`}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#12121c] hover:bg-[#1a1a2e] text-white font-bold text-sm border border-white/10 transition-all"
        >
          Close & Play Again
        </button>
      </div>
    </div>
  );
}
