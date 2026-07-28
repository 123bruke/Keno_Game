import { useState } from "react";
import { useVerify, useCurrentRound } from "../lib/hooks";
import { ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

export default function ProvablyFair() {
  const { data: round } = useCurrentRound();
  const verify = useVerify();
  const [serverSeed, setServerSeed] = useState("");
  const [clientSeed, setClientSeed] = useState("");
  const [nonce, setNonce] = useState(0);

  if (!round) {
    return <div className="text-center py-12 text-slate-400">Loading transparency info...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Current Round Seed Info */}
      <div className="glass-card rounded-2xl p-4 space-y-2 border border-white/10">
        <div className="flex items-center gap-2 mb-2 text-[#22D3EE]">
          <ShieldCheck size={20} />
          <h3 className="font-bold text-sm text-white">Active Round Transparency</h3>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Active Game ID:</span>
            <span className="font-mono text-slate-300 text-[10px] truncate max-w-[200px]">{round?.gameId || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Server Seed Hash (SHA256):</span>
            <span className="font-mono text-[#C084FC] text-[10px] break-all max-w-[200px]">{round?.serverSeedHash || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Client Seed:</span>
            <span className="font-mono text-[#22D3EE]">{round?.clientSeed || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Nonce:</span>
            <span className="font-mono text-slate-200">{round?.nonce ?? 0}</span>
          </div>

        </div>
      </div>

      {/* Manual Verification Tool */}
      <div className="glass-card rounded-2xl p-4 space-y-3 border border-white/10">
        <h3 className="font-bold text-sm text-slate-200">Verify Past Draw</h3>
        <p className="text-xs text-slate-400">
          After a round settles, enter its revealed server seed, client seed, and nonce to verify the draw was fair.
        </p>

        <input
          type="text"
          placeholder="Server Seed (revealed post-draw)"
          value={serverSeed}
          onChange={(e) => setServerSeed(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[#000000] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#C084FC]"
        />
        <input
          type="text"
          placeholder="Client Seed"
          value={clientSeed}
          onChange={(e) => setClientSeed(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[#000000] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#22D3EE]"
        />
        <input
          type="number"
          placeholder="Nonce (e.g. 0)"
          value={nonce}
          onChange={(e) => setNonce(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-lg bg-[#000000] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#C084FC]"
        />

        <button
          onClick={() => verify.mutate({ serverSeed, clientSeed, nonce })}
          disabled={verify.isPending || !serverSeed || !clientSeed}
          className="w-full py-2.5 rounded-xl bg-[#22D3EE] text-black font-extrabold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {verify.isPending ? "Calculating Draw..." : "Verify HMAC-SHA256"}
        </button>

        {verify.data && (
          <div className="bg-[#000000] border border-emerald-500/30 rounded-xl p-3 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 size={16} />
              <span>Draw Deterministically Verified!</span>
            </div>
            <div className="text-slate-400">
              <span className="text-slate-200 font-semibold">Server Seed Hash:</span>
              <div className="font-mono text-[10px] text-[#C084FC] break-all">{verify.data.serverSeedHash}</div>
            </div>
            <div>
              <span className="text-slate-200 font-semibold">Winning Numbers (20 Draw):</span>
              <div className="font-mono text-[#22D3EE] mt-1 font-bold">
                {verify.data.drawNumbers?.join(", ")}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
