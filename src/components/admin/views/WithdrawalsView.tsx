import React from 'react';
import { WithdrawRequest } from '../../../types';
import { CheckCircle2, XCircle, Clock, CreditCard, DollarSign } from 'lucide-react';

interface WithdrawalsViewProps {
  withdrawals: WithdrawRequest[];
  onApproveWithdraw: (id: string) => void;
  onRejectWithdraw: (id: string) => void;
}

export const WithdrawalsView: React.FC<WithdrawalsViewProps> = ({ withdrawals, onApproveWithdraw, onRejectWithdraw }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Withdrawal Requests</h2>
          <p className="text-xs text-slate-400">ইন্সট্রাক্টর ও অ্যাফিলিয়েটদের অর্থ উত্তোলনের আবেদন যাচাই ও স্ট্যাটাস আপডেট</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">Ref ID & Date</th>
              <th className="p-4">Instructor Name</th>
              <th className="p-4">Method & Account</th>
              <th className="p-4">Requested Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Approve / Reject</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
            {withdrawals.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/40">
                <td className="p-4 font-mono">
                  <span className="font-bold text-purple-300 block">{item.referenceId}</span>
                  <span className="text-[11px] text-slate-500">{item.requestDate}</span>
                </td>
                <td className="p-4">
                  <p className="font-bold text-white">{item.instructorName}</p>
                  <span className="text-[11px] text-slate-400">{item.email}</span>
                </td>
                <td className="p-4 font-mono">
                  <span className="uppercase text-purple-400 font-bold">{item.method}</span>
                  <span className="block text-slate-300 text-[11px]">{item.accountDetails}</span>
                </td>
                <td className="p-4 font-black text-emerald-400 text-sm">৳{item.amount.toLocaleString()}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      item.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : item.status === 'Pending'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {item.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => onApproveWithdraw(item.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onRejectWithdraw(item.id)}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
