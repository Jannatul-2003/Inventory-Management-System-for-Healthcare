import React, { useState, useEffect } from 'react';
import { fetchData } from '../../services/api.ts';
import { CustomerResponse } from '../../types/index.ts';

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

  const handleSearch = (e) => {
    e.preventDefault();
    // The effect will trigger the API call
  };

  const handleToggleVip = () => {
    setShowVipOnly(!showVipOnly);
    setSearchTerm("");
  };

  if (loading && customers.length === 0) {
    return (
      <div className="flex justify-between items-center h-64">
        <div className="text-lg">Loading customers...</div>
      </div>
    );
  }

  if (error) {
    return <div className="card bg-red-100 p-4 text-red-800">{error}</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">Customers</h1>
        <button className="btn btn-primary">
          Add New Customer
        </button>
      </div>

      <div className="card-body">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="input-group max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={showVipOnly}
              className="input"
              placeholder="Search customers..."
            />
            <div className="input-group-append">
              <button
                type="submit"
                disabled={showVipOnly}
                className="btn btn-primary"
              >
                Search
              </button>
            </div>
          </form>

          {/* VIP Toggle */}
          <div>
            <button
              onClick={handleToggleVip}
              className={`btn ${
                showVipOnly
                  ? "bg-yellow-100 text-yellow-800"
                  : "btn-secondary"
              }`}
            >
              {showVipOnly ? "★ Showing VIP Only" : "Show VIP Customers"}
            </button>
          </div>
        </div>

        {/* Customers Table */}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact Info</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.customer_id}>
                <td>
                  <div className="flex items-center">
                    <div>
                      <div className="font-semibold">
                        {customer.name}
                        {customer.total_spent >= 10000 && (
                          <span className="ml-1 text-yellow-800">★</span>
                        )}
                      </div>
                      <div className="text-sm">
                        ID: {customer.customer_id}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {customer.contact_info || "No contact information"}
                </td>
                <td>
                  {customer.total_orders}
                </td>
                <td>
                  ${customer.total_spent.toLocaleString()}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-secondary btn-sm mr-3">
                    View Orders
                  </button>
                  <button className="btn btn-primary btn-sm">
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

export default Customers;