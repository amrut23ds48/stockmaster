import { useNavigate, useLocation } from 'react-router-dom';
import { Package, ChevronDown } from 'lucide-react';
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth, Permission } from '../contexts/AuthContext';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isActiveParent = (paths: string[]) => {
    return paths.some(path => location.pathname.startsWith(path));
  };

  // Check permissions for menu visibility
  const canViewProducts = hasPermission(Permission.VIEW_PRODUCT);
  const canViewStock = hasPermission(Permission.VIEW_STOCK);
  const canViewDelivery = hasPermission(Permission.VIEW_DELIVERY);
  const canViewReceipt = hasPermission(Permission.VIEW_RECEIPT);
  const canViewMovement = hasPermission(Permission.VIEW_MOVEMENT);
  const canViewWarehouses = hasPermission(Permission.VIEW_WAREHOUSE);
  const canViewLocations = hasPermission(Permission.VIEW_LOCATION);

  return (
    <nav className="h-16 bg-white border-b-2 border-[#1A4971] flex items-center px-6">
      <div className="flex items-center justify-between w-full max-w-[1920px] mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 mr-12">
          <div className="w-10 h-10 bg-[#1A4971] rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-[#1A4971] m-0">StockMaster</h2>
        </div>

        {/* Navigation Menu */}
        <div className="flex items-center gap-1">
          {/* Dashboard */}
          <button
            onClick={() => navigate('/')}
            className={`px-4 py-2 rounded-lg transition-all ${
              isActive('/') 
                ? 'bg-[#1A4971] text-white' 
                : 'text-[#1A4971] hover:bg-[#E8F4F8]'
            }`}
          >
            Dashboard
          </button>

          {/* Operations Dropdown - Only show if user has access to at least one operation */}
          {(canViewReceipt || canViewDelivery || canViewMovement) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${
                    isActiveParent(['/receipts', '/deliveries']) 
                      ? 'bg-[#1A4971] text-white' 
                      : 'text-[#1A4971] hover:bg-[#E8F4F8]'
                  }`}
                >
                  Operations
                  <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {canViewReceipt && (
                  <DropdownMenuItem 
                    onClick={() => navigate('/receipts')}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="text-[#1A4971]">Receipt</span>
                      <span className="text-xs text-[#6E7A83]">Receive stock into warehouse</span>
                    </div>
                  </DropdownMenuItem>
                )}
                {canViewDelivery && (
                  <DropdownMenuItem 
                    onClick={() => navigate('/deliveries')}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="text-[#1A4971]">Delivery</span>
                      <span className="text-xs text-[#6E7A83]">Deliver goods to customers</span>
                    </div>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Stock Dropdown - Only show if user has access */}
          {(canViewProducts || canViewStock) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${
                    isActiveParent(['/products', '/stock']) 
                      ? 'bg-[#1A4971] text-white' 
                      : 'text-[#1A4971] hover:bg-[#E8F4F8]'
                  }`}
                >
                  Stock
                  <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {canViewProducts && (
                  <DropdownMenuItem 
                    onClick={() => navigate('/products')}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="text-[#1A4971]">Products</span>
                      <span className="text-xs text-[#6E7A83]">List the available stock</span>
                    </div>
                  </DropdownMenuItem>
                )}
                {canViewStock && (
                  <DropdownMenuItem 
                    onClick={() => navigate('/stock')}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="text-[#1A4971]">Stock Availability</span>
                      <span className="text-xs text-[#6E7A83]">Check real-time stock levels</span>
                    </div>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Move History - Only show if user has access */}
          {canViewMovement && (
            <button
              onClick={() => navigate('/movement-history')}
              className={`px-4 py-2 rounded-lg transition-all ${
                isActive('/movement-history') 
                  ? 'bg-[#1A4971] text-white' 
                  : 'text-[#1A4971] hover:bg-[#E8F4F8]'
              }`}
            >
              Move History
            </button>
          )}

          {/* Settings Dropdown - Only show if user has access to at least one setting */}
          {(canViewWarehouses || canViewLocations) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${
                    isActiveParent(['/warehouses', '/locations', '/profile']) 
                      ? 'bg-[#1A4971] text-white' 
                      : 'text-[#1A4971] hover:bg-[#E8F4F8]'
                  }`}
                >
                  Settings
                  <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                {canViewWarehouses && (
                  <DropdownMenuItem 
                    onClick={() => navigate('/warehouses')}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="text-[#1A4971]">Warehouse</span>
                      <span className="text-xs text-[#6E7A83]">Manage warehouse facilities</span>
                    </div>
                  </DropdownMenuItem>
                )}
                {canViewLocations && (
                  <DropdownMenuItem 
                    onClick={() => navigate('/locations')}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="text-[#1A4971]">Locations</span>
                      <span className="text-xs text-[#6E7A83]">Manage storage locations</span>
                    </div>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => navigate('/profile')}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="text-[#1A4971]">Profile</span>
                    <span className="text-xs text-[#6E7A83]">User profile & preferences</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Right Side - Page Title */}
        <div className="ml-auto">
          <span className="text-[#1A4971] px-4 py-2 border-l-2 border-[#D9DFE6]">
            {location.pathname === '/' && 'Dashboard'}
            {location.pathname === '/products' && 'Products'}
            {location.pathname === '/products/add' && 'Add Product'}
            {location.pathname === '/warehouses' && 'Warehouses'}
            {location.pathname === '/warehouses/add' && 'Add Warehouse'}
            {location.pathname === '/locations' && 'Locations'}
            {location.pathname === '/receipts' && 'Receipts'}
            {location.pathname === '/receipts/add' && 'Add Receipt'}
            {location.pathname === '/deliveries' && 'Deliveries'}
            {location.pathname === '/deliveries/add' && 'Add Delivery'}
            {location.pathname === '/movement-history' && 'Movement History'}
            {location.pathname === '/stock' && 'Stock Availability'}
            {location.pathname === '/profile' && 'Profile'}
          </span>
        </div>
      </div>
    </nav>
  );
}