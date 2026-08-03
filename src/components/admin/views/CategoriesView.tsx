import React, { useState } from 'react';
import { Category } from '../../../types';
import {
  Layers, Plus, Trash2, Code, Laptop, Briefcase, Megaphone,
  BookOpen, FileCode, Palette, Sparkles, Layout, GraduationCap,
  Package, Monitor, CheckCircle, Info
} from 'lucide-react';

interface CategoriesViewProps {
  categories: Category[];
  onAddCategory: (cat: Category) => void;
  onDeleteCategory: (id: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ categories, onAddCategory, onDeleteCategory }) => {
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState('GraduationCap');
  const [productType, setProductType] = useState<'Full Course' | 'Simple Product'>('Full Course');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      itemCount: '০ আইটেম',
      iconName,
      color: productType === 'Full Course' ? '#6D28D9' : '#059669',
      bgTint: productType === 'Full Course' ? '#F3E8FF' : '#ECFDF5',
      productType,
      description: description.trim() || undefined,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
    };

    onAddCategory(newCat);
    setName('');
    setDescription('');
    setThumbnailUrl('');
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Categories & Product Types Management</h2>
          <p className="text-xs text-slate-500">নতুন ক্যাটাগরি তৈরি করুন এবং প্রতিটির জন্য Product Type ("Full Course" বা "Simple Product") নির্ধারণ করুন</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Category Form */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-600" /> + Add New Category
            </h3>
            <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-full">
              Category Creator
            </span>
          </div>

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">ক্যাটাগরির নাম (Category Name)</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: ডিজিটাল প্রোডাক্ট, প্রিমিয়াম সফটওয়্যার, ইত্যাদি..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:border-purple-600"
              />
            </div>

            {/* Product Type Selection */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Product Type সিলেক্ট করুন</label>
              <div className="grid grid-cols-1 gap-2">
                <label
                  onClick={() => setProductType('Full Course')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 cursor-pointer transition-all ${
                    productType === 'Full Course'
                      ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-200'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="productType"
                    checked={productType === 'Full Course'}
                    onChange={() => setProductType('Full Course')}
                    className="mt-1 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                      <span>🎓 Full Course</span>
                      <span className="bg-purple-600 text-white text-[9px] px-1.5 py-0.2 rounded font-mono">
                        8 Tabs Form
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      মিডিয়া, রিচ ডেসক্রিপশন, যা শিখবেন, কারিকুলাম, কোর্স ফিচার, ইন্সট্রাক্টর, রিভিউ ও প্রাইসিং এর সম্পূর্ণ ফর্ম
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setProductType('Simple Product')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 cursor-pointer transition-all ${
                    productType === 'Simple Product'
                      ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-200'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="productType"
                    checked={productType === 'Simple Product'}
                    onChange={() => setProductType('Simple Product')}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                      <span>📦 Simple Product</span>
                      <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded font-mono">
                        Light Form
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      ই-বুক, প্রিমিয়াম রিসোর্স, টেমপ্লেট ও সফটওয়্যারের জন্য সহজ ও হালকা ফর্ম (টাইটেল, দাম, ডেসক্রিপশন, ডাউনলোড লিংক)
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">আইকন নির্বাচন (Icon)</label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:border-purple-600 cursor-pointer"
              >
                <option value="GraduationCap">GraduationCap (কোর্স)</option>
                <option value="BookOpen">BookOpen (ই-বুক)</option>
                <option value="Code">Code (প্রোগ্রামিং)</option>
                <option value="FileCode">FileCode (প্রিমিয়াম রিসোর্স)</option>
                <option value="Palette">Palette (ডিজাইন)</option>
                <option value="Sparkles">Sparkles (এআই প্রম্পট)</option>
                <option value="Layout">Layout (টেমপ্লেট)</option>
                <option value="Laptop">Laptop (সফটওয়্যার)</option>
                <option value="Package">Package (ডিজিটাল প্যাকেজ)</option>
                <option value="Monitor">Monitor (উইন্ডোজ অ্যাপ)</option>
                <option value="Briefcase">Briefcase (সার্ভিস/ফ্রি)</option>
                <option value="Megaphone">Megaphone (মার্কেটিং)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">ক্যাটাগরি বিবরণ (Description - optional)</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="সংক্ষিপ্ত বিবরণ লিখুন..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">থাম্বনেইল চিত্র URL (Optional)</label>
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono text-[11px] focus:outline-none focus:border-purple-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold py-3 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Category</span>
            </button>
          </form>
        </div>

        {/* Existing Categories Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">
              বিদ্যমান ক্যাটাগরি তালিকা ({categories.length}টি)
            </h3>
            <span className="text-xs text-slate-500 font-medium"> Product Type অনুযায়ী স্বয়ংক্রিয় ফিল্টার যুক্ত</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => {
              const isFullCourse = (cat.productType || 'Full Course') === 'Full Course';
              return (
                <div
                  key={cat.id}
                  className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs space-y-3 hover:border-purple-200 transition-all relative flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        isFullCourse
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{cat.name}</h4>
                        <span className="text-[11px] text-slate-500 font-medium">{cat.itemCount || '০ আইটেম'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`আপনি কি "${cat.name}" ক্যাটাগরি মুছে ফেলতে চান?`)) {
                          onDeleteCategory(cat.id);
                        }
                      }}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {cat.description && (
                    <p className="text-[11px] text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{cat.description}"
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400 font-mono">Product Type:</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black font-sans flex items-center gap-1 ${
                        isFullCourse
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      <CheckCircle className="w-3 h-3" />
                      {cat.productType || 'Full Course'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

