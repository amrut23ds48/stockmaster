import React from "react";

import { useNavigate } from 'react-router-dom';
import { Package, Warehouse, TrendingUp, TrendingDown, History, ShieldCheck, Users, AlertCircle, CheckCircle, Clock, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { useAuth, Permission } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { LineChart, Line,  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const navigationCards = [
  {
    title: 'Products',
    description: 'Add, search & manage products in stock.',
    icon: Package,
    path: '/products',
    color: '#1A4971',
    permission: Permission.VIEW_PRODUCT
  },
  {
    title: 'Warehouses',
    description: 'Manage warehouse locations and storage facilities.',
    icon: Warehouse,
    path: '/warehouses',
    color: '#1A4971',
    permission: Permission.VIEW_WAREHOUSE
  },
  {
    title: 'Delivery',
    description: 'Process outbound orders and dispatch inventory.',
    icon: TrendingUp,
    path: '/deliveries',
    color: '#1A4971',
    permission: Permission.VIEW_DELIVERY
  },
  {
    title: 'Receipts',
    description: 'Record incoming goods and update stock levels.',
    icon: TrendingDown,
    path: '/receipts',
    color: '#1A4971',
    permission: Permission.VIEW_RECEIPT
  },
  {
    title: 'Movement History',
    description: 'Track all inventory movements and transactions.',
    icon: History,
    path: '/movement-history',
    color: '#1A4971',
    permission: Permission.VIEW_MOVEMENT
  },
];

// Mock data for charts
const weeklyMovementData = [
  { day: 'Mon', receipts: 120, deliveries: 85 },
  { day: 'Tue', receipts: 95, deliveries: 110 },
  { day: 'Wed', receipts: 145, deliveries: 95 },
  { day: 'Thu', receipts: 110, deliveries: 120 },
  { day: 'Fri', receipts: 135, deliveries: 100 },
  { day: 'Sat', receipts: 80, deliveries: 70 },
  { day: 'Sun', receipts: 60, deliveries: 50 },
];

const stockDistributionData = [
  { name: 'Steel Bars', value: 35, color: '#1A4971' },
  { name: 'Steel Plates', value: 28, color: '#2E5984' },
  { name: 'Structural Steel', value: 20, color: '#F9A03F' },
  { name: 'Wire Products', value: 10, color: '#2ECC71' },
  { name: 'Beams', value: 7, color: '#6E7A83' },
];

const recentActivities = [
  { id: 1, type: 'receipt', item: 'Steel Bar 10mm', qty: 500, warehouse: 'Main Warehouse', time: '2 hours ago', status: 'completed' },
  { id: 2, type: 'delivery', item: 'Steel Plate 6mm', qty: 300, warehouse: 'North Center', time: '3 hours ago', status: 'pending' },
  { id: 3, type: 'receipt', item: 'Angle Iron 50x50', qty: 150, warehouse: 'Main Warehouse', time: '5 hours ago', status: 'completed' },
  { id: 4, type: 'delivery', item: 'Wire Mesh Roll', qty: 80, warehouse: 'South Facility', time: '6 hours ago', status: 'completed' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();

  // Filter cards based on permissions
  const visibleCards = navigationCards.filter(card => hasPermission(card.permission));

  const statsCards = [
    { 
      title: 'Total Products', 
      value: '248', 
      change: '+12%', 
      trend: 'up', 
      icon: Package,
      color: 'bg-blue-50',
      iconColor: 'text-[#1A4971]',
      description: 'vs last month'
    },
    { 
      title: 'Active Warehouses', 
      value: '12', 
      change: '+2', 
      trend: 'up', 
      icon: Warehouse,
      color: 'bg-green-50',
      iconColor: 'text-[#2ECC71]',
      description: 'facilities operational'
    },
    { 
      title: 'Pending Receipts', 
      value: '18', 
      change: '-5', 
      trend: 'down', 
      icon: AlertCircle,
      color: 'bg-orange-50',
      iconColor: 'text-[#F9A03F]',
      description: 'awaiting validation'
    },
    { 
      title: 'This Week Movements', 
      value: '1,247', 
      change: '+18%', 
      trend: 'up', 
      icon: Activity,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      description: 'total transactions'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="mb-2">Dashboard</h1>
        <div className="flex items-center gap-3">
          <p className="text-[#6E7A83]">
            Welcome back, {user?.name}!
          </p>
          <Badge 
            variant="secondary" 
            className={`px-3 py-1 flex items-center gap-1 ${
              user?.role === 'manager' 
                ? 'bg-[#1A4971] text-white hover:bg-[#224F7F]' 
                : 'bg-[#E8F4F8] text-[#1A4971] hover:bg-[#D4E8F0]'
            }`}
          >
            {user?.role === 'manager' ? <ShieldCheck className="w-3 h-3" /> : <Users className="w-3 h-3" />}
            {user?.role === 'manager' ? 'Manager' : 'Staff'} Account
          </Badge>
        </div>
      </div>

      {/* Role-specific info banner */}
      {user?.role === 'staff' && (
        <Card className="bg-gradient-to-r from-[#E8F4F8] to-[#F0F7FA] border-l-4 border-[#1A4971]">
          <CardHeader className="pb-3">
            <CardTitle className="text-[#1A4971]">Staff Access Level</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#6E7A83]">
              You can view stock, create deliveries & receipts, and update movement status. 
              Contact your manager for advanced permissions.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-[#6E7A83]">{stat.title}</p>
                    <h2 className="text-3xl font-bold text-[#1A4971]">{stat.value}</h2>
                    <div className="flex items-center gap-1">
                      <TrendIcon className={`w-4 h-4 ${stat.trend === 'up' ? 'text-[#2ECC71]' : 'text-[#D64545]'}`} />
                      <span className={`text-sm ${stat.trend === 'up' ? 'text-[#2ECC71]' : 'text-[#D64545]'}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-[#6E7A83] ml-1">{stat.description}</span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} strokeWidth={1.5} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Movement Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Movement Trend</CardTitle>
            <CardDescription>Receipts vs Deliveries over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyMovementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F4F8" />
                <XAxis dataKey="day" stroke="#6E7A83" />
                <YAxis stroke="#6E7A83" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #D9DFE6',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="receipts" 
                  stroke="#2ECC71" 
                  strokeWidth={2}
                  name="Receipts"
                  dot={{ fill: '#2ECC71', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="deliveries" 
                  stroke="#1A4971" 
                  strokeWidth={2}
                  name="Deliveries"
                  dot={{ fill: '#1A4971', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Distribution</CardTitle>
            <CardDescription>By product category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stockDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {stockDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {stockDistributionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#6E7A83]">{item.name}</span>
                  </div>
                  <span className="text-[#1A4971] font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h3 className="mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.path}
                  onClick={() => navigate(card.path)}
                  className="cursor-pointer hover:shadow-lg transition-all group border-2 border-transparent hover:border-[#1A4971]"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: card.color }}
                      >
                        <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-1 truncate">{card.title}</h3>
                        <p className="text-xs text-[#6E7A83] line-clamp-2">{card.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest warehouse operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-[#E8F4F8] last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'receipt' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {activity.type === 'receipt' ? (
                      <TrendingDown className="w-4 h-4 text-[#2ECC71]" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-[#1A4971]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A4971] truncate">{activity.item}</p>
                    <p className="text-xs text-[#6E7A83] mt-1">
                      {activity.qty} units • {activity.warehouse}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3 h-3 text-[#6E7A83]" />
                      <span className="text-xs text-[#6E7A83]">{activity.time}</span>
                      <Badge 
                        variant={activity.status === 'completed' ? 'default' : 'secondary'}
                        className={`text-xs ${
                          activity.status === 'completed' 
                            ? 'bg-[#2ECC71] hover:bg-[#27AE60]' 
                            : 'bg-[#F9A03F] hover:bg-[#E89230] text-white'
                        }`}
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Capacity Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Capacity Overview</CardTitle>
          <CardDescription>Current utilization across facilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Main Warehouse', capacity: 85, color: '#1A4971' },
              { name: 'North Distribution Center', capacity: 62, color: '#2ECC71' },
              { name: 'South Storage Facility', capacity: 45, color: '#F9A03F' },
            ].map((warehouse, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#1A4971] font-medium">{warehouse.name}</span>
                  <span className="text-sm text-[#6E7A83]">{warehouse.capacity}% utilized</span>
                </div>
                <Progress 
                  value={warehouse.capacity} 
                  className="h-2"
                  style={{ 
                    // @ts-ignore
                    '--progress-background': warehouse.color 
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-[#6E7A83] italic text-center">
        Quick navigation for operational flow.
      </p>
    </div>
  );
}