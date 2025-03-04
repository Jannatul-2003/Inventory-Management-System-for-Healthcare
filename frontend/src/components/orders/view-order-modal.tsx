import React from "react"
import { X } from "lucide-react"
import type { OrderDetail, OrderResponse } from "../../types"

interface ViewOrderModalProps {
  showViewModal: boolean
  setShowViewModal: (show: boolean) => void
  viewOrderInfo: OrderResponse | null
  viewOrderDetails: OrderDetail[]
  viewLoading: boolean
  getStatusColor: (status: string) => string
}

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({
  showViewModal,
  setShowViewModal,
  viewOrderInfo,
  viewOrderDetails,
  viewLoading,
  getStatusColor,
}) => {
  if (!showViewModal) return null

  return (
    <div className="p-4 bg-gray-50 border-b border-gray-200">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 h-auto max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-800">Order Details - #{viewOrderInfo?.order_id}</h3>
          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setShowViewModal(false)}
          >
            <X size={20} />
          </button>
        </div>

        {viewLoading ? (
          <div className="p-6 text-center">Loading order details...</div>
        ) : (
          <>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Order Information</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="mb-2">
                    <span className="font-medium">Date:</span>{" "}
                    {viewOrderInfo?.order_date && new Date(viewOrderInfo.order_date).toLocaleDateString()}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        viewOrderInfo?.status || "",
                      )}`}
                    >
                      {viewOrderInfo?.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Total Amount:</span> ৳{viewOrderInfo?.total_amount.toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Parties</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="mb-2">
                    <span className="font-medium">Customer:</span> {viewOrderInfo?.customer_name}
                  </p>
                  <p>
                    <span className="font-medium">Supplier:</span> {viewOrderInfo?.supplier_name}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 py-3">
              <h4 className="font-medium text-gray-700 mb-3">Order Items</h4>
              <div className="bg-gray-50 rounded-lg p-2">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 rounded-md">
                    {viewOrderDetails.map((item, index) => (
                      <tr key={index} className={index === 0 ? "rounded-t-md" : ""}>
                        <td className="px-4 py-3 text-sm text-gray-800">{item.product_name}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">৳{Number(item.unit_price).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">৳{Number(item.total_price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-5 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200 sticky bottom-0 rounded-b-lg">
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

export default ViewOrderModal

