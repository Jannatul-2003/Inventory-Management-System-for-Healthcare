// import { fetchData, putData } from "@/lib/api"
// import type { InventoryResponse, InventoryUpdate, StockAlert } from "@/lib/types"

// const INVENTORY_ENDPOINT = "/inventory"

// export const getInventory = async (lowStock?: boolean): Promise<InventoryResponse[]> => {
//   const endpoint = lowStock ? `${INVENTORY_ENDPOINT}?low_stock=true` : INVENTORY_ENDPOINT
//   return fetchData<InventoryResponse[]>(endpoint)
// }

// export const getStockAlerts = async (): Promise<StockAlert[]> => {
//   return fetchData<StockAlert[]>(`${INVENTORY_ENDPOINT}/alerts`)
// }

// export const getProductInventory = async (productId: number): Promise<InventoryResponse> => {
//   return fetchData<InventoryResponse>(`${INVENTORY_ENDPOINT}/${productId}`)
// }

// export const updateInventory = async (productId: number, quantity: number): Promise<InventoryResponse> => {
//   const inventoryUpdate: InventoryUpdate = { quantity }
//   return putData<InventoryResponse>(`${INVENTORY_ENDPOINT}/${productId}`, inventoryUpdate)
// }

import { fetchData, putData } from "@/lib/api"
import type { InventoryResponse, InventoryUpdate, StockAlert } from "@/lib/types"

const INVENTORY_ENDPOINT = "/inventory"

export const getInventory = async (lowStock?: boolean): Promise<InventoryResponse[]> => {
  const endpoint = lowStock ? `${INVENTORY_ENDPOINT}?low_stock=true` : INVENTORY_ENDPOINT
  return fetchData<InventoryResponse[]>(endpoint)
}

export const getStockAlerts = async (): Promise<StockAlert[]> => {
  return fetchData<StockAlert[]>(`${INVENTORY_ENDPOINT}/alerts`)
}

export const getProductInventory = async (productId: number): Promise<InventoryResponse> => {
  return fetchData<InventoryResponse>(`${INVENTORY_ENDPOINT}/${productId}`)
}

export const updateInventory = async (productId: number, quantity: number): Promise<InventoryResponse> => {
  const inventoryUpdate: InventoryUpdate = { quantity }
  return putData<InventoryResponse>(`${INVENTORY_ENDPOINT}/${productId}`, inventoryUpdate)
}

