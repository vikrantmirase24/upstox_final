export default function ReportsPage({ reports }) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-lg font-bold text-white">Execution Audit Reports</h2>
        <p className="text-xs text-slate-400">Trade logs and client execution history.</p>
      </div>

      <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-5 shadow-lg">
        <table className="w-full text-xs text-left">
          <thead className="border-b border-[#1E293B] text-slate-400 uppercase text-[11px]">
            <tr>
              <th className="pb-3">Date</th>
              <th className="pb-3">Symbol</th>
              <th className="pb-3">Signal</th>
              <th className="pb-3">Targeted Accounts</th>
              <th className="pb-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]">
            {reports.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-slate-500">
                  No trade reports logged yet.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-800/30">
                  <td className="py-3 text-slate-400">{report.date}</td>
                  <td className="py-3 font-bold text-white">{report.symbol}</td>
                  <td className="py-3 font-bold text-emerald-400">BUY</td>
                  <td className="py-3">{report.accounts_targeted} Accounts</td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      report.status === "TRIGGERED"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-slate-700 text-slate-400"
                    }`}>
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
