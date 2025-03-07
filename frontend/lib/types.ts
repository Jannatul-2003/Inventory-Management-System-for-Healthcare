// // // Types for the API responses and requests

// // // Product types
// // export interface ProductResponse {
// //   product_id: number
// //   name: string
// //   description: string | null
// //   price: number
// //   current_stock: number
// //   stock_status: string
// // }

// // export interface ProductCreate {
// //   name: string
// //   description: string | null
// //   price: number
// // }

// // export interface ProductUpdate {
// //   name?: string
// //   description?: string | null
// //   price?: number
// // }

// // // Inventory types
// // export interface InventoryResponse {
// //   inventory_id: number
// //   product_id: number
// //   product_name: string
// //   price: number
// //   quantity: number
// //   status: string
// // }

// // export interface InventoryUpdate {
// //   quantity: number
// // }

// // export interface StockAlert {
// //   product_id: number
// //   product_name: string
// //   current_stock: number
// //   min_stock_level: number
// // }

// // // Payment types
// // export interface PaymentResponse {
// //   payment_id: number
// //   order_id: number
// //   payment_date: string
// //   amount: number
// //   payment_method: string
// //   status: string
// //   customer_name: string
// // }

// // export interface PaymentCreate {
// //   order_id: number
// //   payment_date: string
// //   amount: number
// //   payment_method: string
// // }

// // export interface PaymentAnalysis {
// //   month: string
// //   total_payments: number
// //   total_amount: number
// //   avg_payment: number
// // }

// // // Customer types
// // export interface CustomerResponse {
// //   customer_id: number
// //   name: string
// //   contact_info: string | null
// //   total_orders: number
// //   total_spent: number
// // }

// // export interface CustomerCreate {
// //   name: string
// //   contact_info?: string | null
// // }

// // export interface CustomerUpdate {
// //   name?: string
// //   contact_info?: string | null
// // }

// // export interface CustomerOrderHistory {
// //   order_id: number
// //   order_date: string
// //   product_name: string
// //   quantity: number
// //   unit_price: number
// //   total_price: number
// // }

// // export interface CustomerValueAnalysis {
// //   customer_id: number
// //   name: string
// //   total_orders: number
// //   total_spent: number
// // }

// // // Order types
// // export interface OrderDetailBase {
// //   product_id: number
// //   quantity: number
// // }

// // export interface OrderDetail extends OrderDetailBase {
// //   order_detail_id: number
// //   product_name: string
// //   unit_price: number
// //   total_price: number
// // }

// // export interface OrderCreate {
// //   order_date: string
// //   supplier_id: number
// //   customer_id: number
// //   details: OrderDetailBase[]
// // }

// // export interface OrderUpdate {
// //   order_date?: string
// //   supplier_id?: number
// //   details?: OrderDetailBase[]
// // }

// // export interface OrderResponse {
// //   order_id: number
// //   order_date: string
// //   supplier_id: number
// //   supplier_name: string
// //   customer_id: number
// //   customer_name: string
// //   total_items: number
// //   total_quantity: number
// //   total_amount: number
// //   amount_paid: number
// //   status: string
// // }

// // export interface OrderSummary {
// //   order_id: number
// //   order_date: string
// //   supplier_name: string
// //   customer_name: string
// //   total_amount: number
// // }

// // export interface OrderStatusSummary {
// //   order_id: number
// //   total_items: number
// //   total_quantity: number
// //   total_amount: number
// //   amount_paid: number
// //   status: string
// // }

// // // Supplier types
// // export interface SupplierResponse {
// //   supplier_id: number
// //   name: string
// //   contact_info: string | null
// //   total_orders: number
// //   avg_delivery_days: number
// // }

// // export interface SupplierCreate {
// //   name: string
// //   contact_info?: string | null
// // }

// // export interface SupplierUpdate {
// //   name?: string
// //   contact_info?: string | null
// // }

// // export interface SupplierPerformance {
// //   supplier_id: number
// //   name: string
// //   total_orders: number
// //   avg_delivery_days: number
// // }

// // Types for the API responses and requests

// // Dashboard types
// export interface DashboardOverview {
//   monthly_orders: number
//   monthly_revenue: number
//   active_customers: number
//   low_stock_items: number
// }

// export interface MonthlyMetrics {
//   month: string
//   total_orders: number
//   total_revenue: number
//   unique_customers: number
// }

// export interface TopProducts {
//   product_id: number
//   name: string
//   total_sold: number
//   total_revenue: number
// }

// export interface TopCustomers {
//   customer_id: number
//   name: string
//   total_orders: number
//   total_spent: number
// }

// // Product types
// export interface ProductBase {
//   name: string
//   description: string | null
//   price: number
// }

// export interface ProductCreate extends ProductBase {}

// export interface ProductUpdate {
//   name?: string
//   description?: string | null
//   price?: number
// }

// export interface ProductResponse extends ProductBase {
//   product_id: number
//   current_stock: number
//   stock_status: string
// }

// // Inventory types
// export interface InventoryUpdate {
//   quantity: number
// }

// export interface InventoryResponse {
//   inventory_id: number
//   product_id: number
//   product_name: string
//   price: number
//   quantity: number
//   status: string
// }

// export interface StockAlert {
//   product_id: number
//   name: string
//   description: string | null
//   price: number
// }

// // Payment types
// export interface PaymentBase {
//   order_id: number
//   payment_date: string
//   amount: number
// }

// export interface PaymentCreate extends PaymentBase {}

// export interface PaymentResponse extends PaymentBase {
//   payment_id: number
//   order_date: string
//   customer_name: string
// }

// export interface PaymentAnalysis {
//   date: string
//   period: string
//   total_payments: number
// }

// // Customer types
// export interface CustomerResponse {
//   customer_id: number
//   name: string
//   contact_info: string | null
//   total_orders: number
//   total_spent: number
// }

// export interface CustomerCreate {
//   name: string
//   contact_info?: string | null
// }

// export interface CustomerUpdate {
//   name?: string
//   contact_info?: string | null
// }

// export interface CustomerOrderHistory {
//   order_id: number
//   order_date: string
//   product_name: string
//   quantity: number
//   unit_price: number
//   total_price: number
// }

// export interface CustomerValueAnalysis {
//   customer_id: number
//   name: string
//   total_orders: number
//   total_spent: number
// }

// // Order types
// export interface OrderDetailBase {
//   product_id: number
//   quantity: number
// }

// export interface OrderDetail extends OrderDetailBase {
//   order_detail_id: number
//   product_name: string
//   unit_price: number
//   total_price: number
// }

// export interface OrderCreate {
//   order_date: string
//   supplier_id: number
//   customer_id: number
//   details: OrderDetailBase[]
// }

// export interface OrderUpdate {
//   order_date?: string
//   supplier_id?: number
//   details?: OrderDetailBase[]
// }

// export interface OrderResponse {
//   order_id: number
//   order_date: string
//   supplier_id: number
//   supplier_name: string
//   customer_id: number
//   customer_name: string
//   total_items: number
//   total_quantity: number
//   total_amount: number
//   amount_paid: number
//   status: string
// }

// export interface OrderSummary {
//   order_id: number
//   order_date: string
//   supplier_name: string
//   customer_name: string
//   total_amount: number
// }

// export interface OrderStatusSummary {
//   order_id: number
//   total_items: number
//   total_quantity: number
//   total_amount: number
//   amount_paid: number
//   status: string
// }

// // Supplier types
// export interface SupplierResponse {
//   supplier_id: number
//   name: string
//   contact_info: string | null
//   total_orders: number
//   avg_delivery_days: number
// }

// export interface SupplierCreate {
//   name: string
//   contact_info?: string | null
// }

// export interface SupplierUpdate {
//   name?: string
//   contact_info?: string | null
// }

// export interface SupplierPerformance {
//   supplier_id: number
//   name: string
//   total_orders: number
//   avg_delivery_days: number
// }

// Types for the API responses and requests

// Dashboard types
export interface DashboardOverview {
  monthly_orders: number
  monthly_revenue: number
  active_customers: number
  low_stock_items: number
}

export interface MonthlyMetrics {
  month: string
  total_orders: number
  total_revenue: number
  unique_customers: number
}

export interface TopProducts {
  product_id: number
  name: string
  total_sold: number
  total_revenue: number
}

export interface TopCustomers {
  customer_id: number
  name: string
  total_orders: number
  total_spent: number
}

// Product types
export interface ProductBase {
  name: string
  description: string | null
  price: number
}

export interface ProductCreate extends ProductBase {}

export interface ProductUpdate {
  name?: string
  description?: string | null
  price?: number
}

export interface ProductResponse extends ProductBase {
  product_id: number
  current_stock: number
  stock_status: string
}

// Inventory types
export interface InventoryUpdate {
  quantity: number
}

export interface InventoryResponse {
  inventory_id: number
  product_id: number
  product_name: string
  price: number
  quantity: number
  status: string
}

export interface StockAlert {
  product_id: number
  name: string
  description: string | null
  price: number
}

// Payment types
export interface PaymentBase {
  order_id: number
  payment_date: string
  amount: number
}

export interface PaymentCreate extends PaymentBase {}

export interface PaymentResponse extends PaymentBase {
  payment_id: number
  order_date: string
  customer_name: string
}

export interface PaymentAnalysis {
  date: string
  period: string
  total_payments: number
}

// Customer types
export interface CustomerResponse {
  customer_id: number
  name: string
  contact_info: string | null
  total_orders: number
  total_spent: number
}

export interface CustomerCreate {
  name: string
  contact_info?: string | null
}

export interface CustomerUpdate {
  name?: string
  contact_info?: string | null
}

export interface CustomerOrderHistory {
  order_id: number
  order_date: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface CustomerValueAnalysis {
  customer_id: number
  name: string
  total_orders: number
  total_spent: number
}

// Order types
export interface OrderDetailBase {
  product_id: number
  quantity: number
}

export interface OrderDetail extends OrderDetailBase {
  order_detail_id: number
  product_name: string
  unit_price: number
  total_price: number
}

export interface OrderCreate {
  order_date: string
  supplier_id: number
  customer_id: number
  details: OrderDetailBase[]
}

export interface OrderUpdate {
  order_date?: string
  supplier_id?: number
  details?: OrderDetailBase[]
}

export interface OrderResponse {
  order_id: number
  order_date: string
  supplier_id: number
  supplier_name: string
  customer_id: number
  customer_name: string
  total_items: number
  total_quantity: number
  total_amount: number
  amount_paid: number
  status: string
}

export interface OrderSummary {
  order_id: number
  order_date: string
  supplier_name: string
  customer_name: string
  total_amount: number
}

export interface OrderStatusSummary {
  order_id: number
  total_items: number
  total_quantity: number
  total_amount: number
  amount_paid: number
  status: string
}

// Supplier types
export interface SupplierResponse {
  supplier_id: number
  name: string
  contact_info: string | null
  total_orders: number
  avg_delivery_days: number
}

export interface SupplierCreate {
  name: string
  contact_info?: string | null
}

export interface SupplierUpdate {
  name?: string
  contact_info?: string | null
}

export interface SupplierPerformance {
  supplier_id: number
  name: string
  total_orders: number
  avg_delivery_days: number
}

// Analytics types
export interface SalesAnalytics {
  sale_date: string
  orders: number
  customers: number
  units_sold: number
  revenue: number
  prev_revenue?: number
  growth_rate?: number
}

export interface ProductAnalytics {
  product_id: number
  name: string
  order_count: number
  total_units: number
  total_revenue: number
  avg_order_size: number
  current_stock: number
  monthly_velocity: number
}

export interface CustomerAnalytics {
  customer_id: number
  name: string
  total_orders: number
  total_spent: number
  first_order: string
  last_order: string
  avg_order_value: number
  customer_lifetime_days: number
}

export interface SupplierAnalytics {
  supplier_id: number
  name: string
  total_orders: number
  total_units: number
  total_value: number
  avg_delivery_days: number
  avg_order_value: number
  performance_rating: string
}

export interface TrendAnalytics {
  month: string
  orders: number
  customers: number
  units: number
  revenue: number
  unique_products: number
  prev_revenue?: number
  revenue_growth?: number
  avg_order_value: number
  avg_units_per_order: number
}

// Shipment types
export interface ShipmentDetailBase {
  product_id: number
  quantity: number
}

export interface ShipmentDetail extends ShipmentDetailBase {
  product_name?: string
}

export interface ShipmentBase {
  order_id: number
  shipment_date: string
}

export interface ShipmentCreate extends ShipmentBase {
  details: ShipmentDetailBase[]
}

export interface ShipmentUpdate {
  shipment_date?: string
  details?: ShipmentDetailBase[]
}

export interface ShipmentResponse extends ShipmentBase {
  shipment_id: number
  order_date: string
  delivery_days: number
  details: ShipmentDetail[]
}

export interface LateShipment {
  order_id: number
  order_date: string
  shipment_id?: number
  shipment_date?: string
  delivery_days?: number
}


