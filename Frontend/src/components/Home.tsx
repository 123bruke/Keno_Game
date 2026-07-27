import { useAppStore } from "../lib/store";
import { useWallet, useCurrentRound } from "../lib/hooks";
import { Zap, Clock, Flame, Wallet as WalletIcon, ArrowRight } from "lucide-react";

const PRESETS = [10, 25, 50, 100, 250];

export default function Home() {
  const {
    setActiveTab,
    gameMode,
    setGameMode,
    selectedNumbers,
    betAmount,
    setBetAmount,
    currentUser,
  } = useAppStore();

  const { data: wallet } = useWallet();
  const { data: roundData } = useCurrentRound();

  const handleEnterGame = () => {
    setActiveTab("game");
  };

  return (
    <div className="space-y-4">
      {/* Welcome Banner & Wallet Overview */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#C084FC]/30 to-[#22D3EE]/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Welcome Back</div>
            <h2 className="text-lg font-extrabold text-white">
              @{currentUser?.username || "Keno Player"}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
              <WalletIcon size={12} className="text-[#C084FC]" /> Total Balance
            </div>
            <div className="text-xl font-black text-white font-mono">
              {Number(wallet?.totalBalance || 0).toFixed(2)}{" "}
              <span className="text-xs font-bold text-[#22D3EE]">{wallet?.currency ?? "ETB"}</span>
            </div>
          </div>
        </div>

        {roundData && (
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-400">Active Classic Round:</span>
            <span className="text-[#22D3EE] font-bold">Round #{roundData.roundNumber}</span>
          </div>
        )}
      </div>

      {/* Game Mode Selection */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Game Mode</div>
        <div className="grid grid-cols-2 gap-2">
          <div
            onClick={() => setGameMode("INSTANT")}
            className={`cursor-pointer glass-card rounded-2xl p-4 border transition-all ${
              gameMode === "INSTANT"
                ? "border-[#C084FC] bg-[#C084FC]/10 shadow-lg shadow-[#C084FC]/20"
                : "border-white/5 hover:border-white/20"
            }`}
          >
            <div className="p-2 rounded-xl bg-[#C084FC]/20 text-[#C084FC] w-fit mb-2">
              <Zap size={20} />
            </div>
            <h3 className="font-extrabold text-sm text-white">Instant Keno</h3>
            <p className="text-[11px] text-slate-400 mt-1">Draws numbers immediately with instant payouts.</p>
          </div>

          <div
            onClick={() => setGameMode("CLASSIC")}
            className={`cursor-pointer glass-card rounded-2xl p-4 border transition-all ${
              gameMode === "CLASSIC"
                ? "border-[#22D3EE] bg-[#22D3EE]/10 shadow-lg shadow-[#22D3EE]/20"
                : "border-white/5 hover:border-white/20"
            }`}
          >
            <div className="p-2 rounded-xl bg-[#22D3EE]/20 text-[#22D3EE] w-fit mb-2">
              <Clock size={20} />
            </div>
            <h3 className="font-extrabold text-sm text-white">Classic Round</h3>
            <p className="text-[11px] text-slate-400 mt-1">Scheduled multiplayer rounds drawn every 30s.</p>
          </div>
        </div>
      </div>

      {/* Bet Wager Selector */}
      <div className="glass-card rounded-2xl p-4 space-y-3 border border-white/10">
        <div className="text-xs text-slate-400 flex justify-between">
          <span>Set Wager per Bet (ETB)</span>
          <span className="font-bold text-[#22D3EE] font-mono">{betAmount} ETB</span>
        </div>
        <div className="flex gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setBetAmount(p)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                betAmount === p
                  ? "bg-gradient-to-r from-[#C084FC] to-[#22D3EE] text-black"
                  : "bg-[#12121c] text-slate-300 hover:bg-[#1a1a2e]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Manual Custom Bet Input */}
        <div className="pt-1">
          <label className="text-[11px] text-slate-400 block mb-1">Or Enter Custom Amount:</label>
          <input
            type="number"
            min={1}
            max={wallet?.totalBalance ?? 10000}
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
            placeholder="Enter custom wager amount..."
            className="w-full px-3 py-2.5 rounded-xl bg-[#000000] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-[#C084FC] transition-all"
          />
        </div>
      </div>

      {/* Main Redirect to Game CTA Button */}
      <button
        onClick={handleEnterGame}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C084FC] via-[#22D3EE] to-[#C084FC] text-black font-black text-lg shadow-2xl shadow-[#C084FC]/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
      >
        <Flame size={22} className="fill-black" />
        {selectedNumbers.length > 0
          ? `ENTER GAME (${selectedNumbers.length} Selected)`
          : "GO TO GAME BOARD"}
        <ArrowRight size={22} />
      </button>
    </div>
  );
}
