import React from "react"
import type { CustomerResponse, CustomerValueAnalysis, CustomerOrderHistory } from "../../types/index.ts"

interface CustomerOrderHistoryProps {
  customer: CustomerResponse | CustomerValueAnalysis
  customerOrders: CustomerOrderHistory[]
  loading: boolean
  handleBackToList: () => void
}

const CustomerOrderHistoryView: React.FC<CustomerOrderHistoryProps> = ({
  customer,
  customerOrders,
  loading,
  handleBackToList,
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h1 className="card-title">Order History: {customer.name}</h1>
          <div className="text-sm">Total Orders: {customer.total_orders}</div>
        </div>
        <button className="btn btn-primary" onClick={handleBackToList}>
          Back to Customers
        </button>
      </div>

      <div className="card-body">
        {loading ? (
          <div className="p-6 text-center">
            <div className="text-lg">Loading order history...</div>
          </div>
        ) : customerOrders.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-lg font-semibold">No orders found</div>
            <div className="text-sm">This customer hasn't placed any orders yet.</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {customerOrders.map((order) => (
                <tr key={`${order.order_id}-${order.product_name}`}>
                  <td>{order.order_id}</td>
                  <td>{new Date(order.order_date).toLocaleDateString()}</td>
                  <td>{order.product_name}</td>
                  <td>{order.quantity}</td>
                  <td>৳{Number.parseFloat(order.unit_price.toString()).toFixed(2)}</td>
                  <td>৳{Number.parseFloat(order.total_price.toString()).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default CustomerOrderHistoryView

