
import { useState, useEffect } from "react"
import { fetchData, postData, putData, deleteData } from "../../../services/api.ts"
import type {
  CustomerResponse,
  CustomerValueAnalysis,
  CustomerOrderHistory,
  CustomerCreate,
  CustomerUpdate,
} from "../../../types/index.ts"

export const useCustomerData = (selectedCustomerId: number | null, viewMode: string) => {
  // State Management
  const [customers, setCustomers] = useState<CustomerResponse[]>([])
  const [vipCustomers, setVipCustomers] = useState<CustomerValueAnalysis[]>([])
  const [customerOrders, setCustomerOrders] = useState<CustomerOrderHistory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showVipOnly, setShowVipOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [customersPerPage] = useState(10)

  // Calculate total pages
  const totalPages = Math.ceil((showVipOnly ? vipCustomers.length : customers.length) / customersPerPage)

  // Fetch Customers
  useEffect(() => {
    const fetchCustomersData = async () => {
      try {
        setLoading(true)
        let endpoint = ""
        let data

        if (showVipOnly) {
          endpoint = "/customers/vip"
          data = await fetchData<CustomerValueAnalysis[]>(endpoint)
          setVipCustomers(data)
        } else if (searchTerm) {
          endpoint = `/customers/?search=${encodeURIComponent(searchTerm)}`
          data = await fetchData<CustomerResponse[]>(endpoint)
          setCustomers(data)
        } else {
          endpoint = "/customers/"
          data = await fetchData<CustomerResponse[]>(endpoint)
          setCustomers(data)
        }

        setError(null)
      } catch (err) {
        setError("Failed to fetch customer data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomersData()
  }, [searchTerm, showVipOnly])

  // Fetch Customer Orders when a customer is selected
  useEffect(() => {
    const fetchCustomerOrdersData = async () => {
      if (selectedCustomerId && viewMode === "orders") {
        try {
          setLoading(true)
          const endpoint = `/customers/${selectedCustomerId}/orders`
          const data = await fetchData<CustomerOrderHistory[]>(endpoint)
          setCustomerOrders(data)
          setError(null)
        } catch (err) {
          setError("Failed to fetch customer orders")
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchCustomerOrdersData()
  }, [selectedCustomerId, viewMode])

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [])

  // Reset pagination when toggling between regular and VIP customers
  useEffect(() => {
    setCurrentPage(1)
  }, [])

  // Function to fetch customer orders
  const fetchCustomerOrders = async (customerId: number) => {
    try {
      setLoading(true)
      const endpoint = `/customers/${customerId}/orders`
      const data = await fetchData<CustomerOrderHistory[]>(endpoint)
      setCustomerOrders(data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch customer orders")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Function to delete a customer
  const handleDeleteCustomer = async (customerId: number) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return

    try {
      setLoading(true)
      await deleteData(`/customers/${customerId}`)

      // Update the customer list after deletion
      if (showVipOnly) {
        const updatedVipList = await fetchData<CustomerValueAnalysis[]>("/customers/vip")
        setVipCustomers(updatedVipList)
      } else {
        const updatedList = await fetchData<CustomerResponse[]>("/customers/")
        setCustomers(updatedList)
      }

      setError(null)
    } catch (err) {
      setError("Failed to delete customer")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Function to create a new customer
  const createCustomer = async (customerData: CustomerCreate) => {
    try {
      setError(null)
      setLoading(true)

      await postData<CustomerResponse>("/customers/", customerData)

      // Refresh customer list with updated data
      if (showVipOnly) {
        const updatedVipList = await fetchData<CustomerValueAnalysis[]>("/customers/vip")
        setVipCustomers(updatedVipList)
      } else {
        const updatedList = await fetchData<CustomerResponse[]>("/customers/")
        setCustomers(updatedList)
      }
    } catch (err) {
      setError("Failed to create customer. Please try again.")
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Function to update an existing customer
  const updateCustomer = async (customerData: CustomerUpdate) => {
    if (!selectedCustomerId) return

    try {
      setError(null)
      setLoading(true)

      await putData<CustomerResponse>(`/customers/${selectedCustomerId}`, customerData)

      // Refresh customer list with updated data
      if (showVipOnly) {
        const updatedVipList = await fetchData<CustomerValueAnalysis[]>("/customers/vip")
        setVipCustomers(updatedVipList)
      } else {
        const updatedList = await fetchData<CustomerResponse[]>("/customers/")
        setCustomers(updatedList)
      }
    } catch (err) {
      setError("Failed to update customer. Please try again.")
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    customers,
    vipCustomers,
    customerOrders,
    searchTerm,
    setSearchTerm,
    showVipOnly,
    setShowVipOnly,
    loading,
    error,
    currentPage,
    setCurrentPage,
    customersPerPage,
    fetchCustomerOrders,
    handleDeleteCustomer,
    createCustomer,
    updateCustomer,
    totalPages,
  }
}

