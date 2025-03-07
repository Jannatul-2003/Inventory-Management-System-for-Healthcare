import { fetchData } from "@/lib/api"
import type {
  SalesAnalytics,
  ProductAnalytics,
  CustomerAnalytics,
  SupplierAnalytics,
  TrendAnalytics,
} from "@/lib/types"

const ANALYTICS_ENDPOINT = "/analytics"

export const getSalesAnalytics = async (startDate?: string, endDate?: string): Promise<SalesAnalytics[]> => {
  let endpoint = `${ANALYTICS_ENDPOINT}/sales`

  if (startDate || endDate) {
    const params = new URLSearchParams()
    if (startDate) params.append("start_date", startDate)
    if (endDate) params.append("end_date", endDate)
    endpoint = `${endpoint}?${params.toString()}`
  }

  return fetchData<SalesAnalytics[]>(endpoint)
}

export const getProductAnalytics = async (): Promise<ProductAnalytics[]> => {
  return fetchData<ProductAnalytics[]>(`${ANALYTICS_ENDPOINT}/products`)
}

export const getCustomerAnalytics = async (): Promise<CustomerAnalytics[]> => {
  return fetchData<CustomerAnalytics[]>(`${ANALYTICS_ENDPOINT}/customers`)
}

export const getSupplierAnalytics = async (): Promise<SupplierAnalytics[]> => {
  return fetchData<SupplierAnalytics[]>(`${ANALYTICS_ENDPOINT}/suppliers`)
}

export const getTrendAnalytics = async (): Promise<TrendAnalytics[]> => {
  return fetchData<TrendAnalytics[]>(`${ANALYTICS_ENDPOINT}/trends`)
}

// Helper function to fetch all analytics data at once
export const fetchAnalyticsData = async () => {
  try {
    const [sales, products, customers, suppliers, trends] = await Promise.all([
      getSalesAnalytics(),
      getProductAnalytics(),
      getCustomerAnalytics(),
      getSupplierAnalytics(),
      getTrendAnalytics(),
    ])

    return {
      sales,
      products,
      customers,
      suppliers,
      trends,
    }
  } catch (error) {
    console.error("Failed to fetch analytics data:", error)
    throw error
  }
}

