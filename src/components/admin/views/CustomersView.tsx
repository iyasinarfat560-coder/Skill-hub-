import React, { useState } from 'react';
import { Customer } from '../../../types';
import { Search, ShieldAlert, ShieldCheck, Phone, Mail, MessageSquare, ShoppingBag, DollarSign, Eye, X } from 'lucide-react';

interface CustomersViewProps {
  customers: Customer[];
  onToggleCustomerStatus: (id: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ customers, onToggleCustomerStatus }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Customer Management</h2>
          <p className="text-xs text-slate-500">নিবন্ধিত সকল শিক্ষার্থী ও ক্রেতার তথ্য, মোট কেনাকাটা ও অ্যাকাউন্ট স্টেটাস</p>
        </div>

        <div className="bg-purple-50 border border-purple-100 px-3.5 py-1.5 rounded-xl text-xs font-bold text-purple-800">
          Total Customers: <span className="font-mono text-purple-900 font-extrabold">{customers.length}</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs">
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="কাস্টমারের নাম, ইমেইল বা ফোন দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-purple-600 placeholder:text-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5">Joined Date</th>
                <th className="p-3.5">Total Orders</th>
                <th className="p-3.5">Total Spent</th>
                <th className="p-3.5">Account Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs border border-purple-200">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{cust.name}</p>
                        <span className="text-[11px] text-slate-400 font-mono">{cust.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="text-slate-800 font-medium">{cust.email}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-purple-600" /> {cust.phone}
                    </div>
                  </td>

                  <td className="p-3.5 font-mono text-slate-500">{cust.joinedDate}</td>
                  <td className="p-3.5 font-bold text-slate-800">{cust.totalOrders} Orders</td>
                  <td className="p-3.5 font-black text-emerald-600">৳{cust.totalSpent}</td>

                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        cust.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {cust.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="p-1.5 bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-purple-700 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      title="View Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <a
                      href={`https://wa.me/88${cust.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition-colors inline-block cursor-pointer"
                      title="WhatsApp Chat"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => onToggleCustomerStatus(cust.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        cust.status === 'Active'
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}
                      title={cust.status === 'Active' ? 'Block Customer' : 'Unblock Customer'}
                    >
                      {cust.status === 'Active' ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile View Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative text-slate-800">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-full bg-[#7C3AED] text-white text-lg font-bold flex items-center justify-center border-2 border-purple-200">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedCustomer.name}</h3>
                <p className="text-xs text-slate-500">{selectedCustomer.email}</p>
                <span className="text-[11px] font-mono text-purple-700 font-semibold">{selectedCustomer.phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500 font-medium">Total Orders</span>
                <p className="text-base font-bold text-slate-900">{selectedCustomer.totalOrders}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500 font-medium">Total Spent</span>
                <p className="text-base font-bold text-emerald-600">৳{selectedCustomer.totalSpent}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700">Quick Actions:</span>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/88${selectedCustomer.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" /> Send WhatsApp
                </a>
                <a
                  href={`mailto:${selectedCustomer.email}`}
                  className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Mail className="w-4 h-4" /> Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
