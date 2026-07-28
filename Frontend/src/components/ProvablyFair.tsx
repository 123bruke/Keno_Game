import { useState } from "react";
import { useVerify, useCurrentRound, useSettledGames, useProvablyFair } from "../lib/hooks";
import { playSound } from "../lib/sound";
import { ShieldCheck, CheckCircle2, RotateCcw } from "lucide-react";
import { useAppStore } from "../lib/store";

export default function ProvablyFair() {
  const { language } = useAppStore();
  const { data: round } = useCurrentRound();
  const { data: settledGames } = useSettledGames();
  const verify = useVerify();
  const [serverSeed, setServerSeed] = useState("");
  const [clientSeed, setClientSeed] = useState("");
  const [nonce, setNonce] = useState(0);
  const [selectedGameId, setSelectedGameId] = useState<string | undefined>(undefined);

  const { data: selectedRecord } = useProvablyFair(selectedGameId, {
    enabled: !!selectedGameId,
  });

  const handleSelectSettled = (gameId: string) => {
    setSelectedGameId(gameId);
  };

  const handleAutoVerify = () => {
    if (!selectedRecord) return;
    setServerSeed(selectedRecord.serverSeed);
    setClientSeed(selectedRecord.clientSeed);
    setNonce(selectedRecord.nonce);
    verify.mutate({
      serverSeed: selectedRecord.serverSeed,
      clientSeed: selectedRecord.clientSeed,
      nonce: selectedRecord.nonce,
    });
  };

  const handleReset = () => {
    setServerSeed("");
    setClientSeed("");
    setNonce(0);
    setSelectedGameId(undefined);
    verify.reset();
  };

  if (!round) {
    return <div className="text-center py-12 text-slate-400">{language === "am" ? "የግልጽነት መረጃ በመጫን ላይ..." : "Loading transparency info..."}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Current Round Seed Info */}
      <div className="glass-card rounded-2xl p-4 space-y-2 border border-white/10">
        <div className="flex items-center gap-2 mb-2 text-[#22D3EE]">
          <ShieldCheck size={20} />
          <h3 className="font-bold text-sm text-white">{language === "am" ? "የንቁ ዙር ግልጽነት" : "Active Round Transparency"}</h3>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">{language === "am" ? "ንቁ የጨዋታ መታወቂያ:" : "Active Game ID:"}</span>
            <span className="font-mono text-slate-300 text-[10px] truncate max-w-[200px]">{round?.gameId || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{language === "am" ? "የሰርቨር ሴድ ሃሽ (SHA256):" : "Server Seed Hash (SHA256):"}</span>
            <span className="font-mono text-[#C084FC] text-[10px] break-all max-w-[200px]">{round?.serverSeedHash || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{language === "am" ? "የደንበኛ ሴድ:" : "Client Seed:"}</span>
            <span className="font-mono text-[#22D3EE]">{round?.clientSeed || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{language === "am" ? "ኖንስ:" : "Nonce:"}</span>
            <span className="font-mono text-slate-200">{round?.nonce ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Past Settled Rounds */}
      <div className="glass-card rounded-2xl p-4 space-y-3 border border-white/10">
        <div className="flex items-center gap-2 mb-1 text-emerald-400">
          <RotateCcw size={18} />
          <h3 className="font-bold text-sm text-white">{language === "am" ? "ያለፉ የተጠናቀቁ ዙሮች" : "Past Settled Rounds"}</h3>
        </div>
        {!settledGames || settledGames.length === 0 ? (
          <p className="text-xs text-slate-400">{language === "am" ? "እስካሁን የተጠናቀቀ ዙር የለም።" : "No settled rounds yet."}</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {settledGames.map((game: any) => (
              <button
                key={game.id}
                onClick={() => { playSound(); handleSelectSettled(game.id); }}
                className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition-all ${
                  selectedGameId === game.id
                    ? "border-[#C084FC] bg-[#C084FC]/10"
                    : "border-white/10 bg-[#000000] hover:border-emerald-500/30"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">{language === "am" ? `ዙር #${game.roundNumber}` : `Round #${game.roundNumber}`}</span>
                  <span className="text-xs text-slate-400">{game.status}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {new Date(game.startedAt).toLocaleString()} | {game.mode}
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedRecord && (
          <div className="bg-[#000000] border border-white/10 rounded-xl p-3 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-200 font-semibold">{language === "am" ? "የተገለጠ መረጃ" : "Revealed Data"}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => { playSound(); handleReset(); }}
                  className="text-[10px] text-slate-400 hover:text-white underline"
                >
                  {language === "am" ? "አጽዳ" : "Clear"}
                </button>
                <button
                  onClick={() => { playSound('select'); handleAutoVerify(); }}
                  disabled={verify.isPending}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/30 disabled:opacity-50 transition-all"
                >
                  {verify.isPending ? (language === "am" ? "በማረጋገጥ ላይ..." : "Verifying...") : (language === "am" ? "በራስ-ሰር አረጋግጥ" : "Auto Verify")}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <div><span className="text-slate-400">{language === "am" ? "የሰርቨር ሴድ:" : "Server Seed:"}</span> <span className="font-mono text-[10px] text-[#C084FC] break-all">{selectedRecord.serverSeed}</span></div>
              <div><span className="text-slate-400">{language === "am" ? "የደንበኛ ሴድ:" : "Client Seed:"}</span> <span className="font-mono text-[10px] text-[#22D3EE]">{selectedRecord.clientSeed}</span></div>
              <div><span className="text-slate-400">{language === "am" ? "ኖንስ:" : "Nonce:"}</span> <span className="font-mono text-slate-200">{selectedRecord.nonce}</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Manual Verification Tool */}
      <div className="glass-card rounded-2xl p-4 space-y-3 border border-white/10">
        <h3 className="font-bold text-sm text-slate-200">{language === "am" ? "ያለፈ ድልድል አረጋግጥ" : "Verify Past Draw"}</h3>
        <p className="text-xs text-slate-400">
          {language === "am"
            ? "ከላይ የተጠናቀቀ ዙር ይምረጡ ወይም ድልድሉ ፍትሃዊ መሆኑን ለማረጋገጥ የተገለጠውን የሰርቨር ሴድ፣ የደንበኛ ሴድ እና ኖንስ በእጅ ያስገቡ።"
            : "Select a settled round above or manually enter the revealed server seed, client seed, and nonce to verify the draw was fair."}
        </p>

        <input
          type="text"
          placeholder={language === "am" ? "የሰርቨር ሴድ (ከድልድል በኋላ የተገለጠ)" : "Server Seed (revealed post-draw)"}
          value={serverSeed}
          onChange={(e) => setServerSeed(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[#000000] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#C084FC]"
        />
        <input
          type="text"
          placeholder={language === "am" ? "የደንበኛ ሴድ" : "Client Seed"}
          value={clientSeed}
          onChange={(e) => setClientSeed(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[#000000] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#22D3EE]"
        />
        <input
          type="number"
          placeholder={language === "am" ? "ኖንስ (ለምሳሌ 0)" : "Nonce (e.g. 0)"}
          value={nonce}
          onChange={(e) => setNonce(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-lg bg-[#000000] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#C084FC]"
        />

        <div className="flex gap-2">
          <button
            onClick={() => { playSound('select'); verify.mutate({ serverSeed, clientSeed, nonce }); }}
            disabled={verify.isPending || !serverSeed || !clientSeed}
            className="flex-1 py-2.5 rounded-xl bg-[#22D3EE] text-black font-extrabold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {verify.isPending ? (language === "am" ? "ድልድል በማስላት ላይ..." : "Calculating Draw...") : (language === "am" ? "HMAC-SHA256 አረጋግጥ" : "Verify HMAC-SHA256")}
          </button>
          {(verify.data || verify.isError) && (
            <button
              onClick={() => { playSound(); handleReset(); }}
              className="px-3 py-2.5 rounded-xl bg-white/5 text-slate-400 text-sm hover:bg-white/10 transition-all"
            >
              {language === "am" ? "አጽዳ" : "Clear"}
            </button>
          )}
        </div>

        {verify.data && (
          <div className="bg-[#000000] border border-emerald-500/30 rounded-xl p-3 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 size={16} />
              <span>{language === "am" ? "ድልድሉ በቆራጥነት ተረጋግጧል!" : "Draw Deterministically Verified!"}</span>
            </div>
            <div className="text-slate-400">
              <span className="text-slate-200 font-semibold">{language === "am" ? "የሰርቨር ሴድ ሃሽ:" : "Server Seed Hash:"}</span>
              <div className="font-mono text-[10px] text-[#C084FC] break-all">{verify.data.serverSeedHash}</div>
            </div>
            <div>
              <span className="text-slate-200 font-semibold">{language === "am" ? "አሸናፊ ቁጥሮች (20 ድልድል):" : "Winning Numbers (20 Draw):"}</span>
              <div className="font-mono text-[#22D3EE] mt-1 font-bold">
                {verify.data.drawNumbers?.join(", ")}
              </div>
            </div>
          </div>
        )}

        {verify.isError && (
          <div className="bg-[#000000] border border-red-500/30 rounded-xl p-3 text-xs text-red-400">
            {language === "am" ? "ማረጋገጥ አልተሳካም። የሴድ ዋጋዎችን ያረጋግጡ።" : "Verification failed. Check the seed values."}
          </div>
        )}
      </div>
    </div>
  );
}
