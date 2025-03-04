import React from "react"
import { RefreshCw } from "lucide-react"

interface OrderFiltersProps {
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  setShowCreateModal: (show: boolean) => void
  startDate: string
  setStartDate: (date: string) => void
  endDate: string
  setEndDate: (date: string) => void
  customerId: string
  setCustomerId: (id: string) => void
  supplierId: string
  setSupplierId: (id: string) => void
  handleFilterApply: (e: React.FormEvent) => void
  handleFilterReset: () => void
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  showFilters,
  setShowFilters,
  setShowCreateModal,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  customerId,
  setCustomerId,
  supplierId,
  setSupplierId,
  handleFilterApply,
  handleFilterReset,
}) => {
  if(!showFilters) return null
  return (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <form onSubmit={handleFilterApply} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input input-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input input-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
              <textarea
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="textarea textarea-sm"
                placeholder="Filter by customer"
                rows={1}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
              <textarea
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="textarea textarea-sm"
                placeholder="Filter by supplier"
                rows={1}
              ></textarea>
            </div>
            <div className="lg:col-span-4 flex justify-end space-x-2">
              <button type="button" onClick={handleFilterReset} className="btn btn-secondary">
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
    
export default OrderFilters

