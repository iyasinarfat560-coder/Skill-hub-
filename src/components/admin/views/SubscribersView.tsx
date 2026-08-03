import React, { useState } from 'react';
import { Subscriber } from '../../../types';
import { Mail, Download, Search, Trash2, Send } from 'lucide-react';

interface SubscribersViewProps {
  subscribers: Subscriber[];
  onDeleteSubscriber: (id: string) => void;
  onOpenBulkComposer: () => void;
}

export const SubscribersView: React.FC<SubscribersViewProps> = ({ subscribers, onDeleteSubscriber, onOpenBulkComposer }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = subscribers.filter((s) => s.email.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,ID,Email,Subscribed Date,Status\n' +
      subscribers.map((s) => `${s.id},${s.email},${s.subscribedDate},${s.status}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'skillshub_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Newsletter Subscribers</h2>
          <p className="text-xs text-slate-400">নিউজলেটার সাবস্ক্রাইবারদের তালিকা, এক্সপোর্ট এবং ইমেইল ব্রডকাস্ট</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={onOpenBulkComposer}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-900/50"
          >
            <Send className="w-4 h-4" /> Broadcast Email
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="ইমেইল এড্রেস দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl pl-9 pr-4 py-2.5 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">Subscriber Email</th>
              <th className="p-4">Subscribed Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-white">{s.email}</td>
                <td className="p-4 font-mono text-slate-400">{s.subscribedDate}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      s.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => onDeleteSubscriber(s.id)}
                    className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
