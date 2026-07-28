import { useState } from "react";
import { authApi } from "../lib/api";
import { useAppStore } from "../lib/store";
import { useQueryClient } from "@tanstack/react-query";
import { playSound } from "../lib/sound";
import { UserCheck, Shield, KeyRound, X } from "lucide-react";

export default function DevLoginModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { setCurrentUser, setActiveTab } = useAppStore();

  const [telegramId, setTelegramId] = useState("");
  const [username, setUsername] = useState("player_one");
  const [firstName, setFirstName] = useState("Player");
  const [role, setRole] = useState<"USER" | "ADMIN" | "SUPERADMIN">("USER");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (
    customId?: string,
    customUser?: string,
    customRole?: "USER" | "ADMIN" | "SUPERADMIN"
  ) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const id = customId || telegramId;
      const payload = {
        ...(id ? { telegramId: id } : {}),
        username: customUser || username,
        firstName,
        ...(id ? {} : { role: customRole || role }),
      };

      const res = id
        ? await authApi.loginTelegram({ telegramId: id, username: customUser || username, firstName })
        : await authApi.loginDev(payload);
      setCurrentUser(res.user);

      // Refresh query data with new auth token
      qc.invalidateQueries();

      // Role-based redirect: ADMIN/SUPERADMIN → admin dashboard, USER → home
      setActiveTab(res.user.role === "ADMIN" || res.user.role === "SUPERADMIN" ? "admin" : "home");

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
              <p className="text-[11px] text-slate-400">Dev login — Telegram ID or new user</p>
            </div>
          </div>
          <button
            onClick={() => { playSound(); onClose(); }}
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
              onClick={() => { playSound('select'); handleLogin("123456789", "player_one", "USER"); }}
              disabled={loading}
              className="py-2.5 px-3 rounded-xl bg-[#12121c] hover:bg-[#1a1a2e] border border-white/10 text-xs font-bold text-[#C084FC] flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              <UserCheck size={14} />
              Login as Player
            </button>
            <button
              onClick={() => { playSound('select'); handleLogin("999999999", "admin_keno", "ADMIN"); }}
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
          <span className="flex-shrink mx-2 text-[10px] text-slate-500 uppercase">or Custom</span>
          <div className="flex-grow border-t border-white/10" />
        </div>

        {/* Custom Login Form */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Telegram ID <span className="text-slate-500">(blank = new dev user)</span></label>
            <input
              type="text"
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
              <label className="text-slate-400 block mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#000000] border border-white/10 text-white focus:outline-none focus:border-[#C084FC]"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Role <span className="text-slate-500">(only when creating new user)</span></label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "USER" | "ADMIN" | "SUPERADMIN")}
              className="w-full px-3 py-2 rounded-lg bg-[#000000] border border-white/10 text-white focus:outline-none focus:border-[#22D3EE]"
            >
              <option value="USER">USER (Player)</option>
              <option value="ADMIN">ADMIN (Manager)</option>
              <option value="SUPERADMIN">SUPERADMIN</option>
            </select>
          </div>
        </div>

        {errorMsg && (
          <div className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg text-center">
            {errorMsg}
          </div>
        )}

        <button
          onClick={() => { playSound('success'); handleLogin(); }}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C084FC] via-[#22D3EE] to-[#C084FC] text-black font-extrabold text-xs shadow-lg shadow-[#C084FC]/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? "Authenticating with Backend..." : "Submit & Authenticate"}
        </button>
      </div>
    </div>
  );
}
