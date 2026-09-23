import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  TrendingUp, LayoutDashboard, Users,
  FileText, LogOut, Activity, Menu, X
} from "lucide-react";
import StocksPage from "./pages/StocksPage";
import UsersPage from "./pages/UsersPage";
import ReportsPage from "./pages/ReportsPage";
import { API } from "../../config/api";

export default function AdminDashboard({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const activeMenu = location.pathname.split("/").pop() || "dashboard";
  const [userCount, setUserCount] = useState(0);
  const [stockCount, setStockCount] = useState(0);
  const [reports, setReports] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const loadSummary = async () => {
    try {
      const [uRes, wRes, rRes] = await Promise.all([
        fetch(`${API}/admin/users`),
        fetch(`${API}/watchlist`),
        fetch(`${API}/admin/reports`)
      ]);
      const uData = uRes.ok ? await uRes.json() : [];
      const wData = wRes.ok ? await wRes.json() : [];
      const rData = rRes.ok ? await rRes.json() : [];

      setUserCount(Array.isArray(uData) ? uData.length : 0);
      setStockCount(Array.isArray(wData) ? wData.length : 0);
      setReports(Array.isArray(rData) ? rData : []);
    } catch (err) {
      console.error("Summary fetch failed:", err);
    }
  };

  useEffect(() => {
    if (activeMenu === "dashboard" || activeMenu === "reports") {
      loadSummary();
    }
  }, [activeMenu]);

  // Mobile screens par navigate hone ke baad collapse kar dega
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[#0B0F17] text-slate-100 font-sans overflow-hidden">

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-[#111827] border-r border-[#1E293B] flex flex-col justify-between p-3 shrink-0 transition-all duration-300 md:static ${isSidebarOpen ? "w-64" : "w-16 md:w-20"
          }`}
      >
        <div>
          {/* Logo & Header */}
          <div className={`flex items-center gap-3 py-3 mb-6 border-b border-[#1E293B] ${isSidebarOpen ? "px-2 justify-between" : "justify-center"
            }`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-blue-600/20 text-blue-500 p-2 rounded-lg border border-blue-500/30 shrink-0">
                <TrendingUp size={20} />
              </div>
              {isSidebarOpen && (
                <div className="truncate">
                  <h1 className="text-sm font-bold text-white tracking-wide">NEXUS ALGO</h1>
                  <p className="text-[10px] text-slate-400">Super Admin Panel</p>
                </div>
              )}
            </div>
            {isSidebarOpen && (
              <button
                type="button"
                aria-label="Toggle Navigation"
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 md:hidden"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <NavLink
              to="/admin/dashboard"
              title="Dashboard Overview"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${isActive ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
                } ${!isSidebarOpen ? "justify-center px-0" : ""}`
              }
            >
              <LayoutDashboard size={18} className="shrink-0" />
              {isSidebarOpen && <span className="truncate">Dashboard Overview</span>}
            </NavLink>

            <NavLink
              to="/admin/stocks"
              title="Daily Stock Engine"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${isActive ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
                } ${!isSidebarOpen ? "justify-center px-0" : ""}`
              }
            >
              <Activity size={18} className="shrink-0" />
              {isSidebarOpen && <span className="truncate">Daily Stock Engine</span>}
            </NavLink>

            <NavLink
              to="/admin/users"
              title="User Management"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${isActive ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
                } ${!isSidebarOpen ? "justify-center px-0" : ""}`
              }
            >
              <Users size={18} className="shrink-0" />
              {isSidebarOpen && <span className="truncate">User Management</span>}
            </NavLink>

            <NavLink
              to="/admin/reports"
              title="Execution Reports"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${isActive ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
                } ${!isSidebarOpen ? "justify-center px-0" : ""}`
              }
            >
              <FileText size={18} className="shrink-0" />
              {isSidebarOpen && <span className="truncate">Execution Reports</span>}
            </NavLink>
          </nav>
        </div>

        {/* User Info & Logout Button */}
        <div className="border-t border-[#1E293B] pt-4">
          {isSidebarOpen && (
            <div className="px-2 mb-3 truncate">
              <p className="text-xs font-bold text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || "admin@algo.com"}</p>
            </div>
          )}
          <button
            onClick={onLogout}
            title="Logout"
            className={`w-full flex items-center gap-2 py-2 bg-slate-800 hover:bg-red-600/20 hover:text-red-400 text-slate-300 rounded-lg text-xs font-semibold transition ${isSidebarOpen ? "px-3" : "justify-center px-0"
              }`}
          >
            <LogOut size={16} className="shrink-0" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 pt-0 md:p-8">
        <header className="-mx-4 mb-5 flex h-14 items-center gap-3 border-b border-[#1E293B] bg-[#111827] px-4 md:-mx-8 md:-mt-8 md:px-8">
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="rounded-lg border border-[#1E293B] bg-[#0B0F17] p-2 text-slate-300 hover:bg-[#1E293B] transition"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-500" />
            <span className="text-xs font-bold tracking-wide text-white">NEXUS ALGO</span>
          </div>
        </header>

        {/* 1. Dashboard Overview */}
        {activeMenu === "dashboard" && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <h2 className="text-lg font-bold text-white">Dashboard Overview</h2>
              <p className="text-xs text-slate-400">Quick view of system counters and status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#111827] border border-[#1E293B] p-5 rounded-xl">
                <p className="text-xs text-slate-400">Total Client Accounts</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{userCount}</h3>
              </div>
              <div className="bg-[#111827] border border-[#1E293B] p-5 rounded-xl">
                <p className="text-xs text-slate-400">Today's Selected Stocks</p>
                <h3 className="text-2xl font-bold mt-1 text-blue-400">{stockCount}</h3>
              </div>
              <div className="bg-[#111827] border border-[#1E293B] p-5 rounded-xl">
                <p className="text-xs text-slate-400">Execution Status</p>
                <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  System Online
                </span>
              </div>
            </div>

            <div className="bg-[#111827] border border-[#1E293B] p-5 rounded-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Quick Navigation</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/admin/stocks")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Activity size={14} /> Open Daily Stock Engine
                </button>
                <button
                  onClick={() => navigate("/admin/users")}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Users size={14} /> Manage Users
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Separate Dedicated Page: Daily Stock Engine */}
        {activeMenu === "stocks" && (
          <StocksPage apiBase={API} />
        )}

        {/* 3. Separate Dedicated Page: Users Management */}
        {activeMenu === "users" && (
          <UsersPage apiBase={API} />
        )}

        {/* 4. Execution Reports Page */}
        {activeMenu === "reports" && (
          <ReportsPage reports={reports} />
        )}

      </main>
    </div>
  );
}