import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

export default function UserList({ users, onView, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-left border-collapse">
        <thead className="border-b border-[#1E293B] text-slate-400 uppercase text-[11px]">
          <tr>
            <th className="pb-3">Name</th>
            <th className="pb-3">Email</th>
            <th className="pb-3">Broker ID</th>
            <th className="pb-3">Multiplier</th>
            <th className="pb-3">Status</th>
            <th className="pb-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1E293B]">
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-6 text-center text-slate-500">
                No users found. Click "+ Onboard New User" to add friends.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/30 transition">
                <td className="py-3 font-bold text-white">{u.name}</td>
                <td className="py-3 text-slate-400">{u.email}</td>
                <td className="py-3 font-mono">{u.client_id}</td>
                <td className="py-3 font-mono text-emerald-400 font-bold">{u.multiplier}x</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    u.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {u.is_active ? 'ACTIVE' : 'DISABLED'}
                  </span>
                </td>
                <td className="py-3 text-right space-x-1.5">
                  <button
                    onClick={() => onView(u)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition"
                    title="View Details"
                  >
                    <Eye size={13} />
                  </button>
                  <button
                    onClick={() => onEdit(u)}
                    className="p-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded transition"
                    title="Edit User"
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    onClick={() => onDelete(u.id)}
                    className="p-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded transition"
                    title="Delete User"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}