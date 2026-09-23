import React, { useState, useEffect, useRef } from "react";
import {
  PlusCircle,
  Search,
  Loader2,
  Plus,
  Trash2,
  Activity,
  RefreshCw,
  Clock,
} from "lucide-react";
import { API } from "../../../config/api";

export default function DailyStockEngine({
  apiBase = API,
}) {
  const [symbol, setSymbol] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(false);

  const searchRef = useRef(null);

  // =========================================================
  // LOAD TODAY'S WATCHLIST
  // =========================================================
  const loadWatchlist = async () => {
    try {
      setIsLoadingWatchlist(true);

      const res = await fetch(`${apiBase}/watchlist`, {
        method: "GET",
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();

        // Backend already returns only today's records.
        setWatchlist(Array.isArray(data) ? data : []);
      } else {
        console.error("Watchlist API failed:", res.status);
        setWatchlist([]);
      }
    } catch (err) {
      console.error("Watchlist fetch failed:", err);
      setWatchlist([]);
    } finally {
      setIsLoadingWatchlist(false);
    }
  };

  // =========================================================
  // AUTO REFRESH EVERY 10 SECONDS
  // =========================================================
  useEffect(() => {
    loadWatchlist();

    const interval = setInterval(() => {
      loadWatchlist();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // CLOSE SEARCH DROPDOWN
  // =========================================================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================================================
  // STOCK SEARCH
  // =========================================================
  useEffect(() => {
    if (symbol.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);

      try {
        const res = await fetch(
          `${apiBase}/stocks/search?query=${encodeURIComponent(symbol)}`
        );

        if (res.ok) {
          const data = await res.json();

          setSuggestions(Array.isArray(data) ? data : []);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Search failed:", err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [symbol, apiBase]);

  // =========================================================
  // SELECT STOCK FROM SEARCH
  // =========================================================
  const handleSelect = (item) => {
    setSymbol(item.symbol || "");
    setShowDropdown(false);
  };

  // =========================================================
  // ADD STOCK TO TODAY'S WATCHLIST
  // =========================================================
  const handleAddStock = async (e) => {
    e.preventDefault();

    const stockSymbol = symbol.trim().toUpperCase();

    if (!stockSymbol) {
      return;
    }

    try {
      const res = await fetch(`${apiBase}/admin/watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: stockSymbol,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSymbol("");
        setShowDropdown(false);

        // Immediately refresh today's list
        await loadWatchlist();
      } else {
        alert(data.detail || "Error adding stock");
      }
    } catch (err) {
      console.error("Add stock failed:", err);
      alert("Unable to add stock. Please try again.");
    }
  };

  // =========================================================
  // REMOVE TODAY'S STOCK
  // =========================================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Kya aap is stock ko today's watchlist se remove karna chahte hain?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(
        `${apiBase}/admin/watchlist/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));

        alert(data.detail || "Unable to remove stock");
        return;
      }

      await loadWatchlist();
    } catch (err) {
      console.error("Delete watchlist failed:", err);
      alert("Unable to remove stock. Please try again.");
    }
  };

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">

      {/* =====================================================
          AUTO PILOT STATUS
      ====================================================== */}
      <div className="bg-[#111827] border border-emerald-500/30 p-5 rounded-xl flex items-center justify-between shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              AUTO-PILOT ACTIVE
            </span>

            <span className="text-xs text-slate-400 font-mono">
              5-Min HA Supertrend (1, 1)
            </span>
          </div>

          <h3 className="text-base font-bold text-white mt-1">
            Automatic Execution Engine
          </h3>

          <p className="text-xs text-slate-400">
            Stocks subha 9:18 tak add karein.{" "}
            <strong>09:20 AM</strong> par auto BUY hoga aur 5-min
            candle par ST RED hote hi next open par auto EXIT ho jayega.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0B0F17] border border-[#1E293B] px-3 py-2 rounded-lg text-slate-300 text-xs">
            <Clock size={15} className="text-blue-400" />

            <span>
              Entry: <strong>09:20 AM</strong>
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="text-blue-500" size={22} />
            Daily Stock Engine
          </h2>

          <p className="text-xs text-slate-400 mt-0.5">
            Jo bhi stocks yahan rahenge unpe bina kisi click ke
            schedule time par trade place ho jayegi.
          </p>
        </div>

        <button
          onClick={loadWatchlist}
          disabled={isLoadingWatchlist}
          className="p-2 bg-[#111827] border border-[#1E293B] hover:bg-slate-800 text-slate-300 rounded-lg text-xs transition disabled:opacity-50"
          title="Refresh List"
        >
          <RefreshCw
            size={15}
            className={isLoadingWatchlist ? "animate-spin" : ""}
          />
        </button>
      </div>

      {/* =====================================================
          SEARCH & ADD STOCK
      ====================================================== */}
      <div className="bg-[#111827] border border-[#1E293B] p-5 rounded-xl shadow-lg relative">
        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <PlusCircle size={15} />
          Search & Add Stock
        </h3>

        <form onSubmit={handleAddStock} className="flex gap-3">
          <div
            className="relative flex-1"
            ref={searchRef}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Stock symbol search karein (e.g. TATASTEEL, INFY, RELIANCE)..."
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowDropdown(true);
                  }
                }}
                required
                autoComplete="off"
                className="w-full bg-[#0B0F17] border border-[#1E293B] pl-9 pr-3 py-2.5 rounded-lg text-xs text-white uppercase focus:border-blue-500 outline-none"
              />

              <Search
                className="absolute left-3 top-3 text-slate-500"
                size={14}
              />

              {isSearching && (
                <Loader2
                  className="absolute right-3 top-3 text-blue-400 animate-spin"
                  size={14}
                />
              )}
            </div>

            {/* SEARCH DROPDOWN */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 max-h-60 overflow-y-auto bg-[#111827] border border-[#1E293B] rounded-lg shadow-2xl z-50 divide-y divide-[#1E293B]">
                {suggestions.map((item) => (
                  <div
                    key={item.token}
                    onClick={() => handleSelect(item)}
                    className="p-3 hover:bg-slate-800 cursor-pointer flex justify-between items-center transition"
                  >
                    <div>
                      <p className="text-xs font-bold text-white tracking-wide">
                        {item.symbol}
                      </p>

                      <p className="text-[10px] text-slate-400 truncate max-w-sm">
                        {item.name || "Equity"}
                      </p>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                      {item.exchange}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition flex items-center gap-1.5 shrink-0"
          >
            <Plus size={15} />
            Add Stock
          </button>
        </form>
      </div>

      {/* =====================================================
          TODAY'S WATCHLIST
      ====================================================== */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-5 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Today's Watchlist ({watchlist.length})
          </h3>

          <span className="text-[11px] text-slate-400">
            Action:{" "}
            <strong className="text-emerald-400">
              BUY ONLY
            </strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="border-b border-[#1E293B] text-slate-400 uppercase text-[11px]">
              <tr>
                <th className="pb-3">#</th>
                <th className="pb-3">Stock Symbol</th>
                <th className="pb-3">Signal</th>
                <th className="pb-3">Engine Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#1E293B]">
              {watchlist.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center text-slate-500"
                  >
                    Aaj abhi tak koi stock add nahi hua hai.
                    09:18 tak stocks add kar lein.
                  </td>
                </tr>
              ) : (
                watchlist.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/30 transition"
                  >
                    <td className="py-3.5 text-slate-500">
                      {idx + 1}
                    </td>

                    <td className="py-3.5 font-bold text-white text-sm">
                      {item.symbol}
                    </td>

                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        BUY
                      </span>
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === "TRIGGERED"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {item.status === "TRIGGERED"
                          ? "ORDER PLACED (AUTO)"
                          : "QUEUED FOR 09:20 AM"}
                      </span>
                    </td>

                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-2 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded transition inline-flex items-center"
                        title="Remove"
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
      </div>
    </div>
  );
}