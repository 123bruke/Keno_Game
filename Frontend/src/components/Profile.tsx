import { useState } from "react";
import { useAppStore } from "../lib/store";
import { useWallet, useHistory } from "../lib/hooks";
import {
  User,
  Volume2,
  VolumeX,
  Globe,
  Smartphone,
  ShieldCheck,
  Wallet as WalletIcon,
  Award,
  KeyRound,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export default function Profile() {
  const {
    currentUser,
    language,
    setLanguage,
    soundEnabled,
    toggleSound,
    vibrationEnabled,
    toggleVibration,
    clientSeed,
    setClientSeed,
    setShowDevLogin,
    setActiveTab,
  } = useAppStore();

  const { data: wallet } = useWallet();
  const { data: historyData } = useHistory(1, 100);

  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [customSeed, setCustomSeed] = useState(clientSeed);
  const [seedSavedMsg, setSeedSavedMsg] = useState("");

  const totalGames = Number(historyData?.total || historyData?.history?.length || 0);
  const winnings = Number(historyData?.totalWinnings || 0);
  const bets = Number(historyData?.totalBets || 0);
  const winRate = totalGames > 0 ? Math.min(100, Math.round((winnings / Math.max(1, bets)) * 100)) : 0;

  const handleGenerateRandomSeed = () => {
    const randomSeed = "seed_" + Math.random().toString(36).substring(2, 12);
    setCustomSeed(randomSeed);
    setClientSeed(randomSeed);
    setSeedSavedMsg(language === "am" ? "አዲስ ሴድ ተቀይሯል!" : "New Client Seed Saved!");
    setTimeout(() => setSeedSavedMsg(""), 3000);
  };

  const handleSaveSeed = () => {
    if (customSeed.trim()) {
      setClientSeed(customSeed.trim());
      setSeedSavedMsg(language === "am" ? "ሴድ በተሳካ ሁኔታ ተቀምጧል!" : "Client Seed Saved!");
      setTimeout(() => setSeedSavedMsg(""), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. USER PROFILE CARD */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C084FC]/20 to-[#22D3EE]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C084FC] via-[#22D3EE] to-white flex items-center justify-center text-black font-black text-2xl shadow-xl shadow-[#C084FC]/30">
            {currentUser?.firstName?.[0] || currentUser?.username?.[0] || "K"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white truncate">
                {currentUser?.firstName
                  ? `${currentUser.firstName} ${currentUser.lastName || ""}`
                  : `@${currentUser?.username || "keno_player"}`}
              </h2>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold ${
                  currentUser?.role === "ADMIN"
                    ? "bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40"
                    : "bg-[#C084FC]/20 text-[#C084FC] border border-[#C084FC]/40"
                }`}
              >
                {currentUser?.role || "USER"}
              </span>
            </div>

            <div className="text-xs text-slate-400 font-mono mt-0.5">
              @{currentUser?.username || "player"}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              ID: {currentUser?.telegramId || "123456789"}
            </div>
          </div>
        </div>
      </div>

      {/* 2. WALLET SUMMARY & QUICK ACTIONS */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <WalletIcon className="text-[#C084FC]" size={16} />
            <span>{language === "am" ? "የኪስ ቦርሳ ሁኔታ" : "Wallet Balances"}</span>
          </div>
          <button
            onClick={() => setActiveTab("wallet")}
            className="text-xs text-[#22D3EE] font-bold flex items-center gap-1 hover:underline"
          >
            {language === "am" ? "ዝርዝር ይመልከቱ" : "Manage Wallet"} <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-[#000000] p-2.5 rounded-xl border border-white/5">
            <span className="text-slate-400 text-[10px] block">Play Balance</span>
            <span className="font-bold text-[#C084FC] text-sm">
              {Number(wallet?.playBalance || 0).toFixed(2)} ETB
            </span>
          </div>
          <div className="bg-[#000000] p-2.5 rounded-xl border border-white/5">
            <span className="text-slate-400 text-[10px] block">Main Balance</span>
            <span className="font-bold text-[#22D3EE] text-sm">
              {Number(wallet?.mainBalance || 0).toFixed(2)} ETB
            </span>
          </div>
        </div>
      </div>

      {/* 3. SETTINGS & PREFERENCES */}
      <div className="glass-card rounded-2xl p-4 space-y-4 border border-white/10">
        <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
          {language === "am" ? "የመተግበሪያ ማስተካከያዎች" : "App Preferences & Settings"}
        </h3>

        {/* Language Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold">
            <Globe className="text-[#22D3EE]" size={18} />
            <div>
              <div>{language === "am" ? "ቋንቋ ይምረጡ" : "Select Language"}</div>
              <div className="text-[10px] text-slate-400 font-normal">
                {language === "am" ? "አማርኛ / English" : "Amharic / English"}
              </div>
            </div>
          </div>

          <div className="flex bg-[#000000] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setLanguage("am")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                language === "am"
                  ? "bg-[#C084FC] text-black shadow-md shadow-[#C084FC]/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🇪🇹 አማርኛ
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                language === "en"
                  ? "bg-[#22D3EE] text-black shadow-md shadow-[#22D3EE]/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* Sound Effects Toggle */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold">
            {soundEnabled ? (
              <Volume2 className="text-[#C084FC]" size={18} />
            ) : (
              <VolumeX className="text-rose-400" size={18} />
            )}
            <div>
              <div>{language === "am" ? "የድምፅ ውጤቶች" : "Sound Effects"}</div>
              <div className="text-[10px] text-slate-400 font-normal">
                {soundEnabled
                  ? language === "am"
                    ? "ድምፅ በርቷል"
                    : "Sound ON"
                  : language === "am"
                  ? "ድምፅ ተዘግቷል"
                  : "Sound OFF"}
              </div>
            </div>
          </div>

          <button
            onClick={toggleSound}
            className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
              soundEnabled ? "bg-[#C084FC] justify-end" : "bg-[#12121c] justify-start border border-white/10"
            }`}
          >
            <div className={`w-4 h-4 rounded-full ${soundEnabled ? "bg-black" : "bg-slate-500"}`} />
          </button>
        </div>

        {/* Vibration / Haptics Toggle */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold">
            <Smartphone className="text-[#22D3EE]" size={18} />
            <div>
              <div>{language === "am" ? "የንቅናቄ ግፊት (Haptics)" : "Haptic Vibration"}</div>
              <div className="text-[10px] text-slate-400 font-normal">
                {vibrationEnabled
                  ? language === "am"
                    ? "ንቅናቄ በርቷል"
                    : "Vibration ON"
                  : language === "am"
                  ? "ንቅናቄ ተዘግቷል"
                  : "Vibration OFF"}
              </div>
            </div>
          </div>

          <button
            onClick={toggleVibration}
            className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
              vibrationEnabled ? "bg-[#22D3EE] justify-end" : "bg-[#12121c] justify-start border border-white/10"
            }`}
          >
            <div className={`w-4 h-4 rounded-full ${vibrationEnabled ? "bg-black" : "bg-slate-500"}`} />
          </button>
        </div>
      </div>

      {/* 4. PROVABLY FAIR SEED SETTINGS */}
      <div className="glass-card rounded-2xl p-4 space-y-3 border border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <ShieldCheck className="text-emerald-400" size={18} />
          <span>{language === "am" ? "ፍትሃዊነት (Provably Fair Client Seed)" : "Provably Fair Client Seed"}</span>
        </div>
        <p className="text-[11px] text-slate-400">
          {language === "am"
            ? "የእርስዎን የራሶት ሴድ በማስገባት የእጣ ውጤቱን ትክክለኛነት ማረጋገጥ ይችላሉ።"
            : "Customize your client seed to guarantee seed entropy and deterministic fairness."}
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={customSeed}
            onChange={(e) => setCustomSeed(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-[#000000] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#C084FC]"
          />
          <button
            onClick={handleGenerateRandomSeed}
            className="p-2 rounded-lg bg-[#12121c] text-[#22D3EE] hover:bg-[#1a1a2e] border border-white/10"
            title="Generate Random Seed"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {seedSavedMsg && (
          <div className="text-emerald-400 text-xs bg-emerald-500/10 p-2 rounded-lg text-center flex items-center justify-center gap-1">
            <CheckCircle2 size={14} /> {seedSavedMsg}
          </div>
        )}

        <button
          onClick={handleSaveSeed}
          className="w-full py-2 rounded-xl bg-[#22D3EE] text-black font-bold text-xs hover:opacity-90 transition-all"
        >
          {language === "am" ? "ሴድ አስቀምጥ" : "Save Custom Client Seed"}
        </button>
      </div>

      {/* 5. CAREER PERFORMANCE STATS */}
      <div className="glass-card rounded-2xl p-4 space-y-3 border border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Award className="text-[#C084FC]" size={18} />
          <span>{language === "am" ? "የጨዋታ ታሪክ ስታቲስቲክስ" : "Career Performance Stats"}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-[#000000] p-2.5 rounded-xl border border-white/5">
            <div className="text-slate-400 text-[10px]">Total Played</div>
            <div className="font-extrabold text-white text-sm mt-0.5">{totalGames}</div>
          </div>
          <div className="bg-[#000000] p-2.5 rounded-xl border border-white/5">
            <div className="text-slate-400 text-[10px]">Winnings</div>
            <div className="font-extrabold text-emerald-400 text-sm mt-0.5">{winnings.toFixed(0)} ETB</div>
          </div>
          <div className="bg-[#000000] p-2.5 rounded-xl border border-white/5">
            <div className="text-slate-400 text-[10px]">Win Rate</div>
            <div className="font-extrabold text-[#22D3EE] text-sm mt-0.5">{winRate}%</div>
          </div>
        </div>
      </div>

      {/* 6. HELP, RULES & DEV AUTH SHORTCUT */}
      <div className="glass-card rounded-2xl p-4 space-y-2 border border-white/10">
        <button
          onClick={() => setShowHowToPlay(!showHowToPlay)}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-[#12121c] hover:bg-[#1a1a2e] text-xs font-bold text-slate-200 transition-all"
        >
          <span className="flex items-center gap-2">
            <HelpCircle size={16} className="text-[#22D3EE]" />
            {language === "am" ? "የኬኖ አጫወት መመሪያ" : "How to Play Keno Guide"}
          </span>
          <ChevronRight size={16} className={showHowToPlay ? "rotate-90 transition-transform" : ""} />
        </button>

        {showHowToPlay && (
          <div className="p-3 bg-[#000000] rounded-xl text-xs text-slate-300 space-y-2 border border-white/5 animate-fade-in">
            <p>1. {language === "am" ? "ከ1 እስከ 80 ባሉት ቁጥሮች ውስጥ ከ1 እስከ 10 ቁጥሮችን ይምረጡ።" : "Select between 1 to 10 numbers from the 1–80 grid."}</p>
            <p>2. {language === "am" ? "የመወራረጃ ገንዘብዎን በቤት ገፅ ያስገቡ።" : "Configure your wager amount on the Home screen."}</p>
            <p>3. {language === "am" ? "20 እጣ ቁጥሮች በቅጽበት ይወጣሉ። የገጣጠሟቸው ቁጥሮች በበዙ ቁጥር አሸናፊነትዎ ያድጋል!" : "20 random winning numbers will be drawn. Match more numbers to win up to 100,000x jackpot!"}</p>
          </div>
        )}

        <button
          onClick={() => setShowDevLogin(true)}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-[#12121c] hover:bg-[#1a1a2e] text-xs font-bold text-[#C084FC] transition-all"
        >
          <span className="flex items-center gap-2">
            <KeyRound size={16} />
            {language === "am" ? "መለያ ቀይር / Dev Login" : "Switch Account / Dev Login"}
          </span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
