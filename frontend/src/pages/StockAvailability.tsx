import { useState } from 'react';
import { mockStockAvailability, mockWarehouses } from '../lib/mock-data';
import { Search, Edit, MapPin, Package, TrendingUp, Warehouse, Filter, Download, AlertCircle } from 'lucide-react';
import { useAuth, Permission } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { toast } from 'sonner';

export function StockAvailability() {
  const { hasPermission } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [stock] = useState(mockStockAvailability);

  const canUpdateStock = hasPermission(Permission.UPDATE_STOCK);
  const canAdjustStock = hasPermission(Permission.ADJUST_STOCK);

  const filteredStock = stock.filter(item => 
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.warehouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const totalLocations = stock.length;
  const totalUnits = stock.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueWarehouses = [...new Set(stock.map(item => item.warehouse))].length;
  const avgStockPerLocation = Math.round(totalUnits / totalLocations);

  // Group by warehouse for summary
  const warehouseStock = stock.reduce((acc, item) => {
    if (!acc[item.warehouse]) {
      acc[item.warehouse] = { total: 0, locations: 0 };
    }
    acc[item.warehouse].total += item.quantity;
    acc[item.warehouse].locations += 1;
    return acc;
  }, {} as Record<string, { total: number; locations: number }>);

  const handleAdjustStock = (id: string) => {
    if (!canAdjustStock) {
      toast.error('You don\'t have permission to adjust stock.');
      return;
    }
    toast.success('Stock adjustment initiated.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-2">Stock Availability</h1>
          <p className="text-[#6E7A83]">
            {canUpdateStock 
              ? 'View and manage stock levels across all warehouses' 
              : 'View stock levels (read-only access)'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            className="border-[#D9DFE6] text-[#1A4971] hover:bg-[#F7F9FC]"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6E7A83] mb-1">Total Units</p>
                <h2 className="text-3xl font-bold text-[#1A4971]">{totalUnits.toLocaleString()}</h2>
                <p className="text-xs text-[#6E7A83] mt-2">Across all locations</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <Package className="w-5 h-5 text-[#1A4971]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6E7A83] mb-1">Warehouses</p>
                <h2 className="text-3xl font-bold text-[#1A4971]">{uniqueWarehouses}</h2>
                <p className="text-xs text-[#6E7A83] mt-2">Active facilities</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <Warehouse className="w-5 h-5 text-[#2ECC71]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6E7A83] mb-1">Storage Locations</p>
                <h2 className="text-3xl font-bold text-[#1A4971]">{totalLocations}</h2>
                <p className="text-xs text-[#6E7A83] mt-2">Total storage points</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6E7A83] mb-1">Avg Per Location</p>
                <h2 className="text-3xl font-bold text-[#1A4971]">{avgStockPerLocation}</h2>
                <p className="text-xs text-[#2ECC71] mt-2">+8% this month</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-xl">
                <TrendingUp className="w-5 h-5 text-[#F9A03F]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Stock Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Stock by Warehouse</CardTitle>
          <CardDescription>Inventory distribution across facilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(warehouseStock).map(([warehouse, data], index) => {
              const percentage = Math.round((data.total / totalUnits) * 100);
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Warehouse className="w-4 h-4 text-[#1A4971]" />
                      <span className="text-sm text-[#1A4971] font-medium">{warehouse}</span>
                      <Badge variant="secondary" className="bg-[#E8F4F8] text-[#1A4971]">
                        {data.locations} location{data.locations !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-[#1A4971] font-medium">{data.total.toLocaleString()} units</span>
                      <span className="text-xs text-[#6E7A83] ml-2">({percentage}%)</span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E7A83]" strokeWidth={1.5} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, warehouses, or locations"
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

      {/* Stock Details Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Stock Details</CardTitle>
          <CardDescription>
            {filteredStock.length} location{filteredStock.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredStock.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F7F9FC] border-b border-[#D9DFE6]">
                  <tr>
                    <th className="text-left px-6 py-4 text-[#1A4971]">Product Name</th>
                    <th className="text-left px-6 py-4 text-[#1A4971]">Warehouse</th>
                    <th className="text-left px-6 py-4 text-[#1A4971]">Location</th>
                    <th className="text-right px-6 py-4 text-[#1A4971]">Quantity</th>
                    <th className="text-center px-6 py-4 text-[#1A4971]">Status</th>
                    {canAdjustStock && (
                      <th className="text-right px-6 py-4 text-[#1A4971]">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredStock.map((item, index) => {
                    const isLowStock = item.quantity < 500;
                    const isCritical = item.quantity < 200;
                    return (
                      <tr 
                        key={item.id}
                        className={`border-b border-[#D9DFE6] hover:bg-[#F7F9FC] transition-colors ${
                          index === filteredStock.length - 1 ? 'border-b-0' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#E8F4F8] rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-[#1A4971]" />
                            </div>
                            <span className="text-[#1A4971] font-medium">{item.productName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Warehouse className="w-4 h-4 text-[#6E7A83]" />
                            <span className="text-[#6E7A83]">{item.warehouse}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#6E7A83]" />
                            <span className="text-[#6E7A83]">{item.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-medium ${isCritical ? 'text-[#D64545]' : isLowStock ? 'text-[#F9A03F]' : 'text-[#1A4971]'}`}>
                            {item.quantity.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge 
                            variant={isCritical ? 'destructive' : isLowStock ? 'secondary' : 'default'}
                            className={
                              isCritical 
                                ? 'bg-[#D64545] hover:bg-[#C03535]' 
                                : isLowStock 
                                ? 'bg-[#F9A03F] hover:bg-[#E89230] text-white' 
                                : 'bg-[#2ECC71] hover:bg-[#27AE60]'
                            }
                          >
                            {isCritical ? 'Critical' : isLowStock ? 'Low Stock' : 'Good'}
                          </Badge>
                        </td>
                        {canAdjustStock && (
                          <td className="px-6 py-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="hover:bg-[#E8F4F8] hover:text-[#1A4971]"
                              onClick={() => handleAdjustStock(item.id)}
                            >
                              <Edit className="w-4 h-4" strokeWidth={1.5} />
                            </Button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-[#F7F9FC] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-[#6E7A83]" />
              </div>
              <h3 className="text-[#1A4971] mb-2">
                {searchQuery ? 'No stock found' : 'No stock available'}
              </h3>
              <p className="text-[#6E7A83]">
                {searchQuery 
                  ? 'Try adjusting your search criteria.'
                  : 'No stock has been recorded yet.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}