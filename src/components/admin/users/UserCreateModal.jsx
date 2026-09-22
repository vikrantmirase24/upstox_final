import React, { useState } from "react";
import { X, PlusCircle } from "lucide-react";

export default function UserCreateModal({ isOpen, onClose, onUserCreated, apiBase }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clientId, setClientId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [multiplier, setMultiplier] = useState("1.0");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${apiBase}/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        client_id: clientId,
        api_key: apiKey,
        risk_multiplier: parseFloat(multiplier)
      })
    });

    if (res.ok) {
      setName("");
      setEmail("");
      setPassword("");
      setClientId("");
      setApiKey("");
      setMultiplier("1.0");
      onUserCreated();
      onClose();
    } else {
      const err = await res.json();
      alert(err.detail || "Failed to create user");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-6 max-w-lg w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-b border-[#1E293B] pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PlusCircle size={16} className="text-emerald-500" /> Onboard New Client
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#0B0F17] border border-[#1E293B] p-2 rounded text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Email</label>
              <input
                type="email"
                placeholder="rahul@algo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0B0F17] border border-[#1E293B] p-2 rounded text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0B0F17] border border-[#1E293B] p-2 rounded text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Broker Client ID</label>
              <input
                type="text"
                placeholder="ANGEL1234"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
                className="w-full bg-[#0B0F17] border border-[#1E293B] p-2 rounded text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Risk Multiplier</label>
              <input
                type="number"
                step="0.5"
                value={multiplier}
                onChange={(e) => setMultiplier(e.target.value)}
                required
                className="w-full bg-[#0B0F17] border border-[#1E293B] p-2 rounded text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Broker API Key</label>
            <input
              type="text"
              placeholder="API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
              className="w-full bg-[#0B0F17] border border-[#1E293B] p-2 rounded text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold uppercase transition"
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold uppercase"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}