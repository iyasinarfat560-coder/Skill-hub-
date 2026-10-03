import React, { useState } from 'react';
import { StaffMember } from '../../../types';
import { ShieldCheck, UserPlus, Trash2, Key } from 'lucide-react';

interface AdminStaffViewProps {
  staff: StaffMember[];
  onAddStaff: (member: StaffMember) => void;
  onDeleteStaff: (id: string) => void;
}

export const AdminStaffView: React.FC<AdminStaffViewProps> = ({ staff, onAddStaff, onDeleteStaff }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('password123');
  const [pin, setPin] = useState('1234');
  const [role, setRole] = useState<'Super Admin' | 'Manager' | 'Support Staff' | 'Content Editor'>('Support Staff');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newStaff: StaffMember = {
      id: `stf-${Date.now()}`,
      name,
      email,
      phone: phone || '01700000000',
      role,
      status: 'Active',
      permissions: [role === 'Super Admin' ? 'All Permissions' : role === 'Manager' ? 'Full Access' : 'Limited Role Access'],
      password: password || 'password123',
      pin: pin || '1234',
    };

    onAddStaff(newStaff);
    setName('');
    setEmail('');
    setPhone('');
    setPassword('password123');
    setPin('1234');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Admin & Staff Management</h2>
          <p className="text-xs text-slate-400">সাব-এডমিন, মডারেটর ও সাপোর্ট মেম্বার যুক্তকরণ ও পারমিশন কন্ট্রোল</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Staff Form */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-purple-400" /> Add Staff Member
          </h3>

          <form onSubmit={handleCreate} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahim Support"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahim@skillshub.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Role / Access Level</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none font-bold text-purple-300"
              >
                <option value="Super Admin">Super Admin (Full Access)</option>
                <option value="Manager">Manager (Orders & Products)</option>
                <option value="Support Staff">Support Staff (Orders & Chat)</option>
                <option value="Content Editor">Content Editor (Products & Blog)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Login Password</label>
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">4-Digit Security PIN</label>
              <input
                type="text"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="1829"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
            >
              Add Staff Member
            </button>
          </form>
        </div>

        {/* Staff Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl shadow-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Name & Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
              {staff.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40">
                  <td className="p-4">
                    <p className="font-bold text-white">{m.name}</p>
                    <span className="text-[11px] text-slate-400">{m.email}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                      {m.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Active
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {m.role !== 'Super Admin' && (
                      <button
                        onClick={() => onDeleteStaff(m.id)}
                        className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
