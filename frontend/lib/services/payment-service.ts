// import { fetchData, postData } from "@/lib/api"
// import type { PaymentResponse, PaymentCreate, PaymentAnalysis } from "@/lib/types"

// const PAYMENTS_ENDPOINT = "/payments"

// export const getPayments = async (startDate?: string, endDate?: string): Promise<PaymentResponse[]> => {
//   let endpoint = PAYMENTS_ENDPOINT

//   if (startDate || endDate) {
//     const params = new URLSearchParams()
//     if (startDate) params.append("start_date", startDate)
//     if (endDate) params.append("end_date", endDate)
//     endpoint = `${endpoint}?${params.toString()}`
//   }

//   return fetchData<PaymentResponse[]>(endpoint)
// }

// export const getPaymentAnalysis = async (): Promise<PaymentAnalysis[]> => {
//   return fetchData<PaymentAnalysis[]>(`${PAYMENTS_ENDPOINT}/analysis`)
// }

// export const getPayment = async (paymentId: number): Promise<PaymentResponse> => {
//   return fetchData<PaymentResponse>(`${PAYMENTS_ENDPOINT}/${paymentId}`)
// }

// export const createPayment = async (payment: PaymentCreate): Promise<PaymentResponse> => {
//   return postData<PaymentResponse>(PAYMENTS_ENDPOINT, payment)
// }
import { fetchData, postData } from "@/lib/api"
import type { PaymentResponse, PaymentCreate, PaymentAnalysis } from "@/lib/types"

const PAYMENTS_ENDPOINT = "/payments"

export const getPayments = async (startDate?: string, endDate?: string): Promise<PaymentResponse[]> => {
  let endpoint = PAYMENTS_ENDPOINT

  if (startDate || endDate) {
    const params = new URLSearchParams()
    if (startDate) params.append("start_date", startDate)
    if (endDate) params.append("end_date", endDate)
    endpoint = `${endpoint}?${params.toString()}`
  }

  return fetchData<PaymentResponse[]>(endpoint)
}

export const getPaymentAnalysis = async (): Promise<PaymentAnalysis[]> => {
  return fetchData<PaymentAnalysis[]>(`${PAYMENTS_ENDPOINT}/analysis`)
}

export const getPayment = async (paymentId: number): Promise<PaymentResponse> => {
  return fetchData<PaymentResponse>(`${PAYMENTS_ENDPOINT}/${paymentId}`)
}

export const createPayment = async (payment: PaymentCreate): Promise<PaymentResponse> => {
  return postData<PaymentResponse>(PAYMENTS_ENDPOINT, payment)
}


