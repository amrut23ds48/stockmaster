import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { mockWarehouses, mockProducts } from '../lib/mock-data';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

interface LineItem {
  id: string;
  productId: string;
  quantity: string;
}

export function AddReceipt() {
  const navigate = useNavigate();
  const [warehouses] = useState(mockWarehouses);
  const [products] = useState(mockProducts);
  const [showValidateDialog, setShowValidateDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    warehouseId: '',
    supplier: '',
    receiptNumber: `RCP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0]
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', productId: '', quantity: '' }
  ]);

  const addLineItem = () => {
    setLineItems([...lineItems, { 
      id: String(Date.now()), 
      productId: '', 
      quantity: '' 
    }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: 'productId' | 'quantity', value: string) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSaveDraft = () => {
    if (!formData.warehouseId || !formData.supplier) {
      toast.error('Please fill in warehouse and supplier.');
      return;
    }
    toast.success('Receipt saved as draft.');
    navigate('/receipts');
  };

  const handleValidate = () => {
    if (!formData.warehouseId || !formData.supplier) {
      toast.error('Please fill in warehouse and supplier.');
      return;
    }
    
    const hasEmptyItems = lineItems.some(item => !item.productId || !item.quantity);
    if (hasEmptyItems) {
      toast.error('Please complete all line items.');
      return;
    }

    setShowValidateDialog(true);
  };

  const confirmValidation = () => {
    toast.success('Receipt validated — stock increased successfully.');
    navigate('/receipts');
  };

  return (
    <div>
      <h1 className="mb-8">New Receipt — Incoming Goods</h1>

      <div className="bg-white rounded-xl shadow-sm border border-[#D9DFE6] p-8">
        {/* Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-[#D9DFE6]">
          <div>
            <label htmlFor="warehouse" className="block mb-2 text-[#1A4971]">
              Select Warehouse *
            </label>
            <select
              id="warehouse"
              value={formData.warehouseId}
              onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
            >
              <option value="">Select a warehouse</option>
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="supplier" className="block mb-2 text-[#1A4971]">
              Select Supplier *
            </label>
            <input
              id="supplier"
              type="text"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
              placeholder="Enter supplier name"
            />
          </div>

          <div>
            <label className="block mb-2 text-[#1A4971]">Receipt Number</label>
            <input
              type="text"
              value={formData.receiptNumber}
              disabled
              className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg bg-[#F7F9FC] text-[#6E7A83]"
            />
          </div>

          <div>
            <label className="block mb-2 text-[#1A4971]">Date</label>
            <input
              type="date"
              value={formData.date}
              disabled
              className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg bg-[#F7F9FC] text-[#6E7A83]"
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-6">
          <h3 className="mb-4">Products</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7F9FC] border-b border-[#D9DFE6]">
                <tr>
                  <th className="text-left px-4 py-3 text-[#1A4971]">Product Name</th>
                  <th className="text-left px-4 py-3 text-[#1A4971]">Quantity Received</th>
                  <th className="text-left px-4 py-3 text-[#1A4971]">Unit</th>
                  <th className="text-center px-4 py-3 text-[#1A4971]">Action</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => {
                  const selectedProduct = products.find(p => p.id === item.productId);
                  
                  return (
                    <tr key={item.id} className="border-b border-[#D9DFE6]">
                      <td className="px-4 py-3">
                        <select
                          value={item.productId}
                          onChange={(e) => updateLineItem(item.id, 'productId', e.target.value)}
                          className="w-full px-3 py-2 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
                        >
                          <option value="">Select product</option>
                          {products.map(product => (
                            <option key={product.id} value={product.id}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
                          placeholder="0"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-3 text-[#6E7A83]">
                        {selectedProduct?.unit || '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLineItem(item.id)}
                          disabled={lineItems.length === 1}
                          className="hover:bg-[#FEE2E2]"
                        >
                          <Trash2 className="w-4 h-4 text-[#D64545]" strokeWidth={1.5} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Button
            onClick={addLineItem}
            variant="outline"
            className="mt-4 border-[#1A4971] text-[#1A4971] hover:bg-[#F7F9FC]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product Row
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-[#D9DFE6]">
          <Button 
            onClick={handleValidate}
            className="bg-[#2ECC71] hover:bg-[#27AE60] text-white rounded-lg"
          >
            Validate Receipt
          </Button>
          <Button 
            onClick={handleSaveDraft}
            variant="outline"
            className="border-[#D9DFE6] text-[#6E7A83] hover:bg-[#F7F9FC] rounded-lg"
          >
            Save Draft
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/receipts')}
            className="border-[#D9DFE6] text-[#6E7A83] hover:bg-[#F7F9FC] rounded-lg"
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Validation Confirmation Dialog */}
      <AlertDialog open={showValidateDialog} onOpenChange={setShowValidateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Validate Receipt</AlertDialogTitle>
            <AlertDialogDescription>
              Validating will increase stock — confirm?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmValidation}
              className="bg-[#2ECC71] hover:bg-[#27AE60]"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
