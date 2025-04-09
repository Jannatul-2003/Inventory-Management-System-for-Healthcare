"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { getCustomer, getCustomerOrders } from "@/lib/services/customer-service"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import type { CustomerOrderHistory } from "@/lib/types"
import React from "react"

export default function CustomerOrdersPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState({ name: "", contact_info: "" })
  const [orders, setOrders] = useState<CustomerOrderHistory[]>([])
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)

  const customerId = Number(params.id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [customerData, ordersData] = await Promise.all([
          getCustomer(customerId),
          getCustomerOrders(customerId)
        ])
        
        setCustomer({
          name: customerData.name,
          contact_info: customerData.contact_info || "No contact information provided"
        })
        setOrders(ordersData)
      } catch (error) {
        console.error("Failed to fetch customer data:", error)
        toast({
          title: "Error",
          description: "Failed to load customer orders. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (customerId) {
      fetchData()
    }
  }, [customerId, toast])

  const toggleOrderDetails = (orderId: number) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <DashboardNav />
          <main className="flex w-full flex-col overflow-hidden">
            <div className="flex justify-center items-center h-64">
              <p>Loading customer orders...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <DashboardNav />
        <main className="flex w-full flex-col overflow-hidden">
          <DashboardShell>
            <div className="flex items-center">
              <Link href={`/customers/${customerId}`}>
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{customer.name}'s Orders</h1>
                <p className="text-muted-foreground">View order history and details</p>
              </div>
            </div>
          </DashboardShell>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                {orders.length > 0 
                  ? `Showing all orders for ${customer.name}`
                  : `No orders found for ${customer.name}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <React.Fragment key={order.order_id}>
                          <TableRow>
                            <TableCell className="font-medium">#{order.order_id}</TableCell>
                            <TableCell>{formatDate(order.order_date)}</TableCell>
                            <TableCell className="text-right">{order.total_price}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => toggleOrderDetails(order.order_id)}
                              >
                                {expandedOrder === order.order_id ? "Hide Details" : "View Details"}
                              </Button>
                            </TableCell>
                          </TableRow>

                          {expandedOrder === order.order_id && (
                            <TableRow>
                              <TableCell colSpan={5} className="bg-muted/50">
                                <div className="py-2">
                                  <h4 className="font-medium mb-2">Order Items</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-right">Unit Price</TableHead>
                                        <TableHead className="text-right">Quantity</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {orders.map((item) => (
                                        <TableRow key={item.product_name}>
                                          <TableCell>{item.product_name}</TableCell>
                                          <TableCell className="text-right">{item.unit_price}</TableCell>
                                          <TableCell className="text-right">{item.quantity}</TableCell>
                                          <TableCell className="text-right">{item.total_price}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex justify-center items-center py-8">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">This customer has not placed any orders yet.</p>
                    <Button variant="outline" asChild>
                      <Link href="/orders/new">Create New Order</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}