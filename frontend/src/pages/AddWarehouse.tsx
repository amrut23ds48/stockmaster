import React from "react";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export function AddWarehouse() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || !formData.address) {
      toast.error('Please fill in all required fields.');
      return;
    }

    toast.success('Warehouse created successfully.');
    navigate('/warehouses');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8">Add Warehouse</h1>

      <div className="bg-white rounded-xl shadow-sm border border-[#D9DFE6] p-8">
        <p className="text-[#6E7A83] mb-6 italic">
          Used to store stock for operations.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Warehouse Name */}
          <div>
            <label htmlFor="name" className="block mb-2 text-[#1A4971]">
              Warehouse Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
              placeholder="Enter warehouse name"
            />
          </div>

          {/* Warehouse Code */}
          <div>
            <label htmlFor="code" className="block mb-2 text-[#1A4971]">
              Warehouse Code *
            </label>
            <input
              id="code"
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
              placeholder="WH-"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block mb-2 text-[#1A4971]">
              Address *
            </label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
              rows={3}
              placeholder="Enter warehouse address"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit"
              className="bg-[#1A4971] hover:bg-[#224F7F] text-white rounded-lg"
            >
              Save Warehouse
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={() => navigate('/warehouses')}
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
