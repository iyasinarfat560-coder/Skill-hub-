import React from 'react';
import { Star, Code, BookOpen, Play, ArrowRight } from 'lucide-react';
import { WebsiteSettingsData } from '../types';

interface HeroProps {
  onExploreCourses: () => void;
  onBrowseAll: () => void;
  websiteSettings?: WebsiteSettingsData;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCourses, onBrowseAll, websiteSettings }) => {
  const heading = websiteSettings?.heroHeading || 'দক্ষতা অর্জন করুন, ভবিষ্যৎ গড়ুন।';
  const subheading = websiteSettings?.heroSubheading || 'প্রিমিয়াম ডিজিটাল কোর্স, ই-বুক ও প্রিমিয়াম রিসোর্স—সবকিছু একই প্ল্যাটফর্মে';

  return (
    <section className="bg-gradient-to-b from-purple-50/50 via-white to-white pt-8 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              {heading}
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-lg sm:text-xl font-medium max-w-xl mx-auto lg:mx-0">
              {subheading}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreCourses}
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-base px-8 py-3.5 rounded-full shadow-lg shadow-purple-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group cursor-pointer"
                id="hero-explore-btn"
              >
                <span>কোর্সসমূহ দেখুন</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onBrowseAll}
                className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-base px-8 py-3.5 rounded-full border-2 border-slate-200 hover:border-purple-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                id="hero-browse-btn"
              >
                সব প্রোডাক্ট
              </button>
            </div>

            {/* Social Proof */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              {/* Overlapping Avatars */}
              <div className="flex -space-x-3">
                <img
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                  alt="Student 1"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
                  alt="Student 2"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
                  alt="Student 3"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"
                  alt="Student 4"
                />
              </div>

              {/* Student stats & Rating */}
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-sm sm:text-base">১০,০০০+ সফল শিক্ষার্থী</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-xs sm:text-sm font-semibold">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-slate-700 ml-1">৪.৯ (১২০০+ রিভিউ)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Vector Illustration Column */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Background Soft Glow */}
            <div className="absolute w-72 h-72 bg-purple-200/60 rounded-full blur-3xl -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

            {/* Illustration Canvas Container */}
            <div className="relative w-full max-w-md bg-gradient-to-br from-purple-100 to-indigo-50 rounded-3xl p-8 border border-purple-100 shadow-xl flex flex-col items-center justify-center min-h-[360px]">
              
              {/* Floating Element 1: Code Bracket Tag (Top Left) */}
              <div className="absolute -top-4 -left-4 bg-orange-500 text-white p-3.5 rounded-2xl shadow-lg flex items-center justify-center animate-bounce duration-1000">
                <Code className="w-6 h-6 stroke-[2.5]" />
              </div>

              {/* Floating Element 2: Book Icon Tag (Top Right) */}
              <div className="absolute top-6 -right-5 bg-blue-600 text-white p-3.5 rounded-2xl shadow-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 stroke-[2.5]" />
              </div>

              {/* Floating Element 3: YouTube Play Button (Bottom Left) */}
              <div className="absolute bottom-6 -left-4 bg-rose-600 text-white p-3.5 rounded-2xl shadow-lg flex items-center justify-center">
                <Play className="w-6 h-6 fill-white stroke-[2]" />
              </div>

              {/* Main Flat Vector Illustration - Boy in Purple Hoodie with Glasses on Laptop */}
              <div className="relative flex flex-col items-center justify-center w-full py-2">
                <svg
                  viewBox="0 0 400 360"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full max-w-[310px] sm:max-w-[340px] h-auto drop-shadow-md select-none"
                >
                  {/* Floor Shadow */}
                  <ellipse cx="200" cy="335" rx="130" ry="10" fill="#E9D5FF" opacity="0.8" />

                  {/* Soft Background Accent Circle */}
                  <circle cx="200" cy="180" r="125" fill="#F3E8FF" />
                  <circle cx="200" cy="180" r="95" fill="#EDE9FE" />

                  {/* Chair / Backrest Cushion */}
                  <path d="M120 150 C120 110 140 85 200 85 C260 85 280 110 280 150 L280 280 L120 280 Z" fill="#DDD6FE" opacity="0.6" />

                  {/* Legs & Shoes (Full Figure Sitting) */}
                  <path d="M142 240 Q130 295 120 320 Q150 325 170 312 L185 250 Z" fill="#334155" />
                  <path d="M258 240 Q270 295 280 320 Q250 325 230 312 L215 250 Z" fill="#334155" />
                  
                  {/* Shoes */}
                  <path d="M102 318 Q120 310 135 322 Q125 330 102 328 Z" fill="#FFFFFF" />
                  <path d="M102 324 Q120 319 135 322" stroke="#CBD5E1" strokeWidth="2" />
                  <path d="M298 318 Q280 310 265 322 Q275 330 298 328 Z" fill="#FFFFFF" />
                  <path d="M298 324 Q280 319 265 322" stroke="#CBD5E1" strokeWidth="2" />

                  {/* Purple Hoodie Torso (Body) */}
                  <path d="M140 170 C135 140 160 130 200 130 C240 130 265 140 260 170 L270 250 C270 258 260 262 200 262 C140 262 130 258 130 250 Z" fill="#7C3AED" />
                  
                  {/* Hoodie Front Pocket */}
                  <path d="M158 220 C180 226 220 226 242 220 L248 252 C220 258 180 258 152 252 Z" fill="#6D28D9" />
                  
                  {/* Hoodie Strings */}
                  <path d="M190 140 L188 180" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                  <path d="M210 140 L212 180" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="188" cy="182" r="2.5" fill="#DDD6FE" />
                  <circle cx="212" cy="182" r="2.5" fill="#DDD6FE" />

                  {/* Arms in Purple Hoodie */}
                  <path d="M138 165 Q115 198 152 212 L166 198 Q142 188 150 165 Z" fill="#6D28D9" />
                  <path d="M262 165 Q285 198 248 212 L234 198 Q258 188 250 165 Z" fill="#6D28D9" />

                  {/* Hands */}
                  <ellipse cx="160" cy="208" rx="8" ry="6" fill="#FDBA74" />
                  <ellipse cx="240" cy="208" rx="8" ry="6" fill="#FDBA74" />

                  {/* Laptop on Lap */}
                  {/* Laptop Screen */}
                  <path d="M148 195 L252 195 L242 145 L158 145 Z" fill="#0F172A" />
                  <path d="M153 190 L247 190 L239 150 L161 150 Z" fill="#1E293B" />
                  {/* Code Screen lines */}
                  <rect x="168" y="157" width="28" height="4" rx="2" fill="#A855F7" />
                  <rect x="201" y="157" width="26" height="4" rx="2" fill="#38BDF8" />
                  <rect x="168" y="167" width="48" height="4" rx="2" fill="#4ADE80" />
                  <rect x="168" y="177" width="34" height="4" rx="2" fill="#F43F5E" />
                  {/* Laptop Keyboard & Base */}
                  <path d="M132 212 L268 212 L254 195 L146 195 Z" fill="#94A3B8" />
                  <path d="M128 216 L272 216 Q272 212 258 212 L142 212 Q128 212 128 216 Z" fill="#64748B" />

                  {/* Neck */}
                  <rect x="190" y="118" width="20" height="18" rx="4" fill="#FDBA74" />
                  <path d="M190 128 C198 134 202 134 210 128 L210 136 L190 136 Z" fill="#EA580C" opacity="0.2" />

                  {/* Hoodie Hood fold around neck */}
                  <path d="M162 132 Q200 148 238 132 Q246 142 232 148 Q200 158 168 148 Q154 142 162 132 Z" fill="#5B21B6" />

                  {/* Head & Face */}
                  <path d="M172 82 C172 62 228 62 228 82 L228 112 C228 128 172 128 172 112 Z" fill="#FDBA74" />
                  
                  {/* Hair */}
                  <path d="M168 80 C168 54 188 44 200 44 C215 44 232 54 232 80 C232 86 225 72 200 72 C178 72 168 86 168 80 Z" fill="#1E1B4B" />
                  <path d="M168 76 C170 66 185 52 200 52 C215 52 228 64 230 76 C222 66 210 62 200 62 C185 62 174 68 168 76 Z" fill="#312E81" />

                  {/* Ears */}
                  <circle cx="170" cy="98" r="6" fill="#FDBA74" />
                  <circle cx="230" cy="98" r="6" fill="#FDBA74" />

                  {/* Black Glasses */}
                  <rect x="178" y="88" width="18" height="14" rx="4" fill="none" stroke="#0F172A" strokeWidth="3" />
                  <rect x="204" y="88" width="18" height="14" rx="4" fill="none" stroke="#0F172A" strokeWidth="3" />
                  <line x1="196" y1="93" x2="204" y2="93" stroke="#0F172A" strokeWidth="3" />
                  <line x1="178" y1="93" x2="171" y2="92" stroke="#0F172A" strokeWidth="2.5" />
                  <line x1="222" y1="93" x2="229" y2="92" stroke="#0F172A" strokeWidth="2.5" />
                  
                  {/* Glasses Blue Reflection */}
                  <line x1="181" y1="91" x2="187" y2="99" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                  <line x1="207" y1="91" x2="213" y2="99" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

                  {/* Eyes */}
                  <circle cx="187" cy="95" r="2" fill="#0F172A" />
                  <circle cx="213" cy="95" r="2" fill="#0F172A" />

                  {/* Eyebrows */}
                  <path d="M178 83 Q187 80 195 83" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />
                  <path d="M205 83 Q213 80 222 83" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />

                  {/* Nose */}
                  <path d="M200 96 L198 103 L202 103" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />

                  {/* Smile */}
                  <path d="M193 111 Q200 117 207 111" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
