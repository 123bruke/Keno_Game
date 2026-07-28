import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAppStore, Tab } from "./lib/store";
import { usePlayKeno, useCurrentRound, useWallet } from "./lib/hooks";
import { ensureAuth } from "./lib/api";
import SplashScreen from "./components/SplashScreen";
import Home from "./components/Home";
import KenoBoard from "./components/KenoBoard";
import BetControls from "./components/BetControls";
import GameResult from "./components/GameResult";
import Wallet from "./components/Wallet";
import History from "./components/History";
import ProvablyFair from "./components/ProvablyFair";
import Profile from "./components/Profile";
import AdminDashboard from "./features/admin/AdminDashboard";
import DevLoginModal from "./components/DevLoginModal";
import { Home as HomeIcon, Clock, WalletIcon, ShieldCheck, User as UserIcon, KeyRound, ArrowLeft } from "lucide-react";

const qc = new QueryClient();

// Client Navigation Tabs
const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "history", label: "History", icon: Clock },
  { id: "wallet", label: "Wallet", icon: WalletIcon },
  { id: "fair", label: "Fairness", icon: ShieldCheck },
  { id: "profile", label: "Profile", icon: UserIcon },
];

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);

  const {
    activeTab,
    setActiveTab,
    selectedNumbers,
    betAmount,
    gameMode,
    clearSelection,
    currentUser,
    setCurrentUser,
    showDevLogin,
    setShowDevLogin,
  } = useAppStore();

  const playMutation = usePlayKeno();
  const { data: roundData } = useCurrentRound();
  const { data: walletData } = useWallet();

  const [gameResultData, setGameResultData] = useState<any>(null);
  const [drawWinning, setDrawWinning] = useState<number[]>([]);
  const [drawRevealed, setDrawRevealed] = useState(0);

  // Auto initialize auth on boot
  useEffect(() => {
    const cachedUser = localStorage.getItem("keno_user");
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        setCurrentUser(parsed);
        setActiveTab(parsed.role === "ADMIN" ? "admin" : "home");
      } catch {}
    } else {
      ensureAuth().then(() => {
        const stored = localStorage.getItem("keno_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setCurrentUser(parsed);
          setActiveTab(parsed.role === "ADMIN" ? "admin" : "home");
        }
      });
    }
  }, []);

  const handlePlay = () => {
    playMutation.mutate(
      { selectedNumbers, betAmount, mode: gameMode },
      {
        onSuccess: (data) => {
          if (data.mode === "INSTANT" && data.drawNumbers) {
            setDrawWinning(data.drawNumbers);
            setDrawRevealed(0);
            clearSelection();

            let idx = 0;
            const interval = setInterval(() => {
              idx++;
              setDrawRevealed(idx);
              if (idx >= data.drawNumbers.length) {
                clearInterval(interval);
                setTimeout(() => setGameResultData(data), 300);
              }
            }, 70);
          } else {
            alert(`Ticket accepted for Classic Round #${data.roundNumber}!`);
            clearSelection();
          }
        },
        onError: (err: any) => {
          alert(err?.response?.data?.message || err?.message || "Failed to place bet");
        },
      }
    );
  };

  // Render Splash Screen on initial application launch
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Role-based guard: admin dashboard only for ADMIN role
  if (activeTab === "admin" && currentUser?.role === "ADMIN") {
    return (
      <>
        <AdminDashboard onSwitchToPlayer={() => setActiveTab("home")} />
        {showDevLogin && <DevLoginModal onClose={() => setShowDevLogin(false)} />}
      </>
    );
  }

  // Non-admin trying to access admin tab → force to home
  if (activeTab === "admin") {
    setActiveTab("home");
  }

  return (
    <div className="min-h-dvh flex flex-col max-w-lg mx-auto bg-[#000000] text-slate-100 selection:bg-[#C084FC] selection:text-black">
      {/* Header Bar */}
      <header className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-white/10 glass-card">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("home")}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#C084FC] to-[#22D3EE] flex items-center justify-center font-black text-black text-base shadow-lg shadow-[#C084FC]/30">
            K
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-wide bg-gradient-to-r from-[#C084FC] via-[#22D3EE] to-white bg-clip-text text-transparent">
              ኬኖ
            </h1>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span>{currentUser?.username ? `@${currentUser.username}` : "Dev User"}</span>
              {currentUser?.role === "ADMIN" && (
                <span
                  onClick={() => setActiveTab("admin")}
                  className="text-[#22D3EE] font-bold underline cursor-pointer"
                >
                  [ADMIN DASHBOARD]
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDevLogin(true)}
            className="flex items-center gap-1 text-[11px] font-bold text-[#C084FC] bg-[#12121c] px-2.5 py-1 rounded-full border border-[#C084FC]/30 hover:bg-[#C084FC]/20 transition-all"
            title="Switch User / Dev Login"
          >
            <KeyRound size={12} />
            Dev Auth
          </button>
          <span className="text-[11px] font-bold text-[#22D3EE] bg-[#12121c] px-2.5 py-1 rounded-full border border-white/10 font-mono">
            {Number(walletData?.totalBalance || 0).toFixed(0)} ETB
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {activeTab === "home" && <Home />}
        {activeTab === "game" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTab("home")}
                className="flex items-center gap-1 text-xs font-bold text-[#C084FC] hover:text-white transition-all bg-[#12121c] px-3 py-1.5 rounded-xl border border-white/10"
              >
                <ArrowLeft size={14} /> Back to Home
              </button>
              <span className="text-xs text-slate-400 font-mono">
                {gameMode} MODE
              </span>
            </div>
            <KenoBoard winningNumbers={drawWinning} revealedCount={drawRevealed} />
            <BetControls onPlay={handlePlay} isPlaying={playMutation.isPending} />
          </div>
        )}
        {activeTab === "history" && <History />}
        {activeTab === "wallet" && <Wallet />}
        {activeTab === "fair" && <ProvablyFair />}
        {activeTab === "profile" && <Profile />}
      </main>

      {/* Client Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#09090b]/90 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-lg mx-auto flex">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-bold transition-all relative ${
                  isActive
                    ? "text-[#C084FC]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon size={18} className={isActive ? "stroke-[#C084FC] filter drop-shadow-md" : ""} />
                {t.label}
                {isActive && (
                  <span className="absolute bottom-0 w-8 h-1 bg-gradient-to-r from-[#C084FC] to-[#22D3EE] rounded-t-full shadow-sm shadow-[#C084FC]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modals */}
      {showDevLogin && <DevLoginModal onClose={() => setShowDevLogin(false)} />}
      {gameResultData && <GameResult result={gameResultData} onClose={() => setGameResultData(null)} />}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AppContent />
    </QueryClientProvider>
  );
}
