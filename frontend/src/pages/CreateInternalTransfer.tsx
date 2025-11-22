import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, ArrowRightLeft, Save, PackageCheck, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { mockWarehouses, mockLocations, mockProducts, mockStockAvailability } from '../lib/mock-data';

export function CreateInternalTransfer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    warehouseId: '',
    productId: '',
    fromLocationId: '',
    toLocationId: '',
    quantity: '',
    notes: ''
  });

  const [availableLocations, setAvailableLocations] = useState<typeof mockLocations>([]);
  const [availableStock, setAvailableStock] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null);

  const handleWarehouseChange = (warehouseId: string) => {
    setFormData({
      ...formData,
      warehouseId,
      productId: '',
      fromLocationId: '',
      toLocationId: '',
      quantity: ''
    });
    
    // Filter locations for selected warehouse
    const filtered = mockLocations.filter(loc => loc.warehouseId === warehouseId);
    setAvailableLocations(filtered);
    setAvailableStock(0);
    setSelectedProduct(null);
  };

  const handleProductChange = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    setSelectedProduct(product || null);
    setFormData({
      ...formData,
      productId,
      fromLocationId: '',
      toLocationId: '',
      quantity: ''
    });
    setAvailableStock(0);
  };

  const handleFromLocationChange = (fromLocationId: string) => {
    setFormData({
      ...formData,
      fromLocationId,
      quantity: ''
    });

    // Calculate available stock at this location
    if (formData.productId && fromLocationId) {
      const location = mockLocations.find(l => l.id === fromLocationId);
      const stock = mockStockAvailability.find(
        s => s.productName === selectedProduct?.name && s.location === location?.name
      );
      setAvailableStock(stock?.quantity || 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.warehouseId || !formData.productId || !formData.fromLocationId || 
        !formData.toLocationId || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.fromLocationId === formData.toLocationId) {
      toast.error('Source and destination locations must be different');
      return;
    }

    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (quantity > availableStock) {
      toast.error(`Insufficient stock. Available: ${availableStock} units`);
      return;
    }

    // Success
    toast.success('Internal transfer created successfully');
    navigate('/internal-transfers');
  };

  const selectedWarehouse = mockWarehouses.find(w => w.id === formData.warehouseId);
  const fromLocation = mockLocations.find(l => l.id === formData.fromLocationId);
  const toLocation = mockLocations.find(l => l.id === formData.toLocationId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/internal-transfers')}
          className="border-[#D9DFE6]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="mb-1">Create Internal Transfer</h1>
          <p className="text-[#6E7A83]">Move products between storage locations within a warehouse</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-[#1A4971]" />
                Transfer Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Warehouse Selection */}
                <div>
                  <label htmlFor="warehouse" className="block mb-2 text-[#1A4971]">
                    Warehouse *
                  </label>
                  <select
                    id="warehouse"
                    value={formData.warehouseId}
                    onChange={(e) => handleWarehouseChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971] bg-white"
                    required
                  >
                    <option value="">Select warehouse</option>
                    {mockWarehouses.map(warehouse => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name} ({warehouse.code})
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-[#6E7A83] mt-1">
                    Choose the warehouse where the transfer will occur
                  </p>
                </div>

                {/* Product Selection */}
                <div>
                  <label htmlFor="product" className="block mb-2 text-[#1A4971]">
                    Product *
                  </label>
                  <select
                    id="product"
                    value={formData.productId}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971] bg-white"
                    disabled={!formData.warehouseId}
                    required
                  >
                    <option value="">Select product</option>
                    {mockProducts.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </option>
                    ))}
                  </select>
                  {selectedProduct && (
                    <p className="text-sm text-[#6E7A83] mt-1">
                      Unit: {selectedProduct.unit}
                    </p>
                  )}
                </div>

                {/* From Location */}
                <div>
                  <label htmlFor="fromLocation" className="block mb-2 text-[#1A4971]">
                    From Location (Source) *
                  </label>
                  <select
                    id="fromLocation"
                    value={formData.fromLocationId}
                    onChange={(e) => handleFromLocationChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971] bg-white"
                    disabled={!formData.warehouseId || !formData.productId}
                    required
                  >
                    <option value="">Select source location</option>
                    {availableLocations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                  {formData.fromLocationId && availableStock > 0 && (
                    <div className="mt-2 p-3 bg-[#E8F4F8] border border-[#1A4971]/20 rounded-lg">
                      <p className="text-sm text-[#1A4971]">
                        Available stock at this location: <span className="font-semibold">{availableStock}</span> {selectedProduct?.unit}
                      </p>
                    </div>
                  )}
                  {formData.fromLocationId && availableStock === 0 && (
                    <div className="mt-2 p-3 bg-[#FFF4E6] border border-[#F9A03F]/20 rounded-lg">
                      <p className="text-sm text-[#F9A03F]">
                        No stock available at this location
                      </p>
                    </div>
                  )}
                </div>

                {/* To Location */}
                <div>
                  <label htmlFor="toLocation" className="block mb-2 text-[#1A4971]">
                    To Location (Destination) *
                  </label>
                  <select
                    id="toLocation"
                    value={formData.toLocationId}
                    onChange={(e) => setFormData({ ...formData, toLocationId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971] bg-white"
                    disabled={!formData.warehouseId || !formData.productId}
                    required
                  >
                    <option value="">Select destination location</option>
                    {availableLocations.map(location => (
                      <option 
                        key={location.id} 
                        value={location.id}
                        disabled={location.id === formData.fromLocationId}
                      >
                        {location.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-[#6E7A83] mt-1">
                    Select where the product will be moved to
                  </p>
                </div>

                {/* Quantity */}
                <div>
                  <label htmlFor="quantity" className="block mb-2 text-[#1A4971]">
                    Quantity to Transfer *
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
                    placeholder="Enter quantity"
                    min="1"
                    max={availableStock}
                    disabled={!formData.fromLocationId}
                    required
                  />
                  {selectedProduct && formData.quantity && (
                    <p className="text-sm text-[#6E7A83] mt-1">
                      Transferring: {formData.quantity} {selectedProduct.unit}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block mb-2 text-[#1A4971]">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971] resize-none"
                    rows={3}
                    placeholder="Add any relevant notes about this transfer..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <Button
                    type="submit"
                    className="bg-[#1A4971] hover:bg-[#224F7F] text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Create Transfer
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/internal-transfers')}
                    className="border-[#D9DFE6] text-[#6E7A83] hover:bg-[#F7F9FC]"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Transfer Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-[#1A4971]" />
                Transfer Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedWarehouse ? (
                <div>
                  <p className="text-sm text-[#6E7A83] mb-1">Warehouse</p>
                  <p className="text-[#1A4971]">{selectedWarehouse.name}</p>
                  <p className="text-sm text-[#6E7A83] font-mono">{selectedWarehouse.code}</p>
                </div>
              ) : (
                <div className="p-4 bg-[#F7F9FC] rounded-lg text-center">
                  <p className="text-sm text-[#6E7A83]">Select a warehouse to begin</p>
                </div>
              )}

              {selectedProduct && (
                <div className="pt-4 border-t border-[#E8F4F8]">
                  <p className="text-sm text-[#6E7A83] mb-1">Product</p>
                  <p className="text-[#1A4971]">{selectedProduct.name}</p>
                  <p className="text-sm text-[#6E7A83]">{selectedProduct.sku}</p>
                </div>
              )}

              {fromLocation && (
                <div className="pt-4 border-t border-[#E8F4F8]">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#F9A03F] mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-[#6E7A83] mb-1">From</p>
                      <p className="text-[#1A4971]">{fromLocation.name}</p>
                    </div>
                  </div>
                </div>
              )}

              {toLocation && (
                <div className="pt-4 border-t border-[#E8F4F8]">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#2ECC71] mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-[#6E7A83] mb-1">To</p>
                      <p className="text-[#1A4971]">{toLocation.name}</p>
                    </div>
                  </div>
                </div>
              )}

              {formData.quantity && selectedProduct && (
                <div className="pt-4 border-t border-[#E8F4F8]">
                  <p className="text-sm text-[#6E7A83] mb-1">Quantity</p>
                  <p className="text-2xl font-bold text-[#1A4971]">
                    {formData.quantity} <span className="text-base font-normal text-[#6E7A83]">{selectedProduct.unit}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="bg-[#E8F4F8] border-[#1A4971]/20">
            <CardContent className="p-4">
              <h4 className="text-[#1A4971] mb-2">Transfer Guidelines</h4>
              <ul className="text-sm text-[#1A4971] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#1A4971] mt-0.5">•</span>
                  <span>Select the warehouse first to view available locations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1A4971] mt-0.5">•</span>
                  <span>Ensure sufficient stock is available at the source location</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1A4971] mt-0.5">•</span>
                  <span>Source and destination locations must be different</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1A4971] mt-0.5">•</span>
                  <span>Transfer requests require manager approval</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
