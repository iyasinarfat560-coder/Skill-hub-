import React, { useState, useMemo, useEffect } from 'react';
import { ViewMode, Course, CartItem, Category, Order, Customer, AdminReview, Coupon, WithdrawRequest, BlogPost, Subscriber, Announcement, StaffMember, GeneralSettings, PaymentSettingsData, WebsiteSettingsData, WhatsAppSettingsData, SystemAuditLog, AdminUser, Bundle } from './types';
import { CATEGORIES, POPULAR_COURSES, TESTIMONIALS } from './data/mockData';
import {
  ADMIN_SEED_CREDENTIALS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
  INITIAL_WITHDRAWALS,
  INITIAL_BLOG_POSTS,
  INITIAL_SUBSCRIBERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_STAFF,
  INITIAL_GENERAL_SETTINGS,
  INITIAL_PAYMENT_SETTINGS,
  INITIAL_WEBSITE_SETTINGS,
  INITIAL_WHATSAPP_SETTINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_BUNDLES,
} from './data/adminMockData';
import {
  fetchSupabaseAppState,
  saveSupabaseStateKey,
  saveSupabaseOrder,
  saveSupabaseSubscriber,
  saveFullSupabaseSnapshot,
} from './lib/supabase';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { CourseCard } from './components/CourseCard';
import { PromoStrip } from './components/PromoStrip';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { CourseDetailsView } from './components/CourseDetailsView';
import { CheckoutView } from './components/CheckoutView';
import { CustomerProfileView } from './components/CustomerProfileView';
import { BlogPublicView } from './components/BlogPublicView';
import { BundleOffersView } from './components/BundleOffersView';
import { CartDrawer } from './components/CartDrawer';
import { LoginModal } from './components/LoginModal';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { Toast } from './components/Toast';
import { ArrowRight, Search, Heart, X, Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(
    POPULAR_COURSES.find((c) => c.id === 'web-dev-bootcamp') || POPULAR_COURSES[1]
  );
  
  // Cart & Wishlist state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Course[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // User Auth state (Public Site)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Admin Auth & Dashboard State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser>({
    email: ADMIN_SEED_CREDENTIALS.email,
    phone: ADMIN_SEED_CREDENTIALS.phone,
    role: ADMIN_SEED_CREDENTIALS.role,
    name: ADMIN_SEED_CREDENTIALS.name,
    isLoggedIn: false,
    pinVerified: false,
  });

  // Master State Databases
  const [products, setProducts] = useState<Course[]>(POPULAR_COURSES);
  const [bundles, setBundles] = useState<Bundle[]>(INITIAL_BUNDLES);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [reviews, setReviews] = useState<AdminReview[]>(INITIAL_REVIEWS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [withdrawals, setWithdrawals] = useState<WithdrawRequest[]>(INITIAL_WITHDRAWALS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(INITIAL_SUBSCRIBERS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(INITIAL_STAFF);
  const [whatsappSettings, setWhatsappSettings] = useState<WhatsAppSettingsData>(INITIAL_WHATSAPP_SETTINGS);
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(INITIAL_GENERAL_SETTINGS);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettingsData>(INITIAL_PAYMENT_SETTINGS);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettingsData>(INITIAL_WEBSITE_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(INITIAL_AUDIT_LOGS);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Initial Sync from Supabase on mount
  useEffect(() => {
    async function initSupabaseData() {
      const dbData = await fetchSupabaseAppState();
      if (dbData) {
        if (dbData.products && dbData.products.length > 0) {
          // Merge products so we don't lose the newly added mock ebooks and source code
          const mergedProducts = [...dbData.products];
          let updated = false;
          POPULAR_COURSES.forEach((pc) => {
            if (!mergedProducts.some((p) => p.id === pc.id)) {
              mergedProducts.push(pc);
              updated = true;
            }
          });
          setProducts(mergedProducts);
          if (updated) {
            saveSupabaseStateKey('products', mergedProducts);
          }
        } else {
          setProducts(POPULAR_COURSES);
        }
        if (dbData.bundles && dbData.bundles.length > 0) setBundles(dbData.bundles);
        if (dbData.categories && dbData.categories.length > 0) setCategories(dbData.categories);
        if (dbData.orders && dbData.orders.length > 0) setOrders(dbData.orders);
        if (dbData.customers && dbData.customers.length > 0) setCustomers(dbData.customers);
        if (dbData.reviews && dbData.reviews.length > 0) setReviews(dbData.reviews);
        if (dbData.coupons && dbData.coupons.length > 0) setCoupons(dbData.coupons);
        if (dbData.blogPosts && dbData.blogPosts.length > 0) setBlogPosts(dbData.blogPosts);
        if (dbData.subscribers && dbData.subscribers.length > 0) setSubscribers(dbData.subscribers);
        if (dbData.announcements && dbData.announcements.length > 0) setAnnouncements(dbData.announcements);
        if (dbData.staffMembers && dbData.staffMembers.length > 0) setStaffMembers(dbData.staffMembers);
        if (dbData.generalSettings) setGeneralSettings(dbData.generalSettings);
        if (dbData.paymentSettings) setPaymentSettings(dbData.paymentSettings);
        if (dbData.websiteSettings) setWebsiteSettings(dbData.websiteSettings);
        if (dbData.whatsappSettings) setWhatsappSettings(dbData.whatsappSettings);
        if (dbData.auditLogs && dbData.auditLogs.length > 0) setAuditLogs(dbData.auditLogs);
      } else {
        // Initial Seed to Supabase if database empty
        saveFullSupabaseSnapshot({
          products: POPULAR_COURSES,
          categories: CATEGORIES,
          orders: INITIAL_ORDERS,
          customers: INITIAL_CUSTOMERS,
          reviews: INITIAL_REVIEWS,
          coupons: INITIAL_COUPONS,
          blogPosts: INITIAL_BLOG_POSTS,
          subscribers: INITIAL_SUBSCRIBERS,
          announcements: INITIAL_ANNOUNCEMENTS,
          staffMembers: INITIAL_STAFF,
          generalSettings: INITIAL_GENERAL_SETTINGS,
          paymentSettings: INITIAL_PAYMENT_SETTINGS,
          websiteSettings: INITIAL_WEBSITE_SETTINGS,
          whatsappSettings: INITIAL_WHATSAPP_SETTINGS,
          auditLogs: INITIAL_AUDIT_LOGS,
        });
      }
    }
    initSupabaseData();
  }, []);

  // Global keyboard & hash listener for hidden admin login modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminAuthModalOpen(true);
      }
    };
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminAuthModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash === '#admin') {
      setIsAdminAuthModalOpen(true);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Add to Cart handler
  const handleAddToCart = (course: Course, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    setCartItems((prev) => {
      const existing = prev.find((item) => item.course.id === course.id);
      if (existing) {
        return prev.map((item) =>
          item.course.id === course.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { course, quantity: 1 }];
    });

    showToast(`"${course.title.slice(0, 22)}..." কার্টে যুক্ত করা হয়েছে!`);
  };

  // Remove from Cart
  const handleRemoveFromCart = (courseId: string) => {
    setCartItems((prev) => prev.filter((item) => item.course.id !== courseId));
    showToast('কার্ট থেকে আইটেম মুছে ফেলা হয়েছে');
  };

  // Toggle Wishlist
  const handleToggleWishlist = (course: Course, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    setWishlist((prev) => {
      const exists = prev.some((c) => c.id === course.id);
      if (exists) {
        showToast('উইশলিস্ট থেকে সরানো হয়েছে');
        return prev.filter((c) => c.id !== course.id);
      } else {
        showToast('উইশলিস্টে যুক্ত করা হয়েছে!');
        return [...prev, course];
      }
    });
  };

  // Buy Now Action
  const handleBuyNow = (course: Course) => {
    setSelectedCourse(course);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered Courses calculation
  const filteredCourses = useMemo(() => {
    return products.filter((course) => {
      const matchesSearch =
        searchQuery === '' ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.tags && course.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      let activeCatId = selectedCategoryId;
      if (!activeCatId) {
        if (currentView === 'courses') activeCatId = 'courses';
        else if (currentView === 'ebooks') activeCatId = 'ebooks';
        else if (currentView === 'source-code') activeCatId = 'source-code';
      }

      const matchesCat = activeCatId === null || course.categoryId === activeCatId;

      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategoryId, currentView]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.course.discountPrice * item.quantity,
      0
    );
  }, [cartItems]);

  // Handlers for Admin Mutations
  const handleAddProduct = (newProd: Course) => {
    setProducts((prev) => {
      const updated = [newProd, ...prev];
      saveSupabaseStateKey('products', updated);
      return updated;
    });
    showToast('নতুন প্রোডাক্ট সফলভাবে যুক্ত করা হয়েছে!');
  };

  const handleUpdateProduct = (updatedProd: Course) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === updatedProd.id ? updatedProd : p));
      saveSupabaseStateKey('products', updated);
      return updated;
    });
    showToast('প্রোডাক্ট ডিটেইলস আপডেট করা হয়েছে!');
  };

  const handleDeleteProduct = (prodId: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== prodId);
      saveSupabaseStateKey('products', updated);
      return updated;
    });
    showToast('প্রোডাক্ট মুছে ফেলা হয়েছে');
  };

  const handleAddBundle = (newBundle: Bundle) => {
    setBundles((prev) => {
      const updated = [newBundle, ...prev];
      saveSupabaseStateKey('bundles', updated);
      return updated;
    });
    showToast('নতুন বান্ডেল অফার তৈরি হয়েছে!');
  };

  const handleUpdateBundle = (updatedBundle: Bundle) => {
    setBundles((prev) => {
      const updated = prev.map((b) => (b.id === updatedBundle.id ? updatedBundle : b));
      saveSupabaseStateKey('bundles', updated);
      return updated;
    });
    showToast('বান্ডেল ডিটেইলস আপডেট করা হয়েছে!');
  };

  const handleDeleteBundle = (bundleId: string) => {
    setBundles((prev) => {
      const updated = prev.filter((b) => b.id !== bundleId);
      saveSupabaseStateKey('bundles', updated);
      return updated;
    });
    showToast('বান্ডেল মুছে ফেলা হয়েছে');
  };

  const handleAddCategory = (cat: Category) => {
    setCategories((prev) => {
      const updated = [...prev, cat];
      saveSupabaseStateKey('categories', updated);
      return updated;
    });
    showToast('ক্যাটাগরি যুক্ত করা হয়েছে!');
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories((prev) => {
      const updated = prev.filter((c) => c.id !== catId);
      saveSupabaseStateKey('categories', updated);
      return updated;
    });
    showToast('ক্যাটাগরি মুছে ফেলা হয়েছে');
  };

  const handleUpdateOrderStatus = (orderId: string, status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled') => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status } : o));
      saveSupabaseStateKey('orders', updated);
      return updated;
    });
    showToast(`Order #${orderId} status is now ${status}`);
  };

  const handleOrderComplete = (newOrderOrOrders: Order | Order[], appliedCouponCode?: string) => {
    const ordersList = Array.isArray(newOrderOrOrders) ? newOrderOrOrders : [newOrderOrOrders];

    ordersList.forEach((o) => saveSupabaseOrder(o));

    setOrders((prev) => {
      const updatedOrders = [...ordersList, ...prev];
      saveSupabaseStateKey('orders', updatedOrders);
      return updatedOrders;
    });

    const firstOrder = ordersList[0];
    const totalOrderAmount = ordersList.reduce((acc, o) => acc + o.amount, 0);

    setCustomers((prev) => {
      let updatedCustomers: Customer[];
      const existing = prev.find((c) => c.email.toLowerCase() === firstOrder.customerEmail.toLowerCase());
      if (existing) {
        updatedCustomers = prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalOrders: c.totalOrders + ordersList.length,
                totalSpent: c.totalSpent + totalOrderAmount,
                lastOrderDate: firstOrder.date,
              }
            : c
        );
      } else {
        const newCustomer: Customer = {
          id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
          name: firstOrder.customerName,
          email: firstOrder.customerEmail,
          phone: firstOrder.customerPhone,
          totalOrders: ordersList.length,
          totalSpent: totalOrderAmount,
          status: 'Active',
          joinedDate: new Date().toISOString().substring(0, 10),
          lastOrderDate: firstOrder.date,
        };
        updatedCustomers = [newCustomer, ...prev];
      }
      saveSupabaseStateKey('customers', updatedCustomers);
      return updatedCustomers;
    });

    ordersList.forEach((o) => {
      if (o.productId) {
        setProducts((prev) => {
          const updatedProds = prev.map((p) => (p.id === o.productId ? { ...p, enrollmentCount: (p.enrollmentCount || 0) + 1 } : p));
          saveSupabaseStateKey('products', updatedProds);
          return updatedProds;
        });
      }
    });

    if (appliedCouponCode) {
      setCoupons((prev) => {
        const updatedCoupons = prev.map((c) => (c.code.toUpperCase() === appliedCouponCode.toUpperCase() ? { ...c, usedCount: c.usedCount + 1 } : c));
        saveSupabaseStateKey('coupons', updatedCoupons);
        return updatedCoupons;
      });
    }

    showToast(
      ordersList.length > 1
        ? `বান্ডেল পেমেন্ট সফল! ${ordersList.length} টি কোর্স/প্রোডাক্ট অর্ডারে যুক্ত হয়েছে।`
        : `অর্ডার #${firstOrder.id} সফলভাবে সিস্টেমে জমা হয়েছে!`
    );
  };

  const handleToggleCustomerStatus = (id: string) => {
    setCustomers((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, status: c.status === 'Active' ? 'Blocked' : 'Active' } : c));
      saveSupabaseStateKey('customers', updated);
      return updated;
    });
    showToast('কাস্টমার স্টেটাস আপডেট করা হয়েছে');
  };

  const handleApproveReview = (id: string) => {
    setReviews((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, status: 'Approved' as const } : r));
      saveSupabaseStateKey('reviews', updated);
      return updated;
    });
    showToast('রিভিউ অনুমোদন করা হয়েছে');
  };

  const handleRejectReview = (id: string) => {
    setReviews((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' as const } : r));
      saveSupabaseStateKey('reviews', updated);
      return updated;
    });
    showToast('রিভিউ রিজেক্ট করা হয়েছে');
  };

  const handleDeleteReview = (id: string) => {
    setReviews((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      saveSupabaseStateKey('reviews', updated);
      return updated;
    });
    showToast('রিভিউ মুছে ফেলা হয়েছে');
  };

  const handleReplyReview = (id: string, replyText: string) => {
    setReviews((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, adminReply: replyText } : r));
      saveSupabaseStateKey('reviews', updated);
      return updated;
    });
    showToast('এডমিন রিপ্লাই পোস্ট করা হয়েছে');
  };

  const handleAddCoupon = (cpn: Coupon) => {
    setCoupons((prev) => {
      const updated = [cpn, ...prev];
      saveSupabaseStateKey('coupons', updated);
      return updated;
    });
    showToast('কুপন কোড অ্যাক্টিভ করা হয়েছে!');
  };

  const handleUpdateCoupon = (cpn: Coupon) => {
    setCoupons((prev) => {
      const updated = prev.map((c) => (c.id === cpn.id ? cpn : c));
      saveSupabaseStateKey('coupons', updated);
      return updated;
    });
    showToast('কুপন আপডেট করা হয়েছে!');
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveSupabaseStateKey('coupons', updated);
      return updated;
    });
    showToast('কুপন মুছে ফেলা হয়েছে');
  };

  const handleApproveWithdraw = (id: string) => {
    setWithdrawals((prev) => prev.map((w) => (w.id === id ? { ...w, status: 'Approved' } : w)));
    showToast('উইথড্র রিকোয়েস্ট অ্যাপ্রুভ করা হয়েছে');
  };

  const handleRejectWithdraw = (id: string) => {
    setWithdrawals((prev) => prev.map((w) => (w.id === id ? { ...w, status: 'Rejected' } : w)));
    showToast('উইথড্র রিকোয়েস্ট রিজেক্ট করা হয়েছে');
  };

  const handleAddBlogPost = (b: BlogPost) => {
    setBlogPosts((prev) => {
      const updated = [b, ...prev];
      saveSupabaseStateKey('blogPosts', updated);
      return updated;
    });
    showToast('ব্লগ পোস্ট পাবলিশ করা হয়েছে!');
  };

  const handleUpdateBlogPost = (updatedPost: BlogPost) => {
    setBlogPosts((prev) => {
      const updated = prev.map((b) => (b.id === updatedPost.id ? updatedPost : b));
      saveSupabaseStateKey('blogPosts', updated);
      return updated;
    });
    showToast('ব্লগ পোস্ট আপডেট করা হয়েছে!');
  };

  const handleDeleteBlogPost = (id: string) => {
    setBlogPosts((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      saveSupabaseStateKey('blogPosts', updated);
      return updated;
    });
    showToast('ব্লগ পোস্ট মুছে ফেলা হয়েছে');
  };

  const handleDeleteSubscriber = (id: string) => {
    setSubscribers((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveSupabaseStateKey('subscribers', updated);
      return updated;
    });
    showToast('সাবস্ক্রাইবার তালিকা থেকে সরানো হয়েছে');
  };

  const handleAddAnnouncement = (a: Announcement) => {
    setAnnouncements((prev) => {
      const updated = [a, ...prev];
      saveSupabaseStateKey('announcements', updated);
      return updated;
    });
    showToast('এনান্সমেন্ট পাবলিশ করা হয়েছে!');
  };

  const handleToggleAnnouncementStatus = (id: string) => {
    setAnnouncements((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, status: a.status === 'Active' ? ('Inactive' as const) : ('Active' as const) } : a));
      saveSupabaseStateKey('announcements', updated);
      return updated;
    });
    showToast('এনান্সমেন্ট স্ট্যাটাস টগল করা হয়েছে');
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      saveSupabaseStateKey('announcements', updated);
      return updated;
    });
    showToast('এনান্সমেন্ট মুছে ফেলা হয়েছে');
  };

  const handleAddStaffMember = (s: StaffMember) => {
    setStaffMembers((prev) => {
      const updated = [s, ...prev];
      saveSupabaseStateKey('staffMembers', updated);
      return updated;
    });
    showToast('স্টাফ মেম্বার যুক্ত করা হয়েছে');
  };

  const handleDeleteStaffMember = (id: string) => {
    setStaffMembers((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveSupabaseStateKey('staffMembers', updated);
      return updated;
    });
    showToast('স্টাফ মুছে ফেলা হয়েছে');
  };

  const handleSaveWhatsAppSettings = (data: WhatsAppSettingsData) => {
    setWhatsappSettings(data);
    saveSupabaseStateKey('whatsappSettings', data);
  };

  const handleSaveGeneralSettings = (data: GeneralSettings) => {
    setGeneralSettings(data);
    saveSupabaseStateKey('generalSettings', data);
  };

  const handleSavePaymentSettings = (data: PaymentSettingsData) => {
    setPaymentSettings(data);
    saveSupabaseStateKey('paymentSettings', data);
  };

  const handleSaveWebsiteSettings = (data: WebsiteSettingsData) => {
    setWebsiteSettings(data);
    saveSupabaseStateKey('websiteSettings', data);
  };


  // Direct Admin Panel View rendering when view is 'admin' and logged in
  if (currentView === 'admin' && isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0A0A12] text-slate-100 selection:bg-purple-500 selection:text-white font-sans">
        <AdminLayout
          adminUser={adminUser}
          onLogoutAdmin={() => {
            setIsAdminLoggedIn(false);
            setAdminUser((prev) => ({ ...prev, isLoggedIn: false, pinVerified: false }));
            setCurrentView('home');
            showToast('অ্যাডমিন সেশন সফলভাবে লগআউট হয়েছে');
          }}
          onReturnToSite={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          products={products}
          bundles={bundles}
          categories={categories}
          orders={orders}
          customers={customers}
          reviews={reviews}
          coupons={coupons}
          withdrawals={withdrawals}
          blogPosts={blogPosts}
          subscribers={subscribers}
          announcements={announcements}
          staffMembers={staffMembers}
          whatsappSettings={whatsappSettings}
          generalSettings={generalSettings}
          paymentSettings={paymentSettings}
          websiteSettings={websiteSettings}
          auditLogs={auditLogs}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onAddBundle={handleAddBundle}
          onUpdateBundle={handleUpdateBundle}
          onDeleteBundle={handleDeleteBundle}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onToggleCustomerStatus={handleToggleCustomerStatus}
          onApproveReview={handleApproveReview}
          onRejectReview={handleRejectReview}
          onDeleteReview={handleDeleteReview}
          onReplyReview={handleReplyReview}
          onAddCoupon={handleAddCoupon}
          onUpdateCoupon={handleUpdateCoupon}
          onDeleteCoupon={handleDeleteCoupon}
          onApproveWithdraw={handleApproveWithdraw}
          onRejectWithdraw={handleRejectWithdraw}
          onAddBlogPost={handleAddBlogPost}
          onUpdateBlogPost={handleUpdateBlogPost}
          onDeleteBlogPost={handleDeleteBlogPost}
          onDeleteSubscriber={handleDeleteSubscriber}
          onAddAnnouncement={handleAddAnnouncement}
          onToggleAnnouncementStatus={handleToggleAnnouncementStatus}
          onDeleteAnnouncement={handleDeleteAnnouncement}
          onAddStaffMember={handleAddStaffMember}
          onDeleteStaffMember={handleDeleteStaffMember}
          onSaveWhatsAppSettings={handleSaveWhatsAppSettings}
          onSaveGeneralSettings={handleSaveGeneralSettings}
          onSavePaymentSettings={setPaymentSettings}
          onSaveWebsiteSettings={setWebsiteSettings}
        />

        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 selection:bg-purple-200 selection:text-purple-900">
      
      {/* Top Website Banner Notice */}
      {announcements.find((a) => a.status === 'Active' && a.type === 'banner') && (
        <div className="bg-purple-950 text-purple-200 px-4 py-2 text-center text-xs font-bold border-b border-purple-800 flex items-center justify-center gap-2">
          <span>{announcements.find((a) => a.status === 'Active' && a.type === 'banner')?.message}</span>
        </div>
      )}

      {/* Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === 'courses') setSelectedCategoryId('courses');
          else if (view === 'ebooks') setSelectedCategoryId('ebooks');
          else if (view === 'source-code') setSelectedCategoryId('source-code');
          else setSelectedCategoryId(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAdminAuth={() => setIsAdminAuthModalOpen(true)}
        user={user}
        onLogout={() => {
          setUser(null);
          showToast('লগআউট সফল হয়েছে');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={(q) => {
          setSearchQuery(q);
          setSelectedCategoryId('courses');
          setCurrentView('courses');
        }}
        websiteSettings={websiteSettings}
      />

      {/* Main View Router */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <div className="space-y-4 animate-fade-in">
            {/* Hero Section */}
            <Hero
              onExploreCourses={() => {
                setSelectedCategoryId('courses');
                setCurrentView('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBrowseAll={() => {
                setSelectedCategoryId('courses');
                setCurrentView('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              websiteSettings={websiteSettings}
            />

            {/* Top Categories */}
            <CategoryGrid
              categories={categories}
              onSelectCategory={(catId) => {
                setSelectedCategoryId(catId);
                if (catId === 'ebooks') setCurrentView('ebooks');
                else if (catId === 'source-code') setCurrentView('source-code');
                else setCurrentView('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewAll={() => {
                setSelectedCategoryId('courses');
                setCurrentView('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Popular Courses Section */}
            <section className="py-12 bg-white border-t border-slate-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      জনপ্রিয় কোর্সসমূহ
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      আমাদের সবচেয়ে জনপ্রিয় ও শীর্ষ রেটেড কোর্স এবং ডিজিটাল অ্যাসেট
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCategoryId(null);
                      setCurrentView('courses');
                    }}
                    className="text-purple-700 hover:text-purple-800 font-bold text-sm flex items-center gap-1 group cursor-pointer"
                    id="view-all-popular-courses-btn"
                  >
                    <span>সবগুলো দেখুন</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* 4 Column Courses Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.slice(0, 4).map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onSelect={(c) => {
                        setSelectedCourse(c);
                        setCurrentView('course-details');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlist.some((w) => w.id === course.id)}
                    />
                  ))}
                </div>

              </div>
            </section>

            {/* Promo Feature Strip Banner */}
            <PromoStrip />

            {/* Testimonials */}
            <Testimonials testimonials={TESTIMONIALS} />
          </div>
        )}

        {/* VIEW 2: COURSE DETAILS PAGE */}
        {currentView === 'course-details' && selectedCourse && (
          <CourseDetailsView
            course={selectedCourse}
            onNavigateHome={() => setCurrentView('home')}
            onNavigateCourses={() => setCurrentView('courses')}
            onBuyNow={handleBuyNow}
            onAddToCart={(c) => handleAddToCart(c)}
            onToggleWishlist={(c) => handleToggleWishlist(c)}
            isWishlisted={wishlist.some((w) => w.id === selectedCourse.id)}
            coupons={coupons}
            whatsappSettings={whatsappSettings}
          />
        )}

        {/* VIEW 3: CHECKOUT / PAYMENT FLOW */}
        {currentView === 'checkout' && (
          <CheckoutView
            selectedCourse={selectedCourse}
            selectedBundle={selectedBundle}
            products={products}
            cartTotal={cartTotal}
            onBackToShopping={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowToast={showToast}
            paymentSettings={paymentSettings}
            coupons={coupons}
            onOrderComplete={handleOrderComplete}
            whatsappSettings={whatsappSettings}
          />
        )}

        {/* VIEW 3.5: CUSTOMER PROFILE / MY ORDERS */}
        {currentView === 'profile' && (
          <CustomerProfileView
            user={user}
            orders={orders}
            products={products}
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowToast={showToast}
            onOpenLogin={() => setIsLoginOpen(true)}
            onSelectCourseForDetails={(course) => {
              setSelectedCourse(course);
              setCurrentView('course-details');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW 3.6: BLOG VIEW */}
        {currentView === 'blog' && (
          <BlogPublicView
            posts={blogPosts}
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowToast={showToast}
          />
        )}

        {/* VIEW 3.7: BUNDLE OFFERS VIEW */}
        {currentView === 'bundles' && (
          <BundleOffersView
            bundles={bundles}
            products={products}
            onSelectBundleForCheckout={(bundle) => {
              setSelectedBundle(bundle);
              setSelectedCourse(null);
              setCurrentView('checkout');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCourseForDetails={(course) => {
              setSelectedCourse(course);
              setCurrentView('course-details');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW 4: ALL COURSES / CATEGORY LIST VIEW */}
        {(currentView === 'courses' || currentView === 'ebooks' || currentView === 'source-code') && (
          <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            
            {/* View Header */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="bg-purple-600/60 text-purple-200 text-xs font-bold px-3 py-1 rounded-full border border-purple-400/30">
                  স্কিলস হাব মার্কেটপ্লেস
                </span>
                <h1 className="text-3xl sm:text-4xl font-black">
                  {currentView === 'courses' && 'সবগুলো ডিজিটাল প্রোডাক্ট ব্রাউজ করুন'}
                  {currentView === 'ebooks' && 'ই-বুক ও বই সংগ্রহ'}
                  {currentView === 'source-code' && 'প্রিমিয়াম সোর্স কোড ও রিসোর্স'}
                </h1>
                <p className="text-purple-200 text-sm max-w-lg">
                  আপনার প্রিয় কোর্স, ই-বুক এবং সোর্স কোড সংগ্রহ করুন সহজেই
                </p>
              </div>

              {/* Filter Search Input */}
              <div className="w-full md:w-80 relative">
                <input
                  type="text"
                  placeholder="খুঁজুন (যেমন: Python, Web)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full pl-10 pr-4 py-3 text-white text-sm placeholder:text-purple-200 focus:outline-hidden focus:bg-white/20 transition-all"
                />
                <Search className="w-4 h-4 text-purple-200 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => {
                  setSelectedCategoryId(null);
                  setCurrentView('courses');
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategoryId === null
                    ? 'bg-purple-700 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                সকল ক্যাটাগরি
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    if (cat.id === 'courses' || cat.id === 'ebooks' || cat.id === 'source-code') {
                      setCurrentView(cat.id as any);
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategoryId === cat.id
                      ? 'bg-purple-700 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Results Grid */}
            {filteredCourses.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
                <Search className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">কোন ফলাফল পাওয়া যায়নি</h3>
                <p className="text-slate-500 text-xs">অন্য কি-ওয়ার্ড দিয়ে আবার চেষ্টা করুন</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategoryId(null);
                  }}
                  className="bg-purple-50 text-purple-700 font-bold text-xs px-4 py-2 rounded-full border border-purple-200"
                >
                  রিসেট করুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onSelect={(c) => {
                      setSelectedCourse(c);
                      setCurrentView('course-details');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlist.some((w) => w.id === course.id)}
                  />
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <Footer
        onNavigate={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdminAuth={() => setIsAdminAuthModalOpen(true)}
        whatsappSettings={whatsappSettings}
        websiteSettings={websiteSettings}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          setCurrentView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Wishlist Drawer Modal */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsWishlistOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600 fill-pink-600" />
                  <h2 className="text-lg font-bold text-slate-900">আপনার উইশলিস্ট</h2>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {wishlist.length === 0 ? (
                  <p className="text-center text-slate-400 text-xs py-10 font-semibold">
                    উইশলিস্টে কোনো কোর্স যুক্ত নেই
                  </p>
                ) : (
                  wishlist.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedCourse(c);
                        setCurrentView('course-details');
                        setIsWishlistOpen(false);
                      }}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-purple-50/50"
                    >
                      <span className="text-xs font-bold text-slate-900 line-clamp-1">{c.title}</span>
                      <span className="text-xs font-extrabold text-purple-700">৳{c.discountPrice}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Public Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(u) => {
          setUser(u);
          showToast(`স্বাগতম, ${u.name}!`);
        }}
      />

      {/* 2-Step Admin Auth Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccessLogin={() => {
          setIsAdminLoggedIn(true);
          setAdminUser((prev) => ({ ...prev, isLoggedIn: true, pinVerified: true }));
          setCurrentView('admin');
          showToast('অ্যাডমিন কন্ট্রোল প্যানেলে স্বাগতম!');
        }}
      />

      {/* Toast Notifications */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

    </div>
  );
}

