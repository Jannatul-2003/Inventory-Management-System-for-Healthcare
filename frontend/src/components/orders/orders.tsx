"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Filter, Plus } from "lucide-react";
import {
  fetchData,
  postData,
  putData,
  deleteData,
} from "../../services/api.ts";
import type {
  OrderResponse,
  OrderCreate,
  OrderDetail,
  OrderUpdate,
  CustomerResponse,
  SupplierResponse,
  ProductResponse,
} from "../../types/index.ts";
import OrderFilters from "./order-filters.tsx";
import CreateOrderModal from "./create-order-modal.tsx";
import ViewOrderModal from "./view-order-modal.tsx";
import EditOrderModal from "./edit-order-modal.tsx";
import DeleteOrderModal from "./delete-order-modal.tsx";
import OrdersTable from "./orders-table.tsx";

const Orders: React.FC = () => {
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

  // Status color helper
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
        <OrderFilters
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              setShowCreateModal={setShowCreateModal}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              customerId={customerId}
              setCustomerId={setCustomerId}
              supplierId={supplierId}
              setSupplierId={setSupplierId}
              handleFilterApply={handleFilterApply}
              handleFilterReset={handleFilterReset}
            />
          <CreateOrderModal
            showCreateModal={showCreateModal}
            setShowCreateModal={setShowCreateModal}
            createOrderError={createOrderError}
            customers={customers}
            suppliers={suppliers}
            products={products}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            selectedSupplier={selectedSupplier}
            setSelectedSupplier={setSelectedSupplier}
            orderItems={orderItems}
            handleAddProduct={handleAddProduct}
            handleRemoveProduct={handleRemoveProduct}
            handleUpdateQuantity={handleUpdateQuantity}
            calculateOrderTotal={calculateOrderTotal}
            handleCreateOrder={handleCreateOrder}
          />

          <ViewOrderModal
            showViewModal={showViewModal}
            setShowViewModal={setShowViewModal}
            viewOrderInfo={viewOrderInfo}
            viewOrderDetails={viewOrderDetails}
            viewLoading={viewLoading}
            getStatusColor={getStatusColor}
          />

          <EditOrderModal
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            editOrderId={editOrderId}
            setEditOrderId={setEditOrderId}
            editOrderError={editOrderError}
            editOrderDate={editOrderDate}
            setEditOrderDate={setEditOrderDate}
            editSelectedSupplier={editSelectedSupplier}
            setEditSelectedSupplier={setEditSelectedSupplier}
            suppliers={suppliers}
            products={products}
            editOrderItems={editOrderItems}
            handleAddProductToEdit={handleAddProductToEdit}
            handleRemoveProductFromEdit={handleRemoveProductFromEdit}
            handleUpdateEditQuantity={handleUpdateEditQuantity}
            calculateEditOrderTotal={calculateEditOrderTotal}
            handleUpdateOrder={handleUpdateOrder}
          />

          <DeleteOrderModal
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            deleteOrderId={deleteOrderId}
            setDeleteOrderId={setDeleteOrderId}
            deleteOrderInfo={deleteOrderInfo}
            setDeleteOrderInfo={setDeleteOrderInfo}
            deleteLoading={deleteLoading}
            handleDeleteOrder={handleDeleteOrder}
          />
        </div>

        <OrdersTable
          currentOrders={currentOrders}
          getStatusColor={getStatusColor}
          handleViewOrder={handleViewOrder}
          handleOpenEditModal={handleOpenEditModal}
          handleOpenDeleteModal={handleOpenDeleteModal}
          indexOfFirstOrder={indexOfFirstOrder}
          indexOfLastOrder={indexOfLastOrder}
          orders={orders}
          currentPage={currentPage}
          prevPage={prevPage}
          nextPage={nextPage}
          ordersPerPage={ordersPerPage}
        />
      </div>
    </div>
  );
};

export default Orders;