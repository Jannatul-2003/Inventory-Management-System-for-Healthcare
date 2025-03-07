import { fetchData, postData, putData, deleteData } from "@/lib/api"
import type { ShipmentResponse, ShipmentCreate, ShipmentUpdate, LateShipment } from "@/lib/types"

const SHIPMENTS_ENDPOINT = "/shipments"

export const getShipments = async (lateOnly?: boolean): Promise<ShipmentResponse[]> => {
  const endpoint = lateOnly ? `${SHIPMENTS_ENDPOINT}?late_only=true` : SHIPMENTS_ENDPOINT
  return fetchData<ShipmentResponse[]>(endpoint)
}

export const getLateShipments = async (): Promise<LateShipment[]> => {
  return fetchData<LateShipment[]>(`${SHIPMENTS_ENDPOINT}/late`)
}

export const getShipment = async (shipmentId: number): Promise<ShipmentResponse> => {
  return fetchData<ShipmentResponse>(`${SHIPMENTS_ENDPOINT}/${shipmentId}`)
}

export const createShipment = async (shipment: ShipmentCreate): Promise<ShipmentResponse> => {
  return postData<ShipmentResponse>(SHIPMENTS_ENDPOINT, shipment)
}

export const updateShipment = async (shipmentId: number, shipment: ShipmentUpdate): Promise<ShipmentResponse> => {
  return putData<ShipmentResponse>(`${SHIPMENTS_ENDPOINT}/${shipmentId}`, shipment)
}

export const deleteShipment = async (shipmentId: number): Promise<void> => {
  return deleteData(`${SHIPMENTS_ENDPOINT}/${shipmentId}`)
}

