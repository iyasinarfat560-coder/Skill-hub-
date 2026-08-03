import React, { useState } from 'react';
import { AdminReview } from '../../../types';
import { Star, CheckCircle, XCircle, Trash2, MessageSquare, CornerDownRight } from 'lucide-react';

interface ReviewsViewProps {
  reviews: AdminReview[];
  onApproveReview: (id: string) => void;
  onRejectReview: (id: string) => void;
  onDeleteReview: (id: string) => void;
  onReplyReview: (id: string, replyText: string) => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  reviews,
  onApproveReview,
  onRejectReview,
  onDeleteReview,
  onReplyReview,
}) => {
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = (id: string) => {
    if (!replyText.trim()) return;
    onReplyReview(id, replyText);
    setReplyingReviewId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Review Moderation</h2>
          <p className="text-xs text-slate-400">শিক্ষার্থীদের দেওয়া রিভিউ অনুমোদন, বাতিল বা এডমিন রিপ্লাই প্রদান করুন</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full object-cover border border-purple-500/50" />
                <div>
                  <h4 className="font-bold text-white text-sm">{rev.name}</h4>
                  <p className="text-[11px] text-slate-400">{rev.productName}</p>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  rev.status === 'Approved'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : rev.status === 'Pending'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {rev.status}
              </span>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                  }`}
                />
              ))}
              <span className="text-xs text-slate-400 ml-2">{rev.date}</span>
            </div>

            <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded-2xl border border-slate-800 italic">
              "{rev.comment}"
            </p>

            {/* Admin Reply */}
            {rev.adminReply && (
              <div className="bg-purple-950/40 border border-purple-800/40 p-3 rounded-2xl text-xs text-purple-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-purple-300">
                  <CornerDownRight className="w-3.5 h-3.5" /> Admin Reply:
                </div>
                <p className="pl-5 text-slate-300">{rev.adminReply}</p>
              </div>
            )}

            {/* Inline Reply Form */}
            {replyingReviewId === rev.id && (
              <div className="space-y-2 pt-2">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="রিভিউ রিপ্লাই লিখুন..."
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setReplyingReviewId(null)}
                    className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSendReply(rev.id)}
                    className="px-4 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold"
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-bold">
              <button
                onClick={() => setReplyingReviewId(rev.id)}
                className="text-purple-400 hover:underline flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Reply
              </button>

              <div className="flex items-center gap-2">
                {rev.status !== 'Approved' && (
                  <button
                    onClick={() => onApproveReview(rev.id)}
                    className="px-3 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-xl border border-emerald-800"
                  >
                    Approve
                  </button>
                )}
                {rev.status !== 'Rejected' && (
                  <button
                    onClick={() => onRejectReview(rev.id)}
                    className="px-3 py-1 bg-amber-950 hover:bg-amber-900 text-amber-300 rounded-xl border border-amber-800"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => onDeleteReview(rev.id)}
                  className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-xl border border-rose-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
