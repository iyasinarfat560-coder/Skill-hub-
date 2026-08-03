import React, { useState } from 'react';
import { SystemAuditLog } from '../../../types';
import { Database, Download, Upload, RefreshCw, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface BackupToolsViewProps {
  logs: SystemAuditLog[];
  onDownloadBackup: () => void;
  onClearCache: () => void;
}

export const BackupToolsView: React.FC<BackupToolsViewProps> = ({ logs, onDownloadBackup, onClearCache }) => {
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClear = () => {
    onClearCache();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Backup, Audit Logs & System Tools</h2>
          <p className="text-xs text-slate-400">ডাটাবেজ ফুল ব্যাকআপ ডাউনলোড, ক্যাশ ক্লিয়ার ও নিরাপত্তা অডিট লগ</p>
        </div>
      </div>

      {cacheCleared && (
        <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 p-4 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>ওয়েবসাইট ক্যাশ ও টেম্পোরারি ফাইল সফলভাবে ক্লিন করা হয়েছে!</span>
        </div>
      )}

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Backup Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-950 text-purple-400 border border-purple-800">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Full JSON Backup</h3>
              <p className="text-xs text-slate-400">সকল ডাটা এক্সপোর্ট করুন</p>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            অর্ডার, কাস্টমার, প্রোডাক্ট ও কুপন কোডসহ পুরো সাইটের সম্পূর্ণ ব্যাকআপ JSON ফরম্যাটে ডাউনলোড করুন।
          </p>
          <button
            onClick={onDownloadBackup}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg text-xs flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Backup JSON
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-950 text-sky-400 border border-sky-800">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Restore Database</h3>
              <p className="text-xs text-slate-400">JSON থেকে ডাটা রিস্টোর</p>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            পূর্বে ডাউনলোড করা JSON ফাইল সিলেক্ট করে ডাটাবেজ ব্যাকআপ পুনরায় সেটআপ করুন।
          </p>
          <label className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl transition-all border border-slate-700 text-xs flex items-center justify-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" /> Select Backup JSON File
            <input type="file" accept=".json" className="hidden" />
          </label>
        </div>

        {/* Cache Clear Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">System Cache Clear</h3>
              <p className="text-xs text-slate-400">স্পিড ও পারফরম্যান্স ক্লিন</p>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            ওয়েবসাইটের ক্যাশ ফাইল, সিডিএন ইমেজ মেমরি এবং রেন্ডার স্টেট ফ্ল্যাশ করুন।
          </p>
          <button
            onClick={handleClear}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg text-xs flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Clear System Cache Now
          </button>
        </div>

      </div>

      {/* Real-time System Audit Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" /> Security & System Audit Logs
          </h3>
          <span className="text-[11px] text-slate-400">Real-time Activity Tracker</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Admin User</th>
                <th className="p-3">Action Performed</th>
                <th className="p-3">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono text-purple-300">{log.timestamp}</td>
                  <td className="p-3 font-bold text-white">{log.adminUser}</td>
                  <td className="p-3 font-semibold text-emerald-400">{log.action}</td>
                  <td className="p-3 text-slate-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
