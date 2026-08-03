import React, { useState, useMemo } from 'react';
import { Bundle, Course } from '../../../types';
import {
  Package,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  Calendar,
  DollarSign,
  Percent,
  Layers,
  X,
  Check,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Info,
  Upload,
  Image as ImageIcon,
  ShoppingBag,
  Clock,
  Filter,
} from 'lucide-react';

interface AdminBundlesViewProps {
  bundles: Bundle[];
  products: Course[];
  onAddBundle: (bundle: Bundle) => void;
  onUpdateBundle: (bundle: Bundle) => void;
  onDeleteBundle: (id: string) => void;
}

export const AdminBundlesView: React.FC<AdminBundlesViewProps> = ({
  bundles,
  products,
  onAddBundle,
  onUpdateBundle,
  onDeleteBundle,
}) => {
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBundleId, setEditingBundleId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [bundlePrice, setBundlePrice] = useState<number>(999);
  const [discountPercent, setDiscountPercent] = useState<number>(40);
  const [pricingMode, setPricingMode] = useState<'manual_price' | 'discount_percent'>('manual_price');
  const [expiryDate, setExpiryDate] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');

  // Product selector search in modal
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Compute calculated original total price of selected products
  const computedOriginalPrice = useMemo(() => {
    return selectedProductIds.reduce((sum, id) => {
      const prod = products.find((p) => p.id === id);
      if (!prod) return sum;
      // use discount price if available, else original price
      return sum + (prod.discountPrice || prod.originalPrice || 0);
    }, 0);
  }, [selectedProductIds, products]);

  // Compute calculated savings percentage
  const calculatedSavingsPercentage = useMemo(() => {
    if (computedOriginalPrice <= 0 || bundlePrice >= computedOriginalPrice) return 0;
    return Math.round(((computedOriginalPrice - bundlePrice) / computedOriginalPrice) * 100);
  }, [computedOriginalPrice, bundlePrice]);

  // When bundlePrice changes in manual mode
  const handleBundlePriceChange = (val: number) => {
    setBundlePrice(val);
    if (computedOriginalPrice > 0) {
      const perc = Math.round(((computedOriginalPrice - val) / computedOriginalPrice) * 100);
      setDiscountPercent(Math.max(0, perc));
    }
  };

  // When discountPercent changes in percent mode
  const handleDiscountPercentChange = (val: number) => {
    setDiscountPercent(val);
    if (computedOriginalPrice > 0) {
      const calculatedPrice = Math.round(computedOriginalPrice * (1 - val / 100));
      setBundlePrice(Math.max(0, calculatedPrice));
    }
  };

  // Toggle product selection in modal
  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) => {
      let updated: string[];
      if (prev.includes(productId)) {
        updated = prev.filter((id) => id !== productId);
      } else {
        updated = [...prev, productId];
      }

      // Auto update price if in discount % mode
      const newOriginal = updated.reduce((sum, id) => {
        const prod = products.find((p) => p.id === id);
        return sum + (prod?.discountPrice || prod?.originalPrice || 0);
      }, 0);

      if (pricingMode === 'discount_percent' && newOriginal > 0) {
        const calculatedPrice = Math.round(newOriginal * (1 - discountPercent / 100));
        setBundlePrice(calculatedPrice);
      }

      return updated;
    });
  };

  // Reset form
  const resetForm = () => {
    setEditingBundleId(null);
    setTitle('');
    setCoverImage('');
    setDescription('');
    setSelectedProductIds([]);
    setBundlePrice(999);
    setDiscountPercent(40);
    setPricingMode('manual_price');
    setExpiryDate('');
    setStatus('Active');
    setProductSearchQuery('');
  };

  // Open modal for editing
  const handleEdit = (bundle: Bundle) => {
    setEditingBundleId(bundle.id);
    setTitle(bundle.title);
    setCoverImage(bundle.coverImage || '');
    setDescription(bundle.description);
    setSelectedProductIds(bundle.productIds || []);
    setBundlePrice(bundle.bundlePrice);
    setDiscountPercent(bundle.savingsPercentage || 0);
    setExpiryDate(bundle.expiryDate || '');
    setStatus(bundle.status);
    setIsModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('অনুগ্রহ করে বান্ডেলের নাম বা শিরোনাম লিখুন।');
      return;
    }
    if (selectedProductIds.length < 2) {
      alert('বান্ডেল অফার তৈরির জন্য অন্তত ২টা বা তার বেশি প্রোডাক্ট সিলেক্ট করুন।');
      return;
    }

    const savings = calculatedSavingsPercentage;

    const bundleData: Bundle = {
      id: editingBundleId || `bundle-${Date.now()}`,
      title: title.trim(),
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
      description: description.trim(),
      productIds: selectedProductIds,
      originalTotalPrice: computedOriginalPrice,
      bundlePrice: Number(bundlePrice),
      savingsPercentage: savings,
      expiryDate: expiryDate || undefined,
      status: status,
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (editingBundleId) {
      onUpdateBundle(bundleData);
    } else {
      onAddBundle(bundleData);
    }

    setIsModalOpen(false);
    resetForm();
  };

  // Filtered bundles list
  const filteredBundles = useMemo(() => {
    return bundles.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bundles, searchQuery, statusFilter]);

  // Filtered products list for product selector in modal
  const filteredProductsForSelector = useMemo(() => {
    return products.filter((p) => {
      return (
        p.title.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearchQuery.toLowerCase())
      );
    });
  }, [products, productSearchQuery]);

  // Top statistics
  const totalBundlesCount = bundles.length;
  const activeBundlesCount = bundles.filter((b) => b.status === 'Active').length;
  const avgSavings =
    bundles.length > 0
      ? Math.round(bundles.reduce((acc, b) => acc + (b.savingsPercentage || 0), 0) / bundles.length)
      : 0;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-purple-500/30 text-purple-200 text-[11px] font-extrabold px-3 py-1 rounded-full border border-purple-400/30">
              কম্বো ও অফার ম্যানেজমেন্ট
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              {activeBundlesCount} Active Deals
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            বান্ডেল অফারসমূহ (Bundle Offers)
          </h2>
          <p className="text-xs text-purple-200/80 max-w-xl">
            একাধিক কোর্স বা প্রোডাক্ট একসাথে প্যাকেজ করে বিশেষ ছাড় বা ডিসকাউন্টে বিক্রি করুন।
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-5 py-3 rounded-2xl text-xs shadow-lg shadow-purple-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-105 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন বান্ডেল তৈরি করুন</span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">মোট বান্ডেল অফার</span>
            <span className="text-2xl font-black text-slate-900">{totalBundlesCount} টি</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">সক্রিয় অফারসমূহ</span>
            <span className="text-2xl font-black text-emerald-600">{activeBundlesCount} টি</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">গড় ছাড়ের হার</span>
            <span className="text-2xl font-black text-indigo-600">{avgSavings}% OFF</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Percent className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="বান্ডেল নাম বা বিবরণ দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-purple-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600">স্ট্যাটাস:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="all">সব বান্ডেল (All)</option>
            <option value="Active">Active (সক্রিয়)</option>
            <option value="Inactive">Inactive (নিষ্ক্রিয়)</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">বান্ডেল নাম ও কভার</th>
                <th className="py-3.5 px-4">অন্তর্ভুক্ত প্রোডাক্টসমূহ</th>
                <th className="py-3.5 px-4">মোট মূল দাম</th>
                <th className="py-3.5 px-4">বান্ডেল দাম</th>
                <th className="py-3.5 px-4">ছাড়ের %</th>
                <th className="py-3.5 px-4">স্ট্যাটাস</th>
                <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBundles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Package className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-extrabold text-sm text-slate-600">কোনো বান্ডেল অফার পাওয়া যায়নি</p>
                    <p className="text-xs text-slate-400 mt-0.5">নতুন বান্ডেল তৈরি করতে উপরের বাটনে ক্লিক করুন</p>
                  </td>
                </tr>
              ) : (
                filteredBundles.map((bundle) => {
                  const includedProducts = (bundle.productIds || [])
                    .map((id) => products.find((p) => p.id === id))
                    .filter(Boolean) as Course[];

                  return (
                    <tr key={bundle.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Bundle Title & Cover */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={bundle.coverImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600'}
                            alt={bundle.title}
                            className="w-14 h-10 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                          />
                          <div>
                            <span className="font-extrabold text-slate-900 text-xs block max-w-xs line-clamp-1">
                              {bundle.title}
                            </span>
                            {bundle.expiryDate && (
                              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-mono inline-block mt-0.5">
                                মেয়াদ: {bundle.expiryDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Included Items */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="font-mono text-[10px] font-extrabold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md inline-block">
                            {includedProducts.length} টি প্রোডাক্ট
                          </span>
                          <div className="flex flex-wrap items-center gap-1 max-w-xs">
                            {includedProducts.slice(0, 2).map((p) => (
                              <span
                                key={p.id}
                                className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded truncate max-w-[130px]"
                                title={p.title}
                              >
                                • {p.title}
                              </span>
                            ))}
                            {includedProducts.length > 2 && (
                              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                                +{includedProducts.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Total Regular Price */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-500 line-through">
                        ৳{bundle.originalTotalPrice}
                      </td>

                      {/* Bundle Offer Price */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-black text-emerald-700 text-sm bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                          ৳{bundle.bundlePrice}
                        </span>
                      </td>

                      {/* Savings % */}
                      <td className="py-3.5 px-4">
                        <span className="bg-purple-600 text-white font-mono font-black text-[11px] px-2.5 py-0.5 rounded-lg shadow-2xs">
                          {bundle.savingsPercentage}% OFF
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 w-fit ${
                            bundle.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 text-slate-600 border border-slate-300'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              bundle.status === 'Active' ? 'bg-emerald-600' : 'bg-slate-400'
                            }`}
                          />
                          {bundle.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(bundle)}
                            className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Bundle"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`আপনি কি সত্যিই "${bundle.title}" বান্ডেলটি মুছে ফেলতে চান?`)) {
                                onDeleteBundle(bundle.id);
                              }
                            }}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Bundle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT BUNDLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base">
                    {editingBundleId ? 'বান্ডেল অফার সম্পাদনা (Edit Bundle)' : 'নতুন বান্ডেল অফার তৈরি করুন'}
                  </h3>
                  <p className="text-[11px] text-purple-200">
                    একাধিক প্রোডাক্ট নির্বাচন করে আকর্ষণীয় ডিসকাউন্ট সেট করুন
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-2 text-purple-200 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs bg-slate-50/50">
              
              {/* 1. Basic Info */}
              <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200">
                <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 text-purple-600" />
                  ১. বান্ডেলের মৌলিক তথ্য (Basic Details)
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">
                      বান্ডেল এর নাম / শিরোনাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="যেমন: Web Dev + Digital Marketing Combo Offer"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium text-xs focus:outline-none focus:border-purple-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">
                      সংক্ষিপ্ত বিবরণ (Short Description)
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="এই বান্ডেলে কী কী পাবেন এবং কেন কিনবেন..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  {/* Cover Image Upload / URL */}
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">
                      বান্ডেল কভার ইমেজ (URL / Upload)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono text-xs focus:outline-none focus:border-purple-600"
                      />
                      <label className="px-3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>আপলোড</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              setCoverImage(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>
                    </div>

                    {coverImage && (
                      <div className="mt-2 w-full h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                        <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 bg-slate-900/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                          Preview
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. PRODUCT SELECTOR (MULTI-SELECT CHECKBOX LIST) */}
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    ২. প্রোডাক্ট নির্বাচন (অন্তত ২ বা তার বেশি কোর্স/প্রোডাক্ট) <span className="text-rose-500">*</span>
                  </h4>

                  <span className="px-2.5 py-1 bg-purple-100 text-purple-900 font-mono font-bold rounded-lg text-[11px]">
                    {selectedProductIds.length} টি সিলেক্ট করা হয়েছে
                  </span>
                </div>

                {/* Product Search inside Selector */}
                <div className="relative">
                  <input
                    type="text"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    placeholder="তালিকা থেকে কোর্স বা প্রোডাক্ট খুঁজুন..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* Scrollable Checkbox List */}
                <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50/50 p-1 custom-scrollbar">
                  {filteredProductsForSelector.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs">
                      কোনো প্রোডাক্ট পাওয়া যায়নি
                    </div>
                  ) : (
                    filteredProductsForSelector.map((product) => {
                      const isSelected = selectedProductIds.includes(product.id);
                      const priceToShow = product.discountPrice || product.originalPrice || 0;

                      return (
                        <label
                          key={product.id}
                          onClick={() => toggleProductSelection(product.id)}
                          className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-purple-50 border border-purple-200 shadow-2xs'
                              : 'hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // handled by label onClick
                              className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
                            />
                            <img
                              src={product.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200'}
                              alt={product.title}
                              className="w-10 h-8 rounded-lg object-cover bg-slate-200"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block text-xs line-clamp-1">
                                {product.title}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {product.category}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono font-bold text-slate-900 text-xs block">
                              ৳{priceToShow}
                            </span>
                            {product.originalPrice > priceToShow && (
                              <span className="text-[10px] text-slate-400 line-through font-mono">
                                ৳{product.originalPrice}
                              </span>
                            )}
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>

                {/* Selected Products Preview Chips */}
                {selectedProductIds.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-500 block w-full">
                      সিলেক্টেড আইটেমসমূহ:
                    </span>
                    {selectedProductIds.map((id) => {
                      const prod = products.find((p) => p.id === id);
                      if (!prod) return null;
                      return (
                        <span
                          key={id}
                          className="bg-purple-100 text-purple-900 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 border border-purple-200"
                        >
                          <span>{prod.title}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleProductSelection(id);
                            }}
                            className="text-purple-600 hover:text-purple-900 cursor-pointer"
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. PRICING & SAVINGS CALCULATOR */}
              <div className="space-y-3 bg-purple-50/70 p-4 rounded-2xl border border-purple-200">
                <h4 className="font-extrabold text-purple-950 text-xs flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                  ৩. দাম ও ডিসকাউন্ট ক্যালকুলেটর (Pricing & Savings)
                </h4>

                {/* Auto Calculated Sum Display */}
                <div className="p-3 bg-white rounded-xl border border-purple-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                      সিলেক্ট করা প্রোডাক্টগুলোর মোট মূল দাম (Auto Calculated Sum)
                    </span>
                    <span className="text-sm font-black text-slate-900 font-mono">
                      ৳{computedOriginalPrice}
                    </span>
                  </div>

                  <span className="text-[11px] text-purple-700 bg-purple-100 px-2.5 py-1 rounded-lg font-bold">
                    {selectedProductIds.length} টি আইটেম যোগ হয়েছে
                  </span>
                </div>

                {/* Pricing Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">
                      বান্ডেল অফার প্রাইস (অ্যাডমিন সেট করবে) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={bundlePrice}
                        onChange={(e) => handleBundlePriceChange(Number(e.target.value))}
                        placeholder="৯৯৯"
                        className="w-full bg-white border border-purple-200 rounded-xl p-2.5 pl-8 text-slate-900 font-mono font-bold text-xs focus:outline-none focus:border-purple-600"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-extrabold text-slate-400">৳</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">
                      অথবা ছাড়ের শতকরা % দিন (Auto Calculates Price)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={discountPercent}
                        onChange={(e) => handleDiscountPercentChange(Number(e.target.value))}
                        placeholder="৫০"
                        className="w-full bg-white border border-purple-200 rounded-xl p-2.5 pl-8 text-slate-900 font-mono font-bold text-xs focus:outline-none focus:border-purple-600"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-extrabold text-slate-400">%</span>
                    </div>
                  </div>
                </div>

                {/* Calculated Deal Summary Banner */}
                <div className="p-3 bg-emerald-600 text-white rounded-xl flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="font-bold text-xs">কাস্টমার সেভিংস প্রিভিউ:</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-xs">
                      সঞ্চয়: <b>৳{Math.max(0, computedOriginalPrice - bundlePrice)}</b>
                    </span>
                    <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black text-xs">
                      {calculatedSavingsPercentage}% OFF
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. EXPIRY DATE & STATUS TOGGLE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-slate-800 font-extrabold mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>অফারের মেয়াদ / এক্সপায়ারি ডেট (ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-extrabold mb-1">
                    স্ট্যাটাস টগল (Active / Inactive)
                  </label>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setStatus('Active')}
                      className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        status === 'Active'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Active (সক্রিয়)
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('Inactive')}
                      className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        status === 'Inactive'
                          ? 'bg-slate-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Inactive (নিষ্ক্রিয়)
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Controls */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  বাতিল করুন
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold shadow-md shadow-purple-200 cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingBundleId ? 'পরিবর্তন সংরক্ষণ করুন' : 'বান্ডেল সেভ ও পাবলিশ করুন'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
