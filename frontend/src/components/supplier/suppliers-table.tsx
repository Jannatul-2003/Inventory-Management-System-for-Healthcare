import React from "react";
import type { SupplierResponse } from "../../types";
import TooltipButton from "../ui/button.tsx";

interface SuppliersTableProps {
  currentSuppliers: SupplierResponse[];
  handleViewSupplier: (SupplierId: number) => void;
  handleOpenEditModal: (SupplierId: number) => void;
  handleOpenDeleteModal: (SupplierId: number) => void;
  indexOfFirstSupplier: number;
  indexOfLastSupplier: number;
  Suppliers: SupplierResponse[];
  currentPage: number;
  prevPage: () => void;
  nextPage: () => void;
  SuppliersPerPage: number;
}

const SuppliersTable: React.FC<SuppliersTableProps> = ({
  currentSuppliers,
  handleViewSupplier,
  handleOpenEditModal,
  handleOpenDeleteModal,
  indexOfFirstSupplier,
  indexOfLastSupplier,
  Suppliers,
  currentPage,
  prevPage,
  nextPage,
  SuppliersPerPage,
}) => {
  return (
    <>
      <div className="card-body p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Supplier ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                {/* <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact Info
                </th> */}
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
                    Avg Delivery Days
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
              {currentSuppliers.length > 0 ? (
                currentSuppliers.map((Supplier) => (
                  <tr key={Supplier.supplier_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      No.{Supplier.supplier_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Supplier.name}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Supplier.contact_info || "No contact information"}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Supplier.total_orders||0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Supplier.avg_delivery_days||"No delivery yet"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <TooltipButton
                        onClick={() => handleViewSupplier(Supplier.supplier_id)}
                        tooltipText="View Supplier"
                      />
                      <TooltipButton
                        onClick={() => handleOpenEditModal(Supplier.supplier_id)}
                        tooltipText="Edit Supplier details"
                      />
                      <TooltipButton
                        onClick={() => handleOpenDeleteModal(Supplier.supplier_id)}
                        tooltipText="Delete Supplier"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No Suppliers found. Create a new Supplier.
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
            {Suppliers.length > 0
              ? `Showing ${indexOfFirstSupplier + 1} to ${Math.min(
                  indexOfLastSupplier,
                  Suppliers.length
                )} of ${Suppliers.length} Suppliers`
              : "No Suppliers found"}
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
                currentPage >= Math.ceil(Suppliers.length / SuppliersPerPage)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={nextPage}
              disabled={currentPage >= Math.ceil(Suppliers.length / SuppliersPerPage)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuppliersTable;
