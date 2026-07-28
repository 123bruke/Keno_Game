import { useState } from "react";
import { useWallet, useDeposit, useWithdraw } from "../lib/hooks";
import { Wallet as WalletIcon, ArrowDownCircle, ArrowUpCircle, History } from "lucide-react";

export default function Wallet() {
  const { data: wallet, isLoading } = useWallet();
  const deposit = useDeposit();
  const withdraw = useWithdraw();
  const [depositAmount, setDepositAmount] = useState(100);
  const [withdrawAmount, setWithdrawAmount] = useState(50);

  if (isLoading) {
    return <div className="text-center py-12 text-slate-400">Loading wallet info...</div>;
  }

  const totalBal = Number(wallet?.totalBalance || 0);
  const playBal = Number(wallet?.playBalance || 0);
  const mainBal = Number(wallet?.mainBalance || 0);

  return (
    <div className="space-y-4">
      {/* Wallet Balance Cards */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C084FC]/20 to-[#22D3EE]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-2 mb-3">
          <WalletIcon className="text-[#C084FC]" size={24} />
          <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">User Wallet</span>
        </div>

        <div className="text-3xl font-extrabold text-white">
          {totalBal.toFixed(2)}{" "}
          <span className="text-sm font-normal text-[#22D3EE]">{wallet?.currency ?? "ETB"}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-xs">
          <div>
            <span className="text-slate-400">Play Balance:</span>
            <div className="font-bold text-[#C084FC] text-sm">{playBal.toFixed(2)} ETB</div>
          </div>
          <div>
            <span className="text-slate-400">Main Balance:</span>
            <div className="font-bold text-[#22D3EE] text-sm">{mainBal.toFixed(2)} ETB</div>
          </div>
        </div>
      </div>

      {/* Deposit Form */}
      <div className="glass-card rounded-2xl p-4 space-y-3 border border-white/10">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-200">
          <ArrowDownCircle className="text-emerald-400" size={18} />
          <span>Deposit Play Balance</span>
        </div>
        <div className="flex gap-2">
          {[50, 100, 500, 1000].map((preset) => (
            <button
              key={preset}
              onClick={() => setDepositAmount(preset)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                depositAmount === preset
                  ? "bg-[#C084FC] text-black"
                  : "bg-[#12121c] text-slate-300 hover:bg-[#1a1a2e]"
              }`}
            >
              +{preset}
            </button>
          ))}
        </div>
        <input
          type="number"
          min={1}
          value={depositAmount}
          onChange={(e) => setDepositAmount(Math.max(1, Number(e.target.value)))}
          className="w-full px-3 py-2 rounded-lg bg-[#000000] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C084FC]"
        />
        <button
          onClick={() => deposit.mutate({ amount: depositAmount })}
          disabled={deposit.isPending}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {deposit.isPending ? "Depositing..." : "Deposit Now"}
        </button>
      </div>

      {/* Withdraw Form */}
      <div className="glass-card rounded-2xl p-4 space-y-3 border border-white/10">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-200">
          <ArrowUpCircle className="text-[#22D3EE]" size={18} />
          <span>Withdraw Main Balance</span>
        </div>
        <input
          type="number"
          min={1}
          max={mainBal}
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(Math.max(1, Number(e.target.value)))}
          className="w-full px-3 py-2 rounded-lg bg-[#000000] border border-white/10 text-white text-sm focus:outline-none focus:border-[#22D3EE]"
        />
        <button
          onClick={() => withdraw.mutate({ amount: withdrawAmount })}
          disabled={withdraw.isPending || mainBal < withdrawAmount}
          className="w-full py-2.5 rounded-xl bg-[#22D3EE] text-black font-extrabold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {withdraw.isPending ? "Withdrawing..." : "Withdraw Funds"}
        </button>
      </div>
    </div>
  );
}
