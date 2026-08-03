import React, { useState } from 'react';
import { PaymentSettingsData } from '../../../types';
import { CreditCard, Save, CheckCircle2, ToggleLeft, ToggleRight } from 'lucide-react';

interface PaymentSettingsViewProps {
  settings: PaymentSettingsData;
  onSave: (settings: PaymentSettingsData) => void;
}

export const PaymentSettingsView: React.FC<PaymentSettingsViewProps> = ({ settings, onSave }) => {
  const [bkashNumber, setBkashNumber] = useState(settings.bkashNumber || '01861612289');
  const [bkashType, setBkashType] = useState<'Personal' | 'Merchant' | 'Agent'>(settings.bkashType || 'Personal');
  const [bkashActive, setBkashActive] = useState<boolean>(settings.bkashActive ?? true);

  const [nagadNumber, setNagadNumber] = useState(settings.nagadNumber || '01861612289');
  const [nagadType, setNagadType] = useState<'Personal' | 'Merchant' | 'Agent'>(settings.nagadType || 'Personal');
  const [nagadActive, setNagadActive] = useState<boolean>(settings.nagadActive ?? true);

  const [rocketNumber, setRocketNumber] = useState(settings.rocketNumber || '01861612289');
  const [rocketType, setRocketType] = useState<'Personal' | 'Merchant' | 'Agent'>(settings.rocketType || 'Personal');
  const [rocketActive, setRocketActive] = useState<boolean>(settings.rocketActive ?? true);

  const [commissionRate, setCommissionRate] = useState(settings.commissionRate || 15);
  const [manualInstructions, setManualInstructions] = useState(settings.manualInstructions || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      bkashNumber,
      bkashType,
      bkashActive,
      nagadNumber,
      nagadType,
      nagadActive,
      rocketNumber,
      rocketType,
      rocketActive,
      commissionRate,
      manualInstructions,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Payment Gateways & Settings</h2>
          <p className="text-xs text-slate-400">বিকাশ, নগদ ও রকেটের মার্চেন্ট/পার্সোনাল নম্বর, অ্যাক্টিভেশন টগল ও পেমেন্ট ইন্সট্রাকশন</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 p-4 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>পেমেন্ট সেটিংস সফলভাবে সেভ করা হয়েছে!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg space-y-6 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* bKash Gateway */}
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-extrabold text-pink-400 text-sm flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-lg bg-pink-600 text-white font-black text-xs flex items-center justify-center">bK</span>
                bKash
              </span>
              <button
                type="button"
                onClick={() => setBkashActive(!bkashActive)}
                className="flex items-center gap-1 cursor-pointer"
              >
                {bkashActive ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                    <ToggleRight className="w-6 h-6 text-emerald-400" /> Active
                  </span>
                ) : (
                  <span className="text-slate-500 font-bold flex items-center gap-1 text-[11px]">
                    <ToggleLeft className="w-6 h-6 text-slate-600" /> Disabled
                  </span>
                )}
              </button>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">bKash Account Number</label>
              <input
                type="text"
                required
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Account Type</label>
              <select
                value={bkashType}
                onChange={(e) => setBkashType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
              >
                <option value="Personal">Personal (Send Money)</option>
                <option value="Merchant">Merchant (Payment)</option>
                <option value="Agent">Agent (Cash Out)</option>
              </select>
            </div>
          </div>

          {/* Nagad Gateway */}
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-extrabold text-orange-400 text-sm flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-lg bg-orange-600 text-white font-black text-xs flex items-center justify-center">Ng</span>
                Nagad
              </span>
              <button
                type="button"
                onClick={() => setNagadActive(!nagadActive)}
                className="flex items-center gap-1 cursor-pointer"
              >
                {nagadActive ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                    <ToggleRight className="w-6 h-6 text-emerald-400" /> Active
                  </span>
                ) : (
                  <span className="text-slate-500 font-bold flex items-center gap-1 text-[11px]">
                    <ToggleLeft className="w-6 h-6 text-slate-600" /> Disabled
                  </span>
                )}
              </button>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nagad Account Number</label>
              <input
                type="text"
                required
                value={nagadNumber}
                onChange={(e) => setNagadNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Account Type</label>
              <select
                value={nagadType}
                onChange={(e) => setNagadType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
              >
                <option value="Personal">Personal (Send Money)</option>
                <option value="Merchant">Merchant (Payment)</option>
                <option value="Agent">Agent (Cash Out)</option>
              </select>
            </div>
          </div>

          {/* Rocket Gateway */}
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-extrabold text-purple-400 text-sm flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center">Rc</span>
                Rocket
              </span>
              <button
                type="button"
                onClick={() => setRocketActive(!rocketActive)}
                className="flex items-center gap-1 cursor-pointer"
              >
                {rocketActive ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                    <ToggleRight className="w-6 h-6 text-emerald-400" /> Active
                  </span>
                ) : (
                  <span className="text-slate-500 font-bold flex items-center gap-1 text-[11px]">
                    <ToggleLeft className="w-6 h-6 text-slate-600" /> Disabled
                  </span>
                )}
              </button>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Rocket Account Number</label>
              <input
                type="text"
                required
                value={rocketNumber}
                onChange={(e) => setRocketNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Account Type</label>
              <select
                value={rocketType}
                onChange={(e) => setRocketType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
              >
                <option value="Personal">Personal (Send Money)</option>
                <option value="Merchant">Merchant (Payment)</option>
                <option value="Agent">Agent (Cash Out)</option>
              </select>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-slate-300 font-semibold">Platform Commission Rate (%)</label>
            <input
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-slate-300 font-semibold">Manual Checkout Instructions</label>
            <textarea
              rows={3}
              value={manualInstructions}
              onChange={(e) => setManualInstructions(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Payment Settings
        </button>
      </form>
    </div>
  );
};
