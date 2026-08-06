import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Course } from '../types';
import { AutoProductCover } from './AutoProductCover';

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
  const [imgError, setImgError] = React.useState(false);
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

  if (course.categoryId === 'source-code' || course.productType === 'Simple Product') {
    const badgeText = course.resourceBadgeText || course.category || 'প্রিমিয়াম';
    
    return (
      <div
        onClick={() => onSelect(course)}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col group relative"
        id={`course-card-${course.id}`}
      >
        {/* Thumbnail Canvas */}
        <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
          {course.thumbnailUrl && !imgError ? (
            <img src={course.thumbnailUrl} alt={course.title} onError={() => setImgError(true)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <AutoProductCover course={course} className="w-full h-full" badgeOverride={badgeText} />
          )}

          {/* Top bar over thumbnail */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              {badgeText}
            </span>

            {onToggleWishlist && (
              <button
                onClick={(e) => onToggleWishlist(course, e)}
                className="p-2 rounded-full bg-slate-900/60 backdrop-blur-xs text-white hover:text-pink-400 transition-colors pointer-events-auto"
                title="Add to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-pink-500 text-pink-500' : ''}`} />
              </button>
            )}
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
