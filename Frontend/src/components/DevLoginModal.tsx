import { useState } from "react";
import { authApi } from "../lib/api";
import { useAppStore } from "../lib/store";
import { useQueryClient } from "@tanstack/react-query";
import { UserCheck, Shield, KeyRound, X, Sparkles } from "lucide-react";

export default function DevLoginModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { setCurrentUser, setActiveTab } = useAppStore();

  const [telegramId, setTelegramId] = useState("123456789");
  const [username, setUsername] = useState("player_one");
  const [firstName, setFirstName] = useState("Player");
  const [lastName, setLastName] = useState("One");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (
    customId?: string,
    customUser?: string,
    customRole?: "USER" | "ADMIN"
  ) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        telegramId: customId || telegramId,
        username: customUser || username,
        firstName,
        lastName,
        role: customRole || role,
      };

      const res = await authApi.loginTelegram(payload);
      setCurrentUser(res.user);

      // Refresh query data with new auth token
      qc.invalidateQueries();

      // Role-based redirect: ADMIN → admin dashboard, USER → home
      setActiveTab((customRole || role) === "ADMIN" ? "admin" : "home");

      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="glass-card border border-[#C084FC]/40 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl shadow-[#C084FC]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#C084FC]/20 text-[#C084FC]">
              <KeyRound size={22} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Dev / Admin Login</h3>
              <p className="text-[11px] text-slate-400">Authenticates with POST /auth/telegram</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-slate-400">1-Click Presets:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleLogin("123456789", "player_one", "USER")}
              disabled={loading}
              className="py-2.5 px-3 rounded-xl bg-[#12121c] hover:bg-[#1a1a2e] border border-white/10 text-xs font-bold text-[#C084FC] flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              <UserCheck size={14} />
              Login as Player
            </button>
            <button
              onClick={() => handleLogin("999999999", "admin_keno", "ADMIN")}
              disabled={loading}
              className="py-2.5 px-3 rounded-xl bg-[#12121c] hover:bg-[#1a1a2e] border border-white/10 text-xs font-bold text-[#22D3EE] flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Shield size={14} />
              Login as Admin
            </button>
          </div>
        </div>

        <div className="relative flex items-center my-2">
          <div className="flex-grow border-t border-white/10" />
          <span className="flex-shrink mx-2 text-[10px] text-slate-500 uppercase">or Custom Telegram User</span>
          <div className="flex-grow border-t border-white/10" />
        </div>

        {/* Custom Login Form */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Telegram ID (Number)</label>
            <input
              type="number"
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#000000] border border-white/10 text-white font-mono focus:outline-none focus:border-[#C084FC]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#000000] border border-white/10 text-white focus:outline-none focus:border-[#C084FC]"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "USER" | "ADMIN")}
                className="w-full px-3 py-2 rounded-lg bg-[#000000] border border-white/10 text-white focus:outline-none focus:border-[#22D3EE]"
              >
                <option value="USER">USER (Player)</option>
                <option value="ADMIN">ADMIN (Manager)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#000000] border border-white/10 text-white focus:outline-none focus:border-[#C084FC]"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#000000] border border-white/10 text-white focus:outline-none focus:border-[#C084FC]"
              />
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg text-center">
            {errorMsg}
          </div>
        )}

        <button
          onClick={() => handleLogin()}
          disabled={loading || !telegramId}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C084FC] via-[#22D3EE] to-[#C084FC] text-black font-extrabold text-xs shadow-lg shadow-[#C084FC]/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? "Authenticating with Backend..." : "Submit & Authenticate"}
        </button>
      </div>
    </div>
  );
}
