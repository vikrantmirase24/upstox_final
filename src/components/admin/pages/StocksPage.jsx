import React from "react";
import DailyStockEngine from "../../admin/stocks/DailyStockEngine";
import { API } from "../../../config/api";

export default function StocksPage({ apiBase = API }) {
  return <DailyStockEngine apiBase={apiBase} />;
}