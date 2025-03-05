import { useEffect, useState } from "react";
import { SupplierResponse } from "../../types/index.ts";
import { fetchData } from "../../services/api.ts";
import React from "react";

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

export default Suppliers;
