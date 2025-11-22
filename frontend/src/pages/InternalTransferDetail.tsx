import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Package, 
  MapPin, 
  User, 
  Trash2, 
  CheckCircle, 
  Clock, 
  ArrowRightLeft,
  XCircle,
  PlayCircle,
  Building2,
  FileText
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { toast } from 'sonner';
import { mockInternalTransfers } from '../lib/mock-data';
import { useAuth, Permission } from '../contexts/AuthContext';

export function InternalTransferDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { hasPermission } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<'In Progress' | 'Completed' | 'Cancelled' | null>(null);

  // Get transfer data
  const transfer = mockInternalTransfers.find(t => t.id === id);

  const canUpdateTransfer = hasPermission(Permission.UPDATE_RECEIPT); // Only managers
  const canDeleteTransfer = hasPermission(Permission.DELETE_RECEIPT); // Only managers

  if (!transfer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Package className="w-16 h-16 text-[#6E7A83] mb-4" />
        <h2 className="text-[#1A4971] mb-2">Transfer Not Found</h2>
        <p className="text-[#6E7A83] mb-6">The requested transfer could not be found.</p>
        <Button 
          onClick={() => navigate('/internal-transfers')}
          className="bg-[#1A4971] hover:bg-[#224F7F] text-white"
        >
          Back to Transfers
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    toast.success('Transfer deleted successfully');
    navigate('/internal-transfers');
  };

  const handleStatusUpdate = (status: 'In Progress' | 'Completed' | 'Cancelled') => {
    setNewStatus(status);
    setShowStatusDialog(true);
  };

  const confirmStatusUpdate = () => {
    toast.success(`Transfer status updated to ${newStatus}`);
    setShowStatusDialog(false);
    setNewStatus(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <Badge className="bg-[#D4F4E2] text-[#2ECC71] border-[#2ECC71]/20 px-3 py-1">
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Completed
          </Badge>
        );
      case 'In Progress':
        return (
          <Badge className="bg-[#FFF4E6] text-[#F9A03F] border-[#F9A03F]/20 px-3 py-1">
            <PlayCircle className="w-4 h-4 mr-1.5" />
            In Progress
          </Badge>
        );
      case 'Pending':
        return (
          <Badge className="bg-[#E8F4F8] text-[#1A4971] border-[#1A4971]/20 px-3 py-1">
            <Clock className="w-4 h-4 mr-1.5" />
            Pending
          </Badge>
        );
      case 'Cancelled':
        return (
          <Badge className="bg-[#FEF2F2] text-[#D64545] border-[#D64545]/20 px-3 py-1">
            <XCircle className="w-4 h-4 mr-1.5" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTimelineSteps = () => {
    const steps = [
      {
        label: 'Requested',
        date: transfer.requestedDate,
        user: transfer.requestedBy,
        icon: FileText,
        completed: true,
      },
    ];

    if (transfer.status === 'In Progress' || transfer.status === 'Completed') {
      steps.push({
        label: 'In Progress',
        date: transfer.requestedDate,
        user: transfer.requestedBy,
        icon: PlayCircle,
        completed: true,
      });
    }

    if (transfer.status === 'Completed' && transfer.completedDate) {
      steps.push({
        label: 'Completed',
        date: transfer.completedDate,
        user: transfer.requestedBy,
        icon: CheckCircle,
        completed: true,
      });
    }

    if (transfer.status === 'Cancelled') {
      steps.push({
        label: 'Cancelled',
        date: transfer.requestedDate,
        user: transfer.requestedBy,
        icon: XCircle,
        completed: true,
      });
    }

    return steps;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/internal-transfers')}
            className="border-[#D9DFE6]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="mb-0">{transfer.transferNumber}</h1>
              {getStatusBadge(transfer.status)}
            </div>
            <p className="text-[#6E7A83]">Internal transfer details and tracking</p>
          </div>
        </div>

        {canUpdateTransfer && transfer.status !== 'Cancelled' && transfer.status !== 'Completed' && (
          <div className="flex items-center gap-3">
            {transfer.status === 'Pending' && (
              <Button
                onClick={() => handleStatusUpdate('In Progress')}
                className="bg-[#F9A03F] hover:bg-[#E89030] text-white"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Start Transfer
              </Button>
            )}
            {transfer.status === 'In Progress' && (
              <Button
                onClick={() => handleStatusUpdate('Completed')}
                className="bg-[#2ECC71] hover:bg-[#27AE60] text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Completed
              </Button>
            )}
            {canDeleteTransfer && (
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="border-[#D64545] text-[#D64545] hover:bg-[#FEF2F2]"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transfer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-[#1A4971]" />
                Transfer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-[#6E7A83] mb-1">Product</p>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#1A4971]" />
                    <span className="text-[#1A4971]">{transfer.productName}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#6E7A83] mb-1">Quantity</p>
                  <p className="text-xl font-semibold text-[#1A4971]">
                    {transfer.quantity} {transfer.unit}
                  </p>
                </div>
              </div>

              {/* Warehouse */}
              <div className="pt-4 border-t border-[#E8F4F8]">
                <p className="text-sm text-[#6E7A83] mb-2">Warehouse</p>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#1A4971]" />
                  <span className="text-[#1A4971]">{transfer.warehouseName}</span>
                </div>
              </div>

              {/* Location Movement */}
              <div className="pt-4 border-t border-[#E8F4F8]">
                <p className="text-sm text-[#6E7A83] mb-3">Location Movement</p>
                <div className="space-y-3">
                  {/* From Location */}
                  <div className="p-4 bg-[#FFF4E6] border border-[#F9A03F]/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#F9A03F] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-[#6E7A83] mb-1">From (Source)</p>
                        <p className="text-[#1A4971]">{transfer.fromLocationName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center">
                    <ArrowRightLeft className="w-6 h-6 text-[#6E7A83]" />
                  </div>

                  {/* To Location */}
                  <div className="p-4 bg-[#D4F4E2] border border-[#2ECC71]/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#2ECC71] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-[#6E7A83] mb-1">To (Destination)</p>
                        <p className="text-[#1A4971]">{transfer.toLocationName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="pt-4 border-t border-[#E8F4F8] grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-[#6E7A83] mb-2">Requested Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#1A4971]" />
                    <span className="text-[#1A4971]">{new Date(transfer.requestedDate).toLocaleString()}</span>
                  </div>
                </div>
                {transfer.completedDate && (
                  <div>
                    <p className="text-sm text-[#6E7A83] mb-2">Completed Date</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#2ECC71]" />
                      <span className="text-[#1A4971]">{new Date(transfer.completedDate).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Requested By */}
              <div className="pt-4 border-t border-[#E8F4F8]">
                <p className="text-sm text-[#6E7A83] mb-2">Requested By</p>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#1A4971]" />
                  <span className="text-[#1A4971]">{transfer.requestedBy}</span>
                </div>
              </div>

              {/* Notes */}
              {transfer.notes && (
                <div className="pt-4 border-t border-[#E8F4F8]">
                  <p className="text-sm text-[#6E7A83] mb-2">Notes</p>
                  <p className="text-[#1A4971]">{transfer.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#1A4971]" />
                Transfer Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getTimelineSteps().map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === getTimelineSteps().length - 1;

                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? transfer.status === 'Completed' ? 'bg-[#2ECC71]' :
                              transfer.status === 'Cancelled' ? 'bg-[#D64545]' :
                              'bg-[#1A4971]'
                            : 'bg-[#D9DFE6]'
                        }`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 h-full min-h-[40px] ${
                            step.completed ? 'bg-[#1A4971]' : 'bg-[#D9DFE6]'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <p className="text-[#1A4971] mb-1">{step.label}</p>
                        <p className="text-sm text-[#6E7A83] mb-1">{new Date(step.date).toLocaleString()}</p>
                        <p className="text-sm text-[#6E7A83]">by {step.user}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          {canUpdateTransfer && transfer.status !== 'Cancelled' && transfer.status !== 'Completed' && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {transfer.status === 'Pending' && (
                  <Button
                    onClick={() => handleStatusUpdate('In Progress')}
                    className="w-full bg-[#F9A03F] hover:bg-[#E89030] text-white"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Transfer
                  </Button>
                )}
                {transfer.status === 'In Progress' && (
                  <Button
                    onClick={() => handleStatusUpdate('Completed')}
                    className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Transfer
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Transfer Summary */}
          <Card className="bg-[#E8F4F8] border-[#1A4971]/20">
            <CardHeader>
              <CardTitle className="text-[#1A4971]">Transfer Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#1A4971]">Transfer #</span>
                <span className="font-mono text-[#1A4971]">{transfer.transferNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#1A4971]">Status</span>
                {getStatusBadge(transfer.status)}
              </div>
              <div className="pt-3 border-t border-[#1A4971]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#1A4971]">Product</span>
                </div>
                <p className="text-[#1A4971]">{transfer.productName}</p>
              </div>
              <div className="pt-3 border-t border-[#1A4971]/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#1A4971]">Quantity</span>
                  <span className="text-xl font-bold text-[#1A4971]">
                    {transfer.quantity} {transfer.unit}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <Card>
            <CardContent className="p-4">
              <h4 className="text-[#1A4971] mb-2">Need Help?</h4>
              <p className="text-sm text-[#6E7A83] mb-3">
                Contact your warehouse manager if you have questions about this transfer.
              </p>
              <Button variant="outline" className="w-full border-[#D9DFE6] text-[#1A4971]">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transfer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete transfer {transfer.transferNumber}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-[#D64545] hover:bg-[#C03535] text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Update Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Transfer Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status to {newStatus}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusUpdate}
              className="bg-[#1A4971] hover:bg-[#224F7F] text-white"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
