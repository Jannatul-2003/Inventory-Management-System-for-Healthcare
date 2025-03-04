// Types based on your schemas
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

export interface OrderCreate {
  order_date: string
  supplier_id: number
  customer_id: number
  details: OrderDetailBase[]
}

export interface OrderDetailBase {
  product_id: number
  quantity: number
}

export interface OrderUpdate {
  order_date?: string
  supplier_id?: number
  details?: OrderDetailBase[]
}

export interface OrderDetail {
  order_detail_id: number
  product_name: string
  unit_price: number
  quantity: number
  total_price: number
}

export interface InventoryResponse {
  inventory_id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  status: string;
}

export interface ProductResponse {
  product_id: number;
  name: string;
  description: string | null;
  price: number;
  current_stock: number;
  stock_status: string;
}

export interface CustomerResponse {
  customer_id: number;
  name: string;
  contact_info: string | null;
  total_orders: number;
  total_spent: number;
}

export interface SupplierResponse {
  supplier_id: number;
  name: string;
  contact_info: string | null;
  total_orders: number;
  avg_delivery_days: number;
}

export interface ShipmentResponse {
  shipment_id: number;
  order_id: number;
  shipment_date: string;
  order_date: string;
  delivery_days: number;
  details: {
    product_id: number;
    product_name: string;
    quantity: number;
  }[];
}


export interface DashboardOverview {
  monthly_orders: number;
  monthly_revenue: number;
  active_customers: number;
  low_stock_items: number;
}

export interface MonthlyMetrics {
  month: string;
  total_orders: number;
  total_revenue: number;
  unique_customers: number;
}

export interface TopProducts {
  product_id: number;
  name: string;
  total_sold: number;
  total_revenue: number;
}
export interface TopCustomers {
  customer_id: number;
  name: string;
  total_orders: number;
  total_spent: number;
}

export interface SalesAnalytics {
  sale_date: string;
  orders: number;
  customers: number;
  units_sold: number;
  revenue: number;
  prev_revenue: number | null;
  growth_rate: number | null;
}

export interface ProductAnalytics {
  product_id: number;
  name: string;
  order_count: number;
  total_units: number;
  total_revenue: number;
  avg_order_size: number;
  current_stock: number;
  monthly_velocity: number;
}
