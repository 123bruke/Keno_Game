import { useState } from "react";
import { useAppStore } from "../lib/store";
import { playSound } from "../lib/sound";
import { Globe, Volume2, VolumeX, Smartphone, ChevronLeft, HelpCircle, ChevronRight } from "lucide-react";

export default function Settings() {
  const {
    language,
    setLanguage,
    soundEnabled,
    toggleSound,
    vibrationEnabled,
    toggleVibration,
    setActiveTab,
  } = useAppStore();

  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => { playSound(); setActiveTab("profile"); }}
          className="p-2 rounded-xl bg-[#12121c] text-slate-300 hover:text-white border border-white/10"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-extrabold text-white">
          {language === "am" ? "ማስተካከያዎች" : "Settings"}
        </h2>
      </div>

      <div className="glass-card rounded-2xl p-4 space-y-4 border border-white/10">
        <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
          {language === "am" ? "የመተግበሪያ ማስተካከያዎች" : "App Preferences & Settings"}
        </h3>

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
              onClick={() => { playSound('select'); setLanguage("am"); }}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                language === "am"
                  ? "bg-[#C084FC] text-black shadow-md shadow-[#C084FC]/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🇪🇹 አማርኛ
            </button>
            <button
              onClick={() => { playSound('select'); setLanguage("en"); }}
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
                  ? language === "am" ? "ድምፅ በርቷል" : "Sound ON"
                  : language === "am" ? "ድምፅ ተዘግቷል" : "Sound OFF"}
              </div>
            </div>
          </div>

          <button
            onClick={() => { playSound(); toggleSound(); }}
            className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
              soundEnabled ? "bg-[#C084FC] justify-end" : "bg-[#12121c] justify-start border border-white/10"
            }`}
          >
            <div className={`w-4 h-4 rounded-full ${soundEnabled ? "bg-black" : "bg-slate-500"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold">
            <Smartphone className="text-[#22D3EE]" size={18} />
            <div>
              <div>{language === "am" ? "የንቅናቄ ግፊት (Haptics)" : "Haptic Vibration"}</div>
              <div className="text-[10px] text-slate-400 font-normal">
                {vibrationEnabled
                  ? language === "am" ? "ንቅናቄ በርቷል" : "Vibration ON"
                  : language === "am" ? "ንቅናቄ ተዘግቷል" : "Vibration OFF"}
              </div>
            </div>
          </div>

          <button
            onClick={() => { playSound(); toggleVibration(); }}
            className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
              vibrationEnabled ? "bg-[#22D3EE] justify-end" : "bg-[#12121c] justify-start border border-white/10"
            }`}
          >
            <div className={`w-4 h-4 rounded-full ${vibrationEnabled ? "bg-black" : "bg-slate-500"}`} />
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 space-y-2 border border-white/10">
        <button
          onClick={() => { playSound(); setShowHowToPlay(!showHowToPlay); }}
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
      </div>
    </div>
  );
}
