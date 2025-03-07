import { fetchData, postData, putData, deleteData } from "@/lib/api"
import type { ProductResponse, ProductCreate, ProductUpdate } from "@/lib/types"

const PRODUCTS_ENDPOINT = "/products"

export const getProducts = async (search?: string): Promise<ProductResponse[]> => {
  const endpoint = search ? `${PRODUCTS_ENDPOINT}?search=${encodeURIComponent(search)}` : PRODUCTS_ENDPOINT
  return fetchData<ProductResponse[]>(endpoint)
}

export const getProduct = async (productId: number): Promise<ProductResponse> => {
  return fetchData<ProductResponse>(`${PRODUCTS_ENDPOINT}/${productId}`)
}

export const createProduct = async (product: ProductCreate): Promise<ProductResponse> => {
  return postData<ProductResponse>(PRODUCTS_ENDPOINT, product)
}

export const updateProduct = async (productId: number, product: ProductUpdate): Promise<ProductResponse> => {
  return putData<ProductResponse>(`${PRODUCTS_ENDPOINT}/${productId}`, product)
}

export const deleteProduct = async (productId: number): Promise<void> => {
  return deleteData(`${PRODUCTS_ENDPOINT}/${productId}`)
}

