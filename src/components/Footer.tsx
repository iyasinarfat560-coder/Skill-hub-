import React from 'react';
import { GraduationCap, Phone, Mail, MessageSquare, Send, Youtube, Facebook, Instagram, Lock } from 'lucide-react';
import { ViewMode, WhatsAppSettingsData, WebsiteSettingsData } from '../types';

interface FooterProps {
  onNavigate: (view: ViewMode) => void;
  onOpenAdminAuth?: () => void;
  whatsappSettings?: WhatsAppSettingsData;
  websiteSettings?: WebsiteSettingsData;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdminAuth, whatsappSettings, websiteSettings }) => {
  const whatsappNumber = websiteSettings?.supportPhone || whatsappSettings?.whatsappNumber || '01861612289';
  const supportEmail = websiteSettings?.supportEmail || whatsappSettings?.supportEmail || 'iyasinarfat560@gmail.com';
  const whatsappChannelLink = whatsappSettings?.whatsappChannelLink || 'https://whatsapp.com/channel/0029Vac16F63gvWeYTvZgL3E';
  const whatsappChatLink = whatsappSettings?.whatsappChatLink || 'https://wa.me/8801861612289';
  const facebookUrl = websiteSettings?.facebookUrl || 'https://facebook.com';
  const youtubeUrl = websiteSettings?.youtubeUrl || 'https://youtube.com';
  const footerText = websiteSettings?.footerText || 'বাংলাদেশের শিক্ষার্থীদের জন্য প্রিমিয়াম ডিজিটাল প্রোডাক্ট ও অনলাইন কোর্স মার্কেটপ্লেস। আধুনিক দক্ষতা অর্জন করুন এবং উজ্জ্বল ক্যারিয়ার গড়ুন।';
  const siteTitle = websiteSettings?.siteTitle || 'Skills Hub';

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                {siteTitle.includes(' ') ? (
                  <>
                    {siteTitle.split(' ')[0]} <span className="text-purple-400">{siteTitle.split(' ').slice(1).join(' ')}</span>
                  </>
                ) : (
                  <span className="text-purple-400">{siteTitle}</span>
                )}
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              {footerText}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-sky-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-base tracking-wide uppercase text-xs">
              দ্রুত লিঙ্কসমূহ
            </h4>
            <ul className="space-y-2 text-sm text-slate-400 font-medium">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-purple-400 transition-colors">
                  হোম
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-purple-400 transition-colors">
                  কোর্সসমূহ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ebooks')} className="hover:text-purple-400 transition-colors">
                  ই-বুক
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('source-code')} className="hover:text-purple-400 transition-colors">
                  প্রিমিয়াম রিসোর্স
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('bundles')} className="hover:text-purple-400 transition-colors">
                  বান্ডেল অফার
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-base tracking-wide uppercase text-xs">
              সাপোর্ট
            </h4>
            <ul className="space-y-2 text-sm text-slate-400 font-medium">
              <li><a href="#faq" className="hover:text-purple-400 transition-colors">সাধারণ প্রশ্নাবলী (FAQ)</a></li>
              <li><a href="#contact" className="hover:text-purple-400 transition-colors">যোগাযোগ করুন</a></li>
              <li><a href="#refund" className="hover:text-purple-400 transition-colors">রিফান্ড পলিসি</a></li>
              <li><a href="#terms" className="hover:text-purple-400 transition-colors">শর্তাবলী ও নিয়মাবলী</a></li>
              <li><a href="#privacy" className="hover:text-purple-400 transition-colors">প্রাইভেসি পলিসি</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-base tracking-wide uppercase text-xs">
              যোগাযোগ
            </h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-purple-400" />
                <a
                  href={whatsappChatLink}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-purple-400 transition-colors"
                >
                  WhatsApp: {whatsappNumber}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>Email: {supportEmail}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <a
                  href={whatsappChannelLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-400 hover:underline"
                >
                  WhatsApp চ্যানেল
                </a>
              </div>
              <a 
                href="https://t.me" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-full transition-colors mt-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>টেলিগ্রাম চ্যানেলে যুক্ত হন</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Logos */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <p>© ২০২৪ স্কিলস হাব। সর্বস্বত্ব সংরক্ষিত।</p>
            {onOpenAdminAuth && (
              <button
                onClick={onOpenAdminAuth}
                className="text-slate-600 hover:text-slate-400 transition-colors p-1 rounded cursor-pointer"
                aria-label="Admin Access"
                title="Admin Access"
              >
                <Lock className="w-3 h-3 opacity-40 hover:opacity-100" />
              </button>
            )}
          </div>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-3">
            {/* bKash */}
            <div className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md text-pink-400 font-bold border border-pink-500/30 text-xs flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              bKash
            </div>

            {/* Nagad */}
            <div className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md text-amber-400 font-bold border border-amber-500/30 text-xs flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Nagad
            </div>

            {/* Rocket */}
            <div className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md text-purple-400 font-bold border border-purple-500/30 text-xs flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              Rocket
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
