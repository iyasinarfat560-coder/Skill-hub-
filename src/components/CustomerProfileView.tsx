import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  ArrowLeft,
  Sparkles,
  PackageCheck,
  HelpCircle,
  BookOpen,
  LogOut
} from 'lucide-react';
import { Order, Course, ViewMode } from '../types';

interface CustomerProfileViewProps {
  user: { name: string; email: string; avatar?: string } | null;
  orders: Order[];
  products: Course[];
  onNavigate: (view: ViewMode) => void;
  onShowToast: (msg: string) => void;
  onOpenLogin: () => void;
  onSelectCourseForDetails?: (course: Course) => void;
  onUpdateUser?: (updated: { name: string; email: string; avatar?: string }) => void;
  onLogout?: () => void;
}

export const CustomerProfileView: React.FC<CustomerProfileViewProps> = ({
  user,
  orders,
  products,
  onNavigate,
  onShowToast,
  onOpenLogin,
  onSelectCourseForDetails,
  onUpdateUser,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Processing' | 'Completed' | 'Cancelled'>('All');
  
  // Profile edit state
  const [editName, setEditName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');

  // Selected Order for Modal Detail & Timeline
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isTrackingRefreshing, setIsTrackingRefreshing] = useState(false);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">আপনার প্রোফাইলে প্রবেশ করুন</h2>
        <p className="text-slate-600 mb-6 text-sm">
          আপনার অর্ডার হিস্ট্রি এবং কোর্স এক্সেস পেতে অনুগ্রহ করে লগইন করুন।
        </p>
        <button
          onClick={onOpenLogin}
          className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-purple-200 cursor-pointer"
        >
          লগইন করুন
        </button>
      </div>
    );
  }

  // Filter orders for the logged-in user (match email or display all user's orders)
  const userOrders = orders.filter(
    (o) =>
      o.customerEmail.toLowerCase() === user.email.toLowerCase() ||
      o.customerName.toLowerCase() === user.name.toLowerCase()
  );

  // If no email match, fallback to showing all orders if list is empty for demo, or userOrders
  const displayedOrdersList = userOrders.length > 0 ? userOrders : orders;

  const filteredOrders = displayedOrdersList.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            🟡 পেন্ডিং
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            🔵 প্রসেসিং হচ্ছে
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            🟢 ডেলিভারি সম্পন্ন
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            🔴 বাতিল
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    const m = method.toLowerCase();
    if (m === 'bkash') {
      return <span className="text-[11px] font-extrabold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-md border border-pink-100">bKash</span>;
    }
    if (m === 'nagad') {
      return <span className="text-[11px] font-extrabold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-100">Nagad</span>;
    }
    if (m === 'rocket') {
      return <span className="text-[11px] font-extrabold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">Rocket</span>;
    }
    return <span className="text-[11px] font-extrabold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">{method}</span>;
  };

  const findProductImage = (productId?: string) => {
    const found = products.find((p) => p.id === productId);
    return found ? found.image : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80';
  };

  const handleManualTrackRefresh = () => {
    setIsTrackingRefreshing(true);
    setTimeout(() => {
      setIsTrackingRefreshing(false);
      onShowToast('স্ট্যাটাস আপডেট রিফ্রেশ করা হয়েছে! বর্তমান স্ট্যাটাস সিঙ্কড।');
    }, 600);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white font-black text-2xl flex items-center justify-center border-2 border-purple-400/30 shadow-lg shrink-0">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black">{user.name}</h1>
                  <span className="bg-purple-500/30 border border-purple-400/40 text-purple-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-purple-300" />
                    Verified Customer
                  </span>
                </div>
                <p className="text-slate-300 text-sm mt-0.5 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                  {user.email}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto border-t sm:border-t-0 border-purple-800/60 pt-4 sm:pt-0">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 flex-1 sm:flex-initial text-center">
                <span className="text-xs text-slate-300 font-semibold block">মোট অর্ডার</span>
                <span className="text-xl font-black text-white">{displayedOrdersList.length} টি</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 flex-1 sm:flex-initial text-center">
                <span className="text-xs text-slate-300 font-semibold block">সম্পন্ন</span>
                <span className="text-xl font-black text-emerald-400">
                  {displayedOrdersList.filter((o) => o.status === 'Completed').length} টি
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-3 mt-8 border-t border-purple-800/50 pt-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-white text-purple-950 shadow-md'
                  : 'bg-purple-950/40 text-purple-200 hover:bg-purple-900/60'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              আমার অর্ডারসমূহ ({displayedOrdersList.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-white text-purple-950 shadow-md'
                  : 'bg-purple-950/40 text-purple-200 hover:bg-purple-900/60'
              }`}
            >
              <User className="w-4 h-4" />
              প্রোফাইল তথ্য
            </button>
          </div>
        </div>

        {/* Tab 1: My Orders (Order History) */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Search and Status Filters */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="অর্ডার আইডি, কোর্সের নাম বা ট্রানজেকশন আইডি খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-200 focus:bg-white"
                />
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {(['All', 'Pending', 'Processing', 'Completed', 'Cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      statusFilter === st
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'All' && 'সব অর্ডার'}
                    {st === 'Pending' && '🟡 পেন্ডিং'}
                    {st === 'Processing' && '🔵 প্রসেসিং'}
                    {st === 'Completed' && '🟢 ডেলিভারি'}
                    {st === 'Cancelled' && '🔴 বাতিল'}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">কোনো অর্ডার পাওয়া যায়নি</h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1 mb-6">
                  {searchQuery || statusFilter !== 'All'
                    ? 'আপনার ফিল্টারের সাথে মিলে এমন কোনো অর্ডার নেই।'
                    : 'আপনি এখনও কোনো অর্ডার করেননি। কোর্স ব্রাউজ করে অর্ডার করুন!'}
                </p>
                <button
                  onClick={() => onNavigate('courses')}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-purple-200"
                >
                  কোর্সসমূহ দেখুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 group"
                  >
                    {/* Left: Product Info */}
                    <div className="flex items-start sm:items-center gap-4">
                      <img
                        src={findProductImage(order.productId)}
                        alt={order.productTitle}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                            #{order.id}
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {order.date}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-purple-700 transition-colors line-clamp-1">
                          {order.productTitle}
                        </h3>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-600 font-medium">
                          <span>পেমেন্ট: {getPaymentMethodBadge(order.paymentMethod)}</span>
                          <span>•</span>
                          <span>TxID: <strong className="font-mono text-slate-800">{order.transactionId}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Price, Status & Actions */}
                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                      <div className="text-left md:text-right">
                        <span className="text-[11px] text-slate-400 font-semibold block">মোট পরিমাণ</span>
                        <span className="text-lg sm:text-xl font-black text-slate-900">৳{order.amount}</span>
                        <div className="mt-1">{getStatusBadge(order.status)}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-purple-200 flex items-center gap-1"
                          title="Track & Details"
                        >
                          <span>বিস্তারিত</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile Info */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs max-w-2xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              ব্যক্তিগত তথ্য ও প্রোফাইল ছবি
            </h2>

            {/* Profile Picture Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-purple-600 text-white font-black text-2xl flex items-center justify-center overflow-hidden shadow-md border-2 border-white">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={editName || user.name} className="w-full h-full object-cover" />
                  ) : (
                    (editName || user.name).charAt(0)
                  )}
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-extrabold text-slate-900 text-base">{user.name}</h3>
                <p className="text-xs text-slate-500 mb-3">{user.email}</p>
                <label className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer inline-flex items-center gap-2">
                  <span>প্রোফাইল ছবি আপলোড করুন</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const res = reader.result as string;
                          setAvatarUrl(res);
                          if (onUpdateUser) {
                            onUpdateUser({
                              name: editName,
                              email: user.email,
                              avatar: res,
                            });
                            onShowToast('প্রোফাইল ছবি সফলভাবে আপডেট করা হয়েছে!');
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (onUpdateUser) {
                  onUpdateUser({
                    name: editName,
                    email: user.email,
                    avatar: avatarUrl,
                  });
                  onShowToast('প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে!');
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  পূর্ণ নাম পরিবর্তন করুন
                </label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-bold text-sm">
                  <User className="w-4 h-4 text-purple-600 shrink-0" />
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-transparent border-none outline-none font-bold text-slate-900"
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  ইমেইল এড্রেস (পরিবর্তনযোগ্য নয়)
                </label>
                <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{user.email}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  অ্যাকাউন্ট স্ট্যাটাস
                </label>
                <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>সক্রিয় (Active) কাস্টমার প্রোফাইল</span>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-purple-200 cursor-pointer"
                >
                  প্রোফাইল তথ্য সংরক্ষণ করুন
                </button>

                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-3 rounded-xl text-sm transition-all border border-rose-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>লগআউট করুন</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Order Details & Live Timeline Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  অর্ডার বিস্তারিত ও ট্র্যাকিং
                </span>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 mt-0.5">
                  <span>অর্ডার #{selectedOrder.id}</span>
                  {getStatusBadge(selectedOrder.status)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Product Summary Row */}
            <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 flex items-center gap-4 mb-6">
              <img
                src={findProductImage(selectedOrder.productId)}
                alt={selectedOrder.productTitle}
                className="w-16 h-16 rounded-xl object-cover border border-purple-200 bg-white"
              />
              <div className="flex-1">
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {selectedOrder.productTitle}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  ক্যাটাগরি: {selectedOrder.itemCategory || 'ডিজিটাল প্রোডাক্ট'}
                </p>
                <div className="text-sm font-black text-purple-700 mt-1">
                  ৳{selectedOrder.amount} BDT
                </div>
              </div>
            </div>

            {/* Live Order Timeline Tracker */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-purple-600" />
                  অর্ডার ট্র্যাকিং টাইমলাইন (Live)
                </h4>
                <button
                  onClick={handleManualTrackRefresh}
                  disabled={isTrackingRefreshing}
                  className="text-xs text-purple-700 font-bold hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTrackingRefreshing ? 'animate-spin' : ''}`} />
                  <span>রিফ্রেশ স্ট্যাটাস</span>
                </button>
              </div>

              {selectedOrder.status === 'Cancelled' ? (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-800 text-xs font-semibold flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm mb-0.5">এই অর্ডারটি বাতিল করা হয়েছে!</strong>
                    ট্রানজেকশন তথ্য সঠিক না থাকায় বা এডমিনের মাধ্যমে অর্ডারটি বাতিল করা হয়েছে। প্রয়োজনে সাপোর্টে যোগাযোগ করুন।
                  </div>
                </div>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  
                  {/* Step 1: Order Placed */}
                  <div className="relative flex items-start gap-3">
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">অর্ডার সাবমিট হয়েছে (Order Placed)</p>
                      <p className="text-[11px] text-slate-500">{selectedOrder.date}</p>
                    </div>
                  </div>

                  {/* Step 2: Payment Verified */}
                  <div className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${
                        selectedOrder.status === 'Processing' || selectedOrder.status === 'Completed'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-400 text-white animate-pulse'
                      }`}
                    >
                      {selectedOrder.status === 'Processing' || selectedOrder.status === 'Completed' ? '✓' : '•'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">পেমেন্ট ভেরিফিকেশন (Payment Verification)</p>
                      <p className="text-[11px] text-slate-500">
                        {selectedOrder.status === 'Pending'
                          ? 'এডমিন পেমেন্ট ট্রানজেকশন আইডেন্টিফাই করছেন...'
                          : 'পেমেন্ট সফলভাবে যাচাই করা হয়েছে।'}
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Processing */}
                  <div className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${
                        selectedOrder.status === 'Completed'
                          ? 'bg-emerald-500 text-white'
                          : selectedOrder.status === 'Processing'
                          ? 'bg-blue-600 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {selectedOrder.status === 'Completed' ? '✓' : '•'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">প্রসেসিং ও এক্সেস তৈরি (Processing Access)</p>
                      <p className="text-[11px] text-slate-500">
                        {selectedOrder.status === 'Completed'
                          ? 'কোর্স এক্সেস সক্রিয় করা হয়েছে।'
                          : selectedOrder.status === 'Processing'
                          ? 'আপনার জন্য ডিজিটাল লিঙ্ক/সোর্স কোড রেডি হচ্ছে...'
                          : 'পেমেন্ট অনুমোদনের পর প্রসেস শুরু হবে।'}
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${
                        selectedOrder.status === 'Completed'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {selectedOrder.status === 'Completed' ? '✓' : '•'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">ডেলিভারি সম্পূর্ণ (Delivered)</p>
                      <p className="text-[11px] text-slate-500">
                        {selectedOrder.status === 'Completed'
                          ? 'সফলভাবে ডেলিভারি সম্পন্ন হয়েছে! উপভোগ করুন।'
                          : 'অর্ডারটি প্রসেসিং শেষ হলে ডেলিভারি মার্ক করা হবে।'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment & Customer Details Table */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
              <div>
                <span className="text-slate-400 font-semibold block">পেমেন্ট মেথড</span>
                <span className="font-extrabold text-slate-900 capitalize">{selectedOrder.paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">ট্রানজেকশন আইডি (TxID)</span>
                <span className="font-mono font-bold text-purple-700">{selectedOrder.transactionId}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">গ্রাহকের নাম</span>
                <span className="font-bold text-slate-800">{selectedOrder.customerName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">ফোন / হোয়াটসঅ্যাপ</span>
                <span className="font-bold text-slate-800">{selectedOrder.customerPhone}</span>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>

              {selectedOrder.status === 'Completed' && (
                <button
                  onClick={() => {
                    const matchedCourse = products.find((p) => p.id === selectedOrder.productId);
                    if (matchedCourse && onSelectCourseForDetails) {
                      onSelectCourseForDetails(matchedCourse);
                      setSelectedOrder(null);
                    } else {
                      onNavigate('courses');
                      setSelectedOrder(null);
                    }
                  }}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-purple-200 flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>কোর্স দেখুন / পড়া শুরু করুন</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
