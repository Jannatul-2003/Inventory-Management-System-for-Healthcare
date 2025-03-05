import React from "react"
import { AlertCircle } from "lucide-react"
import type { CustomerResponse, CustomerValueAnalysis } from "../../../types/index.ts"

interface DeleteCustomerModalProps {
  showDeleteModal: boolean
  setShowDeleteModal: (show: boolean) => void
  deleteCustomerId: number | null
  setDeleteCustomerId: (id: number | null) => void
  deleteCustomerInfo: CustomerResponse | CustomerValueAnalysis | null
  setDeleteCustomerInfo: (info: CustomerResponse | CustomerValueAnalysis | null) => void
  deleteLoading: boolean
  handleDeleteCustomer: () => void
}

const DeleteCustomerModal: React.FC<DeleteCustomerModalProps> = ({
  showDeleteModal,
  setShowDeleteModal,
  deleteCustomerId,
  setDeleteCustomerId,
  deleteCustomerInfo,
  setDeleteCustomerInfo,
  deleteLoading,
  handleDeleteCustomer,
}) => {
  if (!showDeleteModal) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-5">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle size={24} className="text-red-600" />
            </div>
          </div>
          <h3 className="text-lg text-center font-medium text-gray-900 mb-2">Confirm Delete</h3>
          <p className="text-center text-gray-500 mb-5">
            Are you sure you want to delete Customer #{deleteCustomerId}? This action cannot be undone.
          </p>

          {deleteCustomerInfo && (
            <div className="bg-gray-50 p-3 rounded-md mb-5 text-sm">
              <p className="mb-1">
                <span className="font-medium">Name:</span> {deleteCustomerInfo.name}
              </p>
              <p className="mb-1">
                <span className="font-medium">Total Orders:</span> {deleteCustomerInfo.total_orders}
              </p>
              <p>
                <span className="font-medium">Total Spent:</span> ${typeof deleteCustomerInfo.total_spent === 'number' 
                  ? deleteCustomerInfo.total_spent.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                  : '0.00'}
              </p>
            </div>
          )}

          <div className="flex justify-center space-x-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowDeleteModal(false)
                setDeleteCustomerId(null)
                setDeleteCustomerInfo(null)
              }}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-danger" 
              onClick={handleDeleteCustomer} 
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete Customer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteCustomerModal