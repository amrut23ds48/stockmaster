import React from "react";

import { Search, Bell, User } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-16 bg-white border-b border-[#D9DFE6] fixed top-16 right-0 left-0 z-10 flex items-center px-6 gap-6">
      {/* Global Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E7A83]" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search products, receipts, deliveries..."
            className="w-full pl-10 pr-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-2 focus:ring-[#1A4971]/20 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Role Badge */}
        {user && (
          <div className={`px-3 py-1.5 rounded-lg text-xs ${
            user.role === 'manager' 
              ? 'bg-[#1A4971] text-white' 
              : 'bg-[#E8F4F8] text-[#1A4971]'
          }`}>
            {user.role === 'manager' ? 'Manager' : 'Staff'}
          </div>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="rounded-lg relative">
          <Bell className="w-5 h-5 text-[#6E7A83]" strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D64545] rounded-full"></span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="w-9 h-9 bg-[#1A4971] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="text-[#1A4971]">{user?.name || 'User'}</p>
                <p className="text-[#6E7A83] text-xs">{user?.email || ''}</p>
                <p className="text-[#6E7A83] text-xs capitalize">{user?.role || ''} Account</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem>Notifications</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-[#D64545]">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}