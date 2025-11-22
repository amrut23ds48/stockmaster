import { useState } from 'react';
import React from "react";
import { mockMovementHistory } from '../lib/mock-data';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth, Permission } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Check, Edit, Plus, TrendingUp, TrendingDown, ArrowRight, Calendar, Package, Warehouse as WarehouseIcon, Filter, Download } from 'lucide-react';
import { MovementWizard } from '../components/MovementWizard';

export function MovementHistory() {
  const { hasPermission } = useAuth();
  const [movements, setMovements] = useState(mockMovementHistory);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    product: '',
    warehouse: '',
    activityType: '',
    status: ''
  });

  const canUpdateMovementStatus = hasPermission(Permission.UPDATE_MOVEMENT_STATUS);
  const canCreateMovement = hasPermission(Permission.CREATE_MOVEMENT);
  const canUpdateMovementDetails = hasPermission(Permission.UPDATE_MOVEMENT_DETAILS);

  // Calculate stats
  const totalIn = movements.reduce((sum, m) => sum + m.qtyIn, 0);
  const totalOut = movements.reduce((sum, m) => sum + m.qtyOut, 0);
  const pendingCount = movements.filter(m => m.status === 'Pending Validation').length;
  const completedCount = movements.filter(m => m.status === 'Completed').length;

  const handleMarkAsMoved = (id: string) => {
    if (!canUpdateMovementStatus) {
      toast.error('You don\'t have permission to update movement status.');
      return;
    }
    
    setMovements(movements.map(m => 
      m.id === id ? { ...m, status: 'Completed' } : m
    ));
    toast.success('Movement marked as completed!');
  };

  const handleCreateMovement = (movementData: any) => {
    setMovements([movementData, ...movements]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#2ECC71] text-white hover:bg-[#2ECC71]';
      case 'Pending Validation':
        return 'bg-[#E6A700] text-white hover:bg-[#E6A700]';
      default:
        return 'bg-[#6E7A83] text-white hover:bg-[#6E7A83]';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'Receipt':
        return 'bg-[#2ECC71] text-white hover:bg-[#2ECC71]';
      case 'Delivery':
        return 'bg-[#F9A03F] text-white hover:bg-[#F9A03F]';
      case 'Adjustment':
        return 'bg-[#1A4971] text-white hover:bg-[#1A4971]';
      default:
        return 'bg-[#6E7A83] text-white hover:bg-[#6E7A83]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-2">Movement History</h1>
          <p className="text-[#6E7A83]">
            {canCreateMovement 
              ? 'Inventory movement trail — create and manage stock movements' 
              : 'View inventory movement history (Staff can update status)'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            className="border-[#D9DFE6] text-[#1A4971] hover:bg-[#F7F9FC]"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {canCreateMovement && (
            <Button 
              onClick={() => setIsWizardOpen(true)}
              className="bg-[#1A4971] hover:bg-[#224F7F] text-white rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Movement
            </Button>
          )}
        </div>
      </div>

      <MovementWizard 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={handleCreateMovement}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6E7A83] mb-1">Total Inbound</p>
                <h2 className="text-3xl font-bold text-[#2ECC71]">{totalIn.toLocaleString()}</h2>
                <p className="text-xs text-[#6E7A83] mt-2">Units received</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <TrendingDown className="w-5 h-5 text-[#2ECC71]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6E7A83] mb-1">Total Outbound</p>
                <h2 className="text-3xl font-bold text-[#F9A03F]">{totalOut.toLocaleString()}</h2>
                <p className="text-xs text-[#6E7A83] mt-2">Units delivered</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-xl">
                <TrendingUp className="w-5 h-5 text-[#F9A03F]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6E7A83] mb-1">Pending</p>
                <h2 className="text-3xl font-bold text-[#E6A700]">{pendingCount}</h2>
                <p className="text-xs text-[#6E7A83] mt-2">Awaiting validation</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-xl">
                <Calendar className="w-5 h-5 text-[#E6A700]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6E7A83] mb-1">Completed</p>
                <h2 className="text-3xl font-bold text-[#2ECC71]">{completedCount}</h2>
                <p className="text-xs text-[#6E7A83] mt-2">Successfully processed</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <Check className="w-5 h-5 text-[#2ECC71]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter movements by criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block mb-2 text-[#1A4971]">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full px-3 py-2 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
              />
            </div>

            <div>
              <label className="block mb-2 text-[#1A4971]">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full px-3 py-2 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
              />
            </div>

            <div>
              <label className="block mb-2 text-[#1A4971]">Product</label>
              <input
                type="text"
                value={filters.product}
                onChange={(e) => setFilters({ ...filters, product: e.target.value })}
                className="w-full px-3 py-2 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
                placeholder="Search product"
              />
            </div>

            <div>
              <label className="block mb-2 text-[#1A4971]">Warehouse</label>
              <input
                type="text"
                value={filters.warehouse}
                onChange={(e) => setFilters({ ...filters, warehouse: e.target.value })}
                className="w-full px-3 py-2 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
                placeholder="Search warehouse"
              />
            </div>

            <div>
              <label className="block mb-2 text-[#1A4971]">Document Type</label>
              <select
                value={filters.activityType}
                onChange={(e) => setFilters({ ...filters, activityType: e.target.value })}
                className="w-full px-3 py-2 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
              >
                <option value="">All Types</option>
                <option value="Receipt">Receipt</option>
                <option value="Delivery">Delivery</option>
                <option value="Adjustment">Adjustment</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-[#1A4971]">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
              >
                <option value="">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending Validation">Pending Validation</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      <Card>
        <CardHeader>
          <CardTitle>Movement Timeline</CardTitle>
          <CardDescription>{movements.length} movements recorded</CardDescription>
        </CardHeader>
        <CardContent>
          {movements.length > 0 ? (
            <div className="space-y-4">
              {movements.map((movement, index) => (
                <div key={movement.id} className="relative">
                  {index !== movements.length - 1 && (
                    <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-[#E8F4F8]" />
                  )}
                  <div className="flex gap-4 items-start">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      movement.activityType === 'Receipt' 
                        ? 'bg-green-100' 
                        : movement.activityType === 'Delivery'
                        ? 'bg-orange-100'
                        : 'bg-blue-100'
                    }`}>
                      {movement.activityType === 'Receipt' ? (
                        <TrendingDown className="w-5 h-5 text-[#2ECC71]" />
                      ) : movement.activityType === 'Delivery' ? (
                        <TrendingUp className="w-5 h-5 text-[#F9A03F]" />
                      ) : (
                        <Package className="w-5 h-5 text-[#1A4971]" />
                      )}
                    </div>
                    <div className="flex-1 bg-white border border-[#D9DFE6] rounded-xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getActivityColor(movement.activityType)}>
                              {movement.activityType}
                            </Badge>
                            <Badge className={getStatusColor(movement.status)}>
                              {movement.status}
                            </Badge>
                          </div>
                          <h3 className="text-[#1A4971] mb-1">{movement.product}</h3>
                          <div className="flex items-center gap-4 text-sm text-[#6E7A83]">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{movement.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <WarehouseIcon className="w-4 h-4" />
                              <span>{movement.warehouse}</span>
                            </div>
                          </div>
                        </div>
                        {canUpdateMovementStatus && movement.status !== 'Completed' && (
                          <Button
                            onClick={() => handleMarkAsMoved(movement.id)}
                            size="sm"
                            className="bg-[#2ECC71] hover:bg-[#27AE60] text-white rounded-lg"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-6 pt-3 border-t border-[#E8F4F8]">
                        {movement.qtyIn > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[#6E7A83]">In:</span>
                            <span className="text-[#2ECC71] font-medium">+{movement.qtyIn} units</span>
                          </div>
                        )}
                        {movement.qtyOut > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[#6E7A83]">Out:</span>
                            <span className="text-[#F9A03F] font-medium">-{movement.qtyOut} units</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-[#F7F9FC] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-[#6E7A83]" />
              </div>
              <h3 className="text-[#1A4971] mb-2">No movements yet</h3>
              <p className="text-[#6E7A83]">No stock movement recorded yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}