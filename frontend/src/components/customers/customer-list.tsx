import React from "react"
import type { CustomerResponse, CustomerValueAnalysis } from "../../types/index.ts"
import TooltipButton from "../ui/button.tsx"

interface CustomerListProps {
  customers: CustomerResponse[]
  vipCustomers: CustomerValueAnalysis[]
  showVipOnly: boolean
  searchTerm: string
  setSearchTerm: (term: string) => void
  handleSearch: (e: React.FormEvent) => void
  handleViewOrders: (customerId: number) => void
  handleEditCustomer: (customerId: number) => void
  handleDeleteCustomer: (customerId: number) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  customersPerPage: number
  totalPages: number
}

const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  vipCustomers,
  showVipOnly,
  searchTerm,
  setSearchTerm,
  handleSearch,
  handleViewOrders,
  handleEditCustomer,
  handleDeleteCustomer,
  currentPage,
  setCurrentPage,
  customersPerPage,
  totalPages,
}) => {
  // Pagination logic
  const getCustomersForDisplay = () => {
    const dataSource = customers
    const indexOfLastCustomer = currentPage * customersPerPage
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage
    return dataSource.slice(indexOfFirstCustomer, indexOfLastCustomer)
  }
  const getVIPCustomersForDisplay = () => {
    const dataSource =  vipCustomers 
    const indexOfLastCustomer = currentPage * customersPerPage
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage
    return dataSource.slice(indexOfFirstCustomer, indexOfLastCustomer)
  }

  const currentVIPCustomers = getVIPCustomersForDisplay()
  const currentCustomers = getCustomersForDisplay()

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="card-body">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        {/* Search Form */}
        {!showVipOnly && (
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div className="text-sm">Try adjusting your search criteria or add a new customer.</div>
        </div>
      ) : (
        <>
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
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
                      currentVIPCustomers.map((customer: CustomerValueAnalysis) => (
                        <tr key={customer.customer_id}>
                          <td>ID: {customer.customer_id}</td>
                          <td>
                            <div className="flex items-center">
                              <div>
                                <div className="font-semibold">{customer.name}</div>
                                <div className="text-sm"></div>
                              </div>
                            </div>
                          </td>
                          <td>{customer.total_orders}</td>
                          <td>
                            ৳
                            {typeof customer.total_spent === "number"
                              ? customer.total_spent.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : "0.00"}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <TooltipButton
                              onClick={() => handleViewOrders(customer.customer_id)}
                              tooltipText="View order history"
                            />
                            <TooltipButton
                              onClick={() => handleEditCustomer(customer.customer_id)}
                              tooltipText="Edit customer details"
                            />
                            <TooltipButton
                              onClick={() => handleDeleteCustomer(customer.customer_id)}
                              tooltipText="Delete customer"
                            />
                          </td>
                        </tr>
                      ))
                    : // Display regular customers
                      currentCustomers.map((customer: CustomerResponse) => (
                        <tr key={customer.customer_id}>
                          <td>ID: {customer.customer_id}</td>
                          <td>
                            <div className="flex items-center">
                              <div>
                                <div className="font-semibold">
                                  {customer.total_spent >= 1000 ? <>{customer.name} ★</> : customer.name}
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
                              ? customer.total_spent.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : "0.00"}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <TooltipButton
                              onClick={() => handleViewOrders(customer.customer_id)}
                              tooltipText="View order history"
                            />
                            <TooltipButton
                              onClick={() => handleEditCustomer(customer.customer_id)}
                              tooltipText="Edit customer details"
                            />
                            <TooltipButton
                              onClick={() => handleDeleteCustomer(customer.customer_id)}
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
          {(showVipOnly ? vipCustomers.length : customers.length) > customersPerPage && (
            <div className="card-footer">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {customers.length > 0
                    ? `Showing ${(currentPage - 1) * customersPerPage + 1} to ${Math.min(
                        currentPage * customersPerPage,
                        showVipOnly ? vipCustomers.length : customers.length,
                      )} of ${showVipOnly ? vipCustomers.length : customers.length} customers`
                    : "No customers found"}
                </span>
                <div className="flex space-x-2">
                  <button className="btn btn-secondary" onClick={prevPage} disabled={currentPage === 1}>
                    Previous
                  </button>
                  <button
                    className={`btn btn-secondary ${
                      currentPage >=
                      Math.ceil((showVipOnly ? vipCustomers.length : customers.length) / customersPerPage)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={nextPage}
                    disabled={
                      currentPage >=
                      Math.ceil((showVipOnly ? vipCustomers.length : customers.length) / customersPerPage)
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
  )
}

export default CustomerList

