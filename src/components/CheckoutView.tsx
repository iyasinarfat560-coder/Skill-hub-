import React, { useState } from 'react';
import { Check, Copy, CheckCircle2, ShieldCheck, ArrowLeft, AlertCircle, Tag, Package, MessageSquare } from 'lucide-react';
import { Course, Bundle, PaymentMethodType, UserDetails, PaymentSettingsData, Coupon, Order, WhatsAppSettingsData } from '../types';
import { PAYMENT_METHODS } from '../data/mockData';

interface CheckoutViewProps {
  selectedCourse: Course | null;
  selectedBundle?: Bundle | null;
  products?: Course[];
  cartTotal?: number;
  onBackToShopping: () => void;
  onShowToast: (msg: string) => void;
  paymentSettings?: PaymentSettingsData;
  coupons?: Coupon[];
  onOrderComplete?: (newOrder: Order | Order[], appliedCouponCode?: string) => void;
  whatsappSettings?: WhatsAppSettingsData;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  selectedCourse,
  selectedBundle,
  products = [],
  cartTotal,
  onBackToShopping,
  onShowToast,
  paymentSettings,
  coupons = [],
  onOrderComplete,
  whatsappSettings,
}) => {
  const whatsappChatLink = whatsappSettings?.whatsappChatLink || 'https://wa.me/8801861612289';
  // Step 1 Form State
  const [userDetails, setUserDetails] = useState<UserDetails>({
    fullName: '',
    whatsapp: '',
    email: '',
    country: 'Bangladesh',
    notes: '',
  });

  // Step 2 Payment Method selection
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('bkash');

  // Coupon states
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Step 3 TxID input
  const [transactionId, setTransactionId] = useState('');
  const [txError, setTxError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Dynamic Merchant Number based on selected method & paymentSettings
  const merchantNumber = selectedMethod === 'bkash'
    ? (paymentSettings?.bkashNumber || '01861612289')
    : selectedMethod === 'nagad'
    ? (paymentSettings?.nagadNumber || '01861612289')
    : (paymentSettings?.rocketNumber || '01861612289');

  // Payable Amount calculation
  const baseAmount = selectedBundle 
    ? selectedBundle.bundlePrice 
    : (selectedCourse ? selectedCourse.discountPrice : (cartTotal || 699));

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((baseAmount * appliedCoupon.discountValue) / 100);
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }
  const finalPayableAmount = Math.max(0, baseAmount - discountAmount);

  const activeMethodInfo = PAYMENT_METHODS[selectedMethod];

  // Coupon apply handler
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError('অনুগ্রহ করে কুপন কোড দিন');
      return;
    }

    const matched = coupons.find(
      (c) => c.code.toUpperCase() === code && (c.status === 'Active' || c.status === 'Disabled' ? false : true)
    );

    if (matched) {
      if (matched.usedCount >= matched.usageLimit) {
        setCouponError('এই কুপনের ব্যবহারের সীমা শেষ হয়ে গেছে');
        return;
      }
      setAppliedCoupon(matched);
      onShowToast(`'${matched.code}' কুপন সফলভাবে যুক্ত হয়েছে!`);
    } else {
      setCouponError('অবৈধ বা মেয়াদোত্তীর্ণ কুপন কোড');
    }
  };

  // Clipboard Copy helper
  const handleCopyMerchantNumber = () => {
    navigator.clipboard.writeText(merchantNumber);
    onShowToast(`নাম্বার কপি করা হয়েছে! (${merchantNumber})`);
  };

  // Transaction verification simulation & order trigger
  const handleVerifyTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setTxError('অনুগ্রহ করে আপনার ট্রানজেকশন আইডি প্রদান করুন');
      return;
    }

    if (transactionId.length < 6) {
      setTxError('সঠিক ট্রানজেকশন আইডি লিখুন (নূন্যতম ৬ অক্ষর/সংখ্যা)');
      return;
    }

    setTxError('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setPaymentSuccess(true);
      onShowToast('পেমেন্ট ভেরিফিকেশন সফল হয়েছে!');

      if (selectedBundle && selectedBundle.productIds.length > 0) {
        // Create individual order records for each item in the bundle so customer tracks each separately
        const perItemAmount = Math.round(finalPayableAmount / selectedBundle.productIds.length);
        const bundleOrders: Order[] = selectedBundle.productIds.map((pid, idx) => {
          const prod = products.find((p) => p.id === pid);
          return {
            id: `ORD-${Math.floor(1000 + Math.random() * 9000)}-${idx + 1}`,
            customerName: userDetails.fullName || 'Customer',
            customerEmail: userDetails.email || 'customer@gmail.com',
            customerPhone: userDetails.whatsapp || '01861612289',
            productTitle: prod ? prod.title : `Bundle Product (${pid})`,
            productId: pid,
            amount: perItemAmount,
            paymentMethod: selectedMethod,
            transactionId: transactionId.trim().toUpperCase(),
            status: 'Pending',
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            itemCategory: prod ? prod.category : 'Bundle',
          };
        });

        if (onOrderComplete) {
          onOrderComplete(bundleOrders, appliedCoupon?.code);
        }
      } else {
        const newOrder: Order = {
          id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          customerName: userDetails.fullName || 'Customer',
          customerEmail: userDetails.email || 'customer@gmail.com',
          customerPhone: userDetails.whatsapp || '01861612289',
          productTitle: selectedCourse ? selectedCourse.title : 'Skills Hub Purchase',
          productId: selectedCourse ? selectedCourse.id : 'item',
          amount: finalPayableAmount,
          paymentMethod: selectedMethod,
          transactionId: transactionId.trim().toUpperCase(),
          status: 'Pending',
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          itemCategory: selectedCourse ? selectedCourse.category : 'General',
        };

        if (onOrderComplete) {
          onOrderComplete(newOrder, appliedCoupon?.code);
        }
      }
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToShopping}
            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>শপিং এ ফিরে যান</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">১০০% সুরক্ষিত ম্যানুয়াল পেমেন্ট সিস্টেম</span>
          </div>
        </div>

        {/* Selected Product Summary & Coupon Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                অর্ডার বিবরণী
              </span>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {selectedBundle ? selectedBundle.title : (selectedCourse ? selectedCourse.title : 'Skills Hub Purchase')}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-semibold">সর্বমোট মূল্য</span>
              {discountAmount > 0 ? (
                <div>
                  <span className="text-xs text-slate-400 line-through mr-1.5">৳{baseAmount}</span>
                  <span className="text-xl font-black text-purple-700">৳{finalPayableAmount}</span>
                </div>
              ) : (
                <span className="text-xl font-black text-purple-700">৳{baseAmount}</span>
              )}
            </div>
          </div>

          {/* Coupon Code Apply Form */}
          <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100">
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="কুপন কোড (যেমন: WELCOME20)..."
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    if (couponError) setCouponError(null);
                  }}
                  className="w-full bg-white border border-purple-200 rounded-lg pl-9 pr-3 py-2 text-xs font-bold uppercase text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-200"
                />
                <Tag className="w-4 h-4 text-purple-600 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                এপ্লাই
              </button>
            </form>

            {appliedCoupon && (
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>'{appliedCoupon.code}' কুপন যুক্ত হয়েছে! (ছাড়: {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `৳${appliedCoupon.discountValue}`})</span>
              </p>
            )}

            {couponError && (
              <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{couponError}</span>
              </p>
            )}
          </div>
        </div>

        {/* If Payment Completed: Show Success State Screen */}
        {paymentSuccess ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6 animate-fade-in">
            
            {/* Animated Checkmark Circle */}
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            {/* Success Headline */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-600">
                পেমেন্ট সফল হয়েছে!
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                ধন্যবাদ! আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে। খুব শীঘ্রই আপনার WhatsApp অথবা Email এ বিস্তারিত পাঠানো হবে।
              </p>
            </div>

            {/* Order Details Receipt summary */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left text-xs text-slate-700 space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">ট্রানজেকশন আইডি:</span>
                <span className="font-mono font-extrabold text-slate-900">{transactionId.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">পেমেন্ট মেথড:</span>
                <span className="font-bold capitalize text-slate-900">{selectedMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">গ্রাহকের নাম:</span>
                <span className="font-bold text-slate-900">{userDetails.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">WhatsApp:</span>
                <span className="font-bold text-slate-900">{userDetails.whatsapp}</span>
              </div>
            </div>

            {/* Continue Shopping Button */}
            <button
              onClick={onBackToShopping}
              className="w-full sm:w-80 mx-auto bg-purple-700 hover:bg-purple-800 text-white font-bold text-base py-3.5 rounded-full shadow-lg shadow-purple-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              id="continue-shopping-btn"
            >
              শপিং চালিয়ে যান
            </button>

          </div>
        ) : (
          /* Main 3-Step Stacked Form Cards */
          <div className="space-y-6">
            
            {/* STEP 1 Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                  ১
                </span>
                <span>১. আপনার তথ্য দিন</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    আপনার নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={userDetails.fullName}
                    onChange={(e) => setUserDetails({ ...userDetails, fullName: e.target.value })}
                    placeholder="আপনার নাম লিখুন"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-purple-600 transition-all"
                  />
                </div>

                {/* WhatsApp Number */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    WhatsApp নাম্বার <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={userDetails.whatsapp}
                    onChange={(e) => setUserDetails({ ...userDetails, whatsapp: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-purple-600 transition-all"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                    placeholder="your-email@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-purple-600 transition-all"
                  />
                </div>

                {/* Country */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    Country <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={userDetails.country}
                    onChange={(e) => setUserDetails({ ...userDetails, country: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-purple-600 transition-all"
                  >
                    <option value="Bangladesh">Bangladesh</option>
                  </select>
                </div>

                {/* Optional Note */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    নোট (ঐচ্ছিক)
                  </label>
                  <textarea
                    rows={2}
                    value={userDetails.notes}
                    onChange={(e) => setUserDetails({ ...userDetails, notes: e.target.value })}
                    placeholder="কিছু লিখুন (ঐচ্ছিক)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-purple-600 transition-all"
                  />
                </div>

              </div>
            </div>

            {/* STEP 2 Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                  ২
                </span>
                <span>২. পেমেন্ট মেথড বাছাই করুন</span>
              </h2>

              <p className="text-xs text-slate-500 font-medium">
                আপনার সুবিধামত একটি পেমেন্ট মেথড নির্বাচন করুন
              </p>

              {/* Selectable Payment Method Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                
                {/* bKash */}
                {(paymentSettings?.bkashActive ?? true) && (
                  <div
                    onClick={() => setSelectedMethod('bkash')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center flex flex-col items-center justify-between ${
                      selectedMethod === 'bkash'
                        ? 'border-pink-600 bg-pink-50/50 shadow-md ring-2 ring-pink-200'
                        : 'border-slate-200 bg-white hover:border-pink-300'
                    }`}
                    id="payment-method-bkash"
                  >
                    <div className="w-10 h-10 rounded-xl bg-pink-600 text-white font-black flex items-center justify-center text-sm shadow-xs mb-2">
                      bK
                    </div>
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm block">bKash</span>
                    <span className="text-[10px] text-pink-600 font-semibold mt-0.5">পেমেন্ট করুন</span>
                  </div>
                )}

                {/* Nagad */}
                {(paymentSettings?.nagadActive ?? true) && (
                  <div
                    onClick={() => setSelectedMethod('nagad')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center flex flex-col items-center justify-between ${
                      selectedMethod === 'nagad'
                        ? 'border-amber-600 bg-amber-50/50 shadow-md ring-2 ring-amber-200'
                        : 'border-slate-200 bg-white hover:border-amber-300'
                    }`}
                    id="payment-method-nagad"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center text-sm shadow-xs mb-2">
                      NG
                    </div>
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm block">Nagad</span>
                    <span className="text-[10px] text-amber-600 font-semibold mt-0.5">পেমেন্ট করুন</span>
                  </div>
                )}

                {/* Rocket */}
                {(paymentSettings?.rocketActive ?? true) && (
                  <div
                    onClick={() => setSelectedMethod('rocket')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center flex flex-col items-center justify-between ${
                      selectedMethod === 'rocket'
                        ? 'border-purple-600 bg-purple-50/50 shadow-md ring-2 ring-purple-200'
                        : 'border-slate-200 bg-white hover:border-purple-300'
                    }`}
                    id="payment-method-rocket"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-xs mb-2">
                      RC
                    </div>
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm block">Rocket</span>
                    <span className="text-[10px] text-purple-600 font-semibold mt-0.5">পেমেন্ট করুন</span>
                  </div>
                )}

              </div>
            </div>

            {/* STEP 3 Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              
              {/* Header with Amount */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                    ৩
                  </span>
                  <span>৩. পেমেন্ট সম্পন্ন করুন ({activeMethodInfo.name})</span>
                </h2>

                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-slate-900">
                    ৳{finalPayableAmount} BDT
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold block">পেমেন্ট করুন</span>
                </div>
              </div>

              {/* Pink/Magenta Info Banner */}
              <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 text-white font-bold text-xs sm:text-sm p-3.5 rounded-xl shadow-xs text-center">
                পেমেন্ট সম্পন্ন করতে নিচের নির্দেশনা অনুসরণ করুন
              </div>

              {/* Transaction ID Input Form */}
              <form onSubmit={handleVerifyTransaction} className="space-y-6">
                
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 text-xs sm:text-sm block">
                    ট্রানজেকশন আইডি দিন <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => {
                      setTransactionId(e.target.value);
                      if (txError) setTxError('');
                    }}
                    placeholder="ট্রানজেকশন আইডি লিখুন (যেমন: 9J8K7L6M)"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 font-mono font-bold uppercase focus:bg-white focus:outline-hidden transition-all ${
                      txError ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-200 focus:border-pink-600'
                    }`}
                    id="txid-input"
                  />
                  {txError && (
                    <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 pt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{txError}</span>
                    </p>
                  )}
                </div>

                {/* Instructions Box */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-pink-600 text-xs sm:text-sm tracking-wider uppercase">
                    পেমেন্ট নির্দেশনাবলী
                  </h4>

                  <ol className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                    {activeMethodInfo.instructions.map((inst, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0 mt-1.5"></span>
                        <div className="flex-1">
                          {inst.includes('01909905849') || inst.includes('নাম্বারটি দিন') ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span>প্রাপক নাম্বার হিসেবে এই নাম্বারটি দিন:</span>
                              <span className="font-mono font-extrabold text-slate-900 bg-white px-2.5 py-0.5 rounded-md border border-slate-300">
                                {merchantNumber}
                              </span>
                              <button
                                type="button"
                                onClick={handleCopyMerchantNumber}
                                className="bg-pink-600 hover:bg-pink-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                                id="copy-merchant-number-btn"
                              >
                                <Copy className="w-3 h-3" />
                                <span>কপি করুন</span>
                              </button>
                            </div>
                          ) : (
                            <span>{inst.replace(/01909905849/g, merchantNumber)}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Big Magenta/Pink VERIFY TRANSACTION Button */}
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-black text-base py-4 rounded-full shadow-lg shadow-pink-200 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer tracking-wider uppercase flex items-center justify-center gap-2"
                  id="verify-transaction-btn"
                >
                  {isVerifying ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>ভেরিফাই হচ্ছে...</span>
                    </div>
                  ) : (
                    <span>ভেরিফাই ট্রানজেকশন</span>
                  )}
                </button>

              </form>

              {/* WhatsApp Support Assistance Block */}
              <div className="pt-4 border-t border-slate-100 flex flex-col items-center text-center space-y-2">
                <p className="text-xs text-slate-500 font-medium">
                  পেমেন্ট করতে কোনো সমস্যা হচ্ছে বা সাহায্য প্রয়োজন?
                </p>
                <a
                  href={whatsappChatLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-extrabold text-xs bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-full border border-emerald-100 transition-all hover:scale-105"
                >
                  <MessageSquare className="w-4 h-4 fill-emerald-600" />
                  <span>সরাসরি হোয়াটসঅ্যাপে চ্যাট করুন</span>
                </a>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
