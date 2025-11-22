import React from "react";
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { mockWarehouses, mockLocations } from '../lib/mock-data';
import { useAuth, Permission } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export function Locations() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    warehouseId: ''
  });
  const [locations] = useState(mockLocations);
  const [warehouses] = useState(mockWarehouses);

  const canCreateLocation = hasPermission(Permission.CREATE_LOCATION);
  const canViewLocation = hasPermission(Permission.VIEW_LOCATION);

  // If staff tries to access this page, show access denied
  if (!canViewLocation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ShieldAlert className="w-16 h-16 text-[#6E7A83] mb-4" />
        <h2 className="text-[#1A4971] mb-2">Access Denied</h2>
        <p className="text-[#6E7A83] text-center max-w-md">
          You don't have permission to access the Locations page. Please contact your manager.
        </p>
        <Button 
          onClick={() => navigate('/')}
          className="mt-6 bg-[#1A4971] hover:bg-[#224F7F] text-white"
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canCreateLocation) {
      toast.error('You don\'t have permission to create locations.');
      return;
    }
    
    if (!formData.name || !formData.warehouseId) {
      toast.error('Please fill in all required fields.');
      return;
    }

    toast.success('Location saved successfully.');
    setFormData({ name: '', warehouseId: '' });
  };

  return (
    <div>
      <div className="mb-8">
        <h1>Locations</h1>
        <p className="text-[#6E7A83] mt-1">
          {canCreateLocation 
            ? 'Manage storage locations within warehouses' 
            : 'View storage locations (read-only)'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Location Form */}
        <div className="bg-white rounded-xl shadow-sm border border-[#D9DFE6] p-8">
          <h3 className="mb-4">
            {canCreateLocation ? 'Add New Location' : 'Location Form (View Only)'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Name */}
            <div>
              <label htmlFor="name" className="block mb-2 text-[#1A4971]">
                Location Name *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
                placeholder="e.g., Rack A1, Floor B, Bay C-12"
                disabled={!canCreateLocation}
              />
            </div>

            {/* Assigned Warehouse */}
            <div>
              <label htmlFor="warehouse" className="block mb-2 text-[#1A4971]">
                Assigned Warehouse *
              </label>
              <select
                id="warehouse"
                value={formData.warehouseId}
                onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
                disabled={!canCreateLocation}
              >
                <option value="">Select a warehouse</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-[#6E7A83] italic">
              This refers to rack, floor, section, or storage bay.
            </p>

            {/* Save Button */}
            {canCreateLocation && (
              <Button 
                type="submit"
                className="w-full bg-[#1A4971] hover:bg-[#224F7F] text-white rounded-lg"
              >
                Save Location
              </Button>
            )}
          </form>
        </div>

        {/* Existing Locations List */}
        <div className="bg-white rounded-xl shadow-sm border border-[#D9DFE6] p-8">
          <h3 className="mb-4">Existing Locations</h3>
          
          <div className="space-y-4">
            {locations.map(location => (
              <div 
                key={location.id}
                className="p-4 border border-[#D9DFE6] rounded-lg hover:bg-[#F7F9FC] transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[#1A4971] mb-1">{location.name}</p>
                    <p className="text-[#6E7A83]">{location.warehouseName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}