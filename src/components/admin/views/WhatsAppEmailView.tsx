import React, { useState } from 'react';
import { Send, MessageSquare, Mail, CheckCircle2, Phone, Link, Bot, Save } from 'lucide-react';
import { WhatsAppSettingsData } from '../../../types';

interface WhatsAppEmailViewProps {
  settings?: WhatsAppSettingsData;
  onSaveSettings?: (settings: WhatsAppSettingsData) => void;
}

export const WhatsAppEmailView: React.FC<WhatsAppEmailViewProps> = ({ settings, onSaveSettings }) => {
  const [channel, setChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [targetGroup, setTargetGroup] = useState('All Customers');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  // Dynamic Contact & Support Settings State
  const [whatsappNumber, setWhatsappNumber] = useState(settings?.whatsappNumber || '01861612289');
  const [supportEmail, setSupportEmail] = useState(settings?.supportEmail || 'iyasinarfat560@gmail.com');
  const [whatsappChannelLink, setWhatsappChannelLink] = useState(
    settings?.whatsappChannelLink || 'https://whatsapp.com/channel/0029Vac16F63gvWeYTvZgL3E'
  );
  const [whatsappChatLink, setWhatsappChatLink] = useState(
    settings?.whatsappChatLink || 'https://wa.me/8801861612289'
  );
  const [autoReplyOrderTemplate, setAutoReplyOrderTemplate] = useState(
    settings?.autoReplyOrderTemplate ||
      'ধন্যবাদ! আপনার অর্ডারটি সফলভাবে জমা হয়েছে। পেমেন্ট ভেরিফিকেশন শেষে কয়েক মিনিটের মধ্যেই ইমেইলে কোর্স এক্সেস লিংক পাঠিয়ে দেওয়া হবে।'
  );
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Sync state with props if settings change
  React.useEffect(() => {
    if (settings) {
      if (settings.whatsappNumber) setWhatsappNumber(settings.whatsappNumber);
      if (settings.supportEmail) setSupportEmail(settings.supportEmail);
      if (settings.whatsappChannelLink) setWhatsappChannelLink(settings.whatsappChannelLink);
      if (settings.whatsappChatLink) setWhatsappChatLink(settings.whatsappChatLink);
      if (settings.autoReplyOrderTemplate) setAutoReplyOrderTemplate(settings.autoReplyOrderTemplate);
    }
  }, [settings]);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setMessageSubject('');
      setMessageBody('');
    }, 4000);
  };

  const handleSaveContactSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveSettings) {
      onSaveSettings({
        whatsappNumber,
        supportEmail,
        whatsappChannelLink,
        autoReplyOrderTemplate,
        whatsappChatLink,
      });
    }
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">WhatsApp & Email Management</h2>
          <p className="text-xs text-slate-400">সাপোর্ট চ্যানেল কন্ট্রোল, অটো-রিপ্লাই টেমপ্লেট এবং বালক মেসেজ ব্রডকাস্ট সেটিং</p>
        </div>
      </div>

      {/* Global Contact & Support Settings Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-400" />
            <span>অফিসিয়াল সাপোর্ট ও যোগাযোগ সেটিংস</span>
          </h3>
          <span className="text-[11px] font-semibold text-purple-400 bg-purple-950/60 border border-purple-800/60 px-3 py-1 rounded-full">
            ডাইনামিক ভ্যারিয়েবল (কাস্টমার সাইটে অটো-আপডেট হবে)
          </span>
        </div>

        {settingsSaved && (
          <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 p-3 rounded-2xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>সাপোর্ট সেটিং সফলভাবে সংরক্ষিত হয়েছে! ফুটার, চেকআউট ও ডেলিভারি পেজে আপডেট প্রযোজ্য হয়েছে।</span>
          </div>
        )}

        <form onSubmit={handleSaveContactSettings} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">WhatsApp নম্বর</label>
            <div className="relative">
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
              <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">সাপোর্ট ইমেইল ঠিকানা</label>
            <div className="relative">
              <input
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono focus:outline-none focus:border-purple-500"
              />
              <Mail className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">WhatsApp Channel লিঙ্ক</label>
            <div className="relative">
              <input
                type="url"
                required
                value={whatsappChannelLink}
                onChange={(e) => setWhatsappChannelLink(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-cyan-500"
              />
              <Link className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">WhatsApp Chat লিঙ্ক (গ্রাহক বাটন লিঙ্ক)</label>
            <div className="relative">
              <input
                type="url"
                required
                value={whatsappChatLink}
                onChange={(e) => setWhatsappChatLink(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                placeholder="https://wa.me/8801861612289"
              />
              <MessageSquare className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="col-span-full space-y-1">
            <label className="block text-slate-300 font-semibold flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-amber-400" />
              <span>নতুন অর্ডার/পেমেন্ট কনফার্মেশন অটো-রিপ্লাই মেসেজ টেমপ্লেট</span>
            </label>
            <textarea
              rows={2}
              value={autoReplyOrderTemplate}
              onChange={(e) => setAutoReplyOrderTemplate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="col-span-full flex justify-end">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>সাপোর্ট সেটিংস সেভ করুন</span>
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg space-y-4">
          <h3 className="font-bold text-white text-base">মেসেজ/ইমেইল ব্রডকাস্ট কম্পোজার</h3>
          {sentSuccess && (
            <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 p-4 rounded-2xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>ব্রডকাস্ট মেসেজ সফলভাবে প্রসেসিং কিউতে পাঠানো হয়েছে!</span>
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            {/* Channel Selection */}
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-950 border border-slate-800 rounded-2xl font-bold">
              <button
                type="button"
                onClick={() => setChannel('whatsapp')}
                className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  channel === 'whatsapp' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp Broadcast
              </button>
              <button
                type="button"
                onClick={() => setChannel('email')}
                className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  channel === 'email' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4" /> Email Broadcast
              </button>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Audience Group</label>
              <select
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
              >
                <option value="All Customers">All Registered Customers (1,248 Users)</option>
                <option value="Pending Orders Users">Customers with Pending Orders (23 Users)</option>
                <option value="Web Dev Students">Web Development Bootcamp Students (410 Users)</option>
                <option value="Newsletter Subscribers">Newsletter Subscribers (840 Users)</option>
              </select>
            </div>

            {channel === 'email' && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Subject</label>
                <input
                  type="text"
                  required
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  placeholder="e.g. আপনার পছন্দের কোর্সে ৫০% ছাড়ের অফার!"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {channel === 'whatsapp' ? 'WhatsApp Message Content' : 'Email Body Content'}
              </label>
              <textarea
                rows={6}
                required
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="মেসেজের বিস্তারিত লিখুন... (আপনার নাম, লিঙ্ক ও কুপন কোড ব্যবহার করতে পারেন)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-lg text-white flex items-center justify-center gap-2 cursor-pointer ${
                channel === 'whatsapp' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-purple-600 hover:bg-purple-500'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Send {channel === 'whatsapp' ? 'WhatsApp' : 'Email'} Broadcast</span>
            </button>
          </form>
        </div>

        {/* Saved Templates & Quick Hints */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg space-y-4 text-xs">
          <h3 className="font-bold text-white text-sm">Pre-built Templates</h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setMessageSubject('অর্ডার পেন্ডিং রিমাইন্ডার - Skills Hub');
                setMessageBody('প্রিয় শিক্ষার্থী, Skills Hub-এ আপনার অর্ডারটি পেন্ডিং রয়েছে। দ্রুত পেমেন্ট সম্পন্ন করে কোর্স এক্সেস উপভোগ করুন। ধন্যবাদ!');
              }}
              className="w-full text-left p-3 bg-slate-950 border border-slate-800 rounded-2xl hover:border-purple-500 transition-colors cursor-pointer"
            >
              <div className="font-bold text-white">Pending Order Reminder</div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">পেন্ডিং অর্ডার সম্পন্ন করার রিমাইন্ডার মেসেজ</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setMessageSubject('নতুন কোর্স রিলিজ নোটিফিকেশন!');
                setMessageBody('আসসালামু আলাইকুম! Skills Hub-এ নতুন কোর্স রিলিজ হয়েছে। ৫০% ডিসকাউন্টে এনরোল করতে ভিজিট করুন আমাদের ওয়েবসাইট।');
              }}
              className="w-full text-left p-3 bg-slate-950 border border-slate-800 rounded-2xl hover:border-purple-500 transition-colors cursor-pointer"
            >
              <div className="font-bold text-white">New Product Launch Promo</div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">নতুন কোর্স প্রমোশনাল টেমপ্লেট</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
