import React, { useState } from 'react';
import { GeneralSettings } from '../../../types';
import { Save, CheckCircle2, Globe, Image, Upload } from 'lucide-react';

interface GeneralSettingsViewProps {
  settings: GeneralSettings;
  onSave: (settings: GeneralSettings) => void;
}

export const GeneralSettingsView: React.FC<GeneralSettingsViewProps> = ({ settings, onSave }) => {
  const [siteName, setSiteName] = useState(settings.siteName || 'Skills Hub');
  const [tagline, setTagline] = useState(settings.tagline || '');
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=120');
  const [faviconUrl, setFaviconUrl] = useState(settings.faviconUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=32');
  const [currency, setCurrency] = useState(settings.currency || 'BDT (৳)');
  const [timezone, setTimezone] = useState(settings.timezone || 'Asia/Dhaka (GMT+6)');
  const [defaultLanguage, setDefaultLanguage] = useState<'BN' | 'EN'>(settings.defaultLanguage || 'BN');
  const [contactEmail, setContactEmail] = useState(settings.contactEmail || 'iyasinarfat560@gmail.com');
  const [contactPhone, setContactPhone] = useState(settings.contactPhone || '01861612289');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      siteName,
      tagline,
      logoUrl,
      faviconUrl,
      currency,
      timezone,
      defaultLanguage,
      contactEmail,
      contactPhone,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">General Platform Settings</h2>
          <p className="text-xs text-slate-400">ওয়েবসাইটের নাম, লোগো, ফেভিকন, টাইমজোন, ডিফল্ট ভাষা ও কন্টাক্ট ইনফরমেশন</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 p-4 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>জেনারেল সেটিংস সফলভাবে আপডেট করা হয়েছে!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg space-y-5 text-xs">
        
        {/* Brand Name & Tagline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Website Name (সাইটের নাম)</label>
            <input
              type="text"
              required
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tagline / Slogan</label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Logo & Favicon URLs with preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <label className="block text-slate-300 font-semibold flex items-center gap-1.5">
              <Image className="w-4 h-4 text-purple-400" />
              <span>Logo URL (ওয়েবসাইট লোগো)</span>
            </label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center overflow-hidden shrink-0">
                {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" /> : <Image className="w-6 h-6 text-purple-400" />}
              </div>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-[11px] focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <label className="block text-slate-300 font-semibold flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>Favicon URL (ব্রাউজার আইকন)</span>
            </label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                {faviconUrl ? <img src={faviconUrl} alt="Favicon" className="w-6 h-6 object-cover" /> : <Globe className="w-6 h-6 text-slate-400" />}
              </div>
              <input
                type="text"
                value={faviconUrl}
                onChange={(e) => setFaviconUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-[11px] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Timezone & Default Language & Currency */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Timezone (টাইমজোন)</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold focus:outline-none"
            >
              <option value="Asia/Dhaka (GMT+6)">Asia/Dhaka (GMT+6 - Bangladesh Standard Time)</option>
              <option value="Asia/Kolkata (GMT+5:30)">Asia/Kolkata (GMT+5:30 - IST)</option>
              <option value="UTC (GMT+0)">UTC (GMT+0 - Coordinated Universal Time)</option>
              <option value="America/New_York (GMT-5)">America/New_York (EST)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Default Language (ডিফল্ট ভাষা)</label>
            <select
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold focus:outline-none"
            >
              <option value="BN">বাংলা (Bangla)</option>
              <option value="EN">English (US)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Currency Symbol</label>
            <input
              type="text"
              required
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono font-bold focus:outline-none"
            />
          </div>
        </div>

        {/* Contact Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Admin Contact Email</label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Support Phone / WhatsApp</label>
            <input
              type="text"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save General Settings
        </button>
      </form>
    </div>
  );
};
