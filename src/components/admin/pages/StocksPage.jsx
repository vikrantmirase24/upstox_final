import React from "react";
import DailyStockEngine from "../../admin/stocks/DailyStockEngine";

export default function StocksPage({ apiBase = "http://127.0.0.1:8000/api" }) {
  return <DailyStockEngine apiBase={apiBase} />;
}