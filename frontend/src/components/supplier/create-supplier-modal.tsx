import React from "react";
import { X } from "lucide-react";
import type { SupplierCreate, SupplierResponse } from "../../types";
import { postData } from "../../services/api.ts";
interface CreateSupplierModalProps {
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
  createSupplierError: string | null;
  setCreateSupplierError: (error: string | null) => void;
  handleCreateSupplier: () => void;
  supplierName: string;
  setSupplierName: (name: string) => void;
  supplierContactInfo: string | null;
  setSupplierContactInfo: (contactInfo: string | null) => void;
  setSuppliers: (suppliers: SupplierResponse[]) => void;
  resetSupplierForm: () => void;
  suppliers: SupplierResponse[];
}

const CreateSupplierModal: React.FC<CreateSupplierModalProps> = ({
  showCreateModal,
  setShowCreateModal,
  createSupplierError,
  setCreateSupplierError,
  supplierName,
  setSupplierName,
  supplierContactInfo,
  setSupplierContactInfo,
  setSuppliers,
  resetSupplierForm,
  suppliers,
}) => {
  if (!showCreateModal) return null;

  const handleCreateSupplier = async () => {
    if (supplierName.trim() === "") {
      setCreateSupplierError("Please fill at least the Supplier name.");
      return;
    }
  
    try {
      setCreateSupplierError(null);
  
      const SupplierData: SupplierCreate = {
        name: supplierName,
        contact_info: supplierContactInfo || null,
      };
  
      const response = await postData<SupplierResponse>("/suppliers", SupplierData);
  
      // ✅ Directly pass an updated array since `setSuppliers` expects `SupplierResponse[]`
      setSuppliers([response, ...suppliers]); 
  
      setShowCreateModal(false);
      resetSupplierForm();
    } catch (err) {
      setCreateSupplierError("Failed to create Supplier. Please try again.");
      console.error(err);
    }
  };
  
  

  return (
    <div className="p-4 bg-gray-50 border border-gray-200">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 h-auto max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-lg font-semibold">Create New Supplier</h3>
          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setShowCreateModal(false)}
          >
            <X size={20} />
          </button>
        </div>

        {createSupplierError && (
          <div className="mx-4 mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
            {createSupplierError}
          </div>
        )}

        <div className="p-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier <span className="text-red-500">*</span>
            </label>
            <div className="mt-5">
              <input
                type="text"
                className="input w-128"
                placeholder="Supplier Name"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Info
            </label>
            <div className="mt-5">
              <input
                type="text"
                className="input w-128"
                placeholder="Contact Info"
                value={supplierContactInfo || ""}
                onChange={(e) => setSupplierContactInfo(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-4 bg-gray-50 margin-bottom flex justify-end space-x-3 border-t border-gray-200 sticky bottom-0 rounded-b-lg">
          <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleCreateSupplier}>
            Create Supplier
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSupplierModal;
