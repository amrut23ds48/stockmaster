import React from "react";
import { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Package, MapPin, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface MovementWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (movementData: any) => void;
}

export function MovementWizard({ isOpen, onClose, onComplete }: MovementWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    product: '',
    fromWarehouse: '',
    toWarehouse: '',
    quantity: '',
    moveDate: '',
    moveTime: '',
    notes: ''
  });

  const steps = [
    { number: 1, title: 'Select Product', icon: Package },
    { number: 2, title: 'Select Warehouses', icon: MapPin },
    { number: 3, title: 'Set Quantity & Schedule', icon: Calendar },
    { number: 4, title: 'Review & Confirm', icon: Check }
  ];

  const products = [
    'Steel Rods 12mm',
    'Steel Rods 16mm',
    'Cement Bags 50kg',
    'Angle Iron 40x40',
    'Square Pipe 50x50'
  ];

  const warehouses = [
    'Main Warehouse - Mumbai',
    'Secondary Warehouse - Pune',
    'Distribution Center - Delhi',
    'Storage Facility - Bangalore'
  ];

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1 && !formData.product) {
      toast.error('Please select a product');
      return;
    }
    if (currentStep === 2 && (!formData.fromWarehouse || !formData.toWarehouse)) {
      toast.error('Please select both warehouses');
      return;
    }
    if (currentStep === 2 && formData.fromWarehouse === formData.toWarehouse) {
      toast.error('Source and destination warehouses must be different');
      return;
    }
    if (currentStep === 3 && (!formData.quantity || !formData.moveDate || !formData.moveTime)) {
      toast.error('Please fill all required fields');
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const movementData = {
      ...formData,
      id: `MOV-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    
    onComplete(movementData);
    toast.success('Movement requirement created successfully!');
    onClose();
    
    // Reset form
    setFormData({
      product: '',
      fromWarehouse: '',
      toWarehouse: '',
      quantity: '',
      moveDate: '',
      moveTime: '',
      notes: ''
    });
    setCurrentStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1A4971] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white m-0">Create Movement Requirement</h2>
            <p className="text-white/80 text-sm mt-1">
              Step {currentStep} of {steps.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-[#D9DFE6]">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    currentStep > step.number
                      ? 'bg-[#2ECC71] text-white'
                      : currentStep === step.number
                      ? 'bg-[#1A4971] text-white'
                      : 'bg-[#D9DFE6] text-[#6E7A83]'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <p className={`text-xs mt-2 text-center ${
                    currentStep >= step.number ? 'text-[#1A4971]' : 'text-[#6E7A83]'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 mt-[-24px] ${
                    currentStep > step.number ? 'bg-[#2ECC71]' : 'bg-[#D9DFE6]'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[50vh]">
          {/* Step 1: Select Product */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-[#1A4971] mb-4">Select Product to Move</h3>
              <div className="space-y-2">
                {products.map((product) => (
                  <button
                    key={product}
                    onClick={() => setFormData({ ...formData, product })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      formData.product === product
                        ? 'border-[#1A4971] bg-[#E8F4F8]'
                        : 'border-[#D9DFE6] hover:border-[#1A4971]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#1A4971]">{product}</span>
                      {formData.product === product && (
                        <Check className="w-5 h-5 text-[#1A4971]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Warehouses */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-[#1A4971] mb-4">From Warehouse (Source)</h3>
                <div className="space-y-2">
                  {warehouses.map((warehouse) => (
                    <button
                      key={warehouse}
                      onClick={() => setFormData({ ...formData, fromWarehouse: warehouse })}
                      className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                        formData.fromWarehouse === warehouse
                          ? 'border-[#1A4971] bg-[#E8F4F8]'
                          : 'border-[#D9DFE6] hover:border-[#1A4971]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[#1A4971]">{warehouse}</span>
                        {formData.fromWarehouse === warehouse && (
                          <Check className="w-5 h-5 text-[#1A4971]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[#1A4971] mb-4">To Warehouse (Destination)</h3>
                <div className="space-y-2">
                  {warehouses.map((warehouse) => (
                    <button
                      key={warehouse}
                      onClick={() => setFormData({ ...formData, toWarehouse: warehouse })}
                      disabled={formData.fromWarehouse === warehouse}
                      className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                        formData.toWarehouse === warehouse
                          ? 'border-[#1A4971] bg-[#E8F4F8]'
                          : formData.fromWarehouse === warehouse
                          ? 'border-[#D9DFE6] bg-[#F7F9FC] opacity-50 cursor-not-allowed'
                          : 'border-[#D9DFE6] hover:border-[#1A4971]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[#1A4971]">{warehouse}</span>
                        {formData.toWarehouse === warehouse && (
                          <Check className="w-5 h-5 text-[#1A4971]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Quantity & Schedule */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h3 className="text-[#1A4971] mb-4">Set Quantity & Schedule</h3>
              
              <div>
                <label className="block mb-2 text-[#1A4971]">
                  Quantity to Move *
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-3 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-2 focus:ring-[#1A4971]/20"
                  placeholder="Enter quantity"
                  min="1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-[#1A4971]">
                    Move Date *
                  </label>
                  <input
                    type="date"
                    value={formData.moveDate}
                    onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
                    className="w-full px-4 py-3 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-2 focus:ring-[#1A4971]/20"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-[#1A4971]">
                    Move Time *
                  </label>
                  <input
                    type="time"
                    value={formData.moveTime}
                    onChange={(e) => setFormData({ ...formData, moveTime: e.target.value })}
                    className="w-full px-4 py-3 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-2 focus:ring-[#1A4971]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-[#1A4971]">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-2 focus:ring-[#1A4971]/20"
                  placeholder="Enter any special instructions..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 4: Review & Confirm */}
          {currentStep === 4 && (
            <div>
              <h3 className="text-[#1A4971] mb-4">Review Movement Details</h3>
              <div className="bg-[#F7F9FC] rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[#6E7A83]">Product:</span>
                  <span className="text-[#1A4971]">{formData.product}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[#6E7A83]">From:</span>
                  <span className="text-[#1A4971] text-right">{formData.fromWarehouse}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[#6E7A83]">To:</span>
                  <span className="text-[#1A4971] text-right">{formData.toWarehouse}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[#6E7A83]">Quantity:</span>
                  <span className="text-[#1A4971]">{formData.quantity} units</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[#6E7A83]">Scheduled Date:</span>
                  <span className="text-[#1A4971]">{formData.moveDate}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[#6E7A83]">Scheduled Time:</span>
                  <span className="text-[#1A4971]">{formData.moveTime}</span>
                </div>
                {formData.notes && (
                  <div className="flex justify-between items-start">
                    <span className="text-[#6E7A83]">Notes:</span>
                    <span className="text-[#1A4971] text-right max-w-xs">{formData.notes}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#D9DFE6] flex items-center justify-between">
          <Button
            onClick={handleBack}
            disabled={currentStep === 1}
            variant="outline"
            className="border-[#D9DFE6] text-[#1A4971]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-[#D9DFE6] text-[#6E7A83]"
            >
              Cancel
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                className="bg-[#1A4971] hover:bg-[#224F7F] text-white"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="bg-[#2ECC71] hover:bg-[#27AE60] text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm & Create
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
