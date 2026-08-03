import React, { useState } from 'react';
import { Order } from '../../../types';
import { Search, Filter, Printer, Download, Eye, CheckCircle2, Clock, XCircle, AlertCircle, Phone, Mail, FileText, Check } from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled') => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onUpdateOrderStatus }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      o.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || o.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Top Header Controls */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Order Management</h2>
          <p className="text-xs text-slate-500">সকল গ্রাহকের অর্ডার অনুমোদন, স্ট্যাটাস পরিবর্তন এবং ট্রানজেকশন ভেরিফিকেশন</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-purple-50 border border-purple-200 px-3.5 py-1.5 rounded-xl text-xs font-bold text-purple-700">
            Pending Orders: <span className="text-purple-900 font-mono ml-1">{orders.filter((o) => o.status === 'Pending').length}</span>
          </div>
        </div>
      </div>

      {/* Search & Status Filter Bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="অর্ডার আইডি, কাস্টমারের নাম, ফোন বা TxID দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-purple-600 placeholder:text-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          {['all', 'Pending', 'Processing', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer ${
                selectedStatus === status
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Order ID & Date</th>
                <th className="p-3.5">Customer Info</th>
                <th className="p-3.5">Product Purchased</th>
                <th className="p-3.5">Payment & TxID</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status Update</th>
                <th className="p-3.5 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-purple-700 block">{ord.id}</span>
                    <span className="text-[11px] text-slate-400">{ord.date}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{ord.customerName}</div>
                    <div className="text-[11px] text-slate-500">{ord.customerPhone}</div>
                  </td>
                  <td className="p-3.5 max-w-[200px] truncate font-semibold text-slate-800">{ord.productTitle}</td>
                  <td className="p-3.5">
                    <span className="uppercase font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[10px]">
                      {ord.paymentMethod}
                    </span>
                    <div className="font-mono text-[11px] text-purple-700 mt-0.5">{ord.transactionId}</div>
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">৳{ord.amount}</td>
                  <td className="p-3.5">
                    <select
                      value={ord.status}
                      onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                        ord.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : ord.status === 'Processing'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : ord.status === 'Pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="p-1.5 bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-purple-700 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      title="View Invoice"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Skills Hub Invoice</h3>
                <p className="text-xs text-slate-500">Order #{selectedOrder.id}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                {selectedOrder.status}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Customer Details</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedOrder.customerName}</p>
                  <p className="text-slate-600">{selectedOrder.customerPhone}</p>
                  <p className="text-slate-600">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Payment Details</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5 capitalize">{selectedOrder.paymentMethod}</p>
                  <p className="font-mono text-purple-700 font-bold">TxID: {selectedOrder.transactionId}</p>
                  <p className="text-slate-500">{selectedOrder.date}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-500 uppercase text-[10px]">Purchased Item</span>
                <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>{selectedOrder.productTitle}</span>
                  <span className="text-purple-700">৳{selectedOrder.amount}</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border-t border-slate-200 text-sm font-black">
                <span>Total Paid:</span>
                <span className="text-emerald-700 text-lg">৳{selectedOrder.amount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
              <button
                onClick={handlePrintInvoice}
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
