import React, { useState } from 'react';
import { Course, Category } from '../../../types';
import { AddEditCourseModal } from './AddEditCourseModal';
import {
  Plus, Search, Filter, Trash2, Edit3, Eye, CheckCircle, AlertCircle, Tag, Layers
} from 'lucide-react';

interface ProductsViewProps {
  products: Course[];
  categories?: Category[];
  onAddProduct: (product: Course) => void;
  onUpdateProduct: (product: Course) => void;
  onDeleteProduct: (productId: string) => void;
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  categories = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  isAddModalOpen = false,
  onCloseAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
  // Modal state for Add/Edit
  const [modalOpen, setModalOpen] = useState(isAddModalOpen);
  const [editingProduct, setEditingProduct] = useState<Course | null>(null);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (product: Course) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSaveProduct = (course: Course) => {
    const isExisting = products.some((p) => p.id === course.id);
    if (isExisting) {
      onUpdateProduct(course);
    } else {
      onAddProduct(course);
    }
    setModalOpen(false);
    if (onCloseAddModal) onCloseAddModal();
  };

  // Toggle selection
  const toggleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((item) => item !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (confirm(`আপনি কি নিশ্চিত যে নির্বাচিত ${selectedProductIds.length}টি প্রোডাক্ট মুছে ফেলতে চান?`)) {
      selectedProductIds.forEach((id) => onDeleteProduct(id));
      setSelectedProductIds([]);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Product Management</h2>
          <p className="text-xs text-slate-500">সকল কোর্স, ই-বুক এবং প্রিমিয়াম রিসোর্স ম্যানুয়াল এডিট ও যুক্ত করার ড্যাশবোর্ড</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="প্রোডাক্ট বা ক্যাটাগরি সার্চ করুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-purple-600 placeholder:text-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Programming">Programming</option>
            <option value="Freelancing">Freelancing</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="E-books">E-books</option>
            <option value="Source Code">Source Code</option>
          </select>

          {/* Bulk Action */}
          {selectedProductIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedProductIds.length})</span>
            </button>
          )}
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </th>
                <th className="p-3.5">Product Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Original Price</th>
                <th className="p-3.5">Discount Price</th>
                <th className="p-3.5">Students</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.includes(product.id)}
                      onChange={() => toggleSelectOne(product.id)}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                  </td>
                  <td className="p-3.5 font-bold text-slate-900 max-w-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center font-mono text-purple-700 font-extrabold flex-shrink-0">
                        {product.title.charAt(0)}
                      </div>
                      <span className="line-clamp-2">{product.title}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-100 font-bold text-[11px] text-purple-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400 line-through">৳{product.originalPrice}</td>
                  <td className="p-3.5 font-bold text-emerald-600">৳{product.discountPrice}</td>
                  <td className="p-3.5 font-bold text-slate-800">{product.studentsCount} Enrolled</td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="p-1.5 bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-purple-700 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`আপনি কি নিশ্চিত "${product.title}" প্রোডাক্টটি মুছে ফেলতে চান?`)) {
                          onDeleteProduct(product.id);
                        }
                      }}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Course Modal Component */}
      <AddEditCourseModal
        isOpen={modalOpen || isAddModalOpen}
        onClose={() => {
          setModalOpen(false);
          if (onCloseAddModal) onCloseAddModal();
        }}
        productToEdit={editingProduct}
        onSave={handleSaveProduct}
        categories={categories}
      />

    </div>
  );
};
