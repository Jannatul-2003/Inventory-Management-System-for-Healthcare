import React from "react"
import { AlertCircle } from "lucide-react"
import type { SupplierResponse } from "../../types"

interface DeleteSupplierModalProps {
  showDeleteModal: boolean
  setShowDeleteModal: (show: boolean) => void
  deleteSupplierId: number | null
  setDeleteSupplierId: (id: number | null) => void
  deleteSupplierInfo: SupplierResponse | null
  setDeleteSupplierInfo: (info: SupplierResponse | null) => void
  deleteLoading: boolean
  handleDeleteSupplier: () => void
}

const DeleteSupplierModal: React.FC<DeleteSupplierModalProps> = ({
  showDeleteModal,
  setShowDeleteModal,
  deleteSupplierId,
  setDeleteSupplierId,
  deleteSupplierInfo,
  setDeleteSupplierInfo,
  deleteLoading,
  handleDeleteSupplier,
}) => {
  if (!showDeleteModal) return null

  return (
    <div className="p-4 bg-gray-50 border-b border-gray-200 px-20">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-5">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle size={24} className="text-red-600" />
            </div>
          </div>
          <h3 className="text-lg text-center font-medium text-gray-900 mb-2">Confirm Delete</h3>
          <p className="text-center text-gray-500 mb-5">
            Are you sure you want to delete Supplier #{deleteSupplierId}? This action cannot be undone.
          </p>

          {deleteSupplierInfo && (
            <div className="bg-gray-50 p-3 rounded-md mb-5 text-sm">
              <p className="mb-1">
                <span className="font-medium">Name:</span> {deleteSupplierInfo.name}
              </p>
              <p className="mb-1">
                <span className="font-medium">Contact Info:</span> {deleteSupplierInfo.contact_info}
              </p>
              <p>
                <span className="font-medium">Total Orders:</span> {deleteSupplierInfo.total_orders}
              </p>
              <p>
                <span className="font-medium">Average delivery days:</span> {deleteSupplierInfo.avg_delivery_days>1 ? `${deleteSupplierInfo.avg_delivery_days} days` : `${deleteSupplierInfo.avg_delivery_days} day`}
              </p>
            </div>
          )}

          <div className="flex justify-center space-x-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowDeleteModal(false)
                setDeleteSupplierId(null)
                setDeleteSupplierInfo(null)
              }}
            >
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDeleteSupplier} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Delete Supplier"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteSupplierModal

