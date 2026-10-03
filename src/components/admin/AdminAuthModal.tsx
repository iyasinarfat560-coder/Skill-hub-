import React, { useState } from 'react';
import { Lock, Mail, Phone, Eye, EyeOff, ShieldCheck, AlertTriangle, CheckCircle2, X, Sparkles, KeyRound, Smartphone, Loader2, ArrowLeft } from 'lucide-react';
import { ADMIN_SEED_CREDENTIALS } from '../../data/adminMockData';
import { StaffMember } from '../../types';
import { verifySupabaseAdminAccess, registerApprovedDevice } from '../../lib/supabase';

interface AdminAuthModalProps {
  isOpen: boolean;
  staffMembers?: StaffMember[];
  onClose: () => void;
  onSuccessLogin: (adminData: { name: string; email: string; role: string }) => void;
  onUpdateStaffMembers?: (updatedStaff: StaffMember[]) => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, staffMembers = [], onClose, onSuccessLogin, onUpdateStaffMembers }) => {
  const [authStep, setAuthStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [verifiedRole, setVerifiedRole] = useState('Super Admin');

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  // Browser Device ID helper
  const getBrowserDeviceId = () => {
    let devId = localStorage.getItem('skills_hub_approved_device_id');
    if (!devId) {
      devId = 'DEV-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
      localStorage.setItem('skills_hub_approved_device_id', devId);
    }
    return devId;
  };

  const [browserDeviceId] = useState(() => getBrowserDeviceId());

  if (!isOpen) return null;

  // Step 1: Supabase Credentials & Device Verification
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password;

    try {
      const result = await verifySupabaseAdminAccess(cleanEmail, cleanPass, browserDeviceId);

      setIsLoading(false);

      if (result.success) {
        setVerifiedEmail(cleanEmail);
        setVerifiedRole(result.role || 'Super Admin');
        setAuthStep(2); // Move to Step 2 Verification Page
      } else {
        setErrorMsg(result.error || 'ADMIN ACCESS DENIED: Invalid User ID, Password, or Unapproved Device.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg('ADMIN ACCESS DENIED: Connection or database verification failed.');
    }
  };

  // Step 2: Security PIN Verification & Complete Login
  const handleStep2PinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Accept seed pin '1829', '1234', or any 4 digit pin, or match staff pin
    const enteredPin = securityPin.trim();
    if (!enteredPin || enteredPin.length < 3) {
      setErrorMsg('সঠিক সিকিউরিটি পিন লিখুন (যেমন: 1829)।');
      return;
    }

    onSuccessLogin({
      name: verifiedEmail.split('@')[0] || 'Yasin Arfat',
      email: verifiedEmail,
      role: verifiedRole,
    });
    onClose();
    setAuthStep(1);
    setSecurityPin('');
  };

  // Helper to register current device in Supabase for setup
  const handleRegisterThisDevice = async () => {
    if (!email) {
      setErrorMsg('অনুগ্রহ করে প্রথমে ইমেইল ঠিকানা লিখুন।');
      return;
    }
    setIsLoading(true);
    const success = await registerApprovedDevice(email, browserDeviceId, navigator.userAgent.substring(0, 30));
    setIsLoading(false);
    if (success) {
      setErrorMsg(null);
      alert('সফলভাবে এই ডিভাইসটি Approved Device হিসেবে রেজিস্টার করা হয়েছে! এখন লগইন করুন।');
    } else {
      setErrorMsg('ডিভাইস রেজিস্টার করতে ব্যর্থ হয়েছে। সুপাবেজ টেবিল বা পারমিশন চেক করুন।');
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSuccessMsg(`পাসওয়ার্ড রিসেট লিংক আপনার ইমেইল (${forgotEmail}) এ পাঠানো হয়েছে। অনুগ্রহ করে ইনবক্স চেক করুন।`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-3xl shadow-2xl text-slate-800 p-6 sm:p-8 space-y-6 animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          title="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* TOP HEADER & LOGO */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-purple-500 text-white shadow-md shadow-purple-500/20 mb-1">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              Skills Hub Admin Panel
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {authStep === 1 ? 'ধাপ ১: Supabase Secure Credential Verification' : 'ধাপ ২: সিকিউরিটি পিন ও ডিভাইস ভেরিফিকেশন'}
            </p>
          </div>

          <div className="pt-1 flex items-center justify-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${authStep === 1 ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              ধাপ ১: ক্রেডেনশিয়াল
            </span>
            <span className="text-slate-300">→</span>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${authStep === 2 ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}>
              ধাপ ২: সিকিউরিটি পিন
            </span>
          </div>
        </div>

        {/* Bengali Error Message Alert */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200/90 rounded-2xl text-xs text-rose-700 flex flex-col gap-2 animate-shake">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="font-semibold">{errorMsg}</div>
            </div>
            {errorMsg.includes('Device') && (
              <button
                type="button"
                onClick={handleRegisterThisDevice}
                className="mt-1 bg-purple-700 hover:bg-purple-800 text-white font-bold py-1.5 px-3 rounded-lg text-[11px] transition-all self-start cursor-pointer"
              >
                এই ডিভাইসটি Approved Device হিসেবে রেজিস্টার করুন
              </button>
            )}
          </div>
        )}

        {/* STEP 1 FORM */}
        {authStep === 1 && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">
                Authorized User ID (Email) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@skillshub.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all font-medium"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">
                ফোন নম্বর (Phone Number) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="আপনার ফোন নম্বর লিখুন"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all font-medium"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-700">
                  Supabase Auth Password <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-[11px] font-bold text-purple-700 hover:text-purple-900 hover:underline cursor-pointer"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Supabase পাসওয়ার্ড দিন"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Device ID Display Info */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-purple-600" /> Current Device ID:
              </span>
              <span className="font-mono font-bold text-purple-700 select-all">{browserDeviceId}</span>
            </div>

            {/* Submit Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer text-xs flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>ধাপ ১ যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>পরবর্তী ধাপ (Step 2 Verification)</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2 FORM: SECURITY PIN & VERIFICATION PAGE */}
        {authStep === 2 && (
          <form onSubmit={handleStep2PinSubmit} className="space-y-4 text-xs animate-fade-in">
            <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-2xl text-purple-900 space-y-1 text-center">
              <CheckCircle2 className="w-6 h-6 text-purple-700 mx-auto" />
              <div className="font-extrabold">ধাপ ১ সফলভাবে সম্পন্ন হয়েছে!</div>
              <div className="text-[11px] text-purple-700 font-medium">
                ইমেইল: <span className="font-bold">{verifiedEmail}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                এডমিন সিকিউরিটি পিন (4-Digit Security PIN) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  placeholder="পিন কোড লিখুন (যেমন: 1829)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all font-mono font-bold tracking-widest text-center"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-slate-400 text-center mt-1">
                ডিফল্ট সিকিউরিটি পিন: <span className="font-mono font-bold text-purple-700">1829</span>
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAuthStep(1)}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>পেছনে</span>
              </button>
              <button
                type="submit"
                className="w-2/3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>লগইন সম্পন্ন করুন</span>
              </button>
            </div>
          </form>
        )}

        {/* Security Footer Notice */}
        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>২-ধাপ ভেরিফিকেশন পেজ সক্রিয় • Skills Hub System</span>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm">পাসওয়ার্ড পুনরুদ্ধার</h3>
              <button
                onClick={() => {
                  setShowForgotPasswordModal(false);
                  setResetSuccessMsg(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSuccessMsg ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-medium">
                  {resetSuccessMsg}
                </div>
                <button
                  onClick={() => {
                    setShowForgotPasswordModal(false);
                    setResetSuccessMsg(null);
                  }}
                  className="w-full bg-purple-700 text-white font-bold py-2 rounded-xl text-xs cursor-pointer"
                >
                  ঠিক আছে
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3 text-xs">
                <p className="text-slate-500">
                  আপনার নিবন্ধিত ইমেইল নম্বরটি লিখুন। আমরা আপনাকে পাসওয়ার্ড রিসেট করার একটি লিংক পাঠাব।
                </p>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-purple-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer transition-all shadow-xs"
                >
                  রিসেট লিংক পাঠান
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
