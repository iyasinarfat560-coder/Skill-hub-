import React, { useState } from 'react';
import { Bundle, Course, ViewMode } from '../types';
import {
  Package,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Search,
  Star,
  Tag,
  Check,
  ChevronRight,
  Info,
  X,
  Layers,
  Flame,
} from 'lucide-react';

interface BundleOffersViewProps {
  bundles: Bundle[];
  products: Course[];
  onSelectBundleForCheckout: (bundle: Bundle) => void;
  onSelectCourseForDetails: (course: Course) => void;
  onNavigateHome: () => void;
}

export const BundleOffersView: React.FC<BundleOffersViewProps> = ({
  bundles,
  products,
  onSelectBundleForCheckout,
  onSelectCourseForDetails,
  onNavigateHome,
}) => {
  const [selectedBundleForDetails, setSelectedBundleForDetails] = useState<Bundle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Active bundles only on customer site
  const activeBundles = bundles.filter((b) => b.status === 'Active');

  const filteredBundles = activeBundles.filter((b) => {
    return (
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center text-xs sm:text-sm text-slate-500 gap-2">
          <button onClick={onNavigateHome} className="hover:text-purple-600 transition-colors cursor-pointer font-medium">
            হোম
          </button>
          <span>&gt;</span>
          <span className="text-slate-900 font-extrabold">বান্ডেল অফারসমূহ (Bundle Offers)</span>
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-xl">
        {/* Decorative Background Accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-black shadow-inner">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>ধামাকা মেগা সেভিংস অফার</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              একসাথে একাধিক কোর্স ও প্রোডাক্ট কিনুন, <span className="text-amber-400">বাঁচান মেগা ডিসকাউন্ট!</span>
            </h1>

            <p className="text-sm sm:text-base text-purple-200/90 leading-relaxed font-sans">
              আমাদের বিশেষ কিউরেটেড "বান্ডেল কম্বো প্যাকেজ" থেকে পছন্দসই বান্ডেল বেছে নিন। প্রতিটি বান্ডেলে রয়েছে সেরা কোর্স, প্রিমিয়াম রিসোর্স ও ই-বুকের সেরা সমন্বয়।
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-slate-200">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>ইনস্ট্যান্ট অল-ইন-ওয়ান এক্সেস</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>লাইফটাইম সাপোর্ট ও আপডেট</span>
              </div>
            </div>
          </div>

          {/* Search Box Card inside Banner */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl w-full md:w-80 shadow-2xl space-y-3">
            <span className="text-xs font-extrabold uppercase text-purple-200 tracking-wider block">
              খুঁজুন আপনার বান্ডেল
            </span>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="বান্ডেলের নাম দিয়ে খুঁজুন..."
                className="w-full pl-9 pr-3 py-2.5 bg-white text-slate-900 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="text-[11px] text-purple-200 flex items-center justify-between pt-1 font-mono">
              <span>উপলব্ধ সক্রিয় বান্ডেল:</span>
              <span className="font-extrabold text-amber-300">{activeBundles.length} টি</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bundle List Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {filteredBundles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-black text-slate-900 mb-1">কোনো বান্ডেল অফার পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500 mb-4">
              আপনার অনুসন্ধানের সাথে মিল রেখে কোনো অফার খুঁজে পাওয়া যায়নি।
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-purple-700 text-white text-xs font-extrabold rounded-xl hover:bg-purple-800 transition-colors cursor-pointer"
              >
                সব অফার দেখুন
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBundles.map((bundle) => {
              const includedProducts = (bundle.productIds || [])
                .map((id) => products.find((p) => p.id === id))
                .filter(Boolean) as Course[];

              const savingsAmount = Math.max(0, bundle.originalTotalPrice - bundle.bundlePrice);

              return (
                <div
                  key={bundle.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
                >
                  {/* Top Cover Banner */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img
                      src={bundle.coverImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600'}
                      alt={bundle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Top Offer Badge */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                      <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-slate-950" />
                        <span>{bundle.savingsPercentage}% ছাড়</span>
                      </span>

                      <span className="bg-purple-900/90 backdrop-blur-md text-purple-100 text-[10px] font-bold px-2.5 py-1 rounded-full border border-purple-400/30">
                        {includedProducts.length} টি কম্বো আইটেম
                      </span>
                    </div>

                    {/* Included Product Thumbnails Overlapping Collage at bottom left */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10">
                      <div className="flex items-center -space-x-3 overflow-hidden p-1">
                        {includedProducts.slice(0, 4).map((p, idx) => (
                          <img
                            key={idx}
                            src={p.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200'}
                            alt={p.title}
                            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md"
                            title={p.title}
                          />
                        ))}
                      </div>

                      {bundle.expiryDate && (
                        <span className="text-[10px] font-mono font-bold bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-amber-300 border border-white/10 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>মেয়াদ: {bundle.expiryDate}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    
                    <div className="space-y-3">
                      <h3 className="font-black text-slate-900 text-lg leading-snug group-hover:text-purple-700 transition-colors">
                        {bundle.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {bundle.description}
                      </p>

                      {/* Included Items List ("এই বান্ডেলে যা আছে") */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                          এই বান্ডেলে অন্তর্ভুক্ত রয়েছে ({includedProducts.length} টি):
                        </span>

                        <ul className="space-y-1.5">
                          {includedProducts.map((prod) => (
                            <li key={prod.id} className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{prod.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Pricing & Order Actions */}
                    <div className="pt-4 border-t border-slate-100 space-y-4">
                      
                      {/* Price Breakdown Row */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">
                            আসল মোট দাম
                          </span>
                          <span className="text-xs text-slate-400 line-through font-mono font-bold">
                            ৳{bundle.originalTotalPrice}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-emerald-600 font-extrabold block uppercase">
                            বান্ডেল অফার প্রাইস
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-purple-700 font-mono">
                              ৳{bundle.bundlePrice}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                              সেভ ৳{savingsAmount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={() => setSelectedBundleForDetails(bundle)}
                          className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-extrabold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>ডিটেইলস</span>
                        </button>

                        <button
                          onClick={() => onSelectBundleForCheckout(bundle)}
                          className="w-full py-2.5 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs transition-all shadow-md shadow-purple-200 hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                          <span>বান্ডেল কিনুন</span>
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* BUNDLE DETAILS MODAL VIEW */}
      {selectedBundleForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full inline-block">
                    {selectedBundleForDetails.savingsPercentage}% ছাড়ের বিশেষ অফার
                  </span>
                  <h3 className="font-black text-base sm:text-xl">
                    {selectedBundleForDetails.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedBundleForDetails(null)}
                className="p-2 text-purple-200 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/60">
              
              {/* Cover & Overview Banner */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 flex flex-col md:flex-row gap-5 items-center">
                <img
                  src={selectedBundleForDetails.coverImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600'}
                  alt={selectedBundleForDetails.title}
                  className="w-full md:w-64 h-40 rounded-2xl object-cover bg-slate-100 border border-slate-200 shadow-sm"
                />

                <div className="space-y-2 flex-1">
                  <h4 className="text-base font-extrabold text-slate-900">
                    বান্ডেল ওভারভিউ ও বিবরণ
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {selectedBundleForDetails.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 font-extrabold rounded-xl border border-purple-100">
                      মোট অন্তর্ভুক্ত আইটেম: {selectedBundleForDetails.productIds.length} টি
                    </span>
                    {selectedBundleForDetails.expiryDate && (
                      <span className="px-3 py-1 bg-amber-50 text-amber-800 font-mono font-bold rounded-xl border border-amber-200">
                        অফারের মেয়াদ: {selectedBundleForDetails.expiryDate} পর্যন্ত
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Individual Products Breakdown Cards */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>এই বান্ডেলের অন্তর্ভুক্ত প্রোডাক্টসমূহ:</span>
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  {selectedBundleForDetails.productIds.map((pid) => {
                    const prod = products.find((p) => p.id === pid);
                    if (!prod) return null;

                    return (
                      <div
                        key={prod.id}
                        className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:border-purple-300 transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={prod.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200'}
                            alt={prod.title}
                            className="w-16 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100"
                          />
                          <div>
                            <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md inline-block mb-1">
                              {prod.category}
                            </span>
                            <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                              {prod.title}
                            </h5>
                            <span className="text-[11px] text-slate-500 block">
                              ইন্সট্রাক্টর: {prod.instructor?.name || 'Skills Hub Expert'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-slate-400 block font-semibold">একক মূল্য</span>
                            <span className="font-mono font-bold text-slate-900 text-xs">
                              ৳{prod.discountPrice || prod.originalPrice}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedBundleForDetails(null);
                              onSelectCourseForDetails(prod);
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800 text-xs font-extrabold rounded-xl transition-colors cursor-pointer"
                          >
                            বিস্তারিত
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Bottom Price & Order Bar */}
            <div className="p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 font-bold block">
                  মোট মূল দাম: <span className="line-through font-mono">৳{selectedBundleForDetails.originalTotalPrice}</span>
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-purple-700 font-mono">
                    ৳{selectedBundleForDetails.bundlePrice}
                  </span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                    ৳{Math.max(0, selectedBundleForDetails.originalTotalPrice - selectedBundleForDetails.bundlePrice)} সঞ্চয় ({selectedBundleForDetails.savingsPercentage}% OFF)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedBundleForDetails(null)}
                  className="px-4 py-3 rounded-2xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-100 text-xs cursor-pointer"
                >
                  বন্ধ করুন
                </button>

                <button
                  onClick={() => {
                    const bundleToBuy = selectedBundleForDetails;
                    setSelectedBundleForDetails(null);
                    onSelectBundleForCheckout(bundleToBuy);
                  }}
                  className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-lg shadow-purple-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current text-amber-300" />
                  <span>বান্ডেলটি অর্ডার করুন (৳{selectedBundleForDetails.bundlePrice})</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
