// "use client"

// import { useState, useEffect } from "react"
// import { DashboardHeader } from "@/components/dashboard-header"
// import { DashboardNav } from "@/components/dashboard-nav"
// import { DashboardShell } from "@/components/dashboard-shell"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { useToast } from "@/components/ui/use-toast"
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts"

// import { fetchAnalyticsData } from "@/lib/services/analytics-servicee"

// export default function AnalyticsPage() {
//   const { toast } = useToast()
//   const [loading, setLoading] = useState(true)
//   const [salesData, setSalesData] = useState([])
//   const [productData, setProductData] = useState([])
//   const [customerData, setCustomerData] = useState([])
//   const [supplierData, setSupplierData] = useState([])
//   const [trendData, setTrendData] = useState([])

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const data = await fetchAnalyticsData()

//         setSalesData(data.sales || [])
//         setProductData(data.products || [])
//         setCustomerData(data.customers || [])
//         setSupplierData(data.suppliers || [])
//         setTrendData(data.trends || [])
//       } catch (error) {
//         console.error("Failed to fetch analytics data:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load analytics data. Please try again.",
//           variant: "destructive",
//         })
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [toast])

//   // Colors for pie charts
//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

//   return (
//     <div className="flex min-h-screen flex-col">
//       <DashboardHeader />
//       <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
//         <DashboardNav />
//         <main className="flex w-full flex-col overflow-hidden">
//           <DashboardShell>
//             <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
//             <p className="text-muted-foreground">Comprehensive analytics and insights for your inventory system</p>
//           </DashboardShell>

//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <p>Loading analytics data...</p>
//             </div>
//           ) : (
//             <Tabs defaultValue="sales" className="w-full">
//               <TabsList className="grid w-full grid-cols-5">
//                 <TabsTrigger value="sales">Sales</TabsTrigger>
//                 <TabsTrigger value="products">Products</TabsTrigger>
//                 <TabsTrigger value="customers">Customers</TabsTrigger>
//                 <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
//                 <TabsTrigger value="trends">Trends</TabsTrigger>
//               </TabsList>

//               {/* Sales Analytics Tab */}
//               <TabsContent value="sales" className="space-y-4">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Sales Performance</CardTitle>
//                     <CardDescription>Monthly sales revenue and growth</CardDescription>
//                   </CardHeader>
//                   <CardContent className="h-[400px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="sale_date" />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
//                         <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Revenue Growth</CardTitle>
//                       <CardDescription>Month-over-month revenue growth</CardDescription>
//                     </CardHeader>
//                     <CardContent className="h-[300px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="sale_date" />
//                           <YAxis />
//                           <Tooltip />
//                           <Legend />
//                           <Line type="monotone" dataKey="growth_rate" stroke="#8884d8" name="Growth Rate (%)" />
//                         </LineChart>
//                       </ResponsiveContainer>
//                     </CardContent>
//                   </Card>

//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Orders vs Customers</CardTitle>
//                       <CardDescription>Relationship between orders and unique customers</CardDescription>
//                     </CardHeader>
//                     <CardContent className="h-[300px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="sale_date" />
//                           <YAxis />
//                           <Tooltip />
//                           <Legend />
//                           <Bar dataKey="orders" fill="#8884d8" name="Orders" />
//                           <Bar dataKey="customers" fill="#82ca9d" name="Customers" />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </TabsContent>

//               {/* Products Analytics Tab */}
//               <TabsContent value="products" className="space-y-4">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Product Performance</CardTitle>
//                     <CardDescription>Revenue by product</CardDescription>
//                   </CardHeader>
//                   <CardContent className="h-[400px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart
//                         data={productData}
//                         margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                         layout="vertical"
//                       >
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis type="number" />
//                         <YAxis dataKey="name" type="category" width={150} />
//                         <Tooltip />
//                         <Legend />
//                         <Bar dataKey="total_revenue" fill="#8884d8" name="Revenue" />
//                         <Bar dataKey="total_units" fill="#82ca9d" name="Units Sold" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Stock vs Velocity</CardTitle>
//                       <CardDescription>Current stock vs monthly sales velocity</CardDescription>
//                     </CardHeader>
//                     <CardContent className="h-[300px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <BarChart data={productData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="name" />
//                           <YAxis />
//                           <Tooltip />
//                           <Legend />
//                           <Bar dataKey="current_stock" fill="#8884d8" name="Current Stock" />
//                           <Bar dataKey="monthly_velocity" fill="#82ca9d" name="Monthly Velocity" />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </CardContent>
//                   </Card>

//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Revenue Distribution</CardTitle>
//                       <CardDescription>Revenue share by product</CardDescription>
//                     </CardHeader>
//                     <CardContent className="h-[300px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                           <Pie
//                             data={productData}
//                             cx="50%"
//                             cy="50%"
//                             labelLine={false}
//                             outerRadius={80}
//                             fill="#8884d8"
//                             dataKey="total_revenue"
//                             nameKey="name"
//                             label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                           >
//                             {productData.map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                             ))}
//                           </Pie>
//                           <Tooltip />
//                           <Legend />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </TabsContent>

//               {/* Customers Analytics Tab */}
//               <TabsContent value="customers" className="space-y-4">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Customer Spending</CardTitle>
//                     <CardDescription>Total spent by top customers</CardDescription>
//                   </CardHeader>
//                   <CardContent className="h-[400px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart
//                         data={customerData}
//                         margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                         layout="vertical"
//                       >
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis type="number" />
//                         <YAxis dataKey="name" type="category" width={150} />
//                         <Tooltip />
//                         <Legend />
//                         <Bar dataKey="total_spent" fill="#8884d8" name="Total Spent" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Order Frequency</CardTitle>
//                       <CardDescription>Number of orders by customer</CardDescription>
//                     </CardHeader>
//                     <CardContent className="h-[300px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <BarChart data={customerData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="name" />
//                           <YAxis />
//                           <Tooltip />
//                           <Legend />
//                           <Bar dataKey="total_orders" fill="#8884d8" name="Total Orders" />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </CardContent>
//                   </Card>

//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Average Order Value</CardTitle>
//                       <CardDescription>Average spending per order by customer</CardDescription>
//                     </CardHeader>
//                     <CardContent className="h-[300px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <BarChart data={customerData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="name" />
//                           <YAxis />
//                           <Tooltip />
//                           <Legend />
//                           <Bar dataKey="avg_order_value" fill="#82ca9d" name="Avg Order Value" />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </TabsContent>

//               {/* Suppliers Analytics Tab */}
//               <TabsContent value="suppliers" className="space-y-4">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Supplier Performance</CardTitle>
//                     <CardDescription>Order value and delivery metrics by supplier</CardDescription>
//                   </CardHeader>
//                   <CardContent className="h-[400px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={supplierData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Bar dataKey="total_value" fill="#8884d8" name="Total Value" />
//                         <Bar dataKey="total_orders" fill="#82ca9d" name="Total Orders" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Delivery Performance</CardTitle>
//                       <CardDescription>Average delivery days by supplier</CardDescription>
//                     </CardHeader>
//                     <CardContent className="h-[300px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <BarChart data={supplierData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="name" />
//                           <YAxis />
//                           <Tooltip />
//                           <Legend />
//                           <Bar dataKey="avg_delivery_days" fill="#8884d8" name="Avg Delivery Days" />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </CardContent>
//                   </Card>

//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Order Value Distribution</CardTitle>
//                       <CardDescription>Total order value by supplier</CardDescription>
//                     </CardHeader>
//                     <CardContent className="h-[300px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                           <Pie
//                             data={supplierData}
//                             cx="50%"
//                             cy="50%"
//                             labelLine={false}
//                             outerRadius={80}
//                             fill="#8884d8"
//                             dataKey="total_value"
//                             nameKey="name"
//                             label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                           >
//                             {supplierData.map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                             ))}
//                           </Pie>
//                           <Tooltip />
//                           <Legend />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </TabsContent>

//               {/* Trends Analytics Tab */}
//               <TabsContent value="trends" className="space-y-4">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Revenue Trends</CardTitle>
//                     <CardDescription>Monthly revenue and growth trends</CardDescription>
//                   </CardHeader>
//                   <CardContent className="h-[400px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="month" />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
//                         <Line type="monotone" dataKey="revenue_growth" stroke="#82ca9d" name="Growth %" />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Order Metrics</CardTitle>
//                       <CardDescription>Orders and average order value trends</CardDescription>
//                     </CardHeader>
//                     <CardContent className="h-[300px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="month" />
//                           <YAxis />
//                           <Tooltip />
//                           <Legend />
//                           <Line type="monotone" dataKey="orders" stroke="#8884d8" name="Orders" />
//                           <Line type="monotone" dataKey="avg_order_value" stroke="#82ca9d" name="Avg Order Value" />
//                         </LineChart>
//                       </ResponsiveContainer>
//                     </CardContent>
//                   </Card>

//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Customer Activity</CardTitle>
//                       <CardDescription>Customer and product diversity trends</CardDescription>
//                     </CardHeader>
//                     <CardContent className="h-[300px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="month" />
//                           <YAxis />
//                           <Tooltip />
//                           <Legend />
//                           <Line type="monotone" dataKey="customers" stroke="#8884d8" name="Customers" />
//                           <Line type="monotone" dataKey="unique_products" stroke="#82ca9d" name="Unique Products" />
//                         </LineChart>
//                       </ResponsiveContainer>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           )}
//         </main>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { fetchAnalyticsData } from "@/lib/services/analytics-servicee"
import {
  type SalesAnalytics,
  type ProductAnalytics,
  type CustomerAnalytics,
  type SupplierAnalytics,
  type TrendAnalytics,
} from "@/lib/types"

export default function AnalyticsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [salesData, setSalesData] = useState<SalesAnalytics[]>([])
  const [productData, setProductData] = useState<ProductAnalytics[]>([])
  const [customerData, setCustomerData] = useState<CustomerAnalytics[]>([])
  const [supplierData, setSupplierData] = useState<SupplierAnalytics[]>([])
  const [trendData, setTrendData] = useState<TrendAnalytics[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await fetchAnalyticsData()

        setSalesData(data.sales || [])
        setProductData(data.products || [])
        setCustomerData(data.customers || [])
        setSupplierData(data.suppliers || [])
        setTrendData(data.trends || [])
      } catch (error) {
        console.error("Failed to fetch analytics data:", error)
        toast({
          title: "Error",
          description: "Failed to load analytics data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Colors for pie charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <DashboardNav />
        <main className="flex w-full flex-col overflow-hidden">
          <DashboardShell>
            <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive analytics and insights for your inventory system</p>
          </DashboardShell>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading analytics data...</p>
            </div>
          ) : (
            <Tabs defaultValue="sales" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>

              {/* Sales Analytics Tab */}
              <TabsContent value="sales" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Performance</CardTitle>
                    <CardDescription>Monthly sales revenue and growth</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="sale_date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                        <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Growth</CardTitle>
                      <CardDescription>Month-over-month revenue growth</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="sale_date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="growth_rate" stroke="#8884d8" name="Growth Rate (%)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Orders vs Customers</CardTitle>
                      <CardDescription>Relationship between orders and unique customers</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="sale_date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="orders" fill="#8884d8" name="Orders" />
                          <Bar dataKey="customers" fill="#82ca9d" name="Customers" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Products Analytics Tab */}
              <TabsContent value="products" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Performance</CardTitle>
                    <CardDescription>Revenue by product</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={productData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total_revenue" fill="#8884d8" name="Revenue" />
                        <Bar dataKey="total_units" fill="#82ca9d" name="Units Sold" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Stock vs Velocity</CardTitle>
                      <CardDescription>Current stock vs monthly sales velocity</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="current_stock" fill="#8884d8" name="Current Stock" />
                          <Bar dataKey="monthly_velocity" fill="#82ca9d" name="Monthly Velocity" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Distribution</CardTitle>
                      <CardDescription>Revenue share by product</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={productData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="total_revenue"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {productData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Customers Analytics Tab */}
              <TabsContent value="customers" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Spending</CardTitle>
                    <CardDescription>Total spent by top customers</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={customerData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total_spent" fill="#8884d8" name="Total Spent" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Frequency</CardTitle>
                      <CardDescription>Number of orders by customer</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={customerData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="total_orders" fill="#8884d8" name="Total Orders" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Average Order Value</CardTitle>
                      <CardDescription>Average spending per order by customer</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={customerData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="avg_order_value" fill="#82ca9d" name="Avg Order Value" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Suppliers Analytics Tab */}
              <TabsContent value="suppliers" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Supplier Performance</CardTitle>
                    <CardDescription>Order value and delivery metrics by supplier</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={supplierData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total_value" fill="#8884d8" name="Total Value" />
                        <Bar dataKey="total_orders" fill="#82ca9d" name="Total Orders" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Delivery Performance</CardTitle>
                      <CardDescription>Average delivery days by supplier</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={supplierData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="avg_delivery_days" fill="#8884d8" name="Avg Delivery Days" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Order Value Distribution</CardTitle>
                      <CardDescription>Total order value by supplier</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={supplierData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="total_value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {supplierData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Trends Analytics Tab */}
              <TabsContent value="trends" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                    <CardDescription>Monthly revenue and growth trends</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                        <Line type="monotone" dataKey="revenue_growth" stroke="#82ca9d" name="Growth %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Metrics</CardTitle>
                      <CardDescription>Orders and average order value trends</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="orders" stroke="#8884d8" name="Orders" />
                          <Line type="monotone" dataKey="avg_order_value" stroke="#82ca9d" name="Avg Order Value" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Activity</CardTitle>
                      <CardDescription>Customer and product diversity trends</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="customers" stroke="#8884d8" name="Customers" />
                          <Line type="monotone" dataKey="unique_products" stroke="#82ca9d" name="Unique Products" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  )
}

