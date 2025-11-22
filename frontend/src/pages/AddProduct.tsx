import React from "react";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unit: 'Pieces',
    openingStock: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sku || !formData.category) {
      toast.error('Please fill in all required fields.');
      return;
    }

    toast.success('Product created successfully.');
    navigate('/products');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8">Add Product</h1>

      <div className="bg-white rounded-xl shadow-sm border border-[#D9DFE6] p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block mb-2 text-[#1A4971]">
              Product Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
              placeholder="Enter product name"
            />
          </div>

          {/* SKU Code */}
          <div>
            <label htmlFor="sku" className="block mb-2 text-[#1A4971]">
              SKU Code / Barcode *
            </label>
            <input
              id="sku"
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
              placeholder="Enter SKU code"
            />
            <p className="text-[#6E7A83] mt-1.5">Unique code for identification</p>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block mb-2 text-[#1A4971]">
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
            >
              <option value="">Select a category</option>
              <option value="Steel Bars">Steel Bars</option>
              <option value="Steel Plates">Steel Plates</option>
              <option value="Structural Steel">Structural Steel</option>
              <option value="Wire Products">Wire Products</option>
              <option value="Beams">Beams</option>
              <option value="Fasteners">Fasteners</option>
            </select>
          </div>

          {/* Unit of Measure */}
          <div>
            <label htmlFor="unit" className="block mb-2 text-[#1A4971]">
              Unit of Measure *
            </label>
            <select
              id="unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
            >
              <option value="Pieces">Pieces</option>
              <option value="Kg">Kg</option>
              <option value="Meter">Meter</option>
              <option value="Bundle">Bundle</option>
            </select>
          </div>

          {/* Opening Stock */}
          <div>
            <label htmlFor="openingStock" className="block mb-2 text-[#1A4971]">
              Opening Stock (Optional)
            </label>
            <input
              id="openingStock"
              type="number"
              value={formData.openingStock}
              onChange={(e) => setFormData({ ...formData, openingStock: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
              placeholder="0"
              min="0"
            />
            <p className="text-[#6E7A83] mt-1.5">Only enter if product already exists physically</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit"
              className="bg-[#1A4971] hover:bg-[#224F7F] text-white rounded-lg"
            >
              Save
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={() => navigate('/products')}
              className="border-[#D9DFE6] text-[#6E7A83] hover:bg-[#F7F9FC] rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
