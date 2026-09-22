import React, { useState, useEffect } from "react";
import { X, Edit } from "lucide-react";

export default function UserEditModal({ isOpen, onClose, user, onUserUpdated, apiBase }) {
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [multiplier, setMultiplier] = useState("1.0");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setClientId(user.client_id || "");
      setMultiplier(user.multiplier || "1.0");
      setIsActive(user.is_active ?? true);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${apiBase}/admin/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        client_id: clientId,
        risk_multiplier: parseFloat(multiplier),
        is_active: isActive
      })
    });

    if (res.ok) {
      onUserUpdated();
      onClose();
    } else {
      alert("Failed to update user");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-b border-[#1E293B] pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Edit size={16} className="text-blue-500" /> Edit User: {user.name}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#0B0F17] border border-[#1E293B] p-2 rounded text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Broker Client ID</label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              className="w-full bg-[#0B0F17] border border-[#1E293B] p-2 rounded text-white outline-none focus:border-blue-500"
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
              className="w-full bg-[#0B0F17] border border-[#1E293B] p-2 rounded text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="activeStatus"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded bg-[#0B0F17] border-slate-700 text-blue-600 focus:ring-0"
            />
            <label htmlFor="activeStatus" className="text-slate-300">
              Enable Algo Copy Trading for this user
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold uppercase transition"
            >
              Save Changes
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