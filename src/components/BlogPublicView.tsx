import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  User,
  Eye,
  ExternalLink,
  ArrowLeft,
  Video,
  PlayCircle,
  Tag,
  Clock,
  Sparkles,
  Search,
  BookOpen,
  Share2,
  CheckCircle
} from 'lucide-react';
import { BlogPost, ViewMode } from '../types';

interface BlogPublicViewProps {
  posts: BlogPost[];
  onNavigate: (view: ViewMode) => void;
  onShowToast: (msg: string) => void;
}

export const BlogPublicView: React.FC<BlogPublicViewProps> = ({
  posts,
  onNavigate,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Filter only Published posts
  const publishedPosts = posts.filter((p) => p.status === 'Published');

  // Extract unique categories dynamically + include default popular ones
  const defaultCategories = ['All', 'Free Course', 'Notice', 'Tutorial', 'Update'];
  const postCategories = Array.from(new Set(publishedPosts.map((p) => p.category)));
  const allCategories = Array.from(new Set([...defaultCategories, ...postCategories]));

  // Filter posts by category and search query
  const filteredPosts = publishedPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'All' || post.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Helper for category badge colors
  const getCategoryBadge = (category: string) => {
    const cat = category.toLowerCase();
    if (cat === 'free course' || cat === 'ফ্রি কোর্স') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
          <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
          Free Course
        </span>
      );
    }
    if (cat === 'notice' || cat === 'নোটিশ') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs">
          <Tag className="w-3.5 h-3.5 text-amber-600" />
          Notice
        </span>
      );
    }
    if (cat === 'tutorial' || cat === 'টিউটোরিয়াল') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          Tutorial
        </span>
      );
    }
    if (cat === 'update' || cat === 'আপডেট') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          Update
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 shadow-2xs">
        <Tag className="w-3.5 h-3.5 text-indigo-600" />
        {category}
      </span>
    );
  };

  const handleShare = (post: BlogPost) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('ব্লগ পোস্টের লিংক কপি করা হয়েছে!');
    }
  };

  // Format content text with bold formatting and paragraphs
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-4 text-slate-800 text-sm sm:text-base leading-relaxed font-normal">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-2"></div>;

          // Check if bullet point
          if (line.trim().startsWith('•') || line.trim().startsWith('*') || line.trim().startsWith('-')) {
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-2 font-medium text-slate-900">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span>{line.trim().replace(/^[•*-]\s*/, '')}</span>
              </div>
            );
          }

          // Check if bold markdown line
          if (line.includes('**')) {
            const parts = line.split('**');
            return (
              <p key={idx}>
                {parts.map((part, pIdx) =>
                  pIdx % 2 === 1 ? (
                    <strong key={pIdx} className="font-extrabold text-slate-900">
                      {part}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </p>
            );
          }

          return <p key={idx}>{line}</p>;
        })}
      </div>
    );
  };

  // DETAIL VIEW
  if (selectedPost) {
    // Related posts in same category
    const relatedPosts = publishedPosts.filter(
      (p) => p.id !== selectedPost.id && (p.category === selectedPost.category || selectedCategory === 'All')
    ).slice(0, 3);

    const hasExternalLink = !!selectedPost.teraboxLink && selectedPost.teraboxLink.trim() !== '';
    const isButtonEnabled = selectedPost.showButton !== false; // Default true if not explicitly set to false
    const shouldShowButton = hasExternalLink && isButtonEnabled;
    const buttonLabel = selectedPost.buttonText || '🎬 ভিডিও দেখুন';
    const externalUrl = selectedPost.teraboxLink || '#';

    return (
      <div className="bg-slate-50 min-h-screen pb-20 pt-6 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ব্লগ লিস্টিং-এ ফিরে যান</span>
            </button>

            <button
              onClick={() => handleShare(selectedPost)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold hover:bg-purple-100 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>শেয়ার করুন</span>
            </button>
          </div>

          {/* Top Full-Width Cover Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 max-h-[420px]">
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-full object-cover min-h-[260px] sm:min-h-[360px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
              <div>{getCategoryBadge(selectedPost.category)}</div>
              <div className="flex items-center gap-3 text-xs text-slate-200 font-semibold bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  {selectedPost.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  {selectedPost.author}
                </span>
              </div>
            </div>
          </div>

          {/* Article Header & Main Content Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                {selectedPost.title}
              </h1>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-3 pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-purple-600" />
                  {selectedPost.views || 102} জন দেখেছেন
                </span>
                <span>•</span>
                <span className="text-purple-700 font-bold">ক্যাটাগরি: {selectedPost.category}</span>
              </div>
            </div>

            {/* External Call To Action Banner/Button (If link exists & showButton enabled) */}
            {shouldShowButton && (
              <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-900 rounded-2xl p-6 text-white shadow-lg space-y-3 relative overflow-hidden border border-emerald-400/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-1">
                    <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/20 inline-block mb-1">
                      🎬 রিসোর্স / ভিডিও লিংক
                    </span>
                    <h3 className="text-lg font-black text-white">
                      সম্পূর্ণ ভিডিও বা কোর্স লিঙ্ক এক্সেস করুন
                    </h3>
                    <p className="text-emerald-100 text-xs max-w-lg">
                      এক্সটার্নাল লিংকের মাধ্যমে সরাসরি পুরো রিসোর্স বা টিউটোরিয়াল ওপেন করতে নিচের বাটনে ক্লিক করুন।
                    </p>
                  </div>

                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-white text-emerald-950 hover:bg-emerald-50 font-black text-sm px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0 border border-emerald-200 hover:scale-105"
                  >
                    <Video className="w-5 h-5 text-emerald-600" />
                    <span>{buttonLabel}</span>
                    <ExternalLink className="w-4 h-4 text-emerald-700" />
                  </a>
                </div>
              </div>
            )}

            {/* Formatted Article Content */}
            <div className="prose prose-purple max-w-none pt-2">
              <h3 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                বিস্তারিত বিবরণ:
              </h3>
              {renderFormattedContent(selectedPost.content)}
            </div>

            {/* Bottom Button Action */}
            {shouldShowButton && (
              <div className="pt-6 border-t border-slate-100 text-center space-y-3">
                <p className="text-xs text-slate-500 font-medium">
                  পোস্টটির সম্পূর্ণ ভিডিও দেখতে নিচের এক্সটার্নাল লিংকে ক্লিক করুন:
                </p>
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer hover:shadow-lg"
                >
                  <Video className="w-5 h-5" />
                  <span>{buttonLabel}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* Related Posts Section ("সম্পর্কিত পোস্ট") */}
          {relatedPosts.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                সম্পর্কিত পোস্টসমূহ (Related Posts)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map((relPost) => (
                  <div
                    key={relPost.id}
                    onClick={() => {
                      setSelectedPost(relPost);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <img
                        src={relPost.image}
                        alt={relPost.title}
                        className="w-full h-32 rounded-xl object-cover mb-3 bg-slate-100"
                      />
                      <div className="mb-2">{getCategoryBadge(relPost.category)}</div>
                      <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-purple-700 transition-colors line-clamp-2 mb-1">
                        {relPost.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold mt-3 pt-2 border-t border-slate-100">
                      <Calendar className="w-3 h-3 text-purple-500" />
                      <span>{relPost.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // LISTING VIEW
  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-6 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Hero Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              ব্লগ ও শিক্ষা রিসোর্স হাব
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              আমাদের ব্লগ ও ফ্রি টিউটোরিয়াল
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              আইটি স্কিলস, ফ্রি কোর্স, নোটিশ এবং নতুন গাইডলাইন পড়ুন এক ক্লিকেই। নিজের ক্যারিয়ারকে এক ধাপ এগিয়ে নিন।
            </p>
          </div>
        </div>

        {/* Filter Bar & Search Input */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Horizontal Category Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {allCategories.map((cat) => (
              <button
                key={String(cat)}
                onClick={() => setSelectedCategory(String(cat))}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory.toLowerCase() === String(cat).toLowerCase()
                    ? 'bg-purple-700 text-white shadow-md shadow-purple-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {String(cat) === 'All' ? 'সব ব্লগ পোস্ট' : String(cat)}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px] sm:min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ব্লগ পোস্ট খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-200 focus:bg-white"
            />
          </div>
        </div>

        {/* Blog Post Grid */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">কোনো ব্লগ পোস্ট পাওয়া যায়নি</h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              আপনার সিলেক্ট করা ফিল্টারের সাথে মিলে এমন কোনো পোস্ট পাওয়া যায়নি।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  setSelectedPost(post);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Cover */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">{getCategoryBadge(post.category)}</div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2.5">
                    <h3 className="font-black text-slate-900 text-base sm:text-lg group-hover:text-purple-700 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed font-normal">
                      {post.excerpt || post.content.replace(/[*#•-]/g, '').substring(0, 120) + '...'}
                    </p>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>{post.date}</span>
                  </div>

                  <span className="font-extrabold text-purple-700 group-hover:underline flex items-center gap-1">
                    পড়ুন
                    <span>→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
