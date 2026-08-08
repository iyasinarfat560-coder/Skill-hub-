import React, { useState, useRef } from 'react';
import { Lock, Mail, Phone, Eye, EyeOff, ShieldCheck, AlertTriangle, CheckCircle2, X, Sparkles, KeyRound } from 'lucide-react';
import { ADMIN_SEED_CREDENTIALS } from '../../data/adminMockData';
import { StaffMember } from '../../types';

interface AdminAuthModalProps {
  isOpen: boolean;
  staffMembers?: StaffMember[];
  onClose: () => void;
  onSuccessLogin: (adminData: { name: string; email: string; role: string }) => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, staffMembers = [], onClose, onSuccessLogin }) => {
  const [step, setStep] = useState<1 | 2>(1); // 1 = Login Info, 2 = Security PIN
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  // Authenticated user holding state between step 1 and step 2
  const [authenticatedStaff, setAuthenticatedStaff] = useState<{ name: string; email: string; role: string } | null>(null);

  // Step 2 PIN state
  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const pinInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  if (!isOpen) return null;

  // Step 1: Validate Email + Password against Super Admin ONLY
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password;

    const isSuperAdminEmail = cleanEmail === ADMIN_SEED_CREDENTIALS.email.toLowerCase();
    const isSuperAdminPass = cleanPass === ADMIN_SEED_CREDENTIALS.password;

    if (isSuperAdminEmail && isSuperAdminPass) {
      setAuthenticatedStaff({
        name: ADMIN_SEED_CREDENTIALS.name,
        email: ADMIN_SEED_CREDENTIALS.email,
        role: ADMIN_SEED_CREDENTIALS.role,
      });
      setStep(2);
      setErrorMsg(null);
      setTimeout(() => pinInputRefs[0].current?.focus(), 150);
    } else {
      setErrorMsg('ইমেইল অথবা পাসওয়ার্ড ভুল হয়েছে! শুধুমাত্র নির্দিষ্ট অনুমোদিত এডমিন (Admin1829@gmail.com) প্রবেশ করতে পারবেন।');
    }
  };

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...pinDigits];
    newDigits[index] = value.slice(-1);
    setPinDigits(newDigits);

    if (value && index < 3) {
      pinInputRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      pinInputRefs[index - 1].current?.focus();
    }
  };

  // Step 2: Validate 4-digit Security PIN
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const enteredPin = pinDigits.join('');
    if (enteredPin === ADMIN_SEED_CREDENTIALS.pin) {
      if (authenticatedStaff) {
        onSuccessLogin(authenticatedStaff);
      } else {
        onSuccessLogin({
          name: ADMIN_SEED_CREDENTIALS.name,
          email: ADMIN_SEED_CREDENTIALS.email,
          role: ADMIN_SEED_CREDENTIALS.role,
        });
      }
      onClose();
    } else {
      setErrorMsg('নিরাপত্তা পিন নম্বর সঠিক নয়! সঠিক ৪-ডিজিটের পিন কোড (1829) প্রদান করুন।');
      setPinDigits(['', '', '', '']);
      pinInputRefs[0].current?.focus();
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

        {/* Top Header & Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-purple-500 text-white shadow-md shadow-purple-500/20 mb-1">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              Skills Hub Admin Panel
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {step === 1 ? 'অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন' : 'ধাপ ২: ৪-ডিজিট সিকিউরিটি পিন ভেরিফিকেশন'}
            </p>
          </div>

          {/* Step indicator pills */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
              step === 1 ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {step === 1 ? '• ধাপ ১: লগইন তথ্য' : '✓ ধাপ ১ সম্পন্ন'}
            </span>
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
              step === 2 ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}>
              • ধাপ ২: পিন ভেরিফিকেশন
            </span>
          </div>
        </div>

        {/* Bengali Error Message Alert */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200/90 rounded-2xl text-xs text-rose-700 flex items-start gap-2.5 animate-shake">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="font-semibold">{errorMsg}</div>
          </div>
        )}

        {/* STEP 1: EMAIL, PHONE & PASSWORD FORM */}
        {step === 1 && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">
                ইমেইল ঠিকানা (Email) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="আপনার ইমেইল লিখুন"
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
                  পাসওয়ার্ড (Password) <span className="text-rose-500">*</span>
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
                  placeholder="পাসওয়ার্ড লিখুন"
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

            {/* Submit Step 1 Button */}
            <button
              type="submit"
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer text-xs flex items-center justify-center gap-2 mt-2"
            >
              <span>ধাপ ২-এ যান (PIN ভেরিফিকেশন)</span>
              <KeyRound className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: 4-DIGIT SECURITY PIN VERIFICATION */}
        {step === 2 && (
          <form onSubmit={handleVerifyPin} className="space-y-6">
            <div className="bg-purple-50 border border-purple-200/80 rounded-2xl p-3.5 text-xs text-purple-900 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-700 flex-shrink-0" />
              <span className="font-medium">ধাপ ১ সফল হয়েছে! আপনার ৪-ডিজিটের সিকিউরিটি পিন দিন।</span>
            </div>

            {/* 4 Digit Boxes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block">
                  ৪-ডিজিটের সিকিউরিটি পিন
                </label>
                {/* PIN Visibility Toggle Icon */}
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                >
                  {showPin ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>পিন লুকান</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>পিন দেখুন</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-center gap-3">
                {pinDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={pinInputRefs[index]}
                    type={showPin ? 'text' : 'password'}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    className="w-13 h-14 bg-slate-50 border-2 border-slate-200 focus:border-purple-600 rounded-2xl text-center text-xl font-extrabold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setErrorMsg(null);
                }}
                className="text-xs font-bold text-purple-700 hover:underline cursor-pointer"
              >
                ← পূর্ববর্তী ধাপে যান
              </button>
            </div>

            {/* Submit Step 2 PIN Button */}
            <button
              type="submit"
              disabled={pinDigits.some((d) => !d)}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>পিন ভেরিফাই ও ড্যাশবোর্ডে প্রবেশ করুন</span>
            </button>
          </form>
        )}

        {/* Security Footer Notice */}
        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>২-ধাপ ভেরিফিকেশন দ্বারা সুরক্ষিত • Skills Hub System</span>
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

