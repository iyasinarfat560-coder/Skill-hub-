import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { Review } from '../types';

interface TestimonialsProps {
  testimonials: Review[];
  onViewAll?: () => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials, onViewAll }) => {
  return (
    <section className="py-12 bg-slate-50/60 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What Our Students Say
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Real reviews from our happy students
            </p>
          </div>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-purple-700 hover:text-purple-800 font-bold text-sm flex items-center gap-1 group cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* 3 Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              id={`testimonial-card-${review.id}`}
            >
              {/* User Header */}
              <div className="flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-100 shadow-2xs"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-base leading-tight">
                    {review.name}
                  </h4>
                  <span className="text-xs text-purple-600 font-semibold">
                    {review.handle}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-slate-700 text-sm font-medium leading-relaxed italic">
                "{review.comment}"
              </p>

              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400 pt-2 border-t border-slate-100">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
