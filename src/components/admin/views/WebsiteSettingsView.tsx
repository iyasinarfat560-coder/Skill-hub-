import React, { useState } from 'react';
import { WebsiteSettingsData, Category } from '../../../types';
import { Layout, Save, CheckCircle2, Plus, Trash2, Layers } from 'lucide-react';
import { CATEGORIES } from '../../../data/mockData';

interface WebsiteSettingsViewProps {
  settings: WebsiteSettingsData;
  onSave: (settings: WebsiteSettingsData) => void;
}

export const WebsiteSettingsView: React.FC<WebsiteSettingsViewProps> = ({ settings, onSave }) => {
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle);
  const [bannerNotice, setBannerNotice] = useState(settings.bannerNotice);
  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl);
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl);
  const [footerText, setFooterText] = useState(settings.footerText);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Quick Category Manager State
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [newCatName, setNewCatName] = useState('');
  const [newCatCount, setNewCatCount] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName,
      itemCount: newCatCount || '১০+ আইটেম',
      iconName: 'GraduationCap',
      color: '#7C3AED',
      bgTint: '#F5F3FF',
    };

    setCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatCount('');
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ heroTitle, heroSubtitle, bannerNotice, facebookUrl, youtubeUrl, footerText });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Website Front-End Customization</h2>
          <p className="text-xs text-slate-400">হোমপেজ হিরো সেকশন টেক্সট, ব্যানার নোটিশ, সোশ্যাল মিডিয়া ও ক্যাটাগরি ম্যানেজমেন্ট</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 p-4 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>ওয়েবসাইট কন্টেন্ট সফলভাবে আপডেট করা হয়েছে!</span>
        </div>
      )}

      {/* Hero & Banner Editor */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg space-y-4 text-xs">
        <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-2">
          <Layout className="w-4 h-4 text-purple-400" /> Hero & Banner Notice Settings
        </h3>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Homepage Hero Title</label>
          <input
            type="text"
            required
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none font-bold"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Homepage Subtitle Description</label>
          <textarea
            rows={2}
            required
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Top Announcement Notice Text</label>
          <input
            type="text"
            value={bannerNotice}
            onChange={(e) => setBannerNotice(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Facebook Page URL</label>
            <input
              type="text"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">YouTube Channel URL</label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Footer Copyright Text</label>
          <input
            type="text"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Front-End Changes
        </button>
      </form>

      {/* Category Management Section */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg space-y-4 text-xs">
        <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-2">
          <Layers className="w-4 h-4 text-purple-400" /> Homepage Categories Management
        </h3>

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="নতুন ক্যাটাগরির নাম (যেমন: ডাটা সায়েন্স)..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
          />
          <input
            type="text"
            placeholder="আইটেম গণনা (যেমন: ২৫+ কোর্স)..."
            value={newCatCount}
            onChange={(e) => setNewCatCount(e.target.value)}
            className="w-full sm:w-48 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </form>

        {/* Category List Pills/Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-white block">{cat.name}</span>
                <span className="text-[11px] text-slate-400">{cat.itemCount}</span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteCategory(cat.id)}
                className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
