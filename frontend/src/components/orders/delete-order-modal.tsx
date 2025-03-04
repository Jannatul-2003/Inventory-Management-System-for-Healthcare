import React from "react"
import { AlertCircle } from "lucide-react"
import type { OrderResponse } from "../../types"

interface DeleteOrderModalProps {
  showDeleteModal: boolean
  setShowDeleteModal: (show: boolean) => void
  deleteOrderId: number | null
  setDeleteOrderId: (id: number | null) => void
  deleteOrderInfo: OrderResponse | null
  setDeleteOrderInfo: (info: OrderResponse | null) => void
  deleteLoading: boolean
  handleDeleteOrder: () => void
}

const DeleteOrderModal: React.FC<DeleteOrderModalProps> = ({
  showDeleteModal,
  setShowDeleteModal,
  deleteOrderId,
  setDeleteOrderId,
  deleteOrderInfo,
  setDeleteOrderInfo,
  deleteLoading,
  handleDeleteOrder,
}) => {
  if (!showDeleteModal) return null

  return (
    <div className="p-4 bg-gray-50 border-b border-gray-200">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-5">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle size={24} className="text-red-600" />
            </div>
          </div>
          <h3 className="text-lg text-center font-medium text-gray-900 mb-2">Confirm Delete</h3>
          <p className="text-center text-gray-500 mb-5">
            Are you sure you want to delete Order #{deleteOrderId}? This action cannot be undone.
          </p>

          {deleteOrderInfo && (
            <div className="bg-gray-50 p-3 rounded-md mb-5 text-sm">
              <p className="mb-1">
                <span className="font-medium">Date:</span> {new Date(deleteOrderInfo.order_date).toLocaleDateString()}
              </p>
              <p className="mb-1">
                <span className="font-medium">Customer:</span> {deleteOrderInfo.customer_name}
              </p>
              <p>
                <span className="font-medium">Amount:</span> ৳{deleteOrderInfo.total_amount.toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex justify-center space-x-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowDeleteModal(false)
                setDeleteOrderId(null)
                setDeleteOrderInfo(null)
              }}
            >
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDeleteOrder} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Delete Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteOrderModal

