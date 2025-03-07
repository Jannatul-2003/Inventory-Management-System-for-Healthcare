import { fetchData, postData, putData, deleteData } from "@/lib/api"
import type { SupplierResponse, SupplierCreate, SupplierUpdate, SupplierPerformance } from "@/lib/types"

const SUPPLIERS_ENDPOINT = "/suppliers"

export const getSuppliers = async (search?: string): Promise<SupplierResponse[]> => {
  let endpoint = SUPPLIERS_ENDPOINT

  if (search) {
    endpoint = `${endpoint}?search=${encodeURIComponent(search)}`
  }

  return fetchData<SupplierResponse[]>(endpoint)
}

export const getSupplierPerformance = async (): Promise<SupplierPerformance[]> => {
  return fetchData<SupplierPerformance[]>(`${SUPPLIERS_ENDPOINT}/performance`)
}

export const getSupplier = async (supplierId: number): Promise<SupplierResponse> => {
  return fetchData<SupplierResponse>(`${SUPPLIERS_ENDPOINT}/${supplierId}`)
}

export const createSupplier = async (supplier: SupplierCreate): Promise<SupplierResponse> => {
  return postData<SupplierResponse>(SUPPLIERS_ENDPOINT, supplier)
}

export const updateSupplier = async (supplierId: number, supplier: SupplierUpdate): Promise<SupplierResponse> => {
  return putData<SupplierResponse>(`${SUPPLIERS_ENDPOINT}/${supplierId}`, supplier)
}

export const deleteSupplier = async (supplierId: number): Promise<void> => {
  return deleteData(`${SUPPLIERS_ENDPOINT}/${supplierId}`)
}

