import React, { useState, useMemo } from 'react';
import { Coupon, Course } from '../../../types';
import {
  Tag,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Wand2,
  Search,
  Edit3,
  Copy,
  Check,
  ToggleLeft,
  ToggleRight,
  Percent,
  DollarSign,
  Layers,
  Filter,
  X,
  Users,
  Clock,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface CouponsViewProps {
  coupons: Coupon[];
  products?: Course[];
  onAddCoupon: (coupon: Coupon) => void;
  onUpdateCoupon?: (coupon: Coupon) => void;
  onDeleteCoupon: (id: string) => void;
}

export const CouponsView: React.FC<CouponsViewProps> = ({
  coupons,
  products = [],
  onAddCoupon,
  onUpdateCoupon,
  onDeleteCoupon,
}) => {
  // Form State
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(300);
  const [applicableScope, setApplicableScope] = useState<'all' | 'specific'>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [perUserLimit, setPerUserLimit] = useState<number>(1);
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [isActive, setIsActive] = useState<boolean>(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Expired' | 'Inactive'>('all');

  // Multi-select dropdown toggle UI state
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Auto Generate Smart Promo Code
  const handleAutoGenerate = () => {
    const prefixes = ['SKILLS', 'PROMO', 'EID', 'DISCOUNT', 'SPECIAL', 'LEARN', 'DEAL'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90);
    setCode(`${randomPrefix}${randomNum}`);
  };

  // Copy code to clipboard
  const handleCopyCode = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Reset Form
  const resetForm = () => {
    setEditingCouponId(null);
    setCode('');
    setDiscountType('percentage');
    setDiscountValue(20);
    setMinOrderAmount(300);
    setApplicableScope('all');
    setSelectedProducts([]);
    setPerUserLimit(1);
    setUsageLimit(100);
    setStartDate(new Date().toISOString().split('T')[0]);
    setExpiryDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setIsActive(true);
    setIsProductDropdownOpen(false);
  };

  // Populate Form for Editing
  const handleStartEdit = (cpn: Coupon) => {
    setEditingCouponId(cpn.id);
    setCode(cpn.code);
    setDiscountType(cpn.discountType);
    setDiscountValue(cpn.discountValue);
    setMinOrderAmount(cpn.minOrderAmount || 0);
    
    if (cpn.applicableProducts && cpn.applicableProducts.length > 0 && !cpn.applicableProducts.includes('all')) {
      setApplicableScope('specific');
      setSelectedProducts(cpn.applicableProducts);
    } else {
      setApplicableScope('all');
      setSelectedProducts([]);
    }

    setPerUserLimit(cpn.perUserLimit || 1);
    setUsageLimit(cpn.usageLimit || 100);
    setStartDate(cpn.startDate || new Date().toISOString().split('T')[0]);
    setExpiryDate(cpn.expiryDate || new Date().toISOString().split('T')[0]);
    setIsActive(cpn.status === 'Active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle specific product selection in multi-select
  const handleToggleProductSelect = (productTitle: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productTitle) ? prev.filter((p) => p !== productTitle) : [...prev, productTitle]
    );
  };

  // Save / Update Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const formattedCode = code.toUpperCase().trim();
    const finalProducts = applicableScope === 'all' ? ['all'] : selectedProducts.length > 0 ? selectedProducts : ['all'];
    const finalStatus = isActive ? 'Active' : 'Inactive';

    if (editingCouponId && onUpdateCoupon) {
      // Update existing coupon
      const updatedCoupon: Coupon = {
        id: editingCouponId,
        code: formattedCode,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount),
        applicableProducts: finalProducts,
        perUserLimit: Number(perUserLimit),
        usageLimit: Number(usageLimit),
        usedCount: coupons.find((c) => c.id === editingCouponId)?.usedCount || 0,
        startDate,
        expiryDate,
        status: finalStatus,
      };
      onUpdateCoupon(updatedCoupon);
    } else {
      // Create new coupon
      const newCoupon: Coupon = {
        id: `cpn-${Date.now()}`,
        code: formattedCode,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount),
        applicableProducts: finalProducts,
        perUserLimit: Number(perUserLimit),
        usageLimit: Number(usageLimit),
        usedCount: 0,
        startDate,
        expiryDate,
        status: finalStatus,
      };
      onAddCoupon(newCoupon);
    }

    resetForm();
  };

  // Filtered coupons list
  const filteredCoupons = useMemo(() => {
    return coupons.filter((cpn) => {
      const matchesSearch =
        searchQuery === '' ||
        cpn.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cpn.applicableProducts && cpn.applicableProducts.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'Active' && cpn.status === 'Active') ||
        (statusFilter === 'Expired' && cpn.status === 'Expired') ||
        (statusFilter === 'Inactive' && (cpn.status === 'Inactive' || cpn.status === 'Disabled'));

      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchQuery, statusFilter]);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalCount = coupons.length;
    const activeCount = coupons.filter((c) => c.status === 'Active').length;
    const totalUsed = coupons.reduce((acc, c) => acc + (c.usedCount || 0), 0);
    const expiredCount = coupons.filter((c) => c.status === 'Expired').length;
    return { totalCount, activeCount, totalUsed, expiredCount };
  }, [coupons]);

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-900/60 text-purple-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-purple-700/50 flex items-center gap-1">
              <Tag className="w-3 h-3 text-purple-400" /> Promo & Coupon Engine
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            কুপন ও ডিসকাউন্ট কোড ম্যানেজমেন্ট
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            নতুন কুপন তৈরি, নির্দিষ্ট কোর্স নির্বাচন, ব্যবহার লিমিট ও মেয়াদের মেয়াদ নির্ধারণ করুন
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetForm}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন কুপন তৈরি করুন</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-3 bg-purple-950 text-purple-400 rounded-xl border border-purple-800/50">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400">মোট কুপন কোড</p>
            <p className="text-xl font-black text-white">{stats.totalCount}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800/50">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400">অ্যাক্টিভ কুপন</p>
            <p className="text-xl font-black text-emerald-400">{stats.activeCount}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-3 bg-blue-950 text-blue-400 rounded-xl border border-blue-800/50">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400">মোট ব্যাবহার হয়েছে</p>
            <p className="text-xl font-black text-blue-400">{stats.totalUsed} বার</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-3 bg-rose-950 text-rose-400 rounded-xl border border-rose-800/50">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400">মেয়াদউত্তীর্ণ কুপন</p>
            <p className="text-xl font-black text-rose-400">{stats.expiredCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create / Edit Coupon Form */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg space-y-5 h-fit">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              {editingCouponId ? 'কুপন আপডেট করুন' : 'নতুন কুপন এন্ট্রি'}
            </h3>
            <button
              type="button"
              onClick={handleAutoGenerate}
              className="text-[11px] font-bold text-purple-300 hover:text-white bg-purple-950/80 border border-purple-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              title="অটোমেটিক কুপন কোড তৈরি করুন"
            >
              <Wand2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Auto Generate</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Coupon Code */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                কুপন কোড (Coupon Code) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="যেমন: EID50 বা SKILLS20"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono font-black tracking-widest text-sm uppercase focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Discount Type & Value */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">ডিসকাউন্ট টাইপ</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Fixed Amount (৳)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  ডিসকাউন্ট ভ্যালু {discountType === 'percentage' ? '(%)' : '(৳)'}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Minimum Order Amount */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                ন্যূনতম অর্ডার পরিমাণ (৳) <span className="text-slate-500 font-normal">(ঐচ্ছিক)</span>
              </label>
              <input
                type="number"
                min="0"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                placeholder="0 = কোনো ন্যূনতম সীমাবদ্ধতা নেই"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Applicable Products Choice */}
            <div className="space-y-2">
              <label className="block text-slate-300 font-semibold">প্রযোজ্য প্রোডাক্ট / কোর্স</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setApplicableScope('all');
                    setSelectedProducts([]);
                    setIsProductDropdownOpen(false);
                  }}
                  className={`py-2 px-3 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                    applicableScope === 'all'
                      ? 'bg-purple-950 border-purple-600 text-purple-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  All Products
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setApplicableScope('specific');
                    setIsProductDropdownOpen(true);
                  }}
                  className={`py-2 px-3 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                    applicableScope === 'specific'
                      ? 'bg-purple-950 border-purple-600 text-purple-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Specific Course(s)
                </button>
              </div>

              {/* Multi-Select Dropdown for Specific Courses */}
              {applicableScope === 'specific' && (
                <div className="relative pt-1">
                  <button
                    type="button"
                    onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-left text-slate-200 flex items-center justify-between cursor-pointer focus:outline-none"
                  >
                    <span className="truncate">
                      {selectedProducts.length === 0
                        ? 'কোর্স সিলেক্ট করুন (Multi-select)'
                        : `${selectedProducts.length} টি কোর্স সিলেক্টেড`}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isProductDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProductDropdownOpen && (
                    <div className="absolute z-20 left-0 right-0 mt-1 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-3 max-h-48 overflow-y-auto space-y-2 animate-fade-in">
                      <p className="text-[10px] text-purple-300 font-bold border-b border-slate-800 pb-1">
                        নিচের কোর্সগুলোতে টিক চিহ্ন দিন:
                      </p>
                      {products.length === 0 ? (
                        <p className="text-slate-500 text-center py-2">কোনো কোর্স পাওয়া যায়নি</p>
                      ) : (
                        products.map((p) => {
                          const isChecked = selectedProducts.includes(p.title);
                          return (
                            <label
                              key={p.id}
                              className={`flex items-center gap-2.5 p-2 rounded-xl text-xs cursor-pointer hover:bg-slate-900 transition-colors ${
                                isChecked ? 'bg-purple-950/60 text-purple-200 font-semibold' : 'text-slate-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleProductSelect(p.title)}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-0 cursor-pointer"
                              />
                              <span className="truncate">{p.title}</span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* Badges of selected products */}
                  {selectedProducts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {selectedProducts.map((title) => (
                        <span
                          key={title}
                          className="bg-purple-900/50 border border-purple-700/60 text-purple-200 text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1"
                        >
                          <span className="truncate max-w-[120px]">{title}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleProductSelect(title)}
                            className="hover:text-rose-300 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Usage Limits */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">প্রতি ইউজারের সীমা</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={perUserLimit}
                  onChange={(e) => setPerUserLimit(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">সর্বমোট কুপন সীমা</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Date Range Picker */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">মেয়াদ শুরু</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">মেয়াদ শেষ (Expiry)</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Active / Inactive Toggle Switch */}
            <div className="pt-2">
              <label className="block text-slate-300 font-semibold mb-1">কুপন স্টেটাস</label>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-between cursor-pointer font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-950/60 border-emerald-700/80 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                  {isActive ? 'Active (সক্রিয়)' : 'Inactive (নিষ্ক্রিয়)'}
                </span>
                {isActive ? (
                  <ToggleRight className="w-6 h-6 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-slate-600" />
                )}
              </button>
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <Tag className="w-4 h-4" />
                <span>{editingCouponId ? 'কুপন আপডেট করুন' : 'কুপন সেভ ও প্রকাশ করুন'}</span>
              </button>

              {editingCouponId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl transition-all cursor-pointer"
                >
                  বাতিল করুন
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Coupons Table List Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Table Search & Status Filters */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="কুপন কোড বা প্রোডাক্ট নাম খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
              {(['all', 'Active', 'Expired', 'Inactive'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {st === 'all' ? 'সকল কুপন' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Coupon Data Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">Code & Discount</th>
                  <th className="p-4">Applicable Products</th>
                  <th className="p-4">Usage Limit</th>
                  <th className="p-4">Date Range</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                {filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      <Tag className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                      <p className="font-semibold text-sm">কোনো কুপন কোড পাওয়া যায়নি</p>
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((cpn) => {
                    const isAll = !cpn.applicableProducts || cpn.applicableProducts.includes('all');
                    const isExpired = new Date(cpn.expiryDate) < new Date();
                    const usagePercent = Math.min(100, Math.round((cpn.usedCount / (cpn.usageLimit || 1)) * 100));

                    return (
                      <tr key={cpn.id} className="hover:bg-slate-800/40 transition-colors group">
                        {/* Code & Discount */}
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-purple-300 text-sm bg-purple-950/80 border border-purple-800/60 px-2.5 py-1 rounded-lg tracking-wider">
                                {cpn.code}
                              </span>
                              <button
                                onClick={() => handleCopyCode(cpn.code)}
                                className="p-1 hover:text-white text-slate-500 rounded transition-colors cursor-pointer"
                                title="কোড কপি করুন"
                              >
                                {copiedCode === cpn.code ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 pt-0.5">
                              {cpn.discountType === 'percentage' ? (
                                <span>{cpn.discountValue}% Off</span>
                              ) : (
                                <span>৳{cpn.discountValue} Flat Off</span>
                              )}
                              {cpn.minOrderAmount ? (
                                <span className="text-[10px] text-slate-400 font-normal">
                                  (Min Order: ৳{cpn.minOrderAmount})
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </td>

                        {/* Applicable Products */}
                        <td className="p-4">
                          {isAll ? (
                            <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                              <Layers className="w-3 h-3 text-purple-400" /> All Products
                            </span>
                          ) : (
                            <div className="space-y-1 max-w-[180px]">
                              {cpn.applicableProducts?.map((prod) => (
                                <span
                                  key={prod}
                                  className="block truncate bg-purple-950/60 border border-purple-800/60 text-purple-300 text-[10px] font-medium px-2 py-0.5 rounded-md"
                                  title={prod}
                                >
                                  {prod}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        {/* Usage Limit & Progress */}
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span>
                                <span className="font-bold text-white">{cpn.usedCount}</span> / {cpn.usageLimit}
                              </span>
                              <span className="text-slate-500">{usagePercent}%</span>
                            </div>
                            <div className="w-28 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                              <div
                                className={`h-full transition-all ${
                                  usagePercent >= 100
                                    ? 'bg-rose-500'
                                    : usagePercent > 70
                                    ? 'bg-amber-500'
                                    : 'bg-purple-500'
                                }`}
                                style={{ width: `${usagePercent}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-slate-500">
                              {cpn.perUserLimit ? `${cpn.perUserLimit}x per user` : 'Unlimited per user'}
                            </p>
                          </div>
                        </td>

                        {/* Date Range */}
                        <td className="p-4 text-[11px] font-mono text-slate-400">
                          <div className="space-y-0.5">
                            <div>Start: {cpn.startDate || 'N/A'}</div>
                            <div className={isExpired ? 'text-rose-400 font-bold' : ''}>
                              Exp: {cpn.expiryDate}
                            </div>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="p-4">
                          <button
                            onClick={() => {
                              if (onUpdateCoupon) {
                                onUpdateCoupon({
                                  ...cpn,
                                  status: cpn.status === 'Active' ? 'Inactive' : 'Active',
                                });
                              }
                            }}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 cursor-pointer transition-colors ${
                              cpn.status === 'Active'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                : cpn.status === 'Expired'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                            }`}
                            title="স্টেটাস চেঞ্জ করতে ক্লিক করুন"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                cpn.status === 'Active' ? 'bg-emerald-400' : 'bg-slate-500'
                              }`}
                            />
                            {cpn.status}
                          </button>
                        </td>

                        {/* Action Buttons (Edit & Delete) */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleStartEdit(cpn)}
                              className="p-2 bg-slate-800 hover:bg-purple-950 text-slate-300 hover:text-purple-300 border border-slate-700 rounded-xl cursor-pointer transition-colors"
                              title="কুপন এডিট করুন"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteCoupon(cpn.id)}
                              className="p-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50 rounded-xl cursor-pointer transition-colors"
                              title="কুপন মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
      </div>
    </div>
  );
};
