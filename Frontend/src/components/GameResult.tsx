import { useState } from "react";
import { Trophy, X, Sparkles, ShieldCheck, Copy, CheckCircle2, ChevronRight } from "lucide-react";
import { playSound } from "../lib/sound";
import { useAppStore } from "../lib/store";

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
    fairness?: {
      serverSeed: string;
      serverSeedHash: string;
      clientSeed: string;
      nonce: number;
    };
  };
  onClose: () => void;
}) {
  const { language, setActiveTab } = useAppStore();
  const ticket = result.settledTickets[0];
  const isWin = (ticket?.payout ?? 0) > 0;
  const fairness = result.fairness;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!fairness) return;
    const text = `Server Seed: ${fairness.serverSeed}\nServer Seed Hash: ${fairness.serverSeedHash}\nClient Seed: ${fairness.clientSeed}\nNonce: ${fairness.nonce}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      playSound("success");
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const goVerify = () => {
    playSound("select");
    onClose();
    setActiveTab("fair");
  };

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
                {isWin ? (language === "am" ? "አሸናፊ!" : "WINNER!") : (language === "am" ? "ግጥሚያ የለም" : "NO MATCH")}
              </h3>
              <p className="text-xs text-slate-400">{language === "am" ? `ዙር #${result.roundNumber}` : `Round #${result.roundNumber}`}</p>
            </div>
          </div>
          <button
            onClick={() => { playSound(); onClose(); }}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Drawn Numbers Grid */}
        <div>
          <div className="text-xs text-slate-400 mb-2 flex justify-between">
            <span>{language === "am" ? "የወጡ ቁጥሮች (20 ቁጥሮች)" : "Winning Draw (20 Numbers)"}</span>
            <span className="text-[#22D3EE] font-bold">{ticket?.matches ?? 0} {language === "am" ? "ተመሳስሏል" : "Matched"}</span>
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
            <span className="text-slate-400">{language === "am" ? "የእርስዎ ምርጫ:" : "Your Selection:"}</span>
            <span className="font-mono text-[#C084FC] font-bold">
              {ticket?.selectedNumbers.join(", ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{language === "am" ? "ግጥሚያዎች:" : "Matches:"}</span>
            <span className="font-mono text-emerald-400 font-bold">
              {ticket?.matches ?? 0} / {ticket?.selectedNumbers.length ?? 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{language === "am" ? "የውርርድ መጠን:" : "Bet Amount:"}</span>
            <span className="font-mono text-slate-200">{ticket?.betAmount} ETB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{language === "am" ? "ማባዣ:" : "Multiplier:"}</span>
            <span className="font-mono text-[#22D3EE] font-bold">{ticket?.multiplier}x</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold border-t border-white/10 pt-2">
            <span>{isWin ? (language === "am" ? "ጠቅላላ ሽልማት:" : "Total Prize:") : (language === "am" ? "ውጤት:" : "Outcome:")}</span>
            <span className={isWin ? "text-emerald-400" : "text-rose-400"}>
              {isWin ? `+${ticket?.payout.toFixed(2)} ETB` : `-${ticket?.betAmount} ETB`}
            </span>
          </div>
        </div>

        {/* Fairness Revealed */}
        {fairness?.serverSeed && (
          <div className="space-y-2 text-[10px] font-mono bg-[#000000] p-3 rounded-xl border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-emerald-400 font-sans font-bold text-[11px]">
                <ShieldCheck size={12} />
                {language === "am" ? "ፍትሃዊነት ይፈትሹ" : "Provably Fair"}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-all active:scale-95"
                aria-label="Copy seeds"
              >
                {copied ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle2 size={12} />
                    {language === "am" ? "ተቀድቷል!" : "Copied!"}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Copy size={12} />
                    {language === "am" ? "ሴዶችን ቅዳ" : "Copy"}
                  </span>
                )}
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-3">
                <span className="text-slate-500 shrink-0">{language === "am" ? "ሰርቨር ሴድ:" : "Server Seed:"}</span>
                <span className="text-white break-all text-right">{fairness.serverSeed}</span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-slate-500 shrink-0">{language === "am" ? "ሃሽ:" : "Hash:"}</span>
                <span className="text-emerald-400 break-all text-right">{fairness.serverSeedHash}</span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-slate-500 shrink-0">{language === "am" ? "ሴድ:" : "Client Seed:"}</span>
                <span className="text-[#22D3EE] break-all text-right">{fairness.clientSeed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Nonce:</span>
                <span className="text-white">{fairness.nonce}</span>
              </div>
            </div>
            <button
              onClick={goVerify}
              className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#22D3EE] font-sans font-bold text-[11px] flex items-center justify-center gap-1 transition-all"
            >
              {language === "am" ? "አረጋግጥ" : "Verify this round"} <ChevronRight size={13} />
            </button>
          </div>
        )}

        <button
          onClick={() => { playSound('success'); onClose(); }}
          className="w-full py-3 rounded-xl bg-[#12121c] hover:bg-[#1a1a2e] text-white font-bold text-sm border border-white/10 transition-all"
        >
          {language === "am" ? "ዝጋ እና እንደገና ተጫወት" : "Close & Play Again"}
        </button>
      </div>
    </div>
  );
}
