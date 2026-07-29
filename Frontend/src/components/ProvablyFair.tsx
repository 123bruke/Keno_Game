import { useState } from "react";
import { useSettledGames, useProvablyFair } from "../lib/hooks";
import { playSound } from "../lib/sound";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { useAppStore } from "../lib/store";
import { sha256, generateDrawNumbers } from "../lib/crypto";

interface VerifyResult {
  computedHash: string;
  hashMatch: boolean;
  drawNumbers: number[];
}

export default function ProvablyFair() {
  const { language, clientSeed: myClientSeed } = useAppStore();
  const { data: settledGames } = useSettledGames();
  const [selectedGameId, setSelectedGameId] = useState("");
  const [clientSeedInput, setClientSeedInput] = useState(myClientSeed);
  const [serverSeedInput, setServerSeedInput] = useState("");
  const [nonceInput, setNonceInput] = useState(0);
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: record } = useProvablyFair(selectedGameId, {
    enabled: mode === "auto" && !!selectedGameId,
  });

  const handleAutoVerify = async () => {
    if (!record) return;
    setVerifying(true);
    setError(null);
    try {
      const [computedHash, drawNumbers] = await Promise.all([
        sha256(record.serverSeed),
        generateDrawNumbers(record.serverSeed, record.clientSeed, record.nonce),
      ]);
      setResult({ computedHash, hashMatch: computedHash === record.serverSeedHash, drawNumbers });
    } catch {
      setError("Verification computation failed");
    } finally {
      setVerifying(false);
    }
  };

  const handleManualVerify = async () => {
    if (!serverSeedInput || !clientSeedInput) return;
    setVerifying(true);
    setError(null);
    try {
      const [computedHash, drawNumbers] = await Promise.all([
        sha256(serverSeedInput),
        generateDrawNumbers(serverSeedInput, clientSeedInput, nonceInput),
      ]);
      setResult({ computedHash, hashMatch: false, drawNumbers });
    } catch {
      setError("Verification computation failed");
    } finally {
      setVerifying(false);
    }
  };

  const reset = () => {
    setSelectedGameId("");
    setServerSeedInput("");
    setClientSeedInput(myClientSeed);
    setNonceInput(0);
    setResult(null);
    setError(null);
  };

  const games = settledGames?.filter((g: any) => g.status === "COMPLETED") ?? [];

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex gap-1 bg-black rounded-xl p-1 border border-keno-border">
        <button
          onClick={() => { setMode("auto"); reset(); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === "auto" ? "bg-keno-cyan text-black" : "text-keno-muted"}`}
        >
          {language === "am" ? "አውቶማቲክ" : "Auto Verify"}
        </button>
        <button
          onClick={() => { setMode("manual"); reset(); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === "manual" ? "bg-keno-cyan text-black" : "text-keno-muted"}`}
        >
          {language === "am" ? "በእጅ" : "Manual"}
        </button>
      </div>

      {/* Auto mode */}
      {mode === "auto" && (
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-keno-green" />
            <h3 className="font-bold text-sm text-keno-text">{language === "am" ? "የተጠናቀቀ ዙር ይምረጡ" : "Select a Completed Round"}</h3>
          </div>

          {games.length === 0 ? (
            <p className="text-xs text-keno-muted">{language === "am" ? "እስካሁን የተጠናቀቀ ዙር የለም።" : "No completed rounds yet."}</p>
          ) : (
            <select
              value={selectedGameId}
              onChange={(e) => { setSelectedGameId(e.target.value); setResult(null); setError(null); }}
              className="w-full px-3 py-2.5 rounded-xl bg-black border border-keno-border text-keno-text text-xs appearance-none cursor-pointer focus:outline-none focus:border-keno-green"
            >
              <option value="">{language === "am" ? "-- ዙር ይምረጡ --" : "-- Select Round --"}</option>
              {games.map((g: any) => (
                <option key={g.id} value={g.id}>
                  {language === "am" ? `ዙር #${g.roundNumber}` : `Round #${g.roundNumber}`} — {new Date(g.startedAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          )}

          {record && (
            <div className="bg-black rounded-xl p-3 text-xs space-y-1.5 border border-keno-border">
              <div className="text-keno-muted font-mono text-[10px] break-all"><span className="text-keno-muted">{language === "am" ? "ሰርቨር ሴድ:" : "Server Seed:"}</span> {record.serverSeed}</div>
              <div className="text-keno-muted font-mono text-[10px]"><span className="text-keno-muted">{language === "am" ? "የደንበኛ ሴድ:" : "Client Seed:"}</span> {record.clientSeed}</div>
              <div className="text-keno-muted font-mono text-[10px]"><span className="text-keno-muted">Nonce:</span> {record.nonce}</div>
            </div>
          )}

          <button
            onClick={() => { playSound('select'); handleAutoVerify(); }}
            disabled={verifying || !record}
            className="w-full py-3 rounded-xl bg-keno-green text-black font-extrabold text-sm hover:opacity-90 disabled:opacity-40 transition-all"
          >
            {verifying ? (language === "am" ? "በማረጋገጥ ላይ..." : "Verifying...") : (language === "am" ? "አረጋግጥ" : "Verify")}
          </button>
        </div>
      )}

      {/* Manual mode */}
      {mode === "manual" && (
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-keno-muted" />
            <h3 className="font-bold text-sm text-keno-text">{language === "am" ? "በእጅ ማረጋገጥ" : "Manual Verification"}</h3>
          </div>

          <input
            type="text"
            placeholder={language === "am" ? "የሰርቨር ሴድ (ከድልድል በኋላ የተገለጠ)" : "Server Seed (revealed post-draw)"}
            value={serverSeedInput}
            onChange={(e) => setServerSeedInput(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-black border border-keno-border text-keno-text text-xs font-mono focus:outline-none focus:border-keno-purple"
          />
          <input
            type="text"
            placeholder={language === "am" ? "የደንበኛ ሴድ" : "Client Seed"}
            value={clientSeedInput}
            onChange={(e) => setClientSeedInput(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-black border border-keno-border text-keno-text text-xs font-mono focus:outline-none focus:border-keno-cyan"
          />
          <input
            type="number"
            placeholder="Nonce"
            value={nonceInput}
            onChange={(e) => setNonceInput(Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-xl bg-black border border-keno-border text-keno-text text-xs font-mono focus:outline-none focus:border-keno-purple"
          />

          <button
            onClick={() => { playSound('select'); handleManualVerify(); }}
            disabled={verifying || !serverSeedInput || !clientSeedInput}
            className="w-full py-3 rounded-xl bg-keno-cyan text-black font-extrabold text-sm hover:opacity-90 disabled:opacity-40 transition-all"
          >
            {verifying ? (language === "am" ? "በማስላት ላይ..." : "Computing...") : (language === "am" ? "HMAC-SHA256 አረጋግጥ" : "Verify HMAC-SHA256")}
          </button>
        </div>
      )}

      {/* Verifying spinner */}
      {verifying && (
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="text-xs text-keno-muted">{language === "am" ? "SHA256 እና HMAC በአሳሽ ውስጥ በማስላት ላይ..." : "Computing SHA256 and HMAC in browser..."}</p>
        </div>
      )}

      {/* Verification result */}
      {result && !verifying && (
        <div className={`glass-card rounded-2xl p-4 space-y-3 border ${result.hashMatch ? "border-keno-green/40" : "border-keno-red/40"}`}>
          {/* PASS / FAIL badge */}
          <div className={`flex items-center gap-2 ${result.hashMatch ? "text-keno-green" : "text-keno-red"}`}>
            {result.hashMatch ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
            <span className="font-extrabold text-base">
              {result.hashMatch
                ? (language === "am" ? "ተረጋግጧል" : "VERIFIED")
                : (language === "am" ? "አልተረጋገጠም" : "FAILED")}
            </span>
          </div>

          {/* Hash check */}
          <div className="bg-black rounded-xl p-3 text-xs space-y-1">
            <div className="flex items-center gap-1.5">
              {result.hashMatch
                ? <CheckCircle2 size={14} className="text-keno-green" />
                : <XCircle size={14} className="text-keno-red" />
              }
              <span className="font-bold text-keno-text">SHA256(serverSeed)</span>
              <span className={`ml-auto ${result.hashMatch ? "text-keno-green" : "text-keno-red"}`}>
                {result.hashMatch ? "MATCH" : "MISMATCH"}
              </span>
            </div>
            {result.hashMatch && (
              <div className="font-mono text-[10px] text-keno-muted break-all">{result.computedHash}</div>
            )}
            {!result.hashMatch && (
              <div className="space-y-0.5">
                <div className="font-mono text-[10px] text-keno-purple break-all">{language === "am" ? "የተሰላ:" : "Computed:"} {result.computedHash}</div>
                <div className="font-mono text-[10px] text-keno-muted break-all">{language === "am" ? "የተጠበቀ:" : "Expected:"} {record?.serverSeedHash ?? "—"}</div>
              </div>
            )}
          </div>

          {/* Draw numbers */}
          <div className="bg-black rounded-xl p-3 text-xs space-y-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-keno-cyan" />
              <span className="font-bold text-keno-text">{language === "am" ? "ድልድል (20 ቁጥሮች)" : "Draw (20 Numbers)"}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {result.drawNumbers.map((n) => (
                <span key={n} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-keno-cyan/10 text-keno-cyan text-xs font-bold">
                  {n}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => { playSound(); reset(); }}
            className="w-full py-2.5 rounded-xl bg-white/5 text-keno-muted text-xs font-bold hover:bg-white/10 transition-all"
          >
            {language === "am" ? "ሌላ ዙር አረጋግጥ" : "Verify Another Round"}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="glass-card rounded-2xl p-4 border border-keno-red/30">
          <p className="text-xs text-keno-red">{error}</p>
        </div>
      )}
    </div>
  );
}
