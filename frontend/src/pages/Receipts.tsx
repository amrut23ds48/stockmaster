import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { mockReceipts } from '../lib/mock-data';
import { Badge } from '../components/ui/badge';
import { useAuth, Permission } from '../contexts/AuthContext';
import { Trash2, Edit, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function Receipts() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [receipts] = useState(mockReceipts);

  const canCreateReceipt = hasPermission(Permission.CREATE_RECEIPT);
  const canUpdateReceipt = hasPermission(Permission.UPDATE_RECEIPT);
  const canDeleteReceipt = hasPermission(Permission.DELETE_RECEIPT);
  const canValidateReceipt = hasPermission(Permission.VALIDATE_RECEIPT);

  const handleValidate = (id: string) => {
    if (!canValidateReceipt) {
      toast.error('You don\'t have permission to validate receipts.');
      return;
    }
    toast.success('Receipt validated successfully!');
  };

  const handleDelete = (id: string) => {
    if (!canDeleteReceipt) {
      toast.error('You don\'t have permission to delete receipts.');
      return;
    }
    toast.success('Receipt deleted successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#2ECC71] text-white hover:bg-[#2ECC71]';
      case 'Pending Validation':
        return 'bg-[#E6A700] text-white hover:bg-[#E6A700]';
      case 'Draft':
        return 'bg-[#6E7A83] text-white hover:bg-[#6E7A83]';
      default:
        return 'bg-[#6E7A83] text-white';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Receipts</h1>
          <p className="text-[#6E7A83] mt-1">
            {canCreateReceipt 
              ? 'Create and manage incoming stock receipts' 
              : 'View incoming stock receipts'}
          </p>
        </div>
        {canCreateReceipt && (
          <Button 
            onClick={() => navigate('/receipts/add')}
            className="bg-[#1A4971] hover:bg-[#224F7F] text-white rounded-lg"
          >
            Add Receipt
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#D9DFE6] overflow-hidden">
        {receipts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7F9FC] border-b border-[#D9DFE6]">
                <tr>
                  <th className="text-left px-6 py-4 text-[#1A4971]">Receipt #</th>
                  <th className="text-left px-6 py-4 text-[#1A4971]">Supplier</th>
                  <th className="text-left px-6 py-4 text-[#1A4971]">Warehouse</th>
                  <th className="text-left px-6 py-4 text-[#1A4971]">Created Date</th>
                  <th className="text-left px-6 py-4 text-[#1A4971]">Total Quantity</th>
                  <th className="text-left px-6 py-4 text-[#1A4971]">Status</th>
                  {(canUpdateReceipt || canDeleteReceipt || canValidateReceipt) && (
                    <th className="text-left px-6 py-4 text-[#1A4971]">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt, index) => (
                  <tr 
                    key={receipt.id}
                    onClick={() => navigate(`/receipts/${receipt.id}`)}
                    className={`border-b border-[#D9DFE6] hover:bg-[#F7F9FC] transition-colors cursor-pointer ${
                      index === receipts.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-[#1A4971]">{receipt.receiptNumber}</td>
                    <td className="px-6 py-4 text-[#6E7A83]">{receipt.supplier}</td>
                    <td className="px-6 py-4 text-[#6E7A83]">{receipt.warehouseName}</td>
                    <td className="px-6 py-4 text-[#6E7A83]">{receipt.createdDate}</td>
                    <td className="px-6 py-4 text-[#6E7A83]">{receipt.totalQuantity}</td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(receipt.status)}>
                        {receipt.status}
                      </Badge>
                    </td>
                    {(canUpdateReceipt || canDeleteReceipt || canValidateReceipt) && (
                      <td className="px-6 py-4">
                        {canUpdateReceipt && (
                          <Edit className="w-4 h-4 text-[#1A4971] cursor-pointer mr-2" />
                        )}
                        {canDeleteReceipt && (
                          <Trash2 className="w-4 h-4 text-[#1A4971] cursor-pointer mr-2" />
                        )}
                        {canValidateReceipt && (
                          <CheckCircle className="w-4 h-4 text-[#1A4971] cursor-pointer" onClick={() => handleValidate(receipt.id)} />
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#6E7A83]">No receipts added yet — click "Add Receipt" to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}