import React from "react";
import { X, UserCheck, Shield } from "lucide-react";

export default function UserViewModal({ isOpen, onClose, user }) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-b border-[#1E293B] pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <UserCheck size={16} className="text-blue-500" /> Client Details: {user.name}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-[#0B0F17] border border-[#1E293B] rounded-lg">
            <p className="text-slate-400">User ID & Role</p>
            <p className="text-white font-bold mt-0.5">#{user.id} &bull; {user.role}</p>
          </div>

          <div className="p-3 bg-[#0B0F17] border border-[#1E293B] rounded-lg">
            <p className="text-slate-400">Email Address</p>
            <p className="text-white font-mono mt-0.5">{user.email}</p>
          </div>

          <div className="p-3 bg-[#0B0F17] border border-[#1E293B] rounded-lg">
            <p className="text-slate-400">Broker Client ID</p>
            <p className="text-blue-400 font-mono font-bold mt-0.5">{user.client_id}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#0B0F17] border border-[#1E293B] rounded-lg">
              <p className="text-slate-400">Risk Multiplier</p>
              <p className="text-emerald-400 font-mono font-bold text-sm mt-0.5">{user.multiplier}x</p>
            </div>
            <div className="p-3 bg-[#0B0F17] border border-[#1E293B] rounded-lg">
              <p className="text-slate-400">Account Status</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                user.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {user.is_active ? 'ACTIVE' : 'DISABLED'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold uppercase text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}