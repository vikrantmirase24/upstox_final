import React, { useState, useEffect } from "react";
import { User, Activity, LogOut, Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { API } from "../../config/api";

export default function UserDashboard({ user, onLogout }) {
  const [ledger, setLedger] = useState({
    current_capital: 10000,
    purchasing_power: 50000,
    total_realized_pnl: 0,
    trades: []
  });

  const loadLedger = async () => {
    try {
      const res = await fetch(`${API}/user/ledger/${user.id}`);
      if (res.ok) {
        setLedger(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Live Ticker: Har 2 second me auto-refresh
  useEffect(() => {
    loadLedger();
    const interval = setInterval(loadLedger, 2000);
    return () => clearInterval(interval);
  }, []);

  // Total Live Unrealized P&L
  const liveUnrealizedPnl = ledger.trades
    .filter((t) => t.status === "OPEN")
    .reduce((acc, curr) => acc + curr.pnl, 0);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-[#1E293B] px-4 py-3 sm:px-8 sm:py-0 sm:h-16 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-[#111827]">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600/20 text-emerald-500 p-2 rounded-lg">
            <User size={18} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">CLIENT TERMINAL</h1>
            <p className="text-[10px] text-slate-400">Dynamic Capital & Live Feed</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <span className="text-xs text-slate-400">Client: <strong className="text-white">{user.name}</strong></span>
          <button onClick={onLogout} className="w-full sm:w-auto px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition flex items-center justify-center gap-1">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <main className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-[#111827] border border-[#1E293B] p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Available Capital</span>
              <Wallet size={16} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold font-mono text-white mt-2">
              ₹{ledger.current_capital.toLocaleString()}
            </h2>
            <p className="text-[10px] text-slate-500 mt-1">Demat Base Balance</p>
          </div>

          <div className="bg-[#111827] border border-[#1E293B] p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">5x Buying Power</span>
              <TrendingUp size={16} className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold font-mono text-blue-400 mt-2">
              ₹{ledger.purchasing_power.toLocaleString()}
            </h2>
            <p className="text-[10px] text-slate-500 mt-1">Intraday Margin</p>
          </div>

          <div className="bg-[#111827] border border-[#1E293B] p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Live Floating P&L</span>
              <Activity size={16} className={liveUnrealizedPnl >= 0 ? "text-emerald-400" : "text-red-400"} />
            </div>
            <h2 className={`text-2xl font-bold font-mono mt-2 flex items-center gap-1 ${liveUnrealizedPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {liveUnrealizedPnl >= 0 ? "+" : ""}₹{liveUnrealizedPnl.toFixed(2)}
            </h2>
            <p className="text-[10px] text-slate-500 mt-1">Live Open Positions</p>
          </div>

          <div className="bg-[#111827] border border-[#1E293B] p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Total Realized P&L</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">EOD</span>
            </div>
            <h2 className={`text-2xl font-bold font-mono mt-2 ${ledger.total_realized_pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {ledger.total_realized_pnl >= 0 ? "+" : ""}₹{ledger.total_realized_pnl.toFixed(2)}
            </h2>
            <p className="text-[10px] text-slate-500 mt-1">Closed Trades Profit</p>
          </div>
        </div>

        {/* Live Positions Table */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Trades Ledger & Live Execution Feed
            </h3>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Feed (2s refresh)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="border-b border-[#1E293B] text-slate-400 uppercase text-[11px]">
                <tr>
                  <th className="pb-3">Symbol</th>
                  <th className="pb-3">Buy Price / Time</th>
                  <th className="pb-3">Current / Exit Price</th>
                  <th className="pb-3">Exit Time</th>
                  <th className="pb-3">Qty</th>
                  <th className="pb-3">Margin Used</th>
                  <th className="pb-3">Current P&L</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {ledger.trades.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-slate-500">
                      Abhi koi open ya closed trades nahi hain. Admin subha stocks deploy karega.
                    </td>
                  </tr>
                ) : (
                  ledger.trades.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/30">
                      <td className="py-3 font-bold text-white tracking-wide">{t.symbol}</td>
                      <td className="py-3">
                        <div className="font-mono text-slate-200">₹{t.buy_price}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock size={10} /> {t.buy_time}
                        </div>
                      </td>
                      <td className="py-3 font-mono">
                        {t.status === "CLOSED" ? (
                          <span className="text-slate-300">₹{t.sell_price}</span>
                        ) : (
                          <span className="text-blue-400 font-bold animate-pulse">₹{t.current_ltp}</span>
                        )}
                      </td>
                      <td className="py-3 text-[11px] text-slate-400">{t.exit_time}</td>
                      <td className="py-3 font-mono font-bold text-slate-200">{t.quantity}</td>
                      <td className="py-3 font-mono text-slate-400">₹{t.invested_margin}</td>
                      <td className="py-3 font-mono font-bold">
                        <span className={`inline-flex items-center gap-1 ${t.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {t.pnl >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                          {t.pnl >= 0 ? "+" : ""}₹{t.pnl}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === "CLOSED"
                            ? "bg-slate-800 text-slate-400 border border-slate-700"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse"
                        }`}>
                          {t.status === "CLOSED" ? "EXITED" : "RUNNING"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}