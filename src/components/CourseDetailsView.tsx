import React, { useState } from 'react';
import { 
  Play, Pause, Maximize, Volume2, ChevronLeft, ChevronRight, 
  Check, Video, Folder, Infinity, Smartphone, Star, 
  Users, Clock, Globe, Shield, Heart, ShoppingCart, Facebook, 
  Youtube, Linkedin, X, ZoomIn, Laptop, Mail, Tag, CheckCircle2, AlertCircle,
  Package, Download, CheckCircle, FileText, Zap, MessageCircle
} from 'lucide-react';
import { Course, Coupon, WhatsAppSettingsData } from '../types';
import { AutoProductCover } from './AutoProductCover';

interface CourseDetailsViewProps {
  course: Course;
  onNavigateHome: () => void;
  onNavigateCourses: () => void;
  onBuyNow: (course: Course) => void;
  onAddToCart: (course: Course) => void;
  onToggleWishlist: (course: Course) => void;
  isWishlisted: boolean;
  coupons?: Coupon[];
  whatsappSettings?: WhatsAppSettingsData;
}

export const CourseDetailsView: React.FC<CourseDetailsViewProps> = ({
  course,
  onNavigateHome,
  onNavigateCourses,
  onBuyNow,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  coupons = [],
  whatsappSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'learn' | 'curriculum' | 'reviews' | 'instructor'>('description');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);

  // Coupon code states
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPct: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const previewScreenshots = [
    course.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=800',
  ];

  const sampleVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  const curriculumLessons = [
    { title: 'মডিউল ১: কোর্স পরিচিতি ও ডেভেলপমেন্ট এনভায়রনমেন্ট সেটআপ', duration: '১ ঘণ্টা ৩০ মি', lessons: '৫টি লেসন' },
    { title: 'মডিউল ২: প্রজেক্ট বেসিক্স ও ফান্ডামেন্টাল কনসেপ্ট', duration: '২ ঘণ্টা ১৫ মি', lessons: '৮টি লেসন' },
    { title: 'মডিউল ৩: এডভান্সড টেকনিকস ও রিয়েল-ওয়ার্ল্ড প্র্যাকটিস', duration: '৪ ঘণ্টা ০০ মি', lessons: '১২টি লেসন' },
    { title: 'মডিউল ৪: মাস্টারক্লাস, টিপস ও ট্রিকস', duration: '৫ ঘণ্টা ৪৫ মি', lessons: '১৬টি লেসন' },
    { title: 'মডিউল ৫: প্র্যাকটিক্যাল হ্যান্ডস-অন প্রজেক্ট', duration: '৬ ঘণ্টা ১০ মি', lessons: '১৮টি লেসন' },
    { title: 'মডিউল ৬: ফাইনাল আউটপুট ও ইমেইল সাপোর্ট', duration: '৩ ঘণ্টা ৩০ মি', lessons: '৬টি লেসন' },
  ];

  // Calculate final discounted price if coupon applied
  const currentPrice = appliedCoupon
    ? Math.round(course.discountPrice * (1 - appliedCoupon.discountPct / 100))
    : course.discountPrice;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const cleanCode = couponInput.trim().toUpperCase();

    if (!cleanCode) {
      setCouponError('অনুগ্রহ করে কুপন কোড লিখুন');
      return;
    }

    const matched = coupons.find(
      (c) => c.code.toUpperCase() === cleanCode && (c.status === 'Active' || c.status === 'Disabled' ? false : true)
    );

    if (matched) {
      if (matched.usedCount >= matched.usageLimit) {
        setCouponError('এই কুপনের ব্যবহারের সীমা শেষ হয়ে গেছে');
        return;
      }
      const pct = matched.discountType === 'percentage'
        ? matched.discountValue
        : Math.round((matched.discountValue / course.discountPrice) * 100);
      setAppliedCoupon({ code: matched.code, discountPct: Math.min(100, Math.max(1, pct)) });
      setCouponError(null);
    } else if (cleanCode === 'SKILLS10' || cleanCode === 'WELCOME20') {
      setAppliedCoupon({ code: cleanCode, discountPct: 20 });
      setCouponError(null);
    } else {
      setCouponError('অবৈধ বা মেয়াদোত্তীর্ণ কুপন কোড!');
    }
  };

  const isSimpleProduct = course.productType === 'Simple Product' || ['ই-বুক ও বই', 'সোর্স কোড', 'ডিজাইন অ্যাসেট', 'এআই প্রম্পট', 'ওয়েব টেমপ্লেট', 'ডিজিটাল প্রোডাক্ট', 'প্রিমিয়াম সফটওয়্যার'].some(c => course.category.toLowerCase().includes(c.toLowerCase()));

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center text-xs sm:text-sm text-slate-500 gap-2 flex-wrap">
          <button onClick={onNavigateHome} className="hover:text-purple-600 transition-colors cursor-pointer">হোম</button>
          <span>&gt;</span>
          <button onClick={onNavigateCourses} className="hover:text-purple-600 transition-colors cursor-pointer">
            {isSimpleProduct ? 'ডিজিটাল প্রোডাক্টস' : 'কোর্সসমূহ'}
          </button>
          <span>&gt;</span>
          <span className="text-slate-700 font-medium">{course.category}</span>
          <span>&gt;</span>
          <span className="text-purple-700 font-bold truncate max-w-xs">{course.title}</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Main Content Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {isSimpleProduct ? (
              /* SIMPLE DIGITAL PRODUCT DETAILED VIEW */
              <div className="space-y-6">
                
                {/* Product Cover Image Slider Container (Up to 3 images or Auto-generated Cover) */}
                {(() => {
                  const productImages = [
                    course.thumbnailUrl,
                    ...(course.galleryImages || [])
                  ].filter(Boolean) as string[];

                  const hasRealImages = productImages.length > 0;

                  if (!hasRealImages) {
                    return (
                      <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 p-3 space-y-3">
                        <div className="relative w-full h-[320px] sm:h-[400px] md:h-[450px] rounded-2xl overflow-hidden bg-slate-950 group">
                          <AutoProductCover course={course} className="w-full h-full" />
                          <div className="absolute top-4 left-4 z-10">
                            <span className="bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                              <Package className="w-3.5 h-3.5" />
                              <span>ডিজিটাল প্রোডাক্ট (অটো-কভার)</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  const sliderImages = productImages;

                  return (
                    <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 p-3 space-y-3">
                      <div className="relative w-full h-[320px] sm:h-[400px] md:h-[450px] rounded-2xl overflow-hidden bg-slate-950 group">
                        <img 
                          src={sliderImages[activeThumbnailIndex] || sliderImages[0]} 
                          alt={course.title} 
                          className="w-full h-full object-cover transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                        
                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
                          <span className="bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                            <Package className="w-3.5 h-3.5" />
                            <span>ডিজিটাল প্রোডাক্ট</span>
                          </span>

                          <button 
                            onClick={() => setLightboxImage(sliderImages[activeThumbnailIndex] || sliderImages[0])}
                            className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-all flex items-center gap-1 text-xs cursor-pointer"
                            title="ছবি বড় করে দেখুন"
                          >
                            <ZoomIn className="w-4 h-4" />
                            <span className="hidden sm:inline font-bold">বড় করুন</span>
                          </button>
                        </div>

                        {/* Slider Navigation Arrows */}
                        {sliderImages.length > 1 && (
                          <>
                            <button
                              onClick={() => setActiveThumbnailIndex((prev) => (prev > 0 ? prev - 1 : sliderImages.length - 1))}
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all z-20 cursor-pointer shadow-lg"
                              title="পূর্ববর্তী ছবি"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setActiveThumbnailIndex((prev) => (prev < sliderImages.length - 1 ? prev + 1 : 0))}
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all z-20 cursor-pointer shadow-lg"
                              title="পরবর্তী ছবি"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>

                            {/* Dots Indicator */}
                            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                              {sliderImages.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setActiveThumbnailIndex(idx)}
                                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${idx === activeThumbnailIndex ? 'bg-purple-500 w-6' : 'bg-white/50 hover:bg-white'}`}
                                />
                              ))}
                            </div>
                          </>
                        )}

                        {/* Bottom Title overlay */}
                        <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                          <span className="bg-purple-600/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md mb-2 inline-block">
                            {course.category}
                          </span>
                          <h1 className="text-lg sm:text-2xl font-black drop-shadow-md leading-tight">
                            {course.title}
                          </h1>
                        </div>
                      </div>

                      {/* Thumbnail Gallery Bar */}
                      {sliderImages.length > 1 && (
                        <div className="flex items-center gap-3 px-1">
                          {sliderImages.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveThumbnailIndex(idx)}
                              className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${idx === activeThumbnailIndex ? 'border-purple-600 ring-2 ring-purple-200 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'}`}
                            >
                              <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* "এই রিসোর্সে কী কী আছে" Highlight Section for Premium Resource Category */}
                {course.categoryId === 'source-code' && (
                  <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-purple-500/30 shadow-lg space-y-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400 animate-bounce" />
                      <h3 className="font-black text-base sm:text-lg tracking-wide text-purple-100">
                        এই রিসোর্স বান্ডেলে কী কী আছে? (What's Included)
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Highlight 1 */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center space-y-2 hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-2xl sm:text-3xl font-black text-amber-400 block tracking-tight">
                            {course.resourceHighlight1Count || '৫০০+ ফাইল'}
                          </span>
                          <span className="text-xs text-purple-200 font-bold block mt-0.5">
                            {course.resourceHighlight1Label || 'রিসোর্স উপাদান'}
                          </span>
                        </div>
                      </div>

                      {/* Highlight 2 */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center space-y-2 hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold">
                          <Folder className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-2xl sm:text-3xl font-black text-pink-400 block tracking-tight">
                            {course.resourceHighlight2Count || '১০+ ক্যাটাগরি'}
                          </span>
                          <span className="text-xs text-purple-200 font-bold block mt-0.5">
                            {course.resourceHighlight2Label || 'টপিক কভারেজ'}
                          </span>
                        </div>
                      </div>

                      {/* Highlight 3 */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center space-y-2 hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                          <Download className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-2xl sm:text-3xl font-black text-cyan-400 block tracking-tight">
                            {course.resourceHighlight3Count || '১০০% লাইফটাইম'}
                          </span>
                          <span className="text-xs text-purple-200 font-bold block mt-0.5">
                            {course.resourceHighlight3Label || 'ডাউনলোড এক্সেস'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Details Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                  
                  {/* Delivery Method & Features Banner */}
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
                        <Download className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-emerald-950 text-xs sm:text-sm block">
                          {course.deliveryMethodType === 'external_link' ? '🔗 ইনস্ট্যান্ট গুগল ড্রাইভ / মেগা এক্সেস' : '⚡ ইনস্ট্যান্ট ফাইল ডাউনলোড (.ZIP / .PDF / .EXE)'}
                        </span>
                        <span className="text-[11px] text-emerald-800 block">
                          পেমেন্ট করার সাথে সাথেই অর্ডার পেইজে সরাসরি ফাইল এক্সেস পাবেন
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-emerald-600 text-white font-mono font-bold text-xs px-3 py-1.5 rounded-xl">
                      <CheckCircle className="w-4 h-4" />
                      <span>ইনস্ট্যান্ট ডেলিভারি</span>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <span>প্রোডাক্ট বিবরণী (Description)</span>
                    </h3>
                    <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line font-sans bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
                      {course.description}
                    </p>
                  </div>

                  {/* Tags Preview */}
                  {course.tags && course.tags.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                        সম্পর্কিত কীওয়ার্ড ও ট্যাগসমূহ:
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {course.tags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-bold text-xs rounded-xl transition-colors">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trust & Guarantee Grid */}
                  <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                      <Shield className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                      <div>
                        <span className="font-extrabold text-slate-900 text-xs block">১০০% ফাইল গ্যারান্টি</span>
                        <span className="text-[10px] text-slate-500">ভেরিফাইড ও মালওয়্যার মুক্ত</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                      <Zap className="w-6 h-6 text-amber-500 flex-shrink-0" />
                      <div>
                        <span className="font-extrabold text-slate-900 text-xs block">স্বয়ংক্রিয় ডেলিভারি</span>
                        <span className="text-[10px] text-slate-500">বিকাশ/নগদ পেমেন্টেই ফাইল</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                      <Clock className="w-6 h-6 text-purple-600 flex-shrink-0" />
                      <div>
                        <span className="font-extrabold text-slate-900 text-xs block">লাইফটাইম সাপোর্ট</span>
                        <span className="text-[10px] text-slate-500">২৪/৭ অনলাইন সহায়তা</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              /* FULL COURSE DETAILED VIEW */
              <>
                {/* Video Preview Player */}
                <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800 group">
              
              {/* Screen Area */}
              <div className="relative aspect-video w-full flex items-center justify-center overflow-hidden bg-slate-950">
                
                {isPlaying ? (
                  <video
                    src={sampleVideoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                    onEnded={() => setIsPlaying(false)}
                  />
                ) : (
                  <>
                    <img 
                      src={previewScreenshots[activeThumbnailIndex]} 
                      alt={course.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => setLightboxImage(previewScreenshots[activeThumbnailIndex])}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

                    {/* Floating Title Overlay */}
                    <div className="absolute top-4 left-4 right-4 text-white z-10 flex justify-between items-start">
                      <span className="bg-purple-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                        কোর্স প্রিভিউ
                      </span>
                      <button 
                        onClick={() => setLightboxImage(previewScreenshots[activeThumbnailIndex])}
                        className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-all flex items-center gap-1 text-xs cursor-pointer"
                        title="ছবি বড় করে দেখুন"
                      >
                        <ZoomIn className="w-4 h-4" />
                        <span className="hidden sm:inline font-bold">বড় করুন</span>
                      </button>
                    </div>

                    {/* Central Big Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-600/90 hover:bg-purple-600 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer group/btn"
                        id="video-play-btn"
                        title="ভিডিও প্লে করুন"
                      >
                        <Play className="w-8 h-8 fill-white ml-1 group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                      <h2 className="text-base sm:text-xl font-extrabold drop-shadow-md">
                        {course.title} (প্রিভিউ টিজার)
                      </h2>
                      <p className="text-xs text-purple-200 mt-1 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-purple-400" />
                        <span>ভিডিও দেখতে প্লে বাটনে ক্লিক করুন</span>
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Player Control Bar */}
              <div className="bg-slate-950 text-slate-300 px-4 py-3 flex items-center justify-between border-t border-slate-800 text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-white cursor-pointer">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <span className="font-mono text-slate-400">০২:৪৫ মি প্রিভিউ</span>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsVideoModalOpen(true)}
                    className="text-purple-400 hover:text-purple-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize className="w-3.5 h-3.5" />
                    <span>ফুল স্ক্রিনে দেখুন</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Thumbnail Gallery Row with Lightbox Click */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>কোর্সের স্ক্রিনশট ও ছবিসমূহ (ক্লিক করে বড় করুন):</span>
                <span className="text-purple-600 font-semibold">{previewScreenshots.length}টি ছবি</span>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveThumbnailIndex((prev) => (prev > 0 ? prev - 1 : previewScreenshots.length - 1))}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-xs cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-4 gap-3 flex-1">
                  {previewScreenshots.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveThumbnailIndex(idx);
                        setLightboxImage(img);
                      }}
                      className={`group relative aspect-video rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        activeThumbnailIndex === idx ? 'border-purple-600 ring-2 ring-purple-200' : 'border-slate-200 opacity-80 hover:opacity-100'
                      }`}
                      title="ছবি বড় করে দেখতে ক্লিক করুন"
                    >
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ZoomIn className="w-5 h-5 text-white drop-shadow-md" />
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setActiveThumbnailIndex((prev) => (prev < previewScreenshots.length - 1 ? prev + 1 : 0))}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-xs cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Tabs Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-2 flex items-center gap-2 overflow-x-auto shadow-xs">
              {[
                { id: 'description', label: 'বিবরণ' },
                { id: 'learn', label: 'যা শিখবেন' },
                { id: 'curriculum', label: 'কারিকুলাম' },
                { id: 'reviews', label: 'রিভিউ (২৮০)' },
                { id: 'instructor', label: 'ইনস্ট্রাক্টর' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  id={`tab-${tab.id}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content Cards */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-xs">
              
              {/* Tab 1: Description & Learn */}
              {(activeTab === 'description' || activeTab === 'learn') && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 mb-3">
                      এই কোর্সটি সম্পর্কে
                    </h3>
                    <p className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                      {course.description}
                    </p>
                  </div>

                  {/* আপনি যা শিখবেন (What You Will Learn) */}
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-xl font-extrabold text-slate-900 mb-4">
                      আপনি যা শিখবেন
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.whatYouWillLearn.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-purple-50/50 p-3 rounded-xl border border-purple-100/60">
                          <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-slate-800">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feature Highlights Grid */}
                  <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">
                      কোর্সের বিশেষ সুবিধা ও ফিচারসমূহ
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-center space-y-1">
                        <Video className="w-5 h-5 text-purple-600 mx-auto" />
                        <span className="text-xs font-bold text-slate-800 block">{course.features.videoHours}</span>
                        <span className="text-[11px] text-slate-500 font-medium">ভিডিও টিউটোরিয়াল</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-center space-y-1">
                        <Folder className="w-5 h-5 text-purple-600 mx-auto" />
                        <span className="text-xs font-bold text-slate-800 block">{course.features.projectsCount}</span>
                        <span className="text-[11px] text-slate-500 font-medium">হ্যান্ডস-অন প্রজেক্ট</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-center space-y-1">
                        <Laptop className="w-5 h-5 text-purple-600 mx-auto" />
                        <span className="text-xs font-bold text-slate-800 block">মোবাইল ও পিসি</span>
                        <span className="text-[11px] text-slate-500 font-medium">উভয় ডিভাইসে চলবে</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-center space-y-1">
                        <Mail className="w-5 h-5 text-purple-600 mx-auto" />
                        <span className="text-xs font-bold text-slate-800 block">ইমেইলে এক্সেস</span>
                        <span className="text-[11px] text-slate-500 font-medium">ইনস্ট্যান্ট ডেলিভারি</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 2: Curriculum */}
              {activeTab === 'curriculum' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                    কোর্স মডিউল ও সিলেবাস
                  </h3>
                  <div className="space-y-3">
                    {curriculumLessons.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                            <span className="text-xs text-slate-500">{item.lessons}</span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                          {item.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Instructor */}
              {(activeTab === 'description' || activeTab === 'instructor') && (
                <div className="pt-6 border-t border-slate-200">
                  <h3 className="text-xl font-extrabold text-slate-900 mb-4">
                    ইনস্ট্রাক্টর পরিচিতি
                  </h3>
                  <div className="flex items-start gap-4">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-200 shadow-md"
                    />
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-slate-900">{course.instructor.name}</h4>
                      <p className="text-xs font-semibold text-purple-600">{course.instructor.role}</p>
                      <p className="text-xs text-slate-500 font-medium">{course.instructor.experience}</p>
                      
                      <div className="flex items-center gap-2 pt-2 text-slate-400">
                        <Facebook className="w-4 h-4 hover:text-purple-600 cursor-pointer" />
                        <Youtube className="w-4 h-4 hover:text-rose-600 cursor-pointer" />
                        <Linkedin className="w-4 h-4 hover:text-blue-600 cursor-pointer" />
                        <Globe className="w-4 h-4 hover:text-slate-700 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Student Reviews */}
              {(activeTab === 'description' || activeTab === 'reviews') && (
                <div className="pt-6 border-t border-slate-200">
                  <h3 className="text-xl font-extrabold text-slate-900 mb-6">
                    শিক্ষার্থীদের রিভিউ ও রেটিং
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">
                    
                    {/* Score summary */}
                    <div className="md:col-span-4 text-center md:border-r md:border-slate-200 pr-4">
                      <span className="text-5xl font-black text-slate-900 block">{course.rating}</span>
                      <div className="flex justify-center text-amber-400 my-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500 font-semibold">৫-এর মধ্যে</span>
                    </div>

                    {/* Bars breakdown */}
                    <div className="md:col-span-8 space-y-1.5 text-xs text-slate-600">
                      {[
                        { stars: '5★', count: 220, pct: '78%' },
                        { stars: '4★', count: 45, pct: '16%' },
                        { stars: '3★', count: 10, pct: '4%' },
                        { stars: '2★', count: 3, pct: '1%' },
                        { stars: '1★', count: 2, pct: '1%' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="w-6 font-bold">{item.stars}</span>
                          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-600 rounded-full" style={{ width: item.pct }}></div>
                          </div>
                          <span className="w-8 text-right text-slate-400">({item.count})</span>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Sample Review */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                          RA
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 text-xs">রাসেল আহমেদ</h5>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400">২ সপ্তাহ আগে</span>
                    </div>
                    <p className="text-xs text-slate-700">
                      খুবই ভালো কোর্স! সহজভাবে বুঝানো হয়েছে। পেমেন্ট করার পরই ইমেইলে এক্সেস পেয়েছি।
                    </p>
                  </div>

                </div>
              )}

            </div>
              </>
            )}

          </div>

          {/* Right Column: Sticky Checkout Sidebar (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl space-y-6">
              
              {/* Title & Rating */}
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {course.title}
                </h1>
                
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <span className="font-bold text-slate-900">{course.rating}</span>
                  <span className="text-slate-400 font-medium">({course.reviewCount} রিভিউ)</span>
                </div>
              </div>

              {/* Price Tag Box */}
              <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-purple-900">
                        ৳{currentPrice}
                      </span>
                      {course.originalPrice && (
                        <span className="text-sm text-slate-400 line-through font-bold">
                          ৳{course.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="bg-pink-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-xs">
                    {appliedCoupon ? `${appliedCoupon.discountPct + course.discountPercentage}% ছাড়` : `${course.discountPercentage}% OFF`}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs px-3 py-1.5 rounded-xl flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      কুপন {appliedCoupon.code} প্রয়োগ হয়েছে ({appliedCoupon.discountPct}% অতিরিক্ত ছাড়)
                    </span>
                    <button 
                      onClick={() => setAppliedCoupon(null)}
                      className="text-rose-600 hover:underline text-[11px]"
                    >
                      মুছুন
                    </button>
                  </div>
                )}
              </div>

              {/* Coupon Code Option Field */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-purple-600" />
                  <span>কুপন কোড ব্যবহার করুন</span>
                </label>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="যেমন: SKILLS10"
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 uppercase"
                  />
                  <button
                    type="submit"
                    className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    আবেদন
                  </button>
                </form>

                {couponError && (
                  <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{couponError}</span>
                  </p>
                )}
              </div>

              {/* Meta Stats List */}
              <div className="space-y-3 text-xs text-slate-700 font-medium border-t border-b border-slate-100 py-4">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>{course.studentsCount} জন শিক্ষার্থী এনরোলড</span>
                </div>
                <div className="flex items-center gap-3">
                  <Laptop className="w-4 h-4 text-purple-600" />
                  <span>ডিভাইস: মোবাইল ও কম্পিউটার উভয়তেই ব্যবহারযোগ্য</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span>এক্সেস: সম্পূর্ণ ইমেইলে এক্সেস দেওয়া হবে</span>
                </div>
                <div className="flex items-center gap-3">
                  <Infinity className="w-4 h-4 text-purple-600" />
                  <span>মেয়াদ: লাইফটাইম এক্সেস</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span>সার্টিফিকেট: প্রদান করা হয় না</span>
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onBuyNow({ ...course, discountPrice: currentPrice })}
                    className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-base py-3.5 rounded-full shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] active:scale-98 text-center cursor-pointer"
                    id="buy-now-btn"
                  >
                    এখনই কিনুন
                  </button>

                  <button
                    onClick={() => onToggleWishlist(course)}
                    className={`w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center transition-colors cursor-pointer ${
                      isWishlisted ? 'bg-pink-50 border-pink-200 text-pink-600' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                    title="উইশলিস্টে যুক্ত করুন"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-pink-600' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={() => onAddToCart({ ...course, discountPrice: currentPrice })}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm py-3 rounded-full border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  id="add-to-cart-sidebar-btn"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>কার্টে যোগ করুন</span>
                </button>

                {/* WhatsApp Demo / Support Button */}
                {(() => {
                  const baseChatLink = whatsappSettings?.whatsappChatLink || 'https://wa.me/8801861612289';
                  const messageText = `সালামু আলাইকুম, আমি "${course.title}" প্রোডাক্টটি সম্পর্কে জানতে এবং ডেমো দেখতে চাই।`;
                  const finalHref = baseChatLink.includes('?') 
                    ? `${baseChatLink}&text=${encodeURIComponent(messageText)}`
                    : `${baseChatLink}?text=${encodeURIComponent(messageText)}`;
                  return (
                    <a
                      href={finalHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs sm:text-sm py-3 rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <MessageCircle className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                      <span>ডেমো দেখতে বা প্রশ্ন থাকলে WhatsApp করুন</span>
                    </a>
                  );
                })()}
              </div>

              {/* Guarantees info */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>ইনস্ট্যান্ট এক্সেস ও ১০০% নিরাপদ পেমেন্ট</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* FULLSCREEN VIDEO MODAL */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-400" />
                <span>{course.title} (ফুল স্ক্রিন ভিডিও প্রিভিউ)</span>
              </h3>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <video
                src={sampleVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX IMAGE ZOOM MODAL */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="relative max-w-5xl max-h-[90vh] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors cursor-pointer border border-white/20"
              title="বন্ধ করুন"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={lightboxImage} 
              alt="Expanded Preview" 
              className="w-full max-h-[82vh] object-contain rounded-xl"
            />
            <div className="p-3 text-center text-xs text-purple-300 font-medium">
              ছবিটি বড় ভিউতে দেখানো হচ্ছে। বন্ধ করতে X অথবা ছবির বাইরে ক্লিক করুন।
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

