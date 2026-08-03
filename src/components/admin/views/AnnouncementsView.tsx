import React, { useState } from 'react';
import { Announcement } from '../../../types';
import { Megaphone, Plus, Trash2, Eye, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  onAddAnnouncement: (anc: Announcement) => void;
  onToggleAnnouncementStatus: (id: string) => void;
  onDeleteAnnouncement: (id: string) => void;
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  announcements,
  onAddAnnouncement,
  onToggleAnnouncementStatus,
  onDeleteAnnouncement,
  isAddModalOpen = false,
  onCloseAddModal,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'banner' | 'popup'>('banner');
  const [targetPages, setTargetPages] = useState('All Pages');
  const [modalOpen, setModalOpen] = useState(isAddModalOpen);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAnc: Announcement = {
      id: `anc-${Date.now()}`,
      title,
      message,
      type,
      status: 'Active',
      targetPages,
      startDate: '2026-07-26',
      endDate: '2026-08-30',
    };

    onAddAnnouncement(newAnc);
    setTitle('');
    setMessage('');
    setModalOpen(false);
    if (onCloseAddModal) onCloseAddModal();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Announcements & Banners</h2>
          <p className="text-xs text-slate-400">ওয়েবসাইটের টপ ব্যানার নোটিশ এবং পপআপ এনান্সমেন্ট মেকার</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Announcement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((anc) => (
          <div key={anc.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-purple-950 text-purple-300 border border-purple-800">
                {anc.type} Announcement
              </span>

              <button
                onClick={() => onToggleAnnouncementStatus(anc.id)}
                className="flex items-center gap-1 text-xs font-bold text-slate-300"
              >
                {anc.status === 'Active' ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ToggleRight className="w-6 h-6 text-emerald-400" /> Active
                  </span>
                ) : (
                  <span className="text-slate-500 flex items-center gap-1">
                    <ToggleLeft className="w-6 h-6 text-slate-600" /> Inactive
                  </span>
                )}
              </button>
            </div>

            <h4 className="font-bold text-white text-sm">{anc.title}</h4>
            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              {anc.message}
            </p>

            <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 font-mono">
              <span>Target: {anc.targetPages}</span>
              <button
                onClick={() => onDeleteAnnouncement(anc.id)}
                className="p-1.5 bg-rose-950 text-rose-300 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(modalOpen || isAddModalOpen) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 text-slate-100">
            <h3 className="text-lg font-bold text-white">Create Website Announcement</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. ঈদ স্পেশাল অফার ৫০% ডিসকাউন্ট"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Message Body</label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="ব্যানারে দেখানোর জন্য মেসেজ লিখুন..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Display Format</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                  >
                    <option value="banner">Top Banner</option>
                    <option value="popup">Modal Popup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Page</label>
                  <select
                    value={targetPages}
                    onChange={(e) => setTargetPages(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                  >
                    <option value="All Pages">All Pages</option>
                    <option value="Home Page">Home Page Only</option>
                    <option value="Courses Page">Courses Page Only</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    if (onCloseAddModal) onCloseAddModal();
                  }}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-purple-600 text-white font-bold rounded-xl">
                  Publish Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
