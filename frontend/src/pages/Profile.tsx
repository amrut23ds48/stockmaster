import { useState } from 'react';
import React from "react";

import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { User, Mail, Building, Phone, Shield, LogOut, Settings, Bell, Lock, ShieldCheck, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || 'John Warehouse Manager',
    email: user?.email || 'john.manager@stockmaster.com',
    company: 'Steel Dynamics Inc.',
    phone: '+1 234 567 8900',
    role: user?.role || 'manager'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    lowStockAlerts: true,
    deliveryUpdates: false,
    receiptConfirmations: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully.');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Profile Settings</h1>
        <p className="text-[#6E7A83]">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-[#1A4971] to-[#2E5984] rounded-full flex items-center justify-center mb-4 shadow-lg">
                <User className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
              <h2 className="text-[#1A4971] mb-1">{formData.name}</h2>
              <p className="text-[#6E7A83] mb-3">{formData.email}</p>
              <Badge 
                className={`mb-4 ${
                  user?.role === 'manager' 
                    ? 'bg-[#1A4971] hover:bg-[#224F7F]' 
                    : 'bg-[#2ECC71] hover:bg-[#27AE60]'
                }`}
              >
                {user?.role === 'manager' ? (
                  <>
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Manager Account
                  </>
                ) : (
                  <>
                    <Users className="w-3 h-3 mr-1" />
                    Staff Account
                  </>
                )}
              </Badge>
              
              <Separator className="my-4" />
              
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6E7A83]">Member since</span>
                  <span className="text-[#1A4971] font-medium">Nov 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6E7A83]">Last login</span>
                  <span className="text-[#1A4971] font-medium">Today</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6E7A83]">Account status</span>
                  <Badge variant="default" className="bg-[#2ECC71] hover:bg-[#27AE60]">
                    Active
                  </Badge>
                </div>
              </div>

              <Button 
                onClick={handleLogout}
                variant="outline"
                className="w-full mt-6 border-[#D64545] text-[#D64545] hover:bg-[#D64545] hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block mb-2 text-[#1A4971]">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E7A83]" strokeWidth={1.5} />
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block mb-2 text-[#1A4971]">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E7A83]" strokeWidth={1.5} />
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="block mb-2 text-[#1A4971]">
                      Company
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E7A83]" strokeWidth={1.5} />
                      <input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block mb-2 text-[#1A4971]">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E7A83]" strokeWidth={1.5} />
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit"
                    className="bg-[#1A4971] hover:bg-[#224F7F] text-white rounded-lg"
                  >
                    Save Changes
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="border-[#D9DFE6] text-[#6E7A83] hover:bg-[#F7F9FC] rounded-lg"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                  { key: 'lowStockAlerts', label: 'Low Stock Alerts', description: 'Get notified when stock is running low' },
                  { key: 'deliveryUpdates', label: 'Delivery Updates', description: 'Track delivery status changes' },
                  { key: 'receiptConfirmations', label: 'Receipt Confirmations', description: 'Confirm when goods are received' }
                ].map((setting) => (
                  <div key={setting.key} className="flex items-start justify-between p-4 bg-[#F7F9FC] rounded-lg">
                    <div className="flex-1">
                      <p className="text-[#1A4971] font-medium mb-1">{setting.label}</p>
                      <p className="text-sm text-[#6E7A83]">{setting.description}</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({
                        ...notificationSettings,
                        [setting.key]: !notificationSettings[setting.key as keyof typeof notificationSettings]
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings[setting.key as keyof typeof notificationSettings]
                          ? 'bg-[#1A4971]'
                          : 'bg-[#D9DFE6]'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings[setting.key as keyof typeof notificationSettings]
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security
              </CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  variant="outline"
                  className="w-full justify-start border-[#D9DFE6] text-[#1A4971] hover:bg-[#F7F9FC]"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button 
                  variant="outline"
                  className="w-full justify-start border-[#D9DFE6] text-[#1A4971] hover:bg-[#F7F9FC]"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Enable Two-Factor Authentication
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}