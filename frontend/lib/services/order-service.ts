import { fetchData, postData, putData, deleteData } from "@/lib/api"
import type {
  OrderResponse,
  OrderCreate,
  OrderUpdate,
  OrderSummary,
  OrderStatusSummary,
  OrderDetail,
} from "@/lib/types"

const ORDERS_ENDPOINT = "/orders"

export const getOrders = async (
  startDate?: string,
  endDate?: string,
  customerId?: number,
  supplierId?: number,
): Promise<OrderResponse[]> => {
  let endpoint = ORDERS_ENDPOINT
  const params = new URLSearchParams()

  if (startDate) params.append("start_date", startDate)
  if (endDate) params.append("end_date", endDate)
  if (customerId) params.append("customer_id", customerId.toString())
  if (supplierId) params.append("supplier_id", supplierId.toString())

  const queryString = params.toString()
  if (queryString) endpoint = `${endpoint}?${queryString}`

  return fetchData<OrderResponse[]>(endpoint)
}

export const getOrderSummary = async (): Promise<OrderSummary[]> => {
  return fetchData<OrderSummary[]>(`${ORDERS_ENDPOINT}/summary`)
}

export const getOrderStatus = async (): Promise<OrderStatusSummary[]> => {
  return fetchData<OrderStatusSummary[]>(`${ORDERS_ENDPOINT}/status`)
}

export const getOrder = async (orderId: number): Promise<OrderResponse> => {
  return fetchData<OrderResponse>(`${ORDERS_ENDPOINT}/${orderId}`)
}

export const getOrderDetails = async (orderId: number): Promise<OrderDetail[]> => {
  return fetchData<OrderDetail[]>(`${ORDERS_ENDPOINT}/${orderId}/details`)
}

export const createOrder = async (order: OrderCreate): Promise<OrderResponse> => {
  return postData<OrderResponse>(ORDERS_ENDPOINT, order)
}

export const updateOrder = async (orderId: number, order: OrderUpdate): Promise<OrderResponse> => {
  return putData<OrderResponse>(`${ORDERS_ENDPOINT}/${orderId}`, order)
}

export const deleteOrder = async (orderId: number): Promise<void> => {
  return deleteData(`${ORDERS_ENDPOINT}/${orderId}`)
}

