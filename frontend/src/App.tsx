import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';

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

// API service
const API_BASE_URL = 'http://localhost:8000/api/v1';

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

// Orders component
const Orders = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [supplierId, setSupplierId] = useState('');

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        setLoading(true);
        
        // Build query params
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (customerId) params.append('customer_id', customerId);
        if (supplierId) params.append('supplier_id', supplierId);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const data = await fetchData<OrderResponse[]>(`/orders/${queryString}`);
        
        setOrders(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch order data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersData();
  }, [startDate, endDate, customerId, supplierId]);

  const handleFilterApply = (e: React.FormEvent) => {
    e.preventDefault();
    // The effect will trigger the API call
  };

  const handleFilterReset = () => {
    setStartDate('');
    setEndDate('');
    setCustomerId('');
    setSupplierId('');
  };

  if (loading && orders.length === 0) {
    return <div className="flex justify-center items-center h-64"><div className="text-lg">Loading orders...</div></div>;
  }

  if (error) {
    return <div className="bg-red-100 p-4 rounded text-red-700">{error}</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Order
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-medium mb-4">Filter Orders</h2>
        <form onSubmit={handleFilterApply}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
              <input
                type="number"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Filter by customer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier ID</label>
              <input
                type="number"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Filter by supplier"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleFilterReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.order_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.order_id}
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
                  ${order.total_amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                  <button className="text-blue-600 hover:text-blue-900">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Customers component
const Customers = () => {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVipOnly, setShowVipOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomersData = async () => {
      try {
        setLoading(true);
        let endpoint = '/customers/';
        
        if (showVipOnly) {
          endpoint = '/customers/vip';
        } else if (searchTerm) {
          endpoint = `/customers/?search=${encodeURIComponent(searchTerm)}`;
        }
        
        const data = await fetchData<CustomerResponse[]>(endpoint);
        setCustomers(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch customer data');
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
    setSearchTerm('');
  };

  if (loading && customers.length === 0) {
    return <div className="flex justify-center items-center h-64"><div className="text-lg">Loading customers...</div></div>;
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
              showVipOnly ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-gray-100 text-gray-800 border border-gray-300'
            }`}
          >
            {showVipOnly ? '★ Showing VIP Only' : 'Show VIP Customers'}
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                        {customer.total_spent >= 10000 && <span className="ml-1 text-yellow-500">★</span>}
                      </div>
                      <div className="text-sm text-gray-500">ID: {customer.customer_id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.contact_info || 'No contact information'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.total_orders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${customer.total_spent.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">View Orders</button>
                  <button className="text-blue-600 hover:text-blue-900">Edit</button>
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
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPerformance, setShowPerformance] = useState(false);
  const [performance, setPerformance] = useState<any[]>([]);

  useEffect(() => {
    const fetchSuppliersData = async () => {
      try {
        setLoading(true);
        
        if (showPerformance) {
          const data = await fetchData<any[]>('/suppliers/performance');
          setPerformance(data);
        } else {
          const endpoint = searchTerm 
            ? `/suppliers/?search=${encodeURIComponent(searchTerm)}` 
            : '/suppliers/';
          const data = await fetchData<SupplierResponse[]>(endpoint);
          setSuppliers(data);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch supplier data');
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
    setSearchTerm('');
  };

  if (loading && suppliers.length === 0 && performance.length === 0) {
    return <div className="flex justify-center items-center h-64"><div className="text-lg">Loading suppliers...</div></div>;
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
              showPerformance ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' : 'bg-gray-100 text-gray-800 border border-gray-300'
            }`}
          >
            {showPerformance ? 'Show All Suppliers' : 'Show Performance Metrics'}
          </button>
        </div>
      </div>

      {/* Suppliers Table */}
      {!showPerformance ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Delivery (days)</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers.map((supplier) => (
                <tr key={supplier.supplier_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                        <div className="text-sm text-gray-500">ID: {supplier.supplier_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {supplier.contact_info || 'No contact information'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.total_orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.avg_delivery_days.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View Orders</button>
                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Delivery Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance Rating</th>
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
  let color = 'bg-green-100 text-green-800';
  let text = 'Excellent';
  
  if (rating > 5) {
    color = 'bg-red-100 text-red-800';
    text = 'Poor';
  } else if (rating > 3) {
    color = 'bg-yellow-100 text-yellow-800';
    text = 'Average';
  }
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
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
          const data = await fetchData<any[]>('/shipments/late');
          setLateShipments(data);
        } else {
          const data = await fetchData<ShipmentResponse[]>('/shipments/');
          setShipments(data);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch shipment data');
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
    return <div className="flex justify-center items-center h-64"><div className="text-lg">Loading shipments...</div></div>;
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.delivery_days} days</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Late
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                  <button className="text-blue-600 hover:text-blue-900">Edit</button>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.delivery_days} days</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {shipment.details.map((detail) => (
                    <div key={detail.product_id}>
                      {detail.product_name} x {detail.quantity}
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                  <button className="text-blue-600 hover:text-blue-900">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)    
}
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      // case 'dashboard':
      //   return <Dashboard />;
      // case 'inventory':
      //   return <Inventory />;
      // case 'products':
      //   return <Products />;
      case 'orders':
        return <Orders />;
      case 'customers':
        return <Customers />;
      case 'suppliers':
        return <Suppliers />;
      case 'shipments':
        return <Shipments />;
      // case 'analytics':
      //   return <Analytics />;
      // default:
      //   return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <div className="text-xl font-bold">Inventory Management System</div>
            <div className="flex space-x-1">
              <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}>Dashboard</button>
              <button onClick={() => setActiveTab('inventory')} className={`px-3 py-2 rounded ${activeTab === 'inventory' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}>Inventory</button>
              <button onClick={() => setActiveTab('products')} className={`px-3 py-2 rounded ${activeTab === 'products' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}>Products</button>
              <button onClick={() => setActiveTab('orders')} className={`px-3 py-2 rounded ${activeTab === 'orders' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}>Orders</button>
              <button onClick={() => setActiveTab('customers')} className={`px-3 py-2 rounded ${activeTab === 'customers' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}>Customers</button>
              <button onClick={() => setActiveTab('suppliers')} className={`px-3 py-2 rounded ${activeTab === 'suppliers' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}>Suppliers</button>
              <button onClick={() => setActiveTab('shipments')} className={`px-3 py-2 rounded ${activeTab === 'shipments' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}>Shipments</button>
              <button onClick={() => setActiveTab('analytics')} className={`px-3 py-2 rounded ${activeTab === 'analytics' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}>Analytics</button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;