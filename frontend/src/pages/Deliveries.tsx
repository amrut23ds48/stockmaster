import React from "react";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { mockDeliveries } from '../lib/mock-data';
import { Badge } from '../components/ui/badge';
import { useAuth, Permission } from '../contexts/AuthContext';
import { Trash2, Edit, Eye } from 'lucide-react';
import { toast } from 'sonner';

export function Deliveries() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [deliveries] = useState(mockDeliveries);

  const canCreateDelivery = hasPermission(Permission.CREATE_DELIVERY);
  const canUpdateDelivery = hasPermission(Permission.UPDATE_DELIVERY);
  const canDeleteDelivery = hasPermission(Permission.DELETE_DELIVERY);

  const handleValidate = (id: string) => {
    toast.success('Delivery validated successfully!');
  };

  const handleDelete = (id: string) => {
    toast.success('Delivery deleted successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#2ECC71] text-white hover:bg-[#2ECC71]';
      case 'Pending Validation':
        return 'bg-[#E6A700] text-white hover:bg-[#E6A700]';
      case 'Draft':
        return 'bg-[#6E7A83] text-white hover:bg-[#6E7A83]';
      default:
        return 'bg-[#6E7A83] text-white';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Delivery Orders</h1>
          <p className="text-[#6E7A83] mt-1">
            {canCreateDelivery 
              ? 'Create and manage delivery orders' 
              : 'View delivery orders'}
          </p>
        </div>
        {canCreateDelivery && (
          <Button 
            onClick={() => navigate('/deliveries/add')}
            className="bg-[#1A4971] hover:bg-[#224F7F] text-white rounded-lg"
          >
            Add Delivery
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#D9DFE6] overflow-hidden">
        {deliveries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7F9FC] border-b border-[#D9DFE6]">
                <tr>
                  <th className="text-left px-6 py-4 text-[#1A4971]">Delivery #</th>
                  <th className="text-left px-6 py-4 text-[#1A4971]">Customer</th>
                  <th className="text-left px-6 py-4 text-[#1A4971]">Warehouse</th>
                  <th className="text-left px-6 py-4 text-[#1A4971]">Created Date</th>
                  <th className="text-left px-6 py-4 text-[#1A4971]">Total Qty</th>
                  <th className="text-left px-6 py-4 text-[#1A4971]">Status</th>
                  {(canUpdateDelivery || canDeleteDelivery) && (
                    <th className="text-left px-6 py-4 text-[#1A4971]">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery, index) => (
                  <tr 
                    key={delivery.id}
                    onClick={() => navigate(`/deliveries/${delivery.id}`)}
                    className={`border-b border-[#D9DFE6] hover:bg-[#F7F9FC] transition-colors cursor-pointer ${
                      index === deliveries.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-[#1A4971]">{delivery.deliveryNumber}</td>
                    <td className="px-6 py-4 text-[#6E7A83]">{delivery.customer}</td>
                    <td className="px-6 py-4 text-[#6E7A83]">{delivery.warehouseName}</td>
                    <td className="px-6 py-4 text-[#6E7A83]">{delivery.createdDate}</td>
                    <td className="px-6 py-4 text-[#6E7A83]">{delivery.totalQuantity}</td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(delivery.status)}>
                        {delivery.status}
                      </Badge>
                    </td>
                    {(canUpdateDelivery || canDeleteDelivery) && (
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {canUpdateDelivery && (
                            <Edit 
                              className="w-5 h-5 text-[#1A4971] cursor-pointer mr-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/deliveries/${delivery.id}/edit`);
                              }}
                            />
                          )}
                          {canDeleteDelivery && (
                            <Trash2 
                              className="w-5 h-5 text-[#1A4971] cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(delivery.id);
                              }}
                            />
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#6E7A83]">No deliveries added yet — click "Add Delivery" to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}