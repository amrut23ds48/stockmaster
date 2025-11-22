import { useState } from 'react';
import React from "react";

import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Edit, Search, ShieldAlert, Package, AlertTriangle, TrendingUp, Filter, Download, Plus } from 'lucide-react';
import { mockProducts } from '../lib/mock-data';
import { useAuth, Permission } from '../contexts/AuthContext';

export function Products() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [products] = useState(mockProducts);

  const canCreateProduct = hasPermission(Permission.CREATE_PRODUCT);
  const canUpdateProduct = hasPermission(Permission.UPDATE_PRODUCT);
  const canViewProduct = hasPermission(Permission.VIEW_PRODUCT);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockItems = products.filter(p => p.quantity < 500).length;
  const categories = [...new Set(products.map(p => p.category))].length;

  // If staff tries to access this page, show access denied
  if (!canViewProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-[#FEF2F2] p-6 rounded-full mb-6">
          <ShieldAlert className="w-16 h-16 text-[#D64545]" />
        </div>
        <h2 className="text-[#1A4971] mb-2">Access Denied</h2>
        <p className="text-[#6E7A83] text-center max-w-md mb-6">
          You don't have permission to access the Products page. Please contact your manager.
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
          <h1 className="mb-2">Products</h1>
          <p className="text-[#6E7A83]">
            {canCreateProduct 
              ? 'Manage your product inventory' 
              : 'View product inventory (read-only)'}
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
          {canCreateProduct && (
            <Button 
              onClick={() => navigate('/products/add')}
              className="bg-[#1A4971] hover:bg-[#224F7F] text-white rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
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
                <p className="text-sm text-[#6E7A83] mb-1">Total Products</p>
                <h2 className="text-3xl font-bold text-[#1A4971]">{totalProducts}</h2>
                <p className="text-xs text-[#6E7A83] mt-2">{categories} categories</p>
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
                <p className="text-sm text-[#6E7A83] mb-1">Total Stock</p>
                <h2 className="text-3xl font-bold text-[#1A4971]">{totalQuantity.toLocaleString()}</h2>
                <p className="text-xs text-[#2ECC71] mt-2">+12% from last month</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <TrendingUp className="w-5 h-5 text-[#2ECC71]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6E7A83] mb-1">Low Stock Alert</p>
                <h2 className="text-3xl font-bold text-[#F9A03F]">{lowStockItems}</h2>
                <p className="text-xs text-[#6E7A83] mt-2">Items below threshold</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-[#F9A03F]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6E7A83] mb-1">Categories</p>
                <h2 className="text-3xl font-bold text-[#1A4971]">{categories}</h2>
                <p className="text-xs text-[#6E7A83] mt-2">Active product types</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                <Filter className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                placeholder="Search by Name, SKU, or Category"
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

      {/* Products Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F7F9FC] border-b border-[#D9DFE6]">
                  <tr>
                    <th className="text-left px-6 py-4 text-[#1A4971]">Product Name</th>
                    <th className="text-left px-6 py-4 text-[#1A4971]">SKU</th>
                    <th className="text-left px-6 py-4 text-[#1A4971]">Category</th>
                    <th className="text-right px-6 py-4 text-[#1A4971]">Quantity</th>
                    <th className="text-center px-6 py-4 text-[#1A4971]">Status</th>
                    {canUpdateProduct && (
                      <th className="text-right px-6 py-4 text-[#1A4971]">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => {
                    const isLowStock = product.quantity < 500;
                    const isOutOfStock = product.quantity === 0;
                    return (
                      <tr 
                        key={product.id}
                        className={`border-b border-[#D9DFE6] hover:bg-[#F7F9FC] transition-colors ${
                          index === filteredProducts.length - 1 ? 'border-b-0' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#E8F4F8] rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-[#1A4971]" />
                            </div>
                            <span className="text-[#1A4971] font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#6E7A83] font-mono">{product.sku}</td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary" className="bg-[#E8F4F8] text-[#1A4971] hover:bg-[#D4E8F0]">
                            {product.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-medium ${isOutOfStock ? 'text-[#D64545]' : isLowStock ? 'text-[#F9A03F]' : 'text-[#1A4971]'}`}>
                            {product.quantity.toLocaleString()}
                          </span>
                          <span className="text-[#6E7A83] ml-1">{product.unit}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge 
                            variant={isOutOfStock ? 'destructive' : isLowStock ? 'secondary' : 'default'}
                            className={
                              isOutOfStock 
                                ? 'bg-[#D64545] hover:bg-[#C03535]' 
                                : isLowStock 
                                ? 'bg-[#F9A03F] hover:bg-[#E89230] text-white' 
                                : 'bg-[#2ECC71] hover:bg-[#27AE60]'
                            }
                          >
                            {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                          </Badge>
                        </td>
                        {canUpdateProduct && (
                          <td className="px-6 py-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="hover:bg-[#E8F4F8] hover:text-[#1A4971]"
                              onClick={() => navigate(`/products/${product.id}/edit`)}
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
                <Package className="w-10 h-10 text-[#6E7A83]" />
              </div>
              <h3 className="text-[#1A4971] mb-2">
                {searchQuery ? 'No products found' : 'No products yet'}
              </h3>
              <p className="text-[#6E7A83] mb-6">
                {searchQuery 
                  ? 'Try adjusting your search criteria.'
                  : 'Start by adding your first product to the inventory.'}
              </p>
              {!searchQuery && canCreateProduct && (
                <Button 
                  onClick={() => navigate('/products/add')}
                  className="bg-[#1A4971] hover:bg-[#224F7F] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}