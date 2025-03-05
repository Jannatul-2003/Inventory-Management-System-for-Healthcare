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
  // SupplierPerformance,
  // SupplierAnalytics,
  SupplierResponse,
  SupplierUpdate,
  SupplierCreate,
} from "../../types/index.ts";
import CreateSupplierModal from "./create-supplier-modal.tsx";
import ViewSupplierModal from "./view-supplier-modal.tsx";
import EditSupplierModal from "./edit-supplier-modal.tsx";
import DeleteSupplierModal from "./delete-supplier-modal.tsx";
import SuppliersTable from "./suppliers-table.tsx";
import SupplierFilters from "./supplier-filter.tsx";

const Suppliers: React.FC = () => {
  const [Suppliers, setSuppliers] = useState<SupplierResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [supplierId, setSupplierId] = useState("");

  const [contact_info, setContact_info] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [SuppliersPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  // State for create Supplier modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createSupplierError, setCreateSupplierError] = useState<string | null>(
    null
  );
  const [supplierName, setSupplierName] = useState("");
  const [supplierContactInfo, setSupplierContactInfo] = useState<string | null>(
    null
  );
  // View Supplier states
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewSupplierDetails, setViewSupplierDetails] =
    useState<SupplierResponse>();
  const [viewSupplierInfo, setViewSupplierInfo] =
    useState<SupplierResponse | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Edit Supplier states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSupplierId, setEditSupplierId] = useState<number | null>(null);
  const [editSelectedSupplier, setEditSelectedSupplier] = useState<
    number | null
  >(null);
  const [editSupplierContact, setEditSupplierContact] = useState<string | null>(null);
  const [editSupplierName, setEditSupplierName] = useState<string | null>(null);
  const [editSupplierError, setEditSupplierError] = useState<string | null>(
    null
  );

  // Delete Supplier states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSupplierId, setDeleteSupplierId] = useState<number | null>(null);
  const [deleteSupplierInfo, setDeleteSupplierInfo] =
    useState<SupplierResponse | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch Suppliers data
  useEffect(() => {
    const fetchSuppliersData = async () => {
      try {
        setLoading(true);

        // Build query params
        const params = new URLSearchParams();
        if (supplierName) params.append("search", supplierName);

        const queryString = params.toString() ? `?${params.toString()}` : "";
        const data = await fetchData<SupplierResponse[]>(
          `/suppliers/${queryString}`
        );

        setSuppliers(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch Supplier data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliersData();
  }, [supplierName]);

  // Load Supplier details for editing
  useEffect(() => {
    const fetchSupplierDetails = async () => {
      if (!editSupplierId) return;

      try {
        setEditSupplierError(null);
        const Supplier = Suppliers.find(
          (o) => o.supplier_id === editSupplierId
        );

        if (Supplier) {
          setEditSupplierName(Supplier.name);
          setEditSupplierContact(Supplier.contact_info || "");
        }
      } catch (err) {
        setEditSupplierError(
          "Failed to load Supplier details. Please try again."
        );
        console.error(err);
      }
    };

    if (editSupplierId) {
      fetchSupplierDetails();
    }
  }, [editSupplierId, Suppliers]);

  // Handler for filter form
  const handleFilterApply = (e: React.FormEvent) => {
    e.preventDefault();
    // The effect will trigger the API call
    setShowFilters(false);
  };

  const handleFilterReset = () => {
    setSupplierName("");
  };

  // Create new Supplier
  const handleCreateSupplier = async () => {
    if (supplierName === "") {
      setCreateSupplierError("Supplier name is required");
      return;
    }

    try {
      setCreateSupplierError(null);

      const SupplierData: SupplierCreate = {
        name: supplierName,
        contact_info: contact_info || null,
      };

      const response = await postData<SupplierResponse>(
        "/suppliers",
        SupplierData
      );

      // Refresh Suppliers list with the new Supplier
      setSuppliers([response, ...Suppliers]);
      setShowCreateModal(false);
      resetSupplierForm();
    } catch (err) {
      setCreateSupplierError("Failed to create Supplier. Please try again.");
      console.error(err);
    }
  };

  // Update existing Supplier
  const handleUpdateSupplier = async () => {
    try {
      setEditSupplierError(null);

      const SupplierData: SupplierUpdate = {
        name: editSupplierName,
        contact_info: editSupplierContact,
      };

      const response = await putData<SupplierResponse>(
        `/suppliers/${editSupplierId}`,
        SupplierData
      );

      // Update the Suppliers list
      setSuppliers(
        Suppliers.map((Supplier) =>
          Supplier.supplier_id === editSupplierId ? response : Supplier
        )
      );

      setShowEditModal(false);
      setEditSupplierId(null);
      setEditSelectedSupplier(null);
      setEditSupplierContact("");
      setEditSupplierName("");
    } catch (err) {
      setEditSupplierError("Failed to update Supplier. Please try again.");
      console.error(err);
    }
  };

  // View Supplier details
  const handleViewSupplier = async (SupplierId: number) => {
    setViewLoading(true);
    try {
      const SupplierInfo = Suppliers.find((o) => o.supplier_id === SupplierId);
      const SupplierDetails = await fetchData<SupplierResponse>(
        `/suppliers/${SupplierId}`
      );

      setViewSupplierInfo(SupplierInfo || null);
      setViewSupplierDetails(SupplierDetails);
      setShowViewModal(true);
    } catch (err) {
      console.error("Failed to load Supplier details:", err);
    } finally {
      setViewLoading(false);
    }
  };

  // Delete Supplier
  const handleDeleteSupplier = async () => {
    if (!deleteSupplierId) return;

    setDeleteLoading(true);
    try {
      await deleteData(`/suppliers/${deleteSupplierId}`);

      // Update the Suppliers list by removing the deleted Supplier
      setSuppliers(
        Suppliers.filter(
          (Supplier) => Supplier.supplier_id !== deleteSupplierId
        )
      );

      setShowDeleteModal(false);
      setDeleteSupplierId(null);
      setDeleteSupplierInfo(null);
    } catch (err) {
      console.error("Failed to delete Supplier:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Open edit modal
  const handleOpenEditModal = (SupplierId: number) => {
    setEditSupplierId(SupplierId);
    setShowEditModal(true);
  };

  // Open delete confirmation
  const handleOpenDeleteModal = (SupplierId: number) => {
    const SupplierInfo = Suppliers.find((o) => o.supplier_id === SupplierId);
    setDeleteSupplierId(SupplierId);
    setDeleteSupplierInfo(SupplierInfo || null);
    setShowDeleteModal(true);
  };

  // Reset Supplier form
  const resetSupplierForm = () => {
    setSupplierName("");
    setContact_info("");
  };

  // Pagination logic
  const indexOfLastSupplier = currentPage * SuppliersPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - SuppliersPerPage;
  const currentSuppliers = Suppliers.slice(
    indexOfFirstSupplier,
    indexOfLastSupplier
  );

  const nextPage = () => {
    if (currentPage < Math.ceil(Suppliers.length / SuppliersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Loading state
  if (loading && Suppliers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-lg text-blue-600">
        Loading Suppliers...
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
          <h2 className="card-title">Suppliers</h2>
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
              Create Supplier
            </button>
          </div>
        </div>
        <div className="action-panel">
        <SupplierFilters
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            setSupplierName={setSupplierName} // Pass the setSupplierName function to handle filter changes
            handleFilterApply={handleFilterApply}
            handleFilterReset={handleFilterReset}
            supplierName={supplierName}
            />
          <CreateSupplierModal
            showCreateModal={showCreateModal}
            setShowCreateModal={setShowCreateModal}
            createSupplierError={createSupplierError}
            setCreateSupplierError={setCreateSupplierError}
            supplierName={supplierName}
            setSupplierName={setSupplierName}
            supplierContactInfo={supplierContactInfo}
            setSupplierContactInfo={setSupplierContactInfo}
            setSuppliers={setSuppliers}
            handleCreateSupplier={handleCreateSupplier}
            resetSupplierForm={resetSupplierForm}
            suppliers={Suppliers}
          />

          <ViewSupplierModal
            showViewModal={showViewModal}
            setShowViewModal={setShowViewModal}
            viewSupplierInfo={viewSupplierInfo}
            viewLoading={viewLoading}
          />

          <EditSupplierModal
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            editSupplierId={editSupplierId}
            setEditSupplierId={setEditSupplierId}
            editSupplierError={editSupplierError}
            editSupplierContact={editSupplierContact}
            setEditSupplierContact={setEditSupplierContact}
            editSupplierName={editSupplierName}
            setEditSupplierName={setEditSupplierName}
            handleUpdateSupplier={handleUpdateSupplier}
          />

          <DeleteSupplierModal
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            deleteSupplierId={deleteSupplierId}
            setDeleteSupplierId={setDeleteSupplierId}
            deleteSupplierInfo={deleteSupplierInfo}
            setDeleteSupplierInfo={setDeleteSupplierInfo}
            deleteLoading={deleteLoading}
            handleDeleteSupplier={handleDeleteSupplier}
          />
        </div>

        <SuppliersTable
          currentSuppliers={currentSuppliers}
          handleViewSupplier={handleViewSupplier}
          handleOpenEditModal={handleOpenEditModal}
          handleOpenDeleteModal={handleOpenDeleteModal}
          indexOfFirstSupplier={indexOfFirstSupplier}
          indexOfLastSupplier={indexOfLastSupplier}
          Suppliers={Suppliers}
          currentPage={currentPage}
          prevPage={prevPage}
          nextPage={nextPage}
          SuppliersPerPage={SuppliersPerPage}
        />
      </div>
    </div>
  );
};

export default Suppliers;
