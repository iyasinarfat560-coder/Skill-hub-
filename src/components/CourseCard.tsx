import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
  onAddToCart: (course: Course, e: React.MouseEvent) => void;
  onToggleWishlist?: (course: Course, e: React.MouseEvent) => void;
  isWishlisted?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onSelect,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}) => {
  // Theme styling for thumbnail canvas
  const getThumbnailStyle = () => {
    switch (course.thumbnailTheme) {
      case 'python':
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950',
          badge: 'Python',
          badgeBg: 'bg-blue-600 text-white',
          accentText: 'text-amber-400',
        };
      case 'webdev':
        return {
          bg: 'bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900',
          badge: 'Full Stack',
          badgeBg: 'bg-purple-600 text-white',
          accentText: 'text-cyan-400',
        };
      case 'freelancing':
        return {
          bg: 'bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-950',
          badge: 'Freelancing',
          badgeBg: 'bg-emerald-600 text-white',
          accentText: 'text-emerald-300',
        };
      case 'marketing':
        return {
          bg: 'bg-gradient-to-br from-sky-900 via-slate-900 to-blue-950',
          badge: 'Marketing',
          badgeBg: 'bg-sky-600 text-white',
          accentText: 'text-yellow-300',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-purple-900 to-slate-900',
          badge: 'Course',
          badgeBg: 'bg-purple-600 text-white',
          accentText: 'text-white',
        };
    }
  };

  const theme = getThumbnailStyle();

  if (course.categoryId === 'source-code') {
    const badgeText = course.resourceBadgeText || '১০০০+ রিসোর্স';
    
    return (
      <div
        onClick={() => onSelect(course)}
        className="relative bg-white rounded-2xl p-1.5 transition-all duration-300 cursor-pointer flex flex-col group overflow-hidden border-2 border-transparent hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-200/50 hover:-translate-y-1.5"
        style={{
          boxShadow: '0 10px 30px -10px rgba(139, 92, 246, 0.15)',
        }}
        id={`course-card-${course.id}`}
      >
        {/* Glow Background Gradient (glowing border look) */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

        {/* Multi-Image Layer Stack Area */}
        <div className="relative h-48 w-full mt-6 mb-3 px-4 flex flex-col justify-end">
          
          {/* Layer 3: Rear-most (slightly offset, smaller, rotated) */}
          <div className="absolute inset-x-8 top-0 h-40 rounded-xl bg-slate-900 shadow-sm transform rotate-6 translate-x-3 -translate-y-4 scale-90 border border-white/10 overflow-hidden opacity-50 transition-all group-hover:rotate-8 group-hover:translate-x-5 group-hover:-translate-y-5">
            {course.galleryImages && course.galleryImages[1] ? (
              <img src={course.galleryImages[1]} alt="" className="w-full h-full object-cover" />
            ) : course.thumbnailUrl ? (
              <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover filter brightness-75" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-950 to-slate-950 flex items-center justify-center">
                <span className="text-[10px] text-indigo-400 font-mono">ZIP/SOURCE</span>
              </div>
            )}
          </div>

          {/* Layer 2: Middle (medium offset, rotated counter-way) */}
          <div className="absolute inset-x-6 top-1 h-40 rounded-xl bg-slate-950 shadow-md transform -rotate-3 translate-x-1.5 -translate-y-2 scale-95 border border-white/10 overflow-hidden opacity-80 transition-all group-hover:-rotate-4 group-hover:translate-x-2.5 group-hover:-translate-y-3">
            {course.galleryImages && course.galleryImages[0] ? (
              <img src={course.galleryImages[0]} alt="" className="w-full h-full object-cover" />
            ) : course.thumbnailUrl ? (
              <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover filter brightness-90" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-950 to-slate-900 flex items-center justify-center">
                <span className="text-[10px] text-purple-400 font-mono">MERN STACK</span>
              </div>
            )}
          </div>

          {/* Layer 1: Front (Main cover, full opacity, glow border) */}
          <div className="absolute inset-x-4 top-2 h-40 rounded-xl bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 border border-purple-500/30 shadow-lg overflow-hidden transition-all duration-300 group-hover:border-purple-400">
            {course.thumbnailUrl ? (
              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full p-4 flex flex-col justify-between relative bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px]" />
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-purple-600 text-white w-max uppercase tracking-wider z-10">
                  প্রিমিয়াম রিসোর্স
                </span>
                <div className="z-10 text-center py-2">
                  <h4 className="text-white font-black text-sm sm:text-base leading-snug drop-shadow-md line-clamp-2">
                    {course.thumbnailTitle || course.title}
                  </h4>
                </div>
                <div className="z-10 flex justify-center gap-1 opacity-80">
                  <span className="text-[9px] bg-white/10 text-white px-1.5 py-0.5 rounded font-mono">CODE</span>
                  <span className="text-[9px] bg-white/10 text-white px-1.5 py-0.5 rounded font-mono">ASSETS</span>
                  <span className="text-[9px] bg-white/10 text-white px-1.5 py-0.5 rounded font-mono">SETUP</span>
                </div>
              </div>
            )}

            {/* Glowing Corner Badge */}
            <div className="absolute top-2.5 left-2.5 z-20">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md border border-purple-400/40 animate-pulse tracking-wide">
                {badgeText}
              </span>
            </div>

            {/* Wishlist option */}
            {onToggleWishlist && (
              <button
                onClick={(e) => onToggleWishlist(course, e)}
                className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-slate-950/60 backdrop-blur-xs text-white hover:text-pink-400 transition-colors"
                title="Add to Wishlist"
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-pink-500 text-pink-500' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3 z-10 bg-white rounded-b-2xl">
          <div>
            {/* Rating and Resource Info */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-800">{course.rating}</span>
                <span className="text-slate-400">({course.reviewCount})</span>
              </div>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                প্রিমিয়াম বান্ডেল
              </span>
            </div>

            {/* Course Title */}
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base line-clamp-1 group-hover:text-purple-700 transition-colors leading-snug">
              {course.title}
            </h3>

            {/* Short Description */}
            <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed font-medium">
              {course.description || 'সম্পূর্ণ রেডি-টু-ইউজ প্রিমিয়াম সোর্স কোড এবং ডকুমেন্টেশন সহ রিসোর্স প্যাক।'}
            </p>
          </div>

          {/* Pricing & Actions Row */}
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-lg font-black text-slate-900">
                ৳{course.discountPrice}
              </span>
              <span className="text-xs text-slate-400 line-through font-semibold">
                ৳{course.originalPrice}
              </span>
              <span className="bg-pink-100 text-pink-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">
                {course.discountPercentage}% ছাড়
              </span>
            </div>

            <button
              onClick={(e) => onAddToCart(course, e)}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center justify-center shadow-md shadow-purple-200 transition-all hover:scale-110 active:scale-90 cursor-pointer"
              title="Add to Cart"
              id={`add-to-cart-btn-${course.id}`}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(course)}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col group relative"
      id={`course-card-${course.id}`}
    >
      {/* Thumbnail Canvas */}
      <div className={`relative h-44 w-full ${theme.bg} p-4 flex flex-col justify-between overflow-hidden`}>
        
        {/* Top bar over thumbnail */}
        <div className="flex items-center justify-between z-10">
          <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${theme.badgeBg} uppercase tracking-wider shadow-xs`}>
            {theme.badge}
          </span>

          {onToggleWishlist && (
            <button
              onClick={(e) => onToggleWishlist(course, e)}
              className="p-2 rounded-full bg-slate-900/40 backdrop-blur-xs text-white hover:text-pink-400 transition-colors"
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-pink-500 text-pink-500' : ''}`} />
            </button>
          )}
        </div>

        {/* Decorative background grid pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>

        {/* Thumbnail Title Overlay Text */}
        <div className="relative z-10 text-center py-2 px-1">
          <h4 className="text-white font-extrabold text-base sm:text-lg leading-tight drop-shadow-md line-clamp-2">
            {course.thumbnailTitle || course.title}
          </h4>
          <span className={`text-xs font-bold block mt-1 ${theme.accentText}`}>
            স্কিলস হাব অফিশিয়াল
          </span>
        </div>

        {/* Tech Badges Row (for WebDev / Tech) */}
        <div className="relative z-10 flex justify-center gap-1.5 opacity-90">
          <span className="text-[10px] font-mono bg-white/10 text-white px-2 py-0.5 rounded-sm backdrop-blur-xs">
            JS
          </span>
          <span className="text-[10px] font-mono bg-white/10 text-white px-2 py-0.5 rounded-sm backdrop-blur-xs">
            React
          </span>
          <span className="text-[10px] font-mono bg-white/10 text-white px-2 py-0.5 rounded-sm backdrop-blur-xs">
            Node
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Rating Row */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="font-bold text-slate-800">{course.rating}</span>
            <span className="text-slate-400">({course.reviewCount})</span>
          </div>

          {/* Course Title */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 group-hover:text-purple-700 transition-colors leading-snug">
            {course.title}
          </h3>
        </div>

        {/* Pricing & Cart Action Row */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-lg font-black text-slate-900">
              ৳{course.discountPrice}
            </span>
            <span className="text-xs text-slate-400 line-through font-semibold">
              ৳{course.originalPrice}
            </span>
            <span className="bg-pink-100 text-pink-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">
              {course.discountPercentage}% ছাড়
            </span>
          </div>

          <button
            onClick={(e) => onAddToCart(course, e)}
            className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-md shadow-purple-200 transition-all hover:scale-110 active:scale-90"
            title="Add to Cart"
            id={`add-to-cart-btn-${course.id}`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
