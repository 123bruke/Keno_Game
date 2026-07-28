import { useEffect, useState } from "react";
import { Sparkles, Flame } from "lucide-react";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Auto fade-out timer
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(onFinish, 400); // Allow fade animation to complete
    }, 2200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      onClick={() => {
        setFade(true);
        setTimeout(onFinish, 200);
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#000000] text-white p-6 select-none cursor-pointer transition-opacity duration-500 ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C084FC]/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#22D3EE]/25 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Brand Header */}
      <div className="w-full flex justify-between items-center text-xs text-slate-400 font-mono tracking-widest pt-4">
        <span className="flex items-center gap-1 text-[#C084FC]">
          <Sparkles size={14} /> PROVABLY FAIR
        </span>
        <span className="text-[#22D3EE] font-bold">ETHOPIA #1</span>
      </div>

      {/* CENTER PIECE: "ኬኖ" Amharic Word & Glowing Aura */}
      <div className="flex flex-col items-center justify-center text-center my-auto space-y-4 animate-splash-pulse">
        {/* Decorative Badge Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#C084FC] via-[#22D3EE] to-white flex items-center justify-center font-black text-black text-3xl shadow-2xl shadow-[#C084FC]/50 mb-2">
          ኬ
        </div>

        {/* Centered Amharic Word "ኬኖ" */}
        <h1 className="text-7xl sm:text-9xl font-black tracking-wider bg-gradient-to-r from-[#C084FC] via-[#22D3EE] to-white bg-clip-text text-transparent font-serif leading-none filter drop-shadow-2xl">
          ኬኖ
        </h1>

        {/* Amharic Subtitle */}
        <div className="space-y-1">
          <p className="text-base sm:text-xl font-bold tracking-widest text-slate-200">
            የቀጥታ እና ፈጣን የቁጥር ጨዋታ
          </p>
          <p className="text-xs text-slate-400 tracking-wider">
            KENO CASINO TELEGRAM MINI APP
          </p>
        </div>
      </div>

      {/* Bottom Loading Progress Bar */}
      <div className="w-full max-w-xs space-y-2 pb-6 text-center">
        <div className="h-1.5 w-full bg-[#12121c] rounded-full overflow-hidden border border-white/10">
          <div className="h-full bg-gradient-to-r from-[#C084FC] to-[#22D3EE] rounded-full animate-[pulse_1s_infinite] w-full origin-left transition-transform duration-[2000ms] ease-out" />
        </div>
        <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
          ይጫኑ ለመጀመር • TAP TO ENTER
        </div>
      </div>
    </div>
  );
}
