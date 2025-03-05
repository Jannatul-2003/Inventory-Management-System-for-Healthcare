// import { RefreshCw } from "lucide-react";
// import React, { useState } from "react";
import React from "react";

interface SupplierFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void
  supplierName: string;
  setSupplierName: (name:string) => void
  handleFilterApply: (e: React.FormEvent) => void;
  handleFilterReset: () => void;
}

const SupplierFilters: React.FC<SupplierFiltersProps> = ({
  showFilters,
  setShowFilters,
    supplierName,
  setSupplierName,
  handleFilterApply,
  handleFilterReset,
}) => {
if (!showFilters) return null;

  return (
    <div className="card-body">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
    <form onSubmit={handleFilterApply} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <input
          type="text"
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
          className="input input-sm"
          placeholder="Filter by supplier name"
        ></input>
      </div>
      {/* <div className="lg:col-span-4 flex justify-end space-x-2">
        <button type="button" onClick={handleFilterReset} className="btn btn-secondary">
          <RefreshCw size={16} className="mr-2" />
          Reset
        </button>
      </div> */}
    </form>
  </div>
</div>
  );
};

export default SupplierFilters;
