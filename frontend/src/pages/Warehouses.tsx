import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Edit, ShieldAlert, Warehouse as WarehouseIcon, MapPin, Building2, Package, Plus, Search, Filter, Download } from 'lucide-react';
import { mockWarehouses, mockStockAvailability } from '../lib/mock-data';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { useAuth, Permission } from '../contexts/AuthContext';

export function Warehouses() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [warehouses] = useState(mockWarehouses);
  const [searchQuery, setSearchQuery] = useState('');

  const canCreateWarehouse = hasPermission(Permission.CREATE_WAREHOUSE);
  const canUpdateWarehouse = hasPermission(Permission.UPDATE_WAREHOUSE);
  const canViewWarehouse = hasPermission(Permission.VIEW_WAREHOUSE);

  // Calculate stats
  const totalWarehouses = warehouses.length;
  const totalCapacity = warehouses.length * 10000; // Mock capacity
  const usedCapacity = 6800; // Mock used
  const utilizationRate = Math.round((usedCapacity / totalCapacity) * 100);

  // Get stock per warehouse
  const warehouseStockCounts = mockStockAvailability.reduce((acc, item) => {
    acc[item.warehouse] = (acc[item.warehouse] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    warehouse.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    warehouse.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If staff tries to access this page, show access denied
  if (!canViewWarehouse) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-[#FEF2F2] p-6 rounded-full mb-6">
          <ShieldAlert className="w-16 h-16 text-[#D64545]" />
        </div>
        <h2 className="text-[#1A4971] mb-2">Access Denied</h2>
        <p className="text-[#6E7A83] text-center max-w-md mb-6">
          You don't have permission to access the Warehouses page. Please contact your manager.
        </p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-[#1A4971] hover:bg-[#224F7F] text-white"
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-2">Warehouses</h1>
          <p className="text-[#6E7A83]">
            {canCreateWarehouse 
              ? 'Manage warehouse facilities and locations' 
              : 'View warehouse facilities (read-only)'}
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
          {canCreateWarehouse && (
            <Button 
              onClick={() => navigate('/warehouses/add')}
              className="bg-[#1A4971] hover:bg-[#224F7F] text-white rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Warehouse
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6E7A83] mb-1">Total Facilities</p>
                <h2 className="text-3xl font-bold text-[#1A4971]">{totalWarehouses}</h2>
                <p className="text-xs text-[#6E7A83] mt-2">Active warehouses</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <Building2 className="w-5 h-5 text-[#1A4971]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6E7A83] mb-1">Total Capacity</p>
                <h2 className="text-3xl font-bold text-[#1A4971]">{totalCapacity.toLocaleString()}</h2>
                <p className="text-xs text-[#6E7A83] mt-2">Square meters</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <WarehouseIcon className="w-5 h-5 text-[#2ECC71]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6E7A83] mb-1">Utilization Rate</p>
                <h2 className="text-3xl font-bold text-[#F9A03F]">{utilizationRate}%</h2>
                <p className="text-xs text-[#6E7A83] mt-2">Current usage</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-xl">
                <Package className="w-5 h-5 text-[#F9A03F]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6E7A83] mb-1">Storage Locations</p>
                <h2 className="text-3xl font-bold text-[#1A4971]">24</h2>
                <p className="text-xs text-[#6E7A83] mt-2">Configured zones</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E7A83]" strokeWidth={1.5} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, code, or address"
                className="w-full pl-10 pr-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
              />
            </div>
            <Button 
              variant="outline"
              className="border-[#D9DFE6] text-[#1A4971] hover:bg-[#F7F9FC]"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Warehouse Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWarehouses.map((warehouse) => {
          const stockCount = warehouseStockCounts[warehouse.name] || 0;
          const capacity = 10000; // Mock
          const utilizationPercentage = Math.round((stockCount / capacity) * 100);
          
          return (
            <Card key={warehouse.id} className="hover:shadow-lg transition-all group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-[#E8F4F8] rounded-xl flex items-center justify-center group-hover:bg-[#1A4971] transition-colors">
                      <WarehouseIcon className="w-6 h-6 text-[#1A4971] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <CardTitle className="mb-1">{warehouse.name}</CardTitle>
                      <Badge variant="secondary" className="bg-[#E8F4F8] text-[#1A4971] font-mono">
                        {warehouse.code}
                      </Badge>
                    </div>
                  </div>
                  {canUpdateWarehouse && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#E8F4F8]"
                      onClick={() => navigate(`/warehouses/${warehouse.id}/edit`)}
                    >
                      <Edit className="w-4 h-4 text-[#6E7A83]" strokeWidth={1.5} />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2 text-sm text-[#6E7A83]">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{warehouse.address}</span>
                  </div>
                  <div className="pt-3 border-t border-[#E8F4F8]">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[#6E7A83]">Stock Level</span>
                      <span className="text-[#1A4971] font-medium">{stockCount.toLocaleString()} units</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#6E7A83] mb-2">
                      <span>Capacity Utilization</span>
                      <span>{utilizationPercentage}%</span>
                    </div>
                    <div className="h-2 bg-[#F7F9FC] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          utilizationPercentage > 80 ? 'bg-[#D64545]' : utilizationPercentage > 60 ? 'bg-[#F9A03F]' : 'bg-[#2ECC71]'
                        }`}
                        style={{ width: `${utilizationPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredWarehouses.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="bg-[#F7F9FC] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <WarehouseIcon className="w-10 h-10 text-[#6E7A83]" />
              </div>
              <h3 className="text-[#1A4971] mb-2">
                {searchQuery ? 'No warehouses found' : 'No warehouses yet'}
              </h3>
              <p className="text-[#6E7A83] mb-6">
                {searchQuery 
                  ? 'Try adjusting your search criteria.'
                  : 'Start by adding your first warehouse facility.'}
              </p>
              {!searchQuery && canCreateWarehouse && (
                <Button 
                  onClick={() => navigate('/warehouses/add')}
                  className="bg-[#1A4971] hover:bg-[#224F7F] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Warehouse
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}