import React, { useState } from "react";
import { Shield, User, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { API } from "../config/api";

export default function Login({ onLoginSuccess }) {
  const [role, setRole] = useState("ADMIN"); // ADMIN or CLIENT
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setError("");
    setEmail("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      if (!res.ok) {
        throw new Error("Invalid email, password, or role selected!");
      }

      const userData = await res.json();
      onLoginSuccess(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md bg-[#111827] border border-[#1E293B] rounded-2xl p-5 sm:p-8 shadow-2xl">
        
        {/* Title */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 mb-3">
            <Shield size={28} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">NEXUS ALGO</h1>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1">Select your access role to continue</p>
        </div>

        {/* Role Toggle Switch */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#0B0F17] border border-[#1E293B] rounded-xl mb-6">
          <button
            type="button"
            onClick={() => handleRoleSwitch("ADMIN")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition ${
              role === "ADMIN"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Shield size={14} /> Super Admin
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch("CLIENT")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition ${
              role === "CLIENT"
                ? "bg-emerald-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <User size={14} /> Client / User
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-xs text-red-400">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-slate-500" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-lg pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-500" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-lg pl-10 pr-10 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 transition ${
              role === "ADMIN" ? "bg-blue-600 hover:bg-blue-500" : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            {loading ? "Authenticating..." : `Login as ${role === "ADMIN" ? "Super Admin" : "Client"}`}
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#1E293B] text-center">
          <p className="text-[11px] text-slate-500">
            Enter your email and password to continue.
          </p>
        </div>

      </div>
    </div>
  );
}