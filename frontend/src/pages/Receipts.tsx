import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { mockReceipts } from '../lib/mock-data';
import { Badge } from '../components/ui/badge';
import { useAuth, Permission } from '../contexts/AuthContext';
import { Trash2, Edit, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { Receipt } from '../lib/types';


export function Receipts() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);

  const canCreateReceipt = hasPermission(Permission.CREATE_RECEIPT);
  const canUpdateReceipt = hasPermission(Permission.UPDATE_RECEIPT);
  const canDeleteReceipt = hasPermission(Permission.DELETE_RECEIPT);
  const canValidateReceipt = hasPermission(Permission.VALIDATE_RECEIPT);

  // ------------------ FIXED TOGGLE WITHOUT ERRORS ------------------
  const toggleStatus = (id: string) => {
    setReceipts(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, status: r.status === "ready" ? "not_ready" : "ready" }
          : r
      )
    );
    toast.success("Status updated!");
  };

  // ------------------ VALIDATE ------------------
  const handleValidate = (id: string) => {
    if (!canValidateReceipt) {
      toast.error("You don't have permission to validate receipts.");
      return;
    }
    toast.success("Receipt validated successfully!");
  };

  // ------------------ DELETE ------------------
  const handleDelete = (id: string) => {
    if (!canDeleteReceipt) {
      toast.error("You don't have permission to delete receipts.");
      return;
    }
    setReceipts(prev => prev.filter(r => r.id !== id));
    toast.success("Receipt deleted successfully!");
  };

  // ------------------ STATUS BADGES ------------------
  const getStatusBadge = (status: "ready" | "not_ready") => {
    return status === "ready" ? (
      <Badge className="bg-[#2ECC71] text-white">Completed</Badge>
    ) : (
      <Badge className="bg-[#6E7A83] text-white">Draft</Badge>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Receipts</h1>
          <p className="text-[#6E7A83] mt-1">
            {canCreateReceipt
              ? "Create and manage incoming stock receipts"
              : "View incoming stock receipts"}
          </p>
        </div>

        {canCreateReceipt && (
          <Button
            onClick={() => navigate("/receipts/add")}
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
                  <th className="text-left px-6 py-4 text-[#1A4971]">Reference</th>
                  <th className="text-left px-6 py-4 text-[#1A4971]">From</th>
                  <th className="text-left px-6 py-4 text-[#1A4971]">To</th>
                  <th className="text-left px-6 py-4 text-[#1A4971]">Contact</th>
                  <th className="text-left px-6 py-4 text-[#1A4971]">Schedule</th>
                  <th className="text-left px-6 py-4 text-[#1A4971]">Created</th>
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
                      index === receipts.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-[#1A4971]">{receipt.reference}</td>
                    <td className="px-6 py-4 text-[#6E7A83]">{receipt.from_location}</td>
                    <td className="px-6 py-4 text-[#6E7A83]">{receipt.to_location}</td>
                    <td className="px-6 py-4 text-[#6E7A83]">{receipt.contact}</td>
                    <td className="px-6 py-4 text-[#6E7A83]">{receipt.schedule_date}</td>
                    <td className="px-6 py-4 text-[#6E7A83]">{receipt.created_at}</td>

                    <td className="px-6 py-4">{getStatusBadge(receipt.status)}</td>

                    {(canUpdateReceipt || canDeleteReceipt || canValidateReceipt) && (
                      <td
                        className="px-6 py-4 flex items-center gap-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* UPDATE */}
                        {canUpdateReceipt && (
                          <Edit className="w-4 h-4 text-[#1A4971] cursor-pointer" />
                        )}

                        {/* DELETE */}
                        {canDeleteReceipt && (
                          <Trash2
                            className="w-4 h-4 text-red-500 cursor-pointer"
                            onClick={() => handleDelete(receipt.id)}
                          />
                        )}

                        {/* VALIDATE */}
                        {canValidateReceipt && (
                          <CheckCircle
                            className="w-4 h-4 text-green-600 cursor-pointer"
                            onClick={() => handleValidate(receipt.id)}
                          />
                        )}

                        {/* TOGGLE */}
                        <RefreshCw
                          className="w-4 h-4 text-[#1A4971] cursor-pointer"
                          onClick={() => toggleStatus(receipt.id)}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#6E7A83]">
              No receipts added yet — click "Add Receipt" to begin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
