"use client"

import React from "react"
import { useState, useEffect } from "react"
import type { CustomerCreate, CustomerResponse } from "../../types/index.ts"
import { fetchData } from "../../services/api.ts"
import { X } from "lucide-react"

interface CustomerFormProps {
  viewMode: "create" | "edit"
  selectedCustomerId: number | null
  handleBackToList: () => void
  onSubmit: (customerData: CustomerCreate) => Promise<void>
}

const CustomerForm: React.FC<CustomerFormProps> = ({ viewMode, selectedCustomerId, handleBackToList, onSubmit }) => {
  const [formData, setFormData] = useState<CustomerCreate>({
    name: "",
    contact_info: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch customer data for edit mode
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (selectedCustomerId && viewMode === "edit") {
        try {
          setLoading(true)
          const endpoint = `/customers/${selectedCustomerId}`
          const data = await fetchData<CustomerResponse>(endpoint)
          setFormData({
            name: data.name,
            contact_info: data.contact_info || null,
          })
          setError(null)
        } catch (err) {
          setError("Failed to fetch customer details")
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchCustomerDetails()
  }, [selectedCustomerId, viewMode])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }))
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError("Customer name is required")
      return
    }

    try {
      await onSubmit(formData)
      handleBackToList()
    } catch (err) {
      setError(`Failed to ${viewMode === "create" ? "create" : "update"} customer. Please try again.`)
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-body flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card bg-red-100 p-4 text-red-800">
        <div className="font-semibold">Error</div>
        <div>{error}</div>
        <button className="btn btn-secondary mt-5" onClick={handleBackToList}>
          Back to Customers
        </button>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">{viewMode === "create" ? "Create New Customer" : "Edit Customer"}</h1>
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
            <button type="button" className="btn btn-secondary mr-3" onClick={handleBackToList}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!formData.name.trim()}>
              {viewMode === "create" ? "Create Customer" : "Update Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerForm

