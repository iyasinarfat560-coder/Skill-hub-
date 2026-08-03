import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (courseId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const total = cartItems.reduce(
    (sum, item) => sum + item.course.discountPrice * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-slate-900">আপনার শপিং কার্ট</h2>
              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-slate-500 font-semibold text-sm">আপনার কার্ট খালি রয়েছে</p>
                <p className="text-slate-400 text-xs">ব্রাউজ করে পছন্দের কোর্স বা ই-বুক যুক্ত করুন</p>
              </div>
            ) : (
              cartItems.map(({ course, quantity }) => (
                <div
                  key={course.id}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex gap-3 items-center"
                >
                  <div className="w-16 h-16 rounded-xl bg-purple-900 text-white font-black text-[10px] p-2 flex items-center justify-center text-center flex-shrink-0">
                    {course.category}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs line-clamp-2">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-extrabold text-purple-700 text-sm">
                        ৳{course.discountPrice}
                      </span>
                      <span className="text-[11px] text-slate-400 line-through">
                        ৳{course.originalPrice}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(course.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout button */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-600">সর্বমোট (Subtotal):</span>
                <span className="text-xl font-black text-slate-900">৳{total}</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold py-3.5 rounded-full shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                id="cart-checkout-btn"
              >
                <span>চেকআউট এ যান</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
