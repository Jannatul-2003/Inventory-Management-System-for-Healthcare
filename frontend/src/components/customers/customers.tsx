import React, { useState, useEffect } from "react";
import {
  fetchData,
  postData,
  putData,
  deleteData,
} from "../../services/api.ts";
import {
  CustomerResponse,
  CustomerOrderHistory,
  CustomerValueAnalysis,
  CustomerCreate,
  CustomerUpdate,
} from "../../types/index.ts";
import { Plus, X } from "lucide-react";
import TooltipButton from "../ui/button.tsx";

const Customers = () => {
  // State Management
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [vipCustomers, setVipCustomers] = useState<CustomerValueAnalysis[]>([]);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrderHistory[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showVipOnly, setShowVipOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);

  // UI State
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const [viewMode, setViewMode] = useState<
    "list" | "orders" | "create" | "edit"
  >("list");
  const [formData, setFormData] = useState<CustomerCreate>({
    name: "",
    contact_info: null,
  });

  // Fetch Customers
  useEffect(() => {
    const fetchCustomersData = async () => {
      try {
        setLoading(true);
        let endpoint = "";
        let data;

        if (showVipOnly) {
          endpoint = "/customers/vip";
          data = await fetchData<CustomerValueAnalysis[]>(endpoint);
          setVipCustomers(data);
        } else if (searchTerm) {
          endpoint = `/customers/?search=${encodeURIComponent(searchTerm)}`;
          data = await fetchData<CustomerResponse[]>(endpoint);
          setCustomers(data);
        } else {
          endpoint = "/customers/";
          data = await fetchData<CustomerResponse[]>(endpoint);
          setCustomers(data);
        }

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

  // Fetch Customer Orders when a customer is selected
  useEffect(() => {
    const fetchCustomerOrders = async () => {
      if (selectedCustomerId && viewMode === "orders") {
        try {
          setLoading(true);
          const endpoint = `/customers/${selectedCustomerId}/orders`;
          const data = await fetchData<CustomerOrderHistory[]>(endpoint);
          setCustomerOrders(data);
          setError(null);
        } catch (err) {
          setError("Failed to fetch customer orders");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCustomerOrders();
  }, [selectedCustomerId, viewMode]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Fetch customer data for edit mode
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (selectedCustomerId && viewMode === "edit") {
        try {
          setLoading(true);
          const endpoint = `/customers/${selectedCustomerId}`;
          const data = await fetchData<CustomerResponse>(endpoint);
          setFormData({
            name: data.name,
            contact_info: data.contact_info || null,
          });
          setError(null);
        } catch (err) {
          setError("Failed to fetch customer details");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCustomerDetails();
  }, [selectedCustomerId, viewMode]);

  // Reset pagination when toggling between regular and VIP customers
  useEffect(() => {
    setCurrentPage(1);
  }, [showVipOnly]);

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
  };

  const handleEditCustomer = (customerId: number) => {
    setSelectedCustomerId(customerId);
    setViewMode("edit");
  };

  const handleCreateCustomer = () => {
    setFormData({ name: "", contact_info: null });
    setViewMode("create");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedCustomerId(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  };

  const handleDeleteCustomer = async (customerId: number) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;

    try {
      setLoading(true);
      await deleteData(`/customers/${customerId}`);

      // Update the customer list after deletion
      if (showVipOnly) {
        const updatedVipList = await fetchData<CustomerValueAnalysis[]>(
          "/customers/vip"
        );
        setVipCustomers(updatedVipList);
      } else {
        const updatedList = await fetchData<CustomerResponse[]>("/customers/");
        setCustomers(updatedList);
      }

      setError(null);
    } catch (err) {
      setError("Failed to delete customer");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Customer name is required");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Prepare data (remove undefined values for API calls)
      const customerData: CustomerCreate | CustomerUpdate = {
        name: formData.name,
        contact_info: formData.contact_info,
      };

      let response;

      if (viewMode === "create") {
        // Create new customer
        response = await postData<CustomerResponse>(
          "/customers/",
          customerData
        );
      } else if (viewMode === "edit" && selectedCustomerId) {
        // Update existing customer
        response = await putData<CustomerResponse>(
          `/customers/${selectedCustomerId}`,
          customerData
        );
      }

      // Refresh customer list with updated data
      if (showVipOnly) {
        const updatedVipList = await fetchData<CustomerValueAnalysis[]>(
          "/customers/vip"
        );
        setVipCustomers(updatedVipList);
      } else {
        const updatedList = await fetchData<CustomerResponse[]>("/customers/");
        setCustomers(updatedList);
      }

      // Return to list view
      setViewMode("list");
      setSelectedCustomerId(null);
    } catch (err) {
      setError(
        `Failed to ${
          viewMode === "create" ? "create" : "update"
        } customer. Please try again.`
      );
      console.error(err);
    } finally {
      setLoading(false);
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
              <div className="text-sm">
                This customer hasn't placed any orders yet.
              </div>
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
                    <td>
                      ৳{parseFloat(order.unit_price.toString()).toFixed(2)}
                    </td>
                    <td>
                      ৳{parseFloat(order.total_price.toString()).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // Customer Create/Edit Form
  if (viewMode === "create" || viewMode === "edit") {
    return (
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            {viewMode === "create" ? "Create New Customer" : "Edit Customer"}
          </h1>
          <button className="btn btn-secondary" onClick={handleBackToList}>
            <X size={20} />
          </button>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmitForm}>
            <div className="mb-6">
              <label className="input-label" htmlFor="name">
                Customer Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter customer name"
                required
              />
            </div>

            <div className="mb-6">
              <label className="input-label" htmlFor="contact_info">
                Contact Information
              </label>
              <textarea
                id="contact_info"
                name="contact_info"
                value={formData.contact_info || ""}
                onChange={handleInputChange}
                className="textarea"
                placeholder="Enter contact information"
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="btn btn-secondary mr-3"
                onClick={handleBackToList}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!formData.name.trim()}
              >
                {viewMode === "create" ? "Create Customer" : "Update Customer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Pagination logic
  const getCustomersForDisplay = () => {
    const dataSource = customers;
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    return dataSource.slice(indexOfFirstCustomer, indexOfLastCustomer);
  };

  const getVIPCustomersForDisplay = () => {
    const dataSource = vipCustomers;
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    return dataSource.slice(indexOfFirstCustomer, indexOfLastCustomer);
  };

  const currentCustomers = getCustomersForDisplay();
  const currentVIPCustomers = getVIPCustomersForDisplay();

  const totalPages = Math.ceil(
    (showVipOnly ? vipCustomers.length : customers.length) / customersPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Customer List View (Default)
  return (
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

      <div className="card-body">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          {/* Search Form */}
          {!showVipOnly && (
            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-sm"
                placeholder="Search customers..."
              />
            </form>
          )}
        </div>

        {(showVipOnly ? vipCustomers.length === 0 : customers.length === 0) ? (
          <div className="p-6 text-center">
            <div className="text-lg font-semibold">No customers found</div>
            <div className="text-sm">
              Try adjusting your search criteria or add a new customer.
            </div>
          </div>
        ) : (
          <>
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>Customer ID</th>
                      <th>Name</th>
                      {showVipOnly ? <></> : <th>Contact Info</th>}
                      <th>Orders</th>
                      <th>Total Spent</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showVipOnly
                      ? // Display VIP customers
                        currentVIPCustomers.map(
                          (customer: CustomerValueAnalysis) => (
                            <tr key={customer.customer_id}>
                              <td>ID: {customer.customer_id}</td>
                              <td>
                                <div className="flex items-center">
                                  <div>
                                    <div className="font-semibold">
                                      {customer.name}
                                    </div>
                                    <div className="text-sm"></div>
                                  </div>
                                </div>
                              </td>
                              <td>{customer.total_orders}</td>
                              <td>
                                ৳
                                {typeof customer.total_spent === "number"
                                  ? customer.total_spent.toLocaleString(
                                      undefined,
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )
                                  : "0.00"}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                <TooltipButton
                                  onClick={() =>
                                    handleViewOrders(customer.customer_id)
                                  }
                                  tooltipText="View order history"
                                />
                                <TooltipButton
                                  onClick={() =>
                                    handleEditCustomer(customer.customer_id)
                                  }
                                  tooltipText="Edit customer details"
                                />
                                <TooltipButton
                                  onClick={() =>
                                    handleDeleteCustomer(customer.customer_id)
                                  }
                                  tooltipText="Delete customer"
                                />
                              </td>
                            </tr>
                          )
                        )
                      : // Display regular customers
                        currentCustomers.map((customer: CustomerResponse) => (
                          <tr key={customer.customer_id}>
                            <td>ID: {customer.customer_id}</td>
                            <td>
                              <div className="flex items-center">
                                <div>
                                  <div className="font-semibold">
                                    {customer.total_spent >= 1000 ? (
                                      <>{customer.name} ★</>
                                    ) : (
                                      customer.name
                                    )}
                                  </div>
                                  <div className="text-sm"></div>
                                </div>
                              </div>
                            </td>

                            <td>{customer.contact_info}</td>
                            <td>{customer.total_orders}</td>
                            <td>
                              ৳
                              {typeof customer.total_spent === "number"
                                ? customer.total_spent.toLocaleString(
                                    undefined,
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )
                                : "0.00"}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <TooltipButton
                                onClick={() =>
                                  handleViewOrders(customer.customer_id)
                                }
                                tooltipText="View order history"
                              />
                              <TooltipButton
                                onClick={() =>
                                  handleEditCustomer(customer.customer_id)
                                }
                                tooltipText="Edit customer details"
                              />
                              <TooltipButton
                                onClick={() =>
                                  handleDeleteCustomer(customer.customer_id)
                                }
                                tooltipText="Delete customer"
                              />
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Pagination Controls */}
            {(showVipOnly ? vipCustomers.length : customers.length) >
              customersPerPage && (
              <div className="card-footer">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {customers.length > 0
                      ? `Showing ${
                          (currentPage - 1) * customersPerPage + 1
                        } to ${Math.min(
                          currentPage * customersPerPage,
                          showVipOnly ? vipCustomers.length : customers.length
                        )} of ${
                          showVipOnly ? vipCustomers.length : customers.length
                        } customers`
                      : "No customers found"}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      className="btn btn-secondary"
                      onClick={prevPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <button
                      className={`btn btn-secondary ${
                        currentPage >=
                        Math.ceil(
                          (showVipOnly
                            ? vipCustomers.length
                            : customers.length) / customersPerPage
                        )
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={nextPage}
                      disabled={
                        currentPage >=
                        Math.ceil(
                          (showVipOnly
                            ? vipCustomers.length
                            : customers.length) / customersPerPage
                        )
                      }
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Customers;
