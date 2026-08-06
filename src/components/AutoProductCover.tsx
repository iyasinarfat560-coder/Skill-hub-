import React from 'react';
import { Course } from '../types';

interface AutoProductCoverProps {
  course: Course;
  className?: string;
  badgeOverride?: string;
}

export const AutoProductCover: React.FC<AutoProductCoverProps> = ({ course, className = "w-full h-full", badgeOverride }) => {
  const getTheme = () => {
    const titleLower = (course.title || '').toLowerCase();
    const catLower = (course.category || '').toLowerCase();
    
    if (course.thumbnailTheme === 'python' || titleLower.includes('python') || catLower.includes('python')) {
      return {
        bg: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950',
        badgeBg: 'bg-blue-600 text-white',
        accentText: 'text-amber-300',
        keyword: 'PYTHON',
      };
    }
    if (course.thumbnailTheme === 'webdev' || titleLower.includes('mern') || titleLower.includes('react') || titleLower.includes('node') || catLower.includes('mern') || catLower.includes('web')) {
      return {
        bg: 'bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-950',
        badgeBg: 'bg-purple-600 text-white',
        accentText: 'text-cyan-300',
        keyword: 'MERN',
      };
    }
    if (titleLower.includes('ecommerce') || titleLower.includes('ইকমার্স') || titleLower.includes('shop') || titleLower.includes('store')) {
      return {
        bg: 'bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950',
        badgeBg: 'bg-emerald-600 text-white',
        accentText: 'text-emerald-300',
        keyword: 'ECOMMERCE',
      };
    }
    if (titleLower.includes('portfolio') || titleLower.includes('পোর্টফোলিও') || titleLower.includes('resume')) {
      return {
        bg: 'bg-gradient-to-br from-pink-950 via-purple-950 to-slate-950',
        badgeBg: 'bg-pink-600 text-white',
        accentText: 'text-pink-300',
        keyword: 'PORTFOLIO',
      };
    }
    if (course.thumbnailTheme === 'freelancing' || titleLower.includes('freelance')) {
      return {
        bg: 'bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950',
        badgeBg: 'bg-indigo-600 text-white',
        accentText: 'text-blue-300',
        keyword: 'FREELANCE',
      };
    }
    const words = (course.title || '').trim().split(' ');
    const firstKeyword = words[0] ? words[0].toUpperCase() : 'PREMIUM';
    return {
      bg: 'bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950',
      badgeBg: 'bg-purple-600 text-white',
      accentText: 'text-purple-300',
      keyword: badgeOverride || course.resourceBadgeText || firstKeyword,
    };
  };

  const theme = getTheme();
  const displayBadge = badgeOverride || course.resourceBadgeText || theme.keyword;

  return (
    <div className={`relative overflow-hidden flex flex-col justify-between p-4 sm:p-6 ${theme.bg} ${className}`}>
      {/* Light dot or pattern texture */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

      {/* Top small colored badge */}
      <div className="relative z-10 flex items-center justify-between">
        <span className={`text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full ${theme.badgeBg} uppercase tracking-wider shadow-md`}>
          {displayBadge}
        </span>
        <span className="text-[10px] font-mono text-white/60 bg-white/10 px-2 py-0.5 rounded">
          {course.category || 'Digital Resource'}
        </span>
      </div>

      {/* Center Title & Subtitle */}
      <div className="relative z-10 text-center py-4 my-auto">
        <h3 className="text-white font-extrabold text-sm sm:text-lg leading-snug drop-shadow-md line-clamp-2">
          {course.thumbnailTitle || course.title}
        </h3>
        <p className={`text-xs font-semibold mt-2 ${theme.accentText}`}>
          স্কিলস হাব প্রিমিয়াম কালেকশন
        </p>
      </div>

      {/* Bottom tags or indicators */}
      <div className="relative z-10 flex justify-center gap-1.5 opacity-80 flex-wrap">
        <span className="text-[9px] sm:text-[10px] bg-white/10 text-white px-2 py-0.5 rounded font-mono">SOURCE CODE</span>
        <span className="text-[9px] sm:text-[10px] bg-white/10 text-white px-2 py-0.5 rounded font-mono">READY TO USE</span>
        <span className="text-[9px] sm:text-[10px] bg-white/10 text-white px-2 py-0.5 rounded font-mono">LIFETIME ACCESS</span>
      </div>
    </div>
  );
};
