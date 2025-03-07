import { fetchData, postData, putData, deleteData } from "@/lib/api"
import type {
  CustomerResponse,
  CustomerCreate,
  CustomerUpdate,
  CustomerOrderHistory,
  CustomerValueAnalysis,
} from "@/lib/types"

const CUSTOMERS_ENDPOINT = "/customers"

export const getCustomers = async (search?: string, vipOnly?: boolean): Promise<CustomerResponse[]> => {
  let endpoint = CUSTOMERS_ENDPOINT
  const params = new URLSearchParams()

  if (search) params.append("search", search)
  if (vipOnly) params.append("vip_only", "true")

  const queryString = params.toString()
  if (queryString) endpoint = `${endpoint}?${queryString}`

  return fetchData<CustomerResponse[]>(endpoint)
}

export const getVipCustomers = async (): Promise<CustomerValueAnalysis[]> => {
  return fetchData<CustomerValueAnalysis[]>(`${CUSTOMERS_ENDPOINT}/vip`)
}

export const getCustomer = async (customerId: number): Promise<CustomerResponse> => {
  return fetchData<CustomerResponse>(`${CUSTOMERS_ENDPOINT}/${customerId}`)
}

export const getCustomerOrders = async (customerId: number): Promise<CustomerOrderHistory[]> => {
  return fetchData<CustomerOrderHistory[]>(`${CUSTOMERS_ENDPOINT}/${customerId}/orders`)
}

export const createCustomer = async (customer: CustomerCreate): Promise<CustomerResponse> => {
  return postData<CustomerResponse>(CUSTOMERS_ENDPOINT, customer)
}

export const updateCustomer = async (customerId: number, customer: CustomerUpdate): Promise<CustomerResponse> => {
  return putData<CustomerResponse>(`${CUSTOMERS_ENDPOINT}/${customerId}`, customer)
}

export const deleteCustomer = async (customerId: number): Promise<void> => {
  return deleteData(`${CUSTOMERS_ENDPOINT}/${customerId}`)
}

