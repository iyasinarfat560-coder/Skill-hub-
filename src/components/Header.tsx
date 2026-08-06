import React, { useState } from 'react';
import { GraduationCap, Search, ShoppingCart, Heart, User, Menu, X, LogOut, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';
import { ViewMode, WebsiteSettingsData } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenLogin: () => void;
  onOpenAdminAuth: () => void;
  user: { name: string; email: string } | null;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  websiteSettings?: WebsiteSettingsData;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenLogin,
  onOpenAdminAuth,
  user,
  onLogout,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  websiteSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const siteTitle = websiteSettings?.siteTitle || 'Skills Hub';

  const navItems = [
    { label: 'হোম', view: 'home' as ViewMode },
    { label: 'কোর্সসমূহ', view: 'courses' as ViewMode },
    { label: 'ই-বুক', view: 'ebooks' as ViewMode },
    { label: 'প্রিমিয়াম রিসোর্স', view: 'source-code' as ViewMode },
    { label: 'বান্ডেল অফার', view: 'bundles' as ViewMode },
    { label: 'ব্লগ', view: 'blog' as ViewMode },
  ];

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <>
      {/* Top Banner Notice Strip if enabled in Website Settings */}
      {websiteSettings?.enableTopNotice && websiteSettings.topNoticeText && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 border-b border-purple-800/50 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
          <span>{websiteSettings.topNoticeText}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            
            {/* Logo */}
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 cursor-pointer group flex-shrink-0 min-w-0"
              id="brand-logo"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-200 group-hover:scale-105 transition-transform flex-shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-base sm:text-2xl font-extrabold tracking-tight text-slate-900 truncate">
                {siteTitle.includes(' ') ? (
                  <>
                    {siteTitle.split(' ')[0]} <span className="text-purple-600">{siteTitle.split(' ').slice(1).join(' ')}</span>
                  </>
                ) : (
                  <span className="text-purple-600">{siteTitle}</span>
                )}
              </span>
            </div>

          {/* Search Bar on Course Details Page or Top Header */}
          {(currentView === 'course-details' || currentView === 'courses') ? (
            <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
              <input
                type="text"
                placeholder="কোর্স, ই-বুক বা প্রিমিয়াম রিসোর্স খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-800 text-sm rounded-full pl-10 pr-10 py-2.5 border border-slate-200 focus:outline-hidden focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
                id="header-search-input"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          ) : (
            /* Desktop Nav Links */
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onNavigate(item.view)}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    currentView === item.view
                      ? 'text-purple-700 bg-purple-50'
                      : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                  }`}
                  id={`nav-link-${item.view}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            {/* Search Icon button for mobile / general */}
            <button
              onClick={() => onNavigate('courses')}
              className="p-1.5 sm:p-2 text-slate-600 hover:text-purple-600 rounded-full hover:bg-slate-100 transition-colors md:hidden"
              title="Search Courses"
              id="header-search-btn-mobile"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={onOpenWishlist}
              className="p-1.5 sm:p-2 text-slate-600 hover:text-purple-600 rounded-full hover:bg-slate-100 transition-colors relative"
              title="Wishlist"
              id="header-wishlist-btn"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={onOpenCart}
              className="p-1.5 sm:p-2 text-slate-600 hover:text-purple-600 rounded-full hover:bg-slate-100 transition-colors relative"
              title="Cart"
              id="header-cart-btn"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 ? (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                  {cartCount}
                </span>
              ) : (
                <span className="absolute -top-1 -right-1 bg-slate-300 text-slate-700 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  0
                </span>
              )}
            </button>

            {/* Auth / Login Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 pl-1.5 sm:pl-2 pr-2 sm:pr-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-900 font-semibold text-xs sm:text-sm hover:bg-purple-100 transition-colors"
                  id="user-profile-menu"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[50px] sm:max-w-[120px] truncate">{user.name}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
                      আমার অর্ডারসমূহ
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      লগআউট
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full shadow-md shadow-purple-200 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                id="header-login-btn"
              >
                লগইন
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 text-slate-600 hover:text-purple-600 rounded-lg md:hidden flex-shrink-0"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onNavigate(item.view);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-lg ${
                currentView === item.view
                  ? 'text-purple-700 bg-purple-50'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  </>
  );
};
