import React from "react"
import { X } from "lucide-react"
import type { SupplierResponse } from "../../types"

interface ViewSupplierModalProps {
  showViewModal: boolean
  setShowViewModal: (show: boolean) => void
  viewSupplierInfo: SupplierResponse | null
  viewLoading: boolean
}

const ViewSupplierModal: React.FC<ViewSupplierModalProps> = ({
  showViewModal,
  setShowViewModal,
  viewSupplierInfo,
  viewLoading,
}) => {
  if (!showViewModal) return null

  return (
    <div className="p-4 bg-gray-50 bSupplier-b bSupplier-gray-200">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 h-auto max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 bSupplier-b bSupplier-gray-200 sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-800">Supplier Details - #{viewSupplierInfo?.supplier_id}</h3>
          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setShowViewModal(false)}
          >
            <X size={20} />
          </button>
        </div>

        {viewLoading ? (
          <div className="p-6 text-center">Loading Supplier details...</div>
        ) : (
          <>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {/* <h4 className="font-medium text-gray-700 mb-2">Supplier Information</h4> */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="mb-2">
                    <span className="font-medium">Supplier Name: </span>{" "}
                    {viewSupplierInfo?.name}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Contact Info:</span>{" "}
                    <span
                      className="px-2 py-1 rounded-full text-xs font-semibold"
                    >
                      {viewSupplierInfo?.contact_info}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Total Orders:</span> {viewSupplierInfo?.total_orders.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Average Delivery Days:</span> {viewSupplierInfo?.avg_delivery_days && viewSupplierInfo.avg_delivery_days > 1 ? `${viewSupplierInfo.avg_delivery_days} days` : `${viewSupplierInfo?.avg_delivery_days ?? 0} day` }
                  </p>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 bg-gray-50 flex justify-end space-x-3 bSupplier-t bSupplier-gray-200 sticky bottom-0 rounded-b-lg">
              <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ViewSupplierModal

