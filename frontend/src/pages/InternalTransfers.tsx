import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  ArrowRightLeft, 
  PackageCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';
import { mockInternalTransfers, mockWarehouses } from '../lib/mock-data';
import { useAuth, Permission } from '../contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

export function InternalTransfers() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [transfers] = useState(mockInternalTransfers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');

  const canCreateTransfer = hasPermission(Permission.CREATE_RECEIPT); // Staff can create transfers
  const canUpdateTransfer = hasPermission(Permission.UPDATE_RECEIPT); // Only managers can approve/complete

  // Calculate stats
  const pendingTransfers = transfers.filter(t => t.status === 'Pending').length;
  const inProgressTransfers = transfers.filter(t => t.status === 'In Progress').length;
  const completedToday = transfers.filter(t => 
    t.status === 'Completed' && 
    t.completedDate?.startsWith('2024-11-22')
  ).length;
  const totalQuantityMoved = transfers
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.quantity, 0);

  // Filter transfers
  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = 
      transfer.transferNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.fromLocationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.toLocationName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
    const matchesWarehouse = warehouseFilter === 'all' || transfer.warehouseId === warehouseFilter;
    
    return matchesSearch && matchesStatus && matchesWarehouse;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-[#D4F4E2] text-[#2ECC71] border-[#2ECC71]/20"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'In Progress':
        return <Badge className="bg-[#FFF4E6] text-[#F9A03F] border-[#F9A03F]/20"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      case 'Pending':
        return <Badge className="bg-[#E8F4F8] text-[#1A4971] border-[#1A4971]/20"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'Cancelled':
        return <Badge className="bg-[#FEF2F2] text-[#D64545] border-[#D64545]/20"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-2">Internal Transfers</h1>
          <p className="text-[#6E7A83]">
            Move products between storage locations within warehouses
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
          {canCreateTransfer && (
            <Button 
              onClick={() => navigate('/internal-transfers/create')}
              className="bg-[#1A4971] hover:bg-[#224F7F] text-white rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Transfer
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
                <p className="text-sm text-[#6E7A83] mb-1">Pending Transfers</p>
                <h2 className="text-3xl font-bold text-[#1A4971]">{pendingTransfers}</h2>
                <p className="text-xs text-[#6E7A83] mt-2">Awaiting action</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <Clock className="w-5 h-5 text-[#1A4971]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6E7A83] mb-1">In Progress</p>
                <h2 className="text-3xl font-bold text-[#F9A03F]">{inProgressTransfers}</h2>
                <p className="text-xs text-[#6E7A83] mt-2">Currently moving</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-xl">
                <ArrowRightLeft className="w-5 h-5 text-[#F9A03F]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6E7A83] mb-1">Completed Today</p>
                <h2 className="text-3xl font-bold text-[#2ECC71]">{completedToday}</h2>
                <p className="text-xs text-[#6E7A83] mt-2">Successful transfers</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-[#2ECC71]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6E7A83] mb-1">Total Moved</p>
                <h2 className="text-3xl font-bold text-[#1A4971]">{totalQuantityMoved.toLocaleString()}</h2>
                <p className="text-xs text-[#6E7A83] mt-2">Units transferred</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                <PackageCheck className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E7A83]" strokeWidth={1.5} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by transfer number, product, or location"
                className="w-full pl-10 pr-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971]"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971] bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="px-4 py-2.5 border border-[#D9DFE6] rounded-lg focus:outline-none focus:border-[#1A4971] focus:ring-1 focus:ring-[#1A4971] bg-white"
            >
              <option value="all">All Warehouses</option>
              {mockWarehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
              ))}
            </select>

            <Button 
              variant="outline"
              className="border-[#D9DFE6] text-[#1A4971] hover:bg-[#F7F9FC]"
            >
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transfers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F7F9FC] hover:bg-[#F7F9FC]">
                <TableHead className="text-[#1A4971]">Transfer #</TableHead>
                <TableHead className="text-[#1A4971]">Product</TableHead>
                <TableHead className="text-[#1A4971]">Warehouse</TableHead>
                <TableHead className="text-[#1A4971]">From Location</TableHead>
                <TableHead className="text-[#1A4971]">To Location</TableHead>
                <TableHead className="text-[#1A4971]">Quantity</TableHead>
                <TableHead className="text-[#1A4971]">Requested Date</TableHead>
                <TableHead className="text-[#1A4971]">Status</TableHead>
                <TableHead className="text-[#1A4971] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransfers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ArrowRightLeft className="w-12 h-12 text-[#6E7A83] mb-2 opacity-50" />
                      <p className="text-[#6E7A83]">No transfers found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransfers.map((transfer) => (
                  <TableRow key={transfer.id} className="hover:bg-[#F7F9FC] transition-colors">
                    <TableCell>
                      <span className="font-mono text-[#1A4971]">{transfer.transferNumber}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-[#1A4971]">{transfer.productName}</div>
                        <div className="text-xs text-[#6E7A83]">{transfer.unit}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[#6E7A83]">{transfer.warehouseName}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-[#FFF4E6] text-[#F9A03F] border-[#F9A03F]/20">
                        {transfer.fromLocationName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-[#D4F4E2] text-[#2ECC71] border-[#2ECC71]/20">
                        {transfer.toLocationName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-[#1A4971]">{transfer.quantity}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-[#6E7A83]">{new Date(transfer.requestedDate).toLocaleString()}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/internal-transfers/${transfer.id}`)}
                        className="hover:bg-[#E8F4F8] text-[#1A4971]"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredTransfers.length === 0 && searchQuery === '' && statusFilter === 'all' && warehouseFilter === 'all' && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="bg-[#F7F9FC] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRightLeft className="w-10 h-10 text-[#6E7A83]" />
              </div>
              <h3 className="text-[#1A4971] mb-2">No internal transfers yet</h3>
              <p className="text-[#6E7A83] mb-6">
                Start by creating your first transfer to move products between locations.
              </p>
              {canCreateTransfer && (
                <Button 
                  onClick={() => navigate('/internal-transfers/create')}
                  className="bg-[#1A4971] hover:bg-[#224F7F] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Transfer
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
