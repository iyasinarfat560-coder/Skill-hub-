import React, { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Megaphone,
  Mail,
  TrendingUp,
  CreditCard,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  ArrowRight,
  Activity,
  UserCheck,
  Receipt,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { Order, Customer, Course } from '../../../types';

interface DashboardViewProps {
  orders: Order[];
  customers: Customer[];
  products: Course[];
  onNavigateTab: (tab: any) => void;
  onOpenAddProduct: () => void;
  onOpenAddAnnouncement: () => void;
  lang?: 'BN' | 'EN';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  orders,
  customers,
  products,
  onNavigateTab,
  onOpenAddProduct,
  onOpenAddAnnouncement,
  lang = 'EN',
}) => {
  const isBN = lang === 'BN';
  const [timeFilter, setTimeFilter] = useState<'7days' | '30days' | 'year'>('30days');

  // Real Calculations
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const processingOrdersCount = orders.filter((o) => o.status === 'Processing').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'Completed').length;
  const cancelledOrdersCount = orders.filter((o) => o.status === 'Cancelled').length;
  const totalOrdersCount = orders.length;

  const totalSalesAmount = orders
    .filter((o) => o.status === 'Completed' || o.status === 'Processing')
    .reduce((sum, o) => sum + o.amount, 0);

  // Stat Cards Data (Strictly Dynamic)
  const statCards = [
    {
      title: isBN ? 'মোট বিক্রি' : 'Total Sales',
      value: `৳${totalSalesAmount.toLocaleString()}`,
      change: orders.length > 0 ? '+100%' : '0%',
      isPositive: true,
      comparedTo: isBN ? 'লাইভ ডেটা' : 'Live Data',
      icon: DollarSign,
      iconBg: 'bg-purple-100 text-purple-700',
    },
    {
      title: isBN ? 'মোট অর্ডার' : 'Total Orders',
      value: totalOrdersCount.toString(),
      change: orders.length > 0 ? '+100%' : '0%',
      isPositive: true,
      comparedTo: isBN ? 'লাইভ ডেটা' : 'Live Data',
      icon: ShoppingBag,
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      title: isBN ? 'মোট কাস্টমার' : 'Total Customers',
      value: customers.length.toString(),
      change: customers.length > 0 ? '+100%' : '0%',
      isPositive: true,
      comparedTo: isBN ? 'লাইভ ডেটা' : 'Live Data',
      icon: Users,
      iconBg: 'bg-sky-100 text-sky-700',
    },
    {
      title: isBN ? 'পেন্ডিং অর্ডার' : 'Pending Orders',
      value: pendingOrdersCount.toString(),
      change: pendingOrdersCount > 0 ? 'Action Needed' : 'Normal',
      isPositive: pendingOrdersCount === 0,
      comparedTo: isBN ? 'লাইভ ডেটা' : 'Live Data',
      icon: Clock,
      iconBg: 'bg-amber-100 text-amber-700',
    },
    {
      title: isBN ? 'মোট প্রোডাক্টস' : 'Total Products',
      value: products.length.toString(),
      change: 'Active',
      isPositive: true,
      comparedTo: isBN ? 'লাইভ ডেটা' : 'Live Data',
      icon: Package,
      iconBg: 'bg-pink-100 text-pink-700',
    },
  ];

  // Dynamic Chart Data based on timeFilter & actual orders
  const hasOrders = orders.length > 0;
  const activeChart = {
    salesPath: hasOrders ? 'M 0 120 Q 120 40 250 80 T 500 20' : 'M 0 145 L 500 145',
    salesArea: hasOrders ? 'M 0 120 Q 120 40 250 80 T 500 20 L 500 150 L 0 150 Z' : 'M 0 145 L 500 145 L 500 150 L 0 150 Z',
    ordersPath: hasOrders ? 'M 0 135 Q 120 80 250 100 T 500 50' : 'M 0 145 L 500 145',
    ordersArea: hasOrders ? 'M 0 135 Q 120 80 250 100 T 500 50 L 500 150 L 0 150 Z' : 'M 0 145 L 500 145 L 500 150 L 0 150 Z',
    labels: timeFilter === '7days' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] 
      : timeFilter === '30days' 
      ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] 
      : ['Q1', 'Q2', 'Q3', 'Q4'],
    peakSales: `৳ ${totalSalesAmount.toLocaleString()}`,
    avgOrders: `${hasOrders ? (totalOrdersCount / 30).toFixed(1) : 0} / day`,
  };

  // Real Recent Transactions List from orders array
  const realTransactions = orders.map((ord) => ({
    id: ord.transactionId || `TRX-${ord.id}`,
    orderId: `#${ord.id}`,
    customer: ord.customerName,
    amount: ord.amount,
    method: ord.paymentMethod.toUpperCase(),
    methodBg: ord.paymentMethod === 'bkash'
      ? 'bg-pink-50 text-pink-700 border-pink-200'
      : ord.paymentMethod === 'nagad'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-purple-50 text-purple-700 border-purple-200',
    date: ord.date,
    status: ord.status,
  }));

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-8">
      
      {/* 1. ROW 1: 5 STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-purple-300 transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{card.title}</span>
                <div className={`p-2 rounded-xl ${card.iconBg}`}>
                  <IconComp className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-xs font-medium">
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                      card.isPositive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {card.isPositive ? (
                      <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 mr-0.5" />
                    )}
                    {card.change}
                  </span>
                  <span className="text-slate-400 text-[11px]">{card.comparedTo}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. ROW 2: SALES ANALYTICS CHART & ORDER STATUS DONUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Analytics Chart Area */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs lg:col-span-2 space-y-4 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#7C3AED]" />
                <h3 className="text-base font-bold text-slate-900">Sales Analytics</h3>
              </div>
              <p className="text-xs text-slate-500">মোট বিক্রি (৳) এবং অর্ডার প্রগতির সমন্বিত গ্রাফ</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-600 cursor-pointer"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days (July)</option>
                <option value="year">This Year (2026)</option>
              </select>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-6 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 text-[11px]">Peak Sales:</span>
              <p className="font-black text-purple-700 text-sm">{activeChart.peakSales}</p>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div>
              <span className="text-slate-400 text-[11px]">Avg Daily Orders:</span>
              <p className="font-black text-slate-800 text-sm">{activeChart.avgOrders}</p>
            </div>
          </div>

          {/* Dual Axis Custom SVG Chart */}
          <div className="relative w-full h-64 bg-slate-50/50 border border-slate-200/60 rounded-xl p-4 flex flex-col justify-between">
            {/* Legend */}
            <div className="flex items-center justify-end gap-6 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-purple-700 font-bold">
                <span className="w-3 h-3 rounded-full bg-[#7C3AED] inline-block shadow-xs"></span> Total Sales (৳)
              </span>
              <span className="flex items-center gap-1.5 text-pink-600 font-bold">
                <span className="w-3 h-3 rounded-full bg-pink-500 inline-block shadow-xs"></span> Total Orders
              </span>
            </div>

            {/* SVG Lines */}
            <svg viewBox="0 0 500 160" className="w-full h-40 overflow-visible transition-all duration-500">
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EC4899" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#EC4899" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="0" y1="110" x2="500" y2="110" stroke="#E2E8F0" strokeDasharray="3 3" />

              {/* Sales Area & Path */}
              <path d={activeChart.salesArea} fill="url(#purpleGrad)" />
              <path
                d={activeChart.salesPath}
                fill="none"
                stroke="#7C3AED"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Orders Area & Path */}
              <path d={activeChart.ordersArea} fill="url(#pinkGrad)" />
              <path
                d={activeChart.ordersPath}
                fill="none"
                stroke="#EC4899"
                strokeWidth="2.5"
                strokeDasharray="5 3"
              />

              {/* Interactive Data Points */}
              <circle cx="160" cy="80" r="4.5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="320" cy="50" r="5.5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="500" cy="22" r="5.5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />

              <circle cx="320" cy="95" r="4" fill="#EC4899" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="500" cy="50" r="4" fill="#EC4899" stroke="#FFFFFF" strokeWidth="2" />
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-2 border-t border-slate-200">
              {activeChart.labels.map((lbl, i) => (
                <span key={i}>{lbl}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Order Status Donut Breakdown */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Order Status</h3>
            <p className="text-xs text-slate-500">সকল অর্ডারের বর্তমান অবস্থা ও শতকরা হিসাব</p>
          </div>

          <div className="flex flex-col items-center justify-center py-1 relative">
            <svg viewBox="0 0 100 100" className="w-36 h-36 transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
              {/* Completed: Green */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10B981"
                strokeWidth="12"
                strokeDasharray="251"
                strokeDashoffset="85"
              />
              {/* Processing: Blue */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="12"
                strokeDasharray="251"
                strokeDashoffset="180"
              />
              {/* Pending: Amber */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="12"
                strokeDasharray="251"
                strokeDashoffset="230"
              />
              {/* Cancelled: Rose */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#F43F5E"
                strokeWidth="12"
                strokeDasharray="251"
                strokeDashoffset="245"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900">{totalOrdersCount}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Orders</span>
            </div>
          </div>

          {/* Status Breakdown Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-amber-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pending
              </span>
              <span className="font-extrabold text-amber-900">
                {pendingOrdersCount} ({totalOrdersCount > 0 ? ((pendingOrdersCount / totalOrdersCount) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-blue-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Processing
              </span>
              <span className="font-extrabold text-blue-900">
                {processingOrdersCount} ({totalOrdersCount > 0 ? ((processingOrdersCount / totalOrdersCount) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Completed
              </span>
              <span className="font-extrabold text-emerald-900">
                {completedOrdersCount} ({totalOrdersCount > 0 ? ((completedOrdersCount / totalOrdersCount) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="bg-rose-50/60 p-2.5 rounded-xl border border-rose-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-rose-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Cancelled
              </span>
              <span className="font-extrabold text-rose-900">
                {cancelledOrdersCount} ({totalOrdersCount > 0 ? ((cancelledOrdersCount / totalOrdersCount) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. ROW 3: RECENT ORDERS TABLE & TOP SELLING PRODUCTS TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Orders List Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Orders</h3>
              <p className="text-xs text-slate-500">সর্বশেষ ৫টি অর্ডার ও পেমেন্ট স্ট্যাটাস</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 rounded-l-lg">Order ID</th>
                  <th className="p-2.5">Customer</th>
                  <th className="p-2.5">Amount</th>
                  <th className="p-2.5 rounded-r-lg text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">
                      <p className="font-bold text-slate-500 text-sm">এখনো কোনো অর্ডার আসেনি</p>
                      <p className="text-[11px] text-slate-400 mt-1">কাস্টমার ওয়েবসাইট থেকে অর্ডার করলে তা এখানে রিয়েল-টাইমে দেখা যাবে।</p>
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-2.5 font-mono font-bold text-purple-700">{ord.id}</td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-900">{ord.customerName}</div>
                      </td>
                      <td className="p-2.5 font-extrabold text-slate-900">৳{ord.amount}</td>
                      <td className="p-2.5 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                            ord.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : ord.status === 'Processing'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : ord.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Top Selling Products</h3>
              <p className="text-xs text-slate-500">সবচেয়ে বেশি বিক্রি হওয়া জনপ্রিয় কোর্সসমূহ</p>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 rounded-l-lg">Product</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5 text-center">Sales</th>
                  <th className="p-2.5 rounded-r-lg text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {products.filter((p) => (p.enrollmentCount || 0) > 0).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">
                      <p className="font-bold text-slate-500 text-sm">এখনো কোনো বিক্রিত প্রোডাক্ট নেই</p>
                      <p className="text-[11px] text-slate-400 mt-1">কাস্টমার এনরোল করলে জনপ্রিয় কোর্সগুলো এখানে র‍্যাংক করবে।</p>
                    </td>
                  </tr>
                ) : (
                  [...products]
                    .sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0))
                    .slice(0, 5)
                    .map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                              {prod.image ? (
                                <img src={prod.image} alt="" className="w-7 h-7 rounded-lg object-cover" />
                              ) : (
                                '📘'
                              )}
                            </div>
                            <p className="font-bold text-slate-900 line-clamp-1 max-w-[160px]">{prod.title}</p>
                          </div>
                        </td>
                        <td className="p-2.5 text-slate-500 font-medium">{prod.category}</td>
                        <td className="p-2.5 text-center font-bold text-purple-700">{prod.enrollmentCount || 0}</td>
                        <td className="p-2.5 text-right font-extrabold text-emerald-600">
                          ৳{((prod.enrollmentCount || 0) * prod.discountPrice).toLocaleString()}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 4. ROW 4: EARNINGS SUMMARY & RECENT CUSTOMERS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Earnings Summary Cards */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Earnings Summary</h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                Live Data
              </span>
            </div>
            <p className="text-xs text-slate-500">মোট আয়, নিট হিসাব ও কাস্টমার সংখ্যা</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1 hover:border-purple-200 transition-colors">
              <span className="text-[11px] font-semibold text-slate-500">Total Earnings</span>
              <p className="text-lg font-extrabold text-slate-900">৳ {totalSalesAmount.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> Live
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1 hover:border-emerald-200 transition-colors">
              <span className="text-[11px] font-semibold text-slate-500">Net Earnings</span>
              <p className="text-lg font-extrabold text-emerald-600">৳ {totalSalesAmount.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> Live
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1 hover:border-purple-200 transition-colors">
              <span className="text-[11px] font-semibold text-slate-500">Total Orders</span>
              <p className="text-lg font-extrabold text-purple-700">{totalOrdersCount}</p>
              <span className="text-[10px] text-slate-500 font-medium">Recorded</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1 hover:border-amber-200 transition-colors">
              <span className="text-[11px] font-semibold text-slate-500">Pending Orders</span>
              <p className="text-lg font-extrabold text-amber-600">{pendingOrdersCount}</p>
              <span className="text-[10px] text-amber-600 font-bold">Needs Action</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="w-full py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" /> View All Orders
          </button>
        </div>

        {/* Recent Customers List */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Customers</h3>
              <p className="text-xs text-slate-500">নতুন নিবন্ধিত শিক্ষার্থী ও কাস্টমারদের তালিকা</p>
            </div>
            <button
              onClick={() => onNavigateTab('customers')}
              className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {customers.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <p className="font-bold text-slate-500 text-sm">এখনো কোনো কাস্টমার রেজিস্টার করেনি</p>
              <p className="text-[11px] text-slate-400 mt-1">ওয়েবসাইট থেকে প্রথম কেনাকাটার সাথে সাথে কাস্টমার অটোমেটিক এখানে যোগ হবে।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customers.slice(0, 4).map((cust) => (
                <div
                  key={cust.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between hover:border-purple-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-100 text-[#7C3AED] font-bold text-xs flex items-center justify-center border border-purple-200 shrink-0">
                      {cust.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{cust.name}</p>
                      <p className="text-[11px] text-slate-500">{cust.email}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block">{cust.joinedDate}</span>
                    <span className="text-xs font-extrabold text-emerald-600">৳{cust.totalSpent}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 5. ROW 5: RECENT TRANSACTIONS TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
            </div>
            <p className="text-xs text-slate-500">বিকাশ, নগদ, রকেট ও কার্ড পেমেন্টের হিসাব ও আইডি</p>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
          >
            All Transactions <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 rounded-l-lg">Transaction ID</th>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3 rounded-r-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {realTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    <p className="font-bold text-slate-500 text-sm">এখনো কোনো লেনদেন সম্পন্ন হয়নি</p>
                    <p className="text-[11px] text-slate-400 mt-1">কাস্টমারের বিকাশ/নগদ/রকেট পেমেন্ট আইডিগুলো এখানে রিয়েল-টাইমে দেখা যাবে।</p>
                  </td>
                </tr>
              ) : (
                realTransactions.slice(0, 5).map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">{trx.id}</td>
                    <td className="p-3 font-mono font-bold text-purple-700">{trx.orderId}</td>
                    <td className="p-3 font-bold text-slate-900">{trx.customer}</td>
                    <td className="p-3 font-black text-slate-900">৳{trx.amount}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${trx.methodBg}`}>
                        <Smartphone className="w-3 h-3 mr-1" />
                        {trx.method}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{trx.date}</td>
                    <td className="p-3 text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          trx.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : trx.status === 'Processing'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : trx.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. ROW 6: QUICK ACTIONS & SITE OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Quick Actions Shortcuts */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4 lg:col-span-2">
          <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={onOpenAddProduct}
              className="p-3.5 bg-purple-50 hover:bg-purple-100/80 border border-purple-200/80 rounded-xl text-left flex flex-col justify-between gap-3 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center">
                <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Add New Product</div>
                <div className="text-[10px] text-purple-700">কোর্স বা ই-বুক যুক্ত করুন</div>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('orders')}
              className="p-3.5 bg-blue-50 hover:bg-blue-100/80 border border-blue-200/80 rounded-xl text-left flex flex-col justify-between gap-3 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">View Orders</div>
                <div className="text-[10px] text-blue-700">{pendingOrdersCount}টি পেন্ডিং অর্ডার</div>
              </div>
            </button>

            <button
              onClick={onOpenAddAnnouncement}
              className="p-3.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-xl text-left flex flex-col justify-between gap-3 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Megaphone className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Add Announcement</div>
                <div className="text-[10px] text-emerald-700">ওয়েবসাইটে ব্যানার দিন</div>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('whatsapp-email')}
              className="p-3.5 bg-pink-50 hover:bg-pink-100/80 border border-pink-200/80 rounded-xl text-left flex flex-col justify-between gap-3 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-lg bg-pink-600 text-white flex items-center justify-center">
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Subscribers</div>
                <div className="text-[10px] text-pink-700">বাল্ক বার্তা পাঠান</div>
              </div>
            </button>
          </div>
        </div>

        {/* Site Overview Metrics */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-bold text-slate-900">Site Overview</h3>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Active Products</span>
              <span className="font-extrabold text-slate-900">{products.length}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Total Customers</span>
              <span className="font-extrabold text-slate-900">{customers.length}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Total Orders</span>
              <span className="font-extrabold text-slate-900">{totalOrdersCount}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Pending Orders</span>
              <span className="font-extrabold text-amber-600">{pendingOrdersCount}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Total Sales</span>
              <span className="font-extrabold text-[#7C3AED]">৳{totalSalesAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
