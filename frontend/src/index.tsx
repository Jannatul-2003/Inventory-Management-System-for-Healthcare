import React, { useState, useEffect } from "react";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Truck,
  BarChart2,
  Database,
  Settings,
  Menu,
  X,
  RefreshCw,
  Plus,
  Filter,
  Eye,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import ReactDOM from "react-dom/client";
import "./index.css";

// Types based on your schemas
interface DashboardOverview {
  monthly_orders: number;
  monthly_revenue: number;
  active_customers: number;
  low_stock_items: number;
}

interface MonthlyMetrics {
  month: string;
  total_orders: number;
  total_revenue: number;
  unique_customers: number;
}

interface TopProducts {
  product_id: number;
  name: string;
  total_sold: number;
  total_revenue: number;
}

interface TopCustomers {
  customer_id: number;
  name: string;
  total_orders: number;
  total_spent: number;
}

interface SalesAnalytics {
  sale_date: string;
  orders: number;
  customers: number;
  units_sold: number;
  revenue: number;
  prev_revenue: number | null;
  growth_rate: number | null;
}

interface ProductAnalytics {
  product_id: number;
  name: string;
  order_count: number;
  total_units: number;
  total_revenue: number;
  avg_order_size: number;
  current_stock: number;
  monthly_velocity: number;
}

interface InventoryResponse {
  inventory_id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  status: string;
}

interface ProductResponse {
  product_id: number;
  name: string;
  description: string | null;
  price: number;
  current_stock: number;
  stock_status: string;
}

interface CustomerResponse {
  customer_id: number;
  name: string;
  contact_info: string | null;
  total_orders: number;
  total_spent: number;
}

interface SupplierResponse {
  supplier_id: number;
  name: string;
  contact_info: string | null;
  total_orders: number;
  avg_delivery_days: number;
}

interface ShipmentResponse {
  shipment_id: number;
  order_id: number;
  shipment_date: string;
  order_date: string;
  delivery_days: number;
  details: {
    product_id: number;
    product_name: string;
    quantity: number;
  }[];
}
interface OrderResponse {
  order_id: number;
  order_date: string;
  supplier_id: number;
  supplier_name: string;
  customer_id: number;
  customer_name: string;
  total_items: number;
  total_quantity: number;
  total_amount: number;
  amount_paid: number;
  status: string;
}
interface OrderCreate {
  order_date: string;
  supplier_id: number;
  customer_id: number;
  details: OrderDetailBase[];
}

interface OrderDetailBase {
  product_id: number;
  quantity: number;
}
interface OrderUpdate {
  order_date?: string;
  supplier_id?: number;
  details?: OrderDetailBase[];
}

interface OrderDetail {
  order_detail_id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

// API service
const API_BASE_URL = "http://localhost:8000/api/v1";

const fetchData = async <T,>(endpoint: string): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};
//here why await fetch is used why not await post
const postData = async <T,>(endpoint: string, data: any): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return await response.json();
};

const putData = async <T,>(endpoint: string, data: any): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return await response.json();
};

const deleteData = async (endpoint: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
};

// Orders component
const Orders = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  // State for create order modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [orderItems, setOrderItems] = useState<
    { productId: number; quantity: number; price: number }[]
  >([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [createOrderError, setCreateOrderError] = useState<string | null>(null);

  // View order states
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewOrderDetails, setViewOrderDetails] = useState<OrderDetail[]>([]);
  const [viewOrderInfo, setViewOrderInfo] = useState<OrderResponse | null>(
    null
  );
  const [viewLoading, setViewLoading] = useState(false);

  // Edit order states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editOrderId, setEditOrderId] = useState<number | null>(null);
  const [editOrderItems, setEditOrderItems] = useState<
    { productId: number; quantity: number; price: any }[]
  >([]);
  const [editSelectedSupplier, setEditSelectedSupplier] = useState<
    number | null
  >(null);
  const [editOrderDate, setEditOrderDate] = useState("");
  const [editOrderError, setEditOrderError] = useState<string | null>(null);

  // Delete order states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);
  const [deleteOrderInfo, setDeleteOrderInfo] = useState<OrderResponse | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  // Fetch orders data
  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        setLoading(true);

        // Build query params
        const params = new URLSearchParams();
        if (startDate) params.append("start_date", startDate);
        if (endDate) params.append("end_date", endDate);
        if (customerId) params.append("customer_id", customerId);
        if (supplierId) params.append("supplier_id", supplierId);

        const queryString = params.toString() ? `?${params.toString()}` : "";
        const data = await fetchData<OrderResponse[]>(`/orders/${queryString}`);

        setOrders(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch order data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersData();
  }, [startDate, endDate, customerId, supplierId]);

  // Fetch customers, suppliers, and products for the create form
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [customersData, suppliersData, productsData] = await Promise.all([
          fetchData<CustomerResponse[]>("/customers"),
          fetchData<SupplierResponse[]>("/suppliers"),
          fetchData<ProductResponse[]>("/products"),
        ]);

        setCustomers(customersData);
        setSuppliers(suppliersData);
        setProducts(productsData);
      } catch (err) {
        console.error("Failed to fetch form data:", err);
      }
    };

    //   if (showCreateModal) {
    //     fetchFormData();
    //   }
    // }, [showCreateModal]);
    if (showCreateModal || showEditModal) {
      fetchFormData();
    }
  }, [showCreateModal, showEditModal]);

  // Load order details for editing
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!editOrderId) return;

      try {
        setEditOrderError(null);
        const orderDetails = await fetchData<OrderDetail[]>(
          `/orders/${editOrderId}/details`
        );
        const order = orders.find((o) => o.order_id === editOrderId);

        if (order) {
          setEditSelectedSupplier(order.supplier_id);
          setEditOrderDate(order.order_date);

          // Map order details to the format needed for the edit form
          const items = await Promise.all(
            orderDetails.map(async (detail) => {
              // Find product to get current price
              const product = products.find(
                (p) => p.name === detail.product_name
              );
              return {
                productId: product?.product_id || 0,
                quantity: detail.quantity,
                price: detail.unit_price,
              };
            })
          );

          setEditOrderItems(items);
        }
      } catch (err) {
        setEditOrderError("Failed to load order details. Please try again.");
        console.error(err);
      }
    };

    if (editOrderId && products.length > 0) {
      fetchOrderDetails();
    }
  }, [editOrderId, products, orders]);

  // Handler for filter form

  const handleFilterApply = (e: React.FormEvent) => {
    e.preventDefault();
    // The effect will trigger the API call
    setShowFilters(false);
  };

  const handleFilterReset = () => {
    setStartDate("");
    setEndDate("");
    setCustomerId("");
    setSupplierId("");
  };

  // Create new order
  const handleCreateOrder = async () => {
    if (!selectedCustomer || !selectedSupplier || orderItems.length === 0) {
      setCreateOrderError(
        "Please fill all required fields and add at least one product"
      );
      return;
    }

    try {
      setCreateOrderError(null);

      const orderData: OrderCreate = {
        order_date: new Date().toISOString().split("T")[0],
        supplier_id: selectedSupplier,
        customer_id: selectedCustomer,
        details: orderItems.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
      };

      const response = await postData<OrderResponse>("/orders", orderData);

      // Refresh orders list with the new order
      setOrders([response, ...orders]);
      setShowCreateModal(false);
      resetOrderForm();
    } catch (err) {
      setCreateOrderError("Failed to create order. Please try again.");
      console.error(err);
    }
  };

  // Update existing order
  const handleUpdateOrder = async () => {
    if (!editOrderId || !editSelectedSupplier || editOrderItems.length === 0) {
      setEditOrderError(
        "Please fill all required fields and add at least one product"
      );
      return;
    }

    try {
      setEditOrderError(null);

      const orderData: OrderUpdate = {
        order_date: editOrderDate,
        supplier_id: editSelectedSupplier,
        details: editOrderItems.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
      };

      const response = await putData<OrderResponse>(
        `/orders/${editOrderId}`,
        orderData
      );

      // Update the orders list
      setOrders(
        orders.map((order) =>
          order.order_id === editOrderId ? response : order
        )
      );

      setShowEditModal(false);
      setEditOrderId(null);
      setEditOrderItems([]);
      setEditSelectedSupplier(null);
      setEditOrderDate("");
    } catch (err) {
      setEditOrderError("Failed to update order. Please try again.");
      console.error(err);
    }
  };

  // View order details
  const handleViewOrder = async (orderId: number) => {
    setViewLoading(true);
    try {
      const orderInfo = orders.find((o) => o.order_id === orderId);
      const orderDetails = await fetchData<OrderDetail[]>(
        `/orders/${orderId}/details`
      );

      setViewOrderInfo(orderInfo || null);
      setViewOrderDetails(orderDetails);
      setShowViewModal(true);
    } catch (err) {
      console.error("Failed to load order details:", err);
    } finally {
      setViewLoading(false);
    }
  };

  // Delete order
  const handleDeleteOrder = async () => {
    if (!deleteOrderId) return;

    setDeleteLoading(true);
    try {
      await deleteData(`/orders/${deleteOrderId}`);

      // Update the orders list by removing the deleted order
      setOrders(orders.filter((order) => order.order_id !== deleteOrderId));

      setShowDeleteModal(false);
      setDeleteOrderId(null);
      setDeleteOrderInfo(null);
    } catch (err) {
      console.error("Failed to delete order:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Open edit modal
  const handleOpenEditModal = (orderId: number) => {
    setEditOrderId(orderId);
    setShowEditModal(true);
  };

  // Open delete confirmation
  const handleOpenDeleteModal = (orderId: number) => {
    const orderInfo = orders.find((o) => o.order_id === orderId);
    setDeleteOrderId(orderId);
    setDeleteOrderInfo(orderInfo || null);
    setShowDeleteModal(true);
  };
  // Reset order form
  const resetOrderForm = () => {
    setSelectedCustomer(null);
    setSelectedSupplier(null);
    setOrderItems([]);
  };

  // Add product to order
  const handleAddProduct = (productId: number) => {
    const product = products.find((p) => p.product_id === productId);
    if (product) {
      setOrderItems([
        ...orderItems,
        {
          productId: product.product_id,
          quantity: 1,
          price: product.price,
        },
      ]);
    }
  };

  const handleAddProductToEdit = (productId: number) => {
    const product = products.find((p) => p.product_id === productId);
    if (product) {
      setEditOrderItems([
        ...editOrderItems,
        {
          productId: product.product_id,
          quantity: 1,
          price: product.price,
        },
      ]);
    }
  };

  // Remove product from order
  const handleRemoveProduct = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  // Remove product from edit form
  const handleRemoveProductFromEdit = (index: number) => {
    setEditOrderItems(editOrderItems.filter((_, i) => i !== index));
  };

  // Update product quantity
  const handleUpdateQuantity = (index: number, quantity: number) => {
    const updatedItems = [...orderItems];
    updatedItems[index].quantity = quantity;
    setOrderItems(updatedItems);
  };

  const handleUpdateEditQuantity = (index: number, quantity: number) => {
    const updatedItems = [...editOrderItems];
    updatedItems[index].quantity = quantity;
    setEditOrderItems(updatedItems);
  };
  // Calculate order total
  const calculateOrderTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  // Calculate edit order total
  const calculateEditOrderTotal = () => {
    return editOrderItems.reduce((total, item) => {
      return total + Number(item.price) * item.quantity;
    }, 0);
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const nextPage = () => {
    if (currentPage < Math.ceil(orders.length / ordersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-lg text-blue-600">
        Loading orders...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Orders</h2>
          <div className="flex space-x-2">
            <button
              className={`btn ${showFilters ? "btn-primary" : "btn-secondary"}`}
              onClick={() => {
                setShowFilters(!showFilters);
                setShowCreateModal(false);
              }}
            >
              <Filter size={16} className="mr-2" />
              Filters
            </button>
            <button
              className={`btn ${
                showCreateModal ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => {
                setShowCreateModal(!showCreateModal);
                setShowFilters(false);
              }}
            >
              <Plus size={16} className="mr-2" />
              Create Order
            </button>
          </div>
        </div>
        <div className="action-panel">
          {/* Filters section */}
          {showFilters && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <form
                onSubmit={handleFilterApply}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input input-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input input-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer ID
                  </label>
                  <textarea
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="textarea textarea-sm"
                    placeholder="Filter by customer"
                    rows={1}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier
                  </label>
                  <textarea
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="textarea textarea-sm"
                    placeholder="Filter by supplier"
                    rows={1}
                  ></textarea>
                </div>
                <div className="lg:col-span-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleFilterReset}
                    className="btn btn-secondary"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Reset
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Apply Filters
                  </button>
                </div>
              </form>
            </div>
          )}
          {/* Create Order Modal */}
          {showCreateModal && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 h-auto max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white">
                  <h3 className="text-lg font-semibold">Create New Order</h3>
                  <button
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={() => setShowCreateModal(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                {createOrderError && (
                  <div className="mx-4 mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
                    {createOrderError}
                  </div>
                )}

                <div className="p-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block py-4 text-sm font-medium text-gray-700 mb-2">
                      Customer <span className="text-red-500">*</span>
                    </label>
                    <div className="relative py-4">
                      <select
                        value={selectedCustomer || ""}
                        onChange={(e) =>
                          setSelectedCustomer(Number(e.target.value))
                        }
                        className="select-input w-full"
                        required
                      >
                        <option value="">Select Customer</option>
                        {customers.map((customer) => (
                          <option
                            key={customer.customer_id}
                            value={customer.customer_id}
                          >
                            {customer.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier <span className="text-red-500">*</span>
                    </label>
                    <div className="relative py-4">
                      <select
                        value={selectedSupplier || ""}
                        onChange={(e) =>
                          setSelectedSupplier(Number(e.target.value))
                        }
                        className="select-input w-full"
                        required
                      >
                        <option value="">Select Supplier</option>
                        {suppliers.map((supplier) => (
                          <option
                            key={supplier.supplier_id}
                            value={supplier.supplier_id}
                          >
                            {supplier.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-800 mb-3">
                    Order Items
                  </h4>

                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Product
                    </label>
                    <div className="flex space-x-2">
                      <div className="relative py-4 flex-1">
                        <select
                          className="select-input w-full"
                          onChange={(e) =>
                            e.target.value &&
                            handleAddProduct(Number(e.target.value))
                          }
                          value=""
                        >
                          <option value="">Select Product</option>
                          {products.map((product) => (
                            <option
                              key={product.product_id}
                              value={product.product_id}
                            >
                              {product.name} - ৳
                              {Number(product.price).toFixed(2)} (
                              {product.current_stock} in stock)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {orderItems.length > 0 ? (
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
                          {orderItems.map((item, index) => {
                            const product = products.find(
                              (p) => p.product_id === item.productId
                            );
                            return (
                              <tr
                                key={index}
                                className={index === 0 ? "rounded-t-md" : ""}
                              >
                                <td className="px-4 py-3 text-sm text-gray-800">
                                  {product?.name || "Unknown Product"}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-800">
                                  ৳{Number(item.price).toFixed(2)}
                                </td>
                                <td className="px-4 py-3">
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      handleUpdateQuantity(
                                        index,
                                        Number(e.target.value)
                                      )
                                    }
                                    className="quantity-input w-20"
                                  />
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-800">
                                  ৳
                                  {(Number(item.price) * item.quantity).toFixed(
                                    2
                                  )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveProduct(index)}
                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                  >
                                    <X size={16} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          <tr className="bg-gray-50 font-medium rounded-b-md">
                            <td
                              colSpan={3}
                              className="px-4 py-3 text-right text-gray-800"
                            >
                              Total Amount:
                            </td>
                            <td
                              colSpan={2}
                              className="px-4 py-3 text-gray-800 font-bold"
                            >
                              ৳
                              {calculateOrderTotal().toLocaleString(undefined, {
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
                      No products added yet. Select products above to add them
                      to the order.
                    </div>
                  )}
                </div>

                <div className="px-5 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200 sticky bottom-0 rounded-b-lg">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCreateOrder}
                    disabled={
                      !selectedCustomer ||
                      !selectedSupplier ||
                      orderItems.length === 0
                    }
                  >
                    Create Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View Order Modal */}
        {showViewModal && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 h-auto max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white">
                <h3 className="text-lg font-semibold text-gray-800">
                  Order Details - #{viewOrderInfo?.order_id}
                </h3>
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
                      <h4 className="font-medium text-gray-700 mb-2">
                        Order Information
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="mb-2">
                          <span className="font-medium">Date:</span>{" "}
                          {viewOrderInfo?.order_date &&
                            new Date(
                              viewOrderInfo.order_date
                            ).toLocaleDateString()}
                        </p>
                        <p className="mb-2">
                          <span className="font-medium">Status:</span>{" "}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              viewOrderInfo?.status || ""
                            )}`}
                          >
                            {viewOrderInfo?.status}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium">Total Amount:</span> ৳
                          {viewOrderInfo?.total_amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Parties
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="mb-2">
                          <span className="font-medium">Customer:</span>{" "}
                          {viewOrderInfo?.customer_name}
                        </p>
                        <p>
                          <span className="font-medium">Supplier:</span>{" "}
                          {viewOrderInfo?.supplier_name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3">
                    <h4 className="font-medium text-gray-700 mb-3">
                      Order Items
                    </h4>
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
                            <tr
                              key={index}
                              className={index === 0 ? "rounded-t-md" : ""}
                            >
                              <td className="px-4 py-3 text-sm text-gray-800">
                                {item.product_name}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-800">
                                ৳{Number(item.unit_price).toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-800">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-800">
                                ৳{Number(item.total_price).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="px-5 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200 sticky bottom-0 rounded-b-lg">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowViewModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Edit Order Modal */}
        {showEditModal && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 h-auto max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white">
                <h3 className="text-lg font-semibold text-gray-800">
                  Edit Order - #{editOrderId}
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditOrderId(null);
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
                      className="select-input w-full"
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
                      onChange={(e) =>
                        setEditSelectedSupplier(Number(e.target.value))
                      }
                      className="select-input w-full"
                      required
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map((supplier) => (
                        <option
                          key={supplier.supplier_id}
                          value={supplier.supplier_id}
                        >
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Product
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <select
                        className="select-input w-full"
                        onChange={(e) =>
                          e.target.value &&
                          handleAddProductToEdit(Number(e.target.value))
                        }
                        value=""
                      >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                          <option
                            key={product.product_id}
                            value={product.product_id}
                          >
                            {product.name} - ৳{Number(product.price).toFixed(2)}{" "}
                            ({product.current_stock} in stock)
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
                          const product = products.find(
                            (p) => p.product_id === item.productId
                          );
                          return (
                            <tr
                              key={index}
                              className={index === 0 ? "rounded-t-md" : ""}
                            >
                              <td className="px-4 py-3 text-sm text-gray-800">
                                {product?.name || "Unknown Product"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-800">
                                ৳{Number(item.price).toFixed(2)}
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleUpdateEditQuantity(
                                      index,
                                      Number(e.target.value)
                                    )
                                  }
                                  className="quantity-input w-20"
                                />
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-800">
                                ৳
                                {(Number(item.price) * item.quantity).toFixed(
                                  2
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveProductFromEdit(index)
                                  }
                                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                >
                                  <X size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="bg-gray-50 font-medium rounded-b-md">
                          <td
                            colSpan={3}
                            className="px-4 py-3 text-right text-gray-800"
                          >
                            Total Amount:
                          </td>
                          <td
                            colSpan={2}
                            className="px-4 py-3 text-gray-800 font-bold"
                          >
                            ৳
                            {calculateEditOrderTotal().toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg mb-4 border border-gray-200 border-dashed">
                    No products added yet. Select products above to add them to
                    the order.
                  </div>
                )}
              </div>

              <div className="px-5 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200 sticky bottom-0 rounded-b-lg">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditOrderId(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateOrder}
                  disabled={
                    !editSelectedSupplier || editOrderItems.length === 0
                  }
                >
                  Update Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Order Modal */}
        {showDeleteModal && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
              <div className="p-5">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <AlertCircle size={24} className="text-red-600" />
                  </div>
                </div>
                <h3 className="text-lg text-center font-medium text-gray-900 mb-2">
                  Confirm Delete
                </h3>
                <p className="text-center text-gray-500 mb-5">
                  Are you sure you want to delete Order #{deleteOrderId}? This
                  action cannot be undone.
                </p>

                {deleteOrderInfo && (
                  <div className="bg-gray-50 p-3 rounded-md mb-5 text-sm">
                    <p className="mb-1">
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(
                        deleteOrderInfo.order_date
                      ).toLocaleDateString()}
                    </p>
                    <p className="mb-1">
                      <span className="font-medium">Customer:</span>{" "}
                      {deleteOrderInfo.customer_name}
                    </p>
                    <p>
                      <span className="font-medium">Amount:</span> ৳
                      {deleteOrderInfo.total_amount.toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="flex justify-center space-x-3">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteOrderId(null);
                      setDeleteOrderInfo(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteOrder}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Deleting..." : "Delete Order"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}

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
                        <button
                          // className="btn btn-secondary btn-sm mr-2">
                          //   View
                          className="btn btn-icon btn-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 mr-1"
                          onClick={() => handleViewOrder(order.order_id)}
                          title="View Order"
                        >
                          <Eye size={16} />
                        </button>
                        {/* <button className="btn btn-secondary btn-sm">
                          Edit */}
                        <button
                          className="btn btn-icon btn-sm text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 mr-1"
                          onClick={() => handleOpenEditModal(order.order_id)}
                          title="Edit Order"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-icon btn-sm text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => handleOpenDeleteModal(order.order_id)}
                          title="Delete Order"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No orders found. Try adjusting your filters or create a
                      new order.
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
                disabled={
                  currentPage >= Math.ceil(orders.length / ordersPerPage)
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

// Customers component
const Customers = () => {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showVipOnly, setShowVipOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomersData = async () => {
      try {
        setLoading(true);
        let endpoint = "/customers/";

        if (showVipOnly) {
          endpoint = "/customers/vip";
        } else if (searchTerm) {
          endpoint = `/customers/?search=${encodeURIComponent(searchTerm)}`;
        }

        const data = await fetchData<CustomerResponse[]>(endpoint);
        setCustomers(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch customer data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomersData();
  }, [searchTerm, showVipOnly]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The effect will trigger the API call
  };

  const handleToggleVip = () => {
    setShowVipOnly(!showVipOnly);
    setSearchTerm("");
  };

  if (loading && customers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading customers...</div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 p-4 rounded text-red-700">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add New Customer
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-md">
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={showVipOnly}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search customers..."
            />
            <button
              type="submit"
              disabled={showVipOnly}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </form>

        {/* VIP Toggle */}
        <div>
          <button
            onClick={handleToggleVip}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              showVipOnly
                ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                : "bg-gray-100 text-gray-800 border border-gray-300"
            }`}
          >
            {showVipOnly ? "★ Showing VIP Only" : "Show VIP Customers"}
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contact Info
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Orders
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total Spent
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
            {customers.map((customer) => (
              <tr key={customer.customer_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name}
                        {customer.total_spent >= 10000 && (
                          <span className="ml-1 text-yellow-500">★</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {customer.customer_id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.contact_info || "No contact information"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.total_orders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${customer.total_spent.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    View Orders
                  </button>
                  <button className="text-blue-600 hover:text-blue-900">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Suppliers component
const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPerformance, setShowPerformance] = useState(false);
  const [performance, setPerformance] = useState<any[]>([]);

  useEffect(() => {
    const fetchSuppliersData = async () => {
      try {
        setLoading(true);

        if (showPerformance) {
          const data = await fetchData<any[]>("/suppliers/performance");
          setPerformance(data);
        } else {
          const endpoint = searchTerm
            ? `/suppliers/?search=${encodeURIComponent(searchTerm)}`
            : "/suppliers/";
          const data = await fetchData<SupplierResponse[]>(endpoint);
          setSuppliers(data);
        }

        setError(null);
      } catch (err) {
        setError("Failed to fetch supplier data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliersData();
  }, [searchTerm, showPerformance]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The effect will trigger the API call
  };

  const handleToggleView = () => {
    setShowPerformance(!showPerformance);
    setSearchTerm("");
  };

  if (loading && suppliers.length === 0 && performance.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading suppliers...</div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 p-4 rounded text-red-700">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add New Supplier
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-md">
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={showPerformance}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search suppliers..."
            />
            <button
              type="submit"
              disabled={showPerformance}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </form>

        {/* Toggle View */}
        <div>
          <button
            onClick={handleToggleView}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              showPerformance
                ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                : "bg-gray-100 text-gray-800 border border-gray-300"
            }`}
          >
            {showPerformance
              ? "Show All Suppliers"
              : "Show Performance Metrics"}
          </button>
        </div>
      </div>

      {/* Suppliers Table */}
      {!showPerformance ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact Info
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Orders
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Avg Delivery (days)
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
              {suppliers.map((supplier) => (
                <tr key={supplier.supplier_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {supplier.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {supplier.supplier_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {supplier.contact_info || "No contact information"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.total_orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.avg_delivery_days.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      View Orders
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                  Total Orders
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Avg Delivery Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Performance Rating
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performance.map((item) => (
                <tr key={item.supplier_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.total_orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.avg_delivery_days.toFixed(1)} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RatingBadge rating={item.avg_delivery_days} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Helper component for supplier ratings
const RatingBadge = ({ rating }: { rating: number }) => {
  let color = "bg-green-100 text-green-800";
  let text = "Excellent";

  if (rating > 5) {
    color = "bg-red-100 text-red-800";
    text = "Poor";
  } else if (rating > 3) {
    color = "bg-yellow-100 text-yellow-800";
    text = "Average";
  }

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}
    >
      {text}
    </span>
  );
};

// Shipments component
const Shipments = () => {
  const [shipments, setShipments] = useState<ShipmentResponse[]>([]);
  const [lateShipments, setLateShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLateOnly, setShowLateOnly] = useState(false);

  useEffect(() => {
    const fetchShipmentsData = async () => {
      try {
        setLoading(true);

        if (showLateOnly) {
          const data = await fetchData<any[]>("/shipments/late");
          setLateShipments(data);
        } else {
          const data = await fetchData<ShipmentResponse[]>("/shipments/");
          setShipments(data);
        }

        setError(null);
      } catch (err) {
        setError("Failed to fetch shipment data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipmentsData();
  }, [showLateOnly]);

  const handleToggleView = () => {
    setShowLateOnly(!showLateOnly);
  };

  if (loading && shipments.length === 0 && lateShipments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading shipments...</div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 p-4 rounded text-red-700">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shipments</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Shipment
        </button>
      </div>

      <div className="mb-6">
        <button
          onClick={handleToggleView}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            showLateOnly
              ? "bg-red-100 text-red-800 border border-red-300"
              : "bg-gray-100 text-gray-800 border border-gray-300"
          }`}
        >
          {showLateOnly ? "Show All Shipments" : "Show Late Shipments Only"}
        </button>
      </div>

      {/* Shipments Table */}
      {showLateOnly ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Shipment ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Order Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Delivery Days
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
              {lateShipments.map((shipment) => (
                <tr key={shipment.shipment_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{shipment.shipment_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(shipment.order_date).toLocaleDateString()}
                    {new Date(shipment.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.delivery_days} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Late
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      View
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Shipment ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Order Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Delivery Days
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Details
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
              {shipments.map((shipment) => (
                <tr key={shipment.shipment_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{shipment.shipment_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(shipment.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.delivery_days} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.details.map((detail) => (
                      <div key={detail.product_id}>
                        {detail.product_name} x {detail.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      View
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return <Orders />;
      case "customers":
        return <Customers />;
      case "suppliers":
        return <Suppliers />;
      case "shipments":
        return <Shipments />;
      default:
        return <div></div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <div className="w-64 h-screen fixed bg-gray-800 text-white">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Inventory System</h1>
        </div>
        <nav className="mt-5">
          <SidebarItem
            icon={<Home size={20} />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <SidebarItem
            icon={<Database size={20} />}
            label="Inventory"
            active={activeTab === "inventory"}
            onClick={() => setActiveTab("inventory")}
          />
          <SidebarItem
            icon={<Package size={20} />}
            label="Products"
            active={activeTab === "products"}
            onClick={() => setActiveTab("products")}
          />
          <SidebarItem
            icon={<ShoppingCart size={20} />}
            label="Orders"
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="Customers"
            active={activeTab === "customers"}
            onClick={() => setActiveTab("customers")}
          />
          <SidebarItem
            icon={<Truck size={20} />}
            label="Suppliers"
            active={activeTab === "suppliers"}
            onClick={() => setActiveTab("suppliers")}
          />
          <SidebarItem
            icon={<Truck size={20} />}
            label="Shipments"
            active={activeTab === "shipments"}
            onClick={() => setActiveTab("shipments")}
          />
          <SidebarItem
            icon={<BarChart2 size={20} />}
            label="Analytics"
            active={activeTab === "analytics"}
            onClick={() => setActiveTab("analytics")}
          />
          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="px-4 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">{renderContent()}</main>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`sidebar-item ${
        active ? "sidebar-item.active" : "sidebar-item"
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </div>
  );
};

// const App = () => {
//   const [activeTab, setActiveTab] = useState("dashboard");

//   const renderContent = () => {
//     switch (activeTab) {
//       // case 'dashboard':
//       //   return <Dashboard />;
//       // case 'inventory':
//       //   return <Inventory />;
//       // case 'products':
//       //   return <Products />;
//       case "orders":
//         return <Orders />;
//       case "customers":
//         return <Customers />;
//       case "suppliers":
//         return <Suppliers />;
//       case "shipments":
//         return <Shipments />;
//       // case 'analytics':
//       //   return <Analytics />;
//       // default:
//       //   return <Dashboard />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <nav className="bg-blue-600 text-white shadow-md">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center py-3">
//             <div className="text-xl font-bold">Inventory Management System</div>

//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setActiveTab("dashboard")}
//                 className={`btn ${activeTab === "dashboard" ? "btn-primary" : "btn-secondary"}`}
//               >
//                 Dashboard
//               </button>
//               <button
//                 onClick={() => setActiveTab("inventory")}
//                 className={`btn ${activeTab === "inventory" ? "btn-primary" : "btn-secondary"}`}
//               >
//                 Inventory
//               </button>
//               <button
//                 onClick={() => setActiveTab("products")}
//                 className={`btn ${activeTab === "products" ? "btn-primary" : "btn-secondary"}`}
//               >
//                 Products
//               </button>
//               <button
//                 onClick={() => setActiveTab("orders")}
//                 className={`btn ${activeTab === "orders" ? "btn-primary" : "btn-secondary"}`}
//               >
//                 Orders
//               </button>
//               <button
//                 onClick={() => setActiveTab("customers")}
//                 className={`btn ${activeTab === "customers" ? "btn-primary" : "btn-secondary"}`}
//               >
//                 Customers
//               </button>
//               <button
//                 onClick={() => setActiveTab("suppliers")}
//                 className={`btn ${activeTab === "suppliers" ? "btn-primary" : "btn-secondary"}`}
//               >
//                 Suppliers
//               </button>
//               <button
//                 onClick={() => setActiveTab("shipments")}
//                 className={`btn ${activeTab === "shipments" ? "btn-primary" : "btn-secondary"}`}
//               >
//                 Shipments
//               </button>
//               <button
//                 onClick={() => setActiveTab("analytics")}
//                 className={`btn ${activeTab === "analytics" ? "btn-primary" : "btn-secondary"}`}
//               >
//                 Analytics
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>
//       <main className="container mx-auto px-4 py-6">{renderContent()}</main>
//     </div>
//   );
// };

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
