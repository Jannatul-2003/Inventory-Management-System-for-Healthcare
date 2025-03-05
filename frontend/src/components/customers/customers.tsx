"use client";

import React from "react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useCustomerData } from "./hooks/use-customer-data.tsx";
import CustomerList from "./customer-list.tsx";
import CustomerOrderHistory from "./customer-order-history.tsx";
import CustomerForm from "./customer-form.tsx";
import { CustomerResponse, CustomerValueAnalysis } from "../../types/index.ts";
import DeleteCustomerModal from "./hooks/deleteCustomer.tsx";

const Customers = () => {
  // UI State
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const [viewMode, setViewMode] = useState<
    "list" | "orders" | "create" | "edit"
  >("list");

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState<number | null>(null);
  const [deleteCustomerInfo, setDeleteCustomerInfo] = useState<
    CustomerResponse | CustomerValueAnalysis | null
  >(null);

  const {
    customers,
    vipCustomers,
    customerOrders,
    searchTerm,
    setSearchTerm,
    showVipOnly,
    setShowVipOnly,
    loading,
    error,
    currentPage,
    setCurrentPage,
    customersPerPage,
    fetchCustomerOrders,
    handleDeleteCustomer,
    createCustomer,
    updateCustomer,
    totalPages,
  } = useCustomerData(selectedCustomerId, viewMode);

  // Event Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The effect will trigger the API call with searchTerm
  };

  const handleToggleVip = () => {
    setShowVipOnly(!showVipOnly);
    setSearchTerm("");
  };

  const handleViewOrders = (customerId: number) => {
    setSelectedCustomerId(customerId);
    setViewMode("orders");
    fetchCustomerOrders(customerId);
  };

  const handleEditCustomer = (customerId: number) => {
    setSelectedCustomerId(customerId);
    setViewMode("edit");
  };

  const handleCreateCustomer = () => {
    setViewMode("create");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedCustomerId(null);
  };

  const confirmDeleteCustomer = (customerId: number) => {
    const customer = showVipOnly
      ? vipCustomers.find((c) => c.customer_id === customerId)
      : customers.find((c) => c.customer_id === customerId);

    if (customer) {
      setDeleteCustomerId(customerId);
      setDeleteCustomerInfo(customer);
      setShowDeleteModal(true);
    }
  };

  // Loading State
  if (loading && customers.length === 0 && vipCustomers.length === 0) {
    return (
      <div className="card">
        <div className="card-body flex justify-center items-center h-64">
          <div className="text-lg">Loading customers...</div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="card bg-red-100 p-4 text-red-800">
        <div className="font-semibold">Error</div>
        <div>{error}</div>
      </div>
    );
  }

  // Customer Order History View
  if (viewMode === "orders" && selectedCustomerId) {
    const customer = showVipOnly
      ? vipCustomers.find((c) => c.customer_id === selectedCustomerId)
      : customers.find((c) => c.customer_id === selectedCustomerId);

    if (!customer) {
      return (
        <div className="card bg-red-100 p-4 text-red-800">
          <div className="font-semibold">Error</div>
          <div>Customer not found</div>
          <button className="btn btn-secondary mt-5" onClick={handleBackToList}>
            Back to Customers
          </button>
        </div>
      );
    }

    return (
      <CustomerOrderHistory
        customer={customer}
        customerOrders={customerOrders}
        loading={loading}
        handleBackToList={handleBackToList}
      />
    );
  }

  // Customer Create/Edit Form
  if (viewMode === "create" || viewMode === "edit") {
    return (
      <CustomerForm
        viewMode={viewMode}
        selectedCustomerId={selectedCustomerId}
        handleBackToList={handleBackToList}
        onSubmit={viewMode === "create" ? createCustomer : updateCustomer}
      />
    );
  }

  // Customer List View (Default)
  return (
    <div>
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">Customers</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleToggleVip}
            className={`btn ${
              showVipOnly ? "btn-secondary:focus" : "btn-secondary"
            }`}
          >
            {showVipOnly ? "★ Showing VIP Only" : "Show VIP Customers"}
          </button>

          <button className="btn btn-secondary" onClick={handleCreateCustomer}>
            <Plus size={16} className="mr-2" />
            Add New Customer
          </button>
        </div>
      </div>

      <div className="action-panel">
        <DeleteCustomerModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          deleteCustomerId={deleteCustomerId}
          setDeleteCustomerId={setDeleteCustomerId}
          deleteCustomerInfo={deleteCustomerInfo}
          setDeleteCustomerInfo={setDeleteCustomerInfo}
          deleteLoading={loading}
          handleDeleteCustomer={() => {
            if (deleteCustomerId) {
              handleDeleteCustomer(deleteCustomerId);
              setShowDeleteModal(false);
            }
          }}
        />
      </div>

      <CustomerList
        customers={customers}
        vipCustomers={vipCustomers}
        showVipOnly={showVipOnly}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={(e) => e.preventDefault()}
        handleViewOrders={handleViewOrders}
        handleEditCustomer={handleEditCustomer}
        handleDeleteCustomer={confirmDeleteCustomer} // Open modal instead of deleting directly
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        customersPerPage={customersPerPage}
        totalPages={totalPages}
      />
    </div>
    </div>
  );
};

export default Customers;
