import React from "react";
import type { OrderResponse } from "../../types";
import TooltipButton from "../ui/button.tsx";

interface OrdersTableProps {
  currentOrders: OrderResponse[];
  getStatusColor: (status: string) => string;
  handleViewOrder: (orderId: number) => void;
  handleOpenEditModal: (orderId: number) => void;
  handleOpenDeleteModal: (orderId: number) => void;
  indexOfFirstOrder: number;
  indexOfLastOrder: number;
  orders: OrderResponse[];
  currentPage: number;
  prevPage: () => void;
  nextPage: () => void;
  ordersPerPage: number;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  currentOrders,
  getStatusColor,
  handleViewOrder,
  handleOpenEditModal,
  handleOpenDeleteModal,
  indexOfFirstOrder,
  indexOfLastOrder,
  orders,
  currentPage,
  prevPage,
  nextPage,
  ordersPerPage,
}) => {
  return (
    <>
      <div className="card-body p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Supplier
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      No.{order.order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.supplier_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ৳{order.total_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <TooltipButton
                        onClick={() => handleViewOrder(order.order_id)}
                        tooltipText="View order"
                      />
                      <TooltipButton
                        onClick={() => handleOpenEditModal(order.order_id)}
                        tooltipText="Edit order details"
                      />
                      <TooltipButton
                        onClick={() => handleOpenDeleteModal(order.order_id)}
                        tooltipText="Delete order"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No orders found. Try adjusting your filters or create a new
                    order.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card-footer">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {orders.length > 0
              ? `Showing ${indexOfFirstOrder + 1} to ${Math.min(
                  indexOfLastOrder,
                  orders.length
                )} of ${orders.length} orders`
              : "No orders found"}
          </span>
          <div className="flex space-x-2">
            <button
              className={`btn btn-secondary ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className={`btn btn-secondary ${
                currentPage >= Math.ceil(orders.length / ordersPerPage)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={nextPage}
              disabled={currentPage >= Math.ceil(orders.length / ordersPerPage)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersTable;
