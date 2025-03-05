import React from "react"
import { X } from "lucide-react"
import type { ProductResponse, SupplierResponse } from "../../types"

interface EditOrderModalProps {
  showEditModal: boolean
  setShowEditModal: (show: boolean) => void
  editOrderId: number | null
  setEditOrderId: (id: number | null) => void
  editOrderError: string | null
  editOrderDate: string
  setEditOrderDate: (date: string) => void
  editSelectedSupplier: number | null
  setEditSelectedSupplier: (id: number | null) => void
  suppliers: SupplierResponse[]
  products: ProductResponse[]
  editOrderItems: { productId: number; quantity: number; price: any }[]
  handleAddProductToEdit: (productId: number) => void
  handleRemoveProductFromEdit: (index: number) => void
  handleUpdateEditQuantity: (index: number, quantity: number) => void
  calculateEditOrderTotal: () => number
  handleUpdateOrder: () => void
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({
  showEditModal,
  setShowEditModal,
  editOrderId,
  setEditOrderId,
  editOrderError,
  editOrderDate,
  setEditOrderDate,
  editSelectedSupplier,
  setEditSelectedSupplier,
  suppliers,
  products,
  editOrderItems,
  handleAddProductToEdit,
  handleRemoveProductFromEdit,
  handleUpdateEditQuantity,
  calculateEditOrderTotal,
  handleUpdateOrder,
}) => {
  if (!showEditModal) return null

  return (
    <div className="p-4 bg-gray-50 border-b border-gray-200">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 h-auto max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-800">Edit Order - #{editOrderId}</h3>
          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => {
              setShowEditModal(false)
              setEditOrderId(null)
            }}
          >
            <X size={20} />
          </button>
        </div>

        {editOrderError && (
          <div className="mx-4 mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
            {editOrderError}
          </div>
        )}

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={editOrderDate}
                onChange={(e) => setEditOrderDate(e.target.value)}
                className="select-input w-64"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={editSelectedSupplier || ""}
                onChange={(e) => setEditSelectedSupplier(Number(e.target.value))}
                className="select-input w-full"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.supplier_id} value={supplier.supplier_id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-800 mb-3">Order Items</h4>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Product</label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <select
                  className="select-input w-full"
                  onChange={(e) => e.target.value && handleAddProductToEdit(Number(e.target.value))}
                  value=""
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.product_id} value={product.product_id}>
                      {product.name} - ৳{Number(product.price).toFixed(2)} ({product.current_stock} in stock)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {editOrderItems.length > 0 ? (
            <div className="bg-gray-50 rounded-lg p-2 mb-4">
              <table className="min-w-full mb-4">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 rounded-md">
                  {editOrderItems.map((item, index) => {
                    const product = products.find((p) => p.product_id === item.productId)
                    return (
                      <tr key={index} className={index === 0 ? "rounded-t-md" : ""}>
                        <td className="px-4 py-3 text-sm text-gray-800">{product?.name || "Unknown Product"}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">৳{Number(item.price).toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateEditQuantity(index, Number(e.target.value))}
                            className="quantity-input w-20"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          ৳{(Number(item.price) * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveProductFromEdit(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  <tr className="bg-gray-50 font-medium rounded-b-md">
                    <td colSpan={3} className="px-4 py-3 text-right text-gray-800">
                      Total Amount:
                    </td>
                    <td colSpan={2} className="px-4 py-3 text-gray-800 font-bold">
                      ৳
                      {calculateEditOrderTotal().toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg mb-4 border border-gray-200 border-dashed">
              No products added yet. Select products above to add them to the order.
            </div>
          )}
        </div>

        <div className="px-5 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200 sticky bottom-0 rounded-b-lg">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setShowEditModal(false)
              setEditOrderId(null)
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleUpdateOrder}
            disabled={!editSelectedSupplier || editOrderItems.length === 0}
          >
            Update Order
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditOrderModal

