import React, { useState } from 'react';
import {
  AdminTab,
  AdminUser,
  Order,
  Customer,
  AdminReview,
  Coupon,
  WithdrawRequest,
  BlogPost,
  Subscriber,
  Announcement,
  StaffMember,
  GeneralSettings,
  PaymentSettingsData,
  WebsiteSettingsData,
  WhatsAppSettingsData,
  SystemAuditLog,
  Course,
  Category,
  Bundle,
} from '../../types';

import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Star,
  Layers,
  Tag,
  CreditCard,
  FileText,
  Mail,
  Megaphone,
  MessageSquare,
  Settings,
  Globe,
  UserCheck,
  Database,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Plus,
  ShieldCheck,
  Moon,
  Sun,
  Home,
  CheckCircle2,
  Package,
} from 'lucide-react';

import { DashboardView } from './views/DashboardView';
import { ProductsView } from './views/ProductsView';
import { AdminBundlesView } from './views/AdminBundlesView';
import { OrdersView } from './views/OrdersView';
import { CustomersView } from './views/CustomersView';
import { ReviewsView } from './views/ReviewsView';
import { CategoriesView } from './views/CategoriesView';
import { CouponsView } from './views/CouponsView';
import { WithdrawalsView } from './views/WithdrawalsView';
import { BlogView } from './views/BlogView';
import { SubscribersView } from './views/SubscribersView';
import { AnnouncementsView } from './views/AnnouncementsView';
import { WhatsAppEmailView } from './views/WhatsAppEmailView';
import { PaymentSettingsView } from './views/PaymentSettingsView';
import { GeneralSettingsView } from './views/GeneralSettingsView';
import { WebsiteSettingsView } from './views/WebsiteSettingsView';
import { AdminStaffView } from './views/AdminStaffView';
import { BackupToolsView } from './views/BackupToolsView';

interface AdminLayoutProps {
  adminUser: AdminUser;
  onLogoutAdmin: () => void;
  onReturnToSite: () => void;

  // Master Data & Handlers
  products: Course[];
  bundles: Bundle[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  reviews: AdminReview[];
  coupons: Coupon[];
  withdrawals: WithdrawRequest[];
  blogPosts: BlogPost[];
  subscribers: Subscriber[];
  announcements: Announcement[];
  staffMembers: StaffMember[];
  whatsappSettings?: WhatsAppSettingsData;
  generalSettings: GeneralSettings;
  paymentSettings: PaymentSettingsData;
  websiteSettings: WebsiteSettingsData;
  auditLogs: SystemAuditLog[];

  // Mutators
  onAddProduct: (p: Course) => void;
  onUpdateProduct: (p: Course) => void;
  onDeleteProduct: (id: string) => void;
  onAddBundle: (b: Bundle) => void;
  onUpdateBundle: (b: Bundle) => void;
  onDeleteBundle: (id: string) => void;
  onAddCategory: (c: Category) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateOrderStatus: (id: string, status: any) => void;
  onToggleCustomerStatus: (id: string) => void;
  onApproveReview: (id: string) => void;
  onRejectReview: (id: string) => void;
  onDeleteReview: (id: string) => void;
  onReplyReview: (id: string, reply: string) => void;
  onAddCoupon: (c: Coupon) => void;
  onUpdateCoupon?: (c: Coupon) => void;
  onDeleteCoupon: (id: string) => void;
  onApproveWithdraw: (id: string) => void;
  onRejectWithdraw: (id: string) => void;
  onAddBlogPost: (b: BlogPost) => void;
  onUpdateBlogPost?: (b: BlogPost) => void;
  onDeleteBlogPost: (id: string) => void;
  onDeleteSubscriber: (id: string) => void;
  onAddAnnouncement: (a: Announcement) => void;
  onToggleAnnouncementStatus: (id: string) => void;
  onDeleteAnnouncement: (id: string) => void;
  onAddStaffMember: (s: StaffMember) => void;
  onDeleteStaffMember: (id: string) => void;
  onSaveWhatsAppSettings?: (w: WhatsAppSettingsData) => void;
  onSaveGeneralSettings: (g: GeneralSettings) => void;
  onSavePaymentSettings: (p: PaymentSettingsData) => void;
  onSaveWebsiteSettings: (w: WebsiteSettingsData) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [lang, setLang] = useState<'BN' | 'EN'>('EN');

  // Modal triggers for quick shortcuts
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddAnnouncementModalOpen, setIsAddAnnouncementModalOpen] = useState(false);

  const pendingOrdersCount = props.orders.filter((o) => o.status === 'Pending').length;

  // Download full JSON backup
  const handleDownloadBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      products: props.products,
      categories: props.categories,
      orders: props.orders,
      customers: props.customers,
      reviews: props.reviews,
      coupons: props.coupons,
      withdrawals: props.withdrawals,
      blogPosts: props.blogPosts,
      subscribers: props.subscribers,
      announcements: props.announcements,
      staffMembers: props.staffMembers,
      generalSettings: props.generalSettings,
      paymentSettings: props.paymentSettings,
      websiteSettings: props.websiteSettings,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `skillshub_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClearCache = () => {
    console.log('System cache cleared.');
  };

  const [salesOverviewPeriod, setSalesOverviewPeriod] = useState('this_month');

  // Sidebar Menu Items Definition (Bilingual EN / BN)
  const menuGroups = [
    {
      title: lang === 'BN' ? 'প্রধান মেনু' : 'MAIN',
      items: [
        { tab: 'dashboard' as AdminTab, label: lang === 'BN' ? 'ড্যাশবোর্ড' : 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: lang === 'BN' ? 'ম্যানেজমেন্ট' : 'MANAGE',
      items: [
        { tab: 'products' as AdminTab, label: lang === 'BN' ? 'প্রোডাক্টস' : 'Products', icon: ShoppingBag, count: props.products.length },
        { tab: 'bundles' as AdminTab, label: lang === 'BN' ? 'বান্ডেল অফার' : 'Bundles', icon: Package, count: props.bundles.length },
        { tab: 'orders' as AdminTab, label: lang === 'BN' ? 'অর্ডারস' : 'Orders', icon: ShoppingBag, badge: pendingOrdersCount ? `${pendingOrdersCount}` : undefined },
        { tab: 'customers' as AdminTab, label: lang === 'BN' ? 'কাস্টমারস' : 'Customers', icon: Users, count: props.customers.length },
        { tab: 'reviews' as AdminTab, label: lang === 'BN' ? 'রিভিউস' : 'Reviews', icon: Star, count: props.reviews.length },
        { tab: 'categories' as AdminTab, label: lang === 'BN' ? 'ক্যাটাগরি' : 'Categories', icon: Layers },
        { tab: 'coupons' as AdminTab, label: lang === 'BN' ? 'কুপন' : 'Coupons', icon: Tag },
        { tab: 'withdrawals' as AdminTab, label: lang === 'BN' ? 'উইথড্র রিকোয়েস্ট' : 'Withdraw Requests', icon: CreditCard },
      ],
    },
    {
      title: lang === 'BN' ? 'মার্কেটিং' : 'MARKETING',
      items: [
        { tab: 'blog' as AdminTab, label: lang === 'BN' ? 'ব্লগ পোস্ট' : 'Blog Posts', icon: FileText },
        { tab: 'subscribers' as AdminTab, label: lang === 'BN' ? 'সাবস্ক্রাইবার' : 'Subscribers', icon: Mail },
        { tab: 'announcements' as AdminTab, label: lang === 'BN' ? 'অ্যানাউন্সমেন্ট' : 'Announcements', icon: Megaphone },
        { tab: 'whatsapp-email' as AdminTab, label: lang === 'BN' ? 'হোয়াটসঅ্যাপ / ইমেইল' : 'WhatsApp / Email', icon: MessageSquare },
      ],
    },
    {
      title: lang === 'BN' ? 'সেটিংস' : 'SETTINGS',
      items: [
        { tab: 'payment-settings' as AdminTab, label: lang === 'BN' ? 'পেমেন্ট সেটিংস' : 'Payment Settings', icon: CreditCard },
        { tab: 'general-settings' as AdminTab, label: lang === 'BN' ? 'সাধারণ সেটিংস' : 'General Settings', icon: Settings },
        { tab: 'website-settings' as AdminTab, label: lang === 'BN' ? 'ওয়েবসাইট সেটিংস' : 'Website Settings', icon: Globe },
        { tab: 'admin-staff' as AdminTab, label: lang === 'BN' ? 'এডমিন ও স্টাফ' : 'Admin & Staff', icon: UserCheck },
        { tab: 'backup-tools' as AdminTab, label: lang === 'BN' ? 'ব্যাকআপ ও টুলস' : 'Backup & Tools', icon: Database },
      ],
    },
  ];

  return (
    <div className={`min-h-screen flex text-slate-800 font-sans ${isDarkMode ? 'bg-[#0A0A12] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'}`}>
      
      {/* 1. LEFT SIDEBAR (DARK NAVY #0F172A) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding Logo */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-purple-900/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-base tracking-tight leading-none">Skills Hub</h1>
              <span className="text-[10px] font-bold text-slate-400 inline-block mt-0.5">
                Admin Panel
              </span>
            </div>
          </div>

          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                {group.title}
              </span>

              {group.items.map((item) => {
                const IconComp = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => {
                      setActiveTab(item.tab);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-900/40 font-bold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-purple-500 text-white animate-pulse">
                        {item.badge}
                      </span>
                    )}

                    {!item.badge && item.count !== undefined && (
                      <span className="text-[11px] font-mono font-medium text-slate-500">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Sidebar Sales Widget & Return Site/Logout Buttons */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-[#0B1120]">
          {/* Sales Sparkline Mini Card */}
          <div className="bg-[#131C31] border border-slate-800/80 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-slate-300 font-bold">Sales Overview</span>
              <select
                value={salesOverviewPeriod}
                onChange={(e) => setSalesOverviewPeriod(e.target.value)}
                className="bg-slate-900 text-slate-300 text-[10px] font-medium border border-slate-700/80 rounded-md px-1.5 py-0.5 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="this_year">This Year</option>
              </select>
            </div>

            <div className="flex items-baseline justify-between">
              <p className="text-sm font-extrabold text-white">
                {salesOverviewPeriod === 'this_year' ? '৳18,45,890' : salesOverviewPeriod === 'last_month' ? '৳1,22,400' : '৳1,45,890'}
              </p>
              <span className="text-emerald-400 flex items-center gap-0.5 text-[10px] font-bold">
                <TrendingUp className="w-3 h-3" /> +18.6%
              </span>
            </div>

            {/* Sparkline Chart SVG */}
            <div className="w-full h-8 pt-1">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 25" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sidebarSparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,20 Q15,6 30,17 T60,10 T80,15 T100,4 L100,25 L0,25 Z"
                  fill="url(#sidebarSparkGrad)"
                />
                <path
                  d="M0,20 Q15,6 30,17 T60,10 T80,15 T100,4"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={props.onReturnToSite}
              className="flex-1 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700/60"
            >
              <Home className="w-3.5 h-3.5" /> Website
            </button>

            <button
              onClick={props.onLogoutAdmin}
              className="flex-1 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 font-bold py-2 rounded-xl border border-rose-800/60 transition-colors flex items-center justify-center gap-1.5 text-xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Sticky Top Header Bar */}
        <header className={`sticky top-0 z-30 backdrop-blur-md border-b px-6 py-3 flex items-center justify-between gap-4 ${
          isDarkMode ? 'bg-[#0F0F1A]/90 border-slate-800 text-white' : 'bg-white/90 border-slate-200/80 text-slate-800 shadow-xs'
        }`}>
          
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 rounded-xl bg-slate-100 border border-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-base font-extrabold text-slate-900 capitalize">{activeTab.replace('-', ' ')}</h2>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Welcome back, <span className="text-purple-700 font-bold">{props.adminUser.name}</span>
              </p>
            </div>
          </div>

          {/* Right Controls: Search, Notifications, Lang, Admin Avatar */}
          <div className="flex items-center gap-3">
            
            {/* Search Bar */}
            <div className="hidden md:flex relative w-64">
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full bg-slate-100/80 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-600 placeholder:text-slate-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Language Selector */}
            <button
              onClick={() => setLang(lang === 'BN' ? 'EN' : 'BN')}
              className="px-2.5 py-1.5 bg-purple-50 border border-purple-200 text-xs font-bold text-purple-700 rounded-xl cursor-pointer"
            >
              {lang}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 rounded-xl relative transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {pendingOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 text-xs space-y-3 text-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900">Recent Alerts</span>
                    <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full">{pendingOrdersCount} Pending</span>
                  </div>

                  <div className="space-y-2">
                    {props.orders.slice(0, 3).map((ord) => (
                      <div key={ord.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{ord.id}</span>
                          <span className="text-emerald-600">৳{ord.amount}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{ord.productTitle}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('orders');
                      setNotificationsOpen(false);
                    }}
                    className="w-full text-center text-purple-700 font-bold hover:underline block pt-1 text-[11px] cursor-pointer"
                  >
                    Go to Orders Panel →
                  </button>
                </div>
              )}
            </div>

            {/* Admin Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center">
                  A
                </div>
                <div className="hidden sm:block text-left">
                  <span className="block text-xs font-bold text-slate-900 leading-tight">Admin</span>
                  <span className="block text-[10px] text-purple-700 font-semibold">Super Admin</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-xs space-y-1 text-slate-800">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{props.adminUser.email}</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">Security PIN: 1829 (Verified)</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('admin-staff');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
                  >
                    Change PIN & Security
                  </button>
                  <button
                    onClick={props.onLogoutAdmin}
                    className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout Admin
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Dynamic View Viewports */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              orders={props.orders}
              customers={props.customers}
              products={props.products}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAddProduct={() => setIsAddProductModalOpen(true)}
              onOpenAddAnnouncement={() => setIsAddAnnouncementModalOpen(true)}
              lang={lang}
            />
          )}

          {activeTab === 'products' && (
            <ProductsView
              products={props.products}
              categories={props.categories}
              onAddProduct={props.onAddProduct}
              onUpdateProduct={props.onUpdateProduct}
              onDeleteProduct={props.onDeleteProduct}
              isAddModalOpen={isAddProductModalOpen}
              onCloseAddModal={() => setIsAddProductModalOpen(false)}
            />
          )}

          {activeTab === 'bundles' && (
            <AdminBundlesView
              bundles={props.bundles}
              products={props.products}
              onAddBundle={props.onAddBundle}
              onUpdateBundle={props.onUpdateBundle}
              onDeleteBundle={props.onDeleteBundle}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView orders={props.orders} onUpdateOrderStatus={props.onUpdateOrderStatus} />
          )}

          {activeTab === 'customers' && (
            <CustomersView customers={props.customers} onToggleCustomerStatus={props.onToggleCustomerStatus} />
          )}

          {activeTab === 'reviews' && (
            <ReviewsView
              reviews={props.reviews}
              onApproveReview={props.onApproveReview}
              onRejectReview={props.onRejectReview}
              onDeleteReview={props.onDeleteReview}
              onReplyReview={props.onReplyReview}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesView
              categories={props.categories}
              onAddCategory={props.onAddCategory}
              onDeleteCategory={props.onDeleteCategory}
            />
          )}

          {activeTab === 'coupons' && (
            <CouponsView
              coupons={props.coupons}
              products={props.products}
              onAddCoupon={props.onAddCoupon}
              onUpdateCoupon={props.onUpdateCoupon}
              onDeleteCoupon={props.onDeleteCoupon}
            />
          )}

          {activeTab === 'withdrawals' && (
            <WithdrawalsView
              withdrawals={props.withdrawals}
              onApproveWithdraw={props.onApproveWithdraw}
              onRejectWithdraw={props.onRejectWithdraw}
            />
          )}

          {activeTab === 'blog' && (
            <BlogView
              posts={props.blogPosts}
              onAddPost={props.onAddBlogPost}
              onUpdatePost={props.onUpdateBlogPost}
              onDeletePost={props.onDeleteBlogPost}
            />
          )}

          {activeTab === 'subscribers' && (
            <SubscribersView
              subscribers={props.subscribers}
              onDeleteSubscriber={props.onDeleteSubscriber}
              onOpenBulkComposer={() => setActiveTab('whatsapp-email')}
            />
          )}

          {activeTab === 'announcements' && (
            <AnnouncementsView
              announcements={props.announcements}
              onAddAnnouncement={props.onAddAnnouncement}
              onToggleAnnouncementStatus={props.onToggleAnnouncementStatus}
              onDeleteAnnouncement={props.onDeleteAnnouncement}
              isAddModalOpen={isAddAnnouncementModalOpen}
              onCloseAddModal={() => setIsAddAnnouncementModalOpen(false)}
            />
          )}

          {activeTab === 'whatsapp-email' && (
            <WhatsAppEmailView
              settings={props.whatsappSettings}
              onSaveSettings={props.onSaveWhatsAppSettings}
            />
          )}

          {activeTab === 'payment-settings' && (
            <PaymentSettingsView settings={props.paymentSettings} onSave={props.onSavePaymentSettings} />
          )}

          {activeTab === 'general-settings' && (
            <GeneralSettingsView settings={props.generalSettings} onSave={props.onSaveGeneralSettings} />
          )}

          {activeTab === 'website-settings' && (
            <WebsiteSettingsView settings={props.websiteSettings} onSave={props.onSaveWebsiteSettings} />
          )}

          {activeTab === 'admin-staff' && (
            <AdminStaffView
              staff={props.staffMembers}
              onAddStaff={props.onAddStaffMember}
              onDeleteStaff={props.onDeleteStaffMember}
            />
          )}

          {activeTab === 'backup-tools' && (
            <BackupToolsView
              logs={props.auditLogs}
              products={props.products}
              onDownloadBackup={handleDownloadBackup}
              onClearCache={handleClearCache}
              onShowToast={props.onShowToast}
            />
          )}
        </main>

      </div>
    </div>
  );
};
