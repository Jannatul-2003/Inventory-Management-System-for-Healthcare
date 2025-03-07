import { fetchData } from "@/lib/api"
import type { DashboardOverview, MonthlyMetrics, TopProducts, TopCustomers } from "@/lib/types"

const DASHBOARD_ENDPOINT = "/dashboard"

export const getOverview = async (): Promise<DashboardOverview> => {
  return fetchData<DashboardOverview>(`${DASHBOARD_ENDPOINT}/overview`)
}

export const getMonthlyMetrics = async (): Promise<MonthlyMetrics[]> => {
  return fetchData<MonthlyMetrics[]>(`${DASHBOARD_ENDPOINT}/monthly`)
}

export const getTopProducts = async (): Promise<TopProducts[]> => {
  return fetchData<TopProducts[]>(`${DASHBOARD_ENDPOINT}/top-products`)
}

export const getTopCustomers = async (): Promise<TopCustomers[]> => {
  return fetchData<TopCustomers[]>(`${DASHBOARD_ENDPOINT}/top-customers`)
}

