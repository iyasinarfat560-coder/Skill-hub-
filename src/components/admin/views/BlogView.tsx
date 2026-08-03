import React, { useState } from 'react';
import { BlogPost } from '../../../types';
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  Eye,
  Calendar,
  Search,
  CheckCircle,
  XCircle,
  X,
  Upload,
  Link,
  Bold,
  List,
  Heading,
  Tag,
  Video,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  BookOpen,
  Image as ImageIcon
} from 'lucide-react';

interface BlogViewProps {
  posts: BlogPost[];
  onAddPost: (post: BlogPost) => void;
  onUpdatePost?: (post: BlogPost) => void;
  onDeletePost: (id: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({
  posts,
  onAddPost,
  onUpdatePost,
  onDeletePost,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Free Course');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([
    'Free Course',
    'Notice',
    'Tutorial',
    'Update',
    'Announcement',
    'Programming',
    'Freelancing',
    'Web Development',
  ]);

  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [teraboxLink, setTeraboxLink] = useState('');
  const [showButton, setShowButton] = useState<boolean>(true);
  const [buttonText, setButtonText] = useState('🎬 ভিডিও দেখুন');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');

  // Drag & drop highlight state
  const [isDragging, setIsDragging] = useState(false);

  // Preset Cover Images
  const presetImages = [
    { label: 'Free Course', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600' },
    { label: 'Programming', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600' },
    { label: 'Notice Board', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600' },
    { label: 'Analytics & Tech', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600' },
  ];

  // Open modal for Create
  const handleOpenAdd = () => {
    setEditingPost(null);
    setTitle('');
    setCategory('Free Course');
    setExcerpt('');
    setContent('');
    setImageUrl('https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600');
    setTeraboxLink('');
    setShowButton(true);
    setButtonText('🎬 ভিডিও দেখুন');
    setStatus('Published');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setCategory(post.category);
    setExcerpt(post.excerpt || '');
    setContent(post.content || '');
    setImageUrl(post.image || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600');
    setTeraboxLink(post.teraboxLink || '');
    setShowButton(post.showButton !== undefined ? post.showButton : true);
    setButtonText(post.buttonText || '🎬 ভিডিও দেখুন');
    setStatus(post.status);
    setIsModalOpen(true);
  };

  // Add custom category
  const handleAddCustomCategory = () => {
    if (!customCategoryInput.trim()) return;
    const newCat = customCategoryInput.trim();
    if (!availableCategories.includes(newCat)) {
      setAvailableCategories([...availableCategories, newCat]);
    }
    setCategory(newCat);
    setCustomCategoryInput('');
    setShowCustomCategoryInput(false);
  };

  // File upload reader
  const handleFileUpload = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Formatting helpers for rich text
  const insertFormatting = (prefix: string, suffix: string = '') => {
    setContent((prev) => `${prev}\n${prefix}${suffix}`);
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const postData: BlogPost = {
      id: editingPost ? editingPost.id : `blog-${Date.now()}`,
      title: title.trim(),
      category: category.trim(),
      author: editingPost ? editingPost.author : 'Admin',
      date: editingPost ? editingPost.date : new Date().toISOString().substring(0, 10),
      status,
      excerpt: excerpt.trim() || title.trim(),
      content: content.trim(),
      views: editingPost ? editingPost.views : 0,
      image: imageUrl.trim() || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600',
      teraboxLink: teraboxLink.trim() || undefined,
      showButton,
      buttonText: buttonText.trim() || '🎬 ভিডিও দেখুন',
    };

    if (editingPost && onUpdatePost) {
      onUpdatePost(postData);
    } else {
      onAddPost(postData);
    }

    setIsModalOpen(false);
  };

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const allCategories = Array.from(new Set(['All', ...availableCategories, ...posts.map((p) => p.category)]));

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-900/60 text-purple-300 border border-purple-700/50 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Marketing & SEO
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Total Posts: {posts.length}</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">Blog Posts Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ব্লগ আর্টিকেল তৈরি, সম্পাদন ও কাস্টমারদের জন্য ফ্রি কোর্স / ভিডিও লিংক ম্যানেজ করুন
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm px-5 py-3 rounded-2xl transition-all shadow-lg shadow-purple-950/50 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Post</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ব্লগ টাইটেল বা ক্যাটাগরি দিয়ে খুঁজুন..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'All' ? 'সব ক্যাটাগরি' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider">
                <th className="p-4">Thumbnail & Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Published Date</th>
                <th className="p-4 text-center">Views</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-bold">কোনো ব্লগ পোস্ট পাওয়া যায়নি</p>
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Thumbnail & Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                        />
                        <div>
                          <h4 className="font-black text-white text-sm line-clamp-1">{post.title}</h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {post.excerpt || post.content.substring(0, 70)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                        <Tag className="w-3 h-3 text-purple-400" />
                        {post.category}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      {post.status === 'Published' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                          <XCircle className="w-3 h-3 text-amber-400" />
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-slate-300 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{post.date}</span>
                      </div>
                    </td>

                    {/* Views */}
                    <td className="p-4 text-center font-extrabold text-slate-300">
                      {post.views || 0}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-2">
                      {/* View Preview */}
                      <button
                        onClick={() => setPreviewPost(post)}
                        title="পোস্ট প্রিভিউ দেখুন"
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenEdit(post)}
                        title="সম্পাদনা করুন"
                        className="p-2 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 rounded-xl transition-colors cursor-pointer border border-indigo-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি "${post.title}" ব্লগ পোস্টটি ডিলিট করতে চান?`)) {
                            onDeletePost(post.id);
                          }
                        }}
                        title="মুছে ফেলুন"
                        className="p-2 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-xl transition-colors cursor-pointer border border-rose-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    পোস্টের বিস্তারিত তথ্য এবং কোর্স লিংক ফিল্ড পূরণ করুন
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              
              {/* Title */}
              <div className="space-y-1">
                <label className="block text-slate-200 font-extrabold">
                  Article Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. ফ্রি কোর্স: HTML & CSS ফুল ক্র্যাশ কোর্স ২০২৬"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs font-semibold focus:outline-hidden focus:border-purple-500"
                />
              </div>

              {/* Cover Image Upload / URL & Presets */}
              <div className="space-y-2">
                <label className="block text-slate-200 font-extrabold flex items-center justify-between">
                  <span>Cover Image (কভার ইমেজ)</span>
                  <span className="text-[10px] text-slate-400">URL বা ড্র্যাগ এন্ড ড্রপ</span>
                </label>

                {/* Drag and drop zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                    isDragging
                      ? 'border-purple-500 bg-purple-950/30'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Preview Box */}
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-24 h-16 rounded-xl object-cover bg-slate-900 border border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-24 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-6 h-6 text-slate-600" />
                      </div>
                    )}

                    <div className="flex-1 text-left space-y-1">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-hidden focus:border-purple-500"
                      />

                      <div className="flex items-center gap-2 pt-1">
                        <label className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold cursor-pointer border border-slate-700">
                          <Upload className="w-3 h-3 text-purple-400" />
                          <span>ডিভাইস থেকে ইমেজ আপলোড করুন</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
                    <span className="text-[10px] font-bold text-slate-500 shrink-0">প্রিসেট থাম্বনেইল:</span>
                    {presetImages.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageUrl(preset.url)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500 text-[10px] font-bold text-slate-300 shrink-0 cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Dropdown + Add Custom Category */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-200 font-extrabold">Category (ক্যাটাগরি)</label>
                  <button
                    type="button"
                    onClick={() => setShowCustomCategoryInput(!showCustomCategoryInput)}
                    className="text-[11px] font-bold text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ নতুন ক্যাটাগরি যোগ করুন</span>
                  </button>
                </div>

                {showCustomCategoryInput ? (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      placeholder="নতুন ক্যাটাগরির নাম (e.g. Announcement)..."
                      className="flex-1 bg-slate-950 border border-purple-800 rounded-xl p-2.5 text-xs text-white focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomCategory}
                      className="px-3 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs font-semibold focus:outline-hidden focus:border-purple-500"
                  >
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Short Excerpt */}
              <div className="space-y-1">
                <label className="block text-slate-200 font-extrabold">
                  Short Excerpt (সংক্ষিপ্ত সামারি)
                </label>
                <input
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="ব্লগ লিস্টে কার্ডের নিচে দেখানোর জন্য ২-৩ লাইনের সারাংশ..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-hidden"
                />
              </div>

              {/* Rich Text Editor Toolbar & Content */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-200 font-extrabold">Content (বিস্তারিত তথ্য)</label>
                  
                  {/* Editor Quick Format Toolbar */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**')}
                      title="Bold text"
                      className="p-1 hover:bg-slate-800 rounded-md text-slate-300 cursor-pointer"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('### ')}
                      title="Heading 3"
                      className="p-1 hover:bg-slate-800 rounded-md text-slate-300 cursor-pointer"
                    >
                      <Heading className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('• ')}
                      title="Bullet point"
                      className="p-1 hover:bg-slate-800 rounded-md text-slate-300 cursor-pointer"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="ব্লগের বিস্তারিত লেখা, টিউটোরিয়াল স্টেপস ও প্যারাগ্রাফ লিখুন..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs font-medium leading-relaxed focus:outline-hidden focus:border-purple-500 custom-scrollbar"
                />
              </div>

              {/* External Link Section (Course / Video Link - Terabox etc.) */}
              <div className="bg-slate-950/80 border border-emerald-900/50 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-extrabold text-emerald-300 text-xs">
                    Course / Video Link (Terabox ইত্যাদি এক্সটার্নাল লিংক)
                  </h4>
                </div>

                {/* Terabox Link Input */}
                <div>
                  <input
                    type="url"
                    value={teraboxLink}
                    onChange={(e) => setTeraboxLink(e.target.value)}
                    placeholder="https://www.terabox.com/s/1_example_link..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    এখানে লিংক দিলে কাস্টমার সাইটে কাস্টম বাটন প্রদর্শিত হবে।
                  </p>
                </div>

                {/* Show Button Toggle & Button Text Field */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  {/* Toggle */}
                  <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-xs font-extrabold text-slate-200">Show as button on post</span>
                    <button
                      type="button"
                      onClick={() => setShowButton(!showButton)}
                      className={`p-1 rounded-xl transition-colors cursor-pointer ${
                        showButton ? 'text-emerald-400' : 'text-slate-600'
                      }`}
                    >
                      {showButton ? (
                        <ToggleRight className="w-7 h-7" />
                      ) : (
                        <ToggleLeft className="w-7 h-7" />
                      )}
                    </button>
                  </div>

                  {/* Custom Button Text */}
                  <div>
                    <input
                      type="text"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      placeholder="বাটনের টেক্সট (e.g. 🎬 ভিডিও দেখুন)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Status Switch (Published vs Draft) */}
              <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <div>
                  <span className="block text-xs font-extrabold text-white">Post Status (পাবলিশ স্ট্যাটাস)</span>
                  <span className="text-[10px] text-slate-400">
                    Draft মোডে থাকলে কাস্টমার ওয়েবসাইটে এটি দেখাবে না
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('Published')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      status === 'Published'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Published
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus('Draft')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      status === 'Draft'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Draft
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-950/50 cursor-pointer"
                >
                  {editingPost ? 'Update Post' : 'Publish Post'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW MODAL */}
      {previewPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">
                Live Public Preview
              </span>
              <button
                onClick={() => setPreviewPost(null)}
                className="p-1.5 text-slate-500 hover:text-slate-900 rounded-xl bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Cover */}
            <div className="relative rounded-2xl overflow-hidden max-h-72 bg-slate-900">
              <img src={previewPost.image} alt={previewPost.title} className="w-full h-full object-cover min-h-[200px]" />
            </div>

            <div className="space-y-3">
              <span className="inline-block bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {previewPost.category}
              </span>
              <h2 className="text-2xl font-black text-slate-900 leading-snug">{previewPost.title}</h2>
              <div className="text-xs text-slate-500 font-medium">
                পাবলিশের তারিখ: {previewPost.date} • ভিউ: {previewPost.views}
              </div>
            </div>

            {/* Button Preview if teraboxLink */}
            {previewPost.teraboxLink && previewPost.showButton !== false && (
              <div className="bg-emerald-600 text-white p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">ভিডিও লেকচার লিংক</h4>
                  <p className="text-xs text-emerald-100">কাস্টমার সাইটে দেখানো বাটন</p>
                </div>
                <a
                  href={previewPost.teraboxLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-emerald-900 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Video className="w-4 h-4 text-emerald-600" />
                  <span>{previewPost.buttonText || '🎬 ভিডিও দেখুন'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                </a>
              </div>
            )}

            <div className="bg-slate-50 p-5 rounded-2xl text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
              {previewPost.content}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
