import React, { useState } from 'react';
import { SystemAuditLog, Course } from '../../../types';
import { Database, Download, Upload, RefreshCw, ShieldCheck, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { testSupabaseSync, syncAllProductsToSupabase } from '../../../lib/supabase';

interface BackupToolsViewProps {
  logs: SystemAuditLog[];
  products: Course[];
  onDownloadBackup: () => void;
  onClearCache: () => void;
  onShowToast: (msg: string) => void;
}

export const BackupToolsView: React.FC<BackupToolsViewProps> = ({ logs, products, onDownloadBackup, onClearCache, onShowToast }) => {
  const [cacheCleared, setCacheCleared] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{ testing: boolean; success?: boolean; message?: string }>({ testing: false });
  const [syncing, setSyncing] = useState(false);

  const handleClear = () => {
    onClearCache();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 3000);
  };

  const handleTestSupabase = async () => {
    setSupabaseStatus({ testing: true });
    const res = await testSupabaseSync();
    setSupabaseStatus({ testing: false, success: res.success, message: res.message });
  };

  const handleSyncProducts = async () => {
    setSyncing(true);
    const res = await syncAllProductsToSupabase(products);
    setSyncing(false);
    if (res.success) {
      onShowToast(`সফলভাবে ${res.count}টি প্রোডাক্ট Supabase-এ সিঙ্ক করা হয়েছে!`);
    } else {
      onShowToast(`সিঙ্ক ব্যর্থ: ${res.error}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Backup, Supabase Sync & System Tools</h2>
          <p className="text-xs text-slate-400">ডাটাবেজ ফুল ব্যাকআপ, Supabase সিঙ্ক ও সিস্টেম টুলস</p>
        </div>
      </div>

      {cacheCleared && (
        <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 p-4 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>ওয়েবসাইট ক্যাশ ও টেম্পোরারি ফাইল সফলভাবে ক্লিন করা হয়েছে!</span>
        </div>
      )}

      {/* Supabase Sync & Diagnostics Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-950 text-indigo-400 border border-indigo-800">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Supabase Cloud Database Sync</h3>
            <p className="text-xs text-slate-400">প্রোডাক্ট, কোর্স ও ডাটাবেজ সিঙ্ক স্ট্যাটাস পরীক্ষা ও ফোর্স সিঙ্ক</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            onClick={handleTestSupabase}
            disabled={supabaseStatus.testing}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-4 rounded-xl transition-all border border-slate-700 text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {supabaseStatus.testing ? <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" /> : <Database className="w-4 h-4 text-indigo-400" />}
            <span>Test Supabase Connection</span>
          </button>

          <button
            onClick={handleSyncProducts}
            disabled={syncing}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Sync All Products ({products.length}) To Supabase Now</span>
          </button>
        </div>

        {supabaseStatus.message && (
          <div className={`p-4 rounded-2xl text-xs flex items-start gap-2 border ${supabaseStatus.success ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200' : 'bg-rose-950/80 border-rose-800 text-rose-200'}`}>
            {supabaseStatus.success ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            <div>
              <p className="font-bold">{supabaseStatus.success ? 'Success' : 'Connection Warning'}</p>
              <p className="mt-0.5 opacity-90">{supabaseStatus.message}</p>
            </div>
          </div>
        )}
      </div>

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
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg text-xs flex items-center justify-center gap-2 cursor-pointer"
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
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg text-xs flex items-center justify-center gap-2 cursor-pointer"
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
