import React from 'react';
import { GraduationCap, BookOpen, Code, Palette, Sparkles, Layout, ArrowRight } from 'lucide-react';
import { Category, ViewMode } from '../types';

interface CategoryGridProps {
  categories: Category[];
  onSelectCategory: (catId: string) => void;
  onViewAll: () => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onSelectCategory,
  onViewAll,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6" />;
      case 'Code':
        return <Code className="w-6 h-6" />;
      case 'Palette':
        return <Palette className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'Layout':
        return <Layout className="w-6 h-6" />;
      default:
        return <GraduationCap className="w-6 h-6" />;
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              পপুলার ক্যাটাগরি
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              আমাদের সেরা ক্যাটাগরিগুলো এক্সপ্লোর করুন
            </p>
          </div>
          <button
            onClick={onViewAll}
            className="text-purple-700 hover:text-purple-800 font-bold text-sm flex items-center gap-1 group cursor-pointer"
            id="view-all-categories-btn"
          >
            <span>সব দেখুন</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="bg-white hover:bg-purple-50/50 rounded-2xl p-5 border border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center text-center group"
              id={`category-card-${category.id}`}
            >
              {/* Icon Container */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs"
                style={{
                  backgroundColor: category.bgTint,
                  color: category.color,
                }}
              >
                {getIcon(category.iconName)}
              </div>

              {/* Title & Count */}
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-purple-700 transition-colors line-clamp-1">
                {category.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {category.itemCount}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
