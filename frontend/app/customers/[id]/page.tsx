"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, User } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { getCustomer, getCustomerOrders, deleteCustomer } from "@/lib/services/customer-service"
import type { CustomerResponse, CustomerOrderHistory } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [customer, setCustomer] = useState<CustomerResponse | null>(null)
  const [orders, setOrders] = useState<CustomerOrderHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const customerId = Number(params.id)

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true)
        const customerData = await getCustomer(customerId)
        setCustomer(customerData)

        try {
          const ordersData = await getCustomerOrders(customerId)
          setOrders(ordersData)
        } catch (error) {
          console.error("Failed to fetch customer orders:", error)
        }
      } catch (error) {
        console.error("Failed to fetch customer:", error)
        toast({
          title: "Error",
          description: "Failed to load customer details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (customerId) {
      fetchCustomerData()
    }
  }, [customerId, toast])

  const handleDelete = async () => {
    try {
      await deleteCustomer(customerId)
      toast({
        title: "Success",
        description: "Customer has been deleted successfully.",
      })
      router.push("/customers")
    } catch (error) {
      console.error("Failed to delete customer:", error)
      toast({
        title: "Error",
        description: "Failed to delete customer. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Helper function to safely format currency values
  const formatCurrency = (amount: any): string => {
    const numAmount = typeof amount === "number" ? amount : Number(amount)
    return isNaN(numAmount) ? "0.00" : numAmount.toFixed(2)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <DashboardNav />
          <main className="flex w-full flex-col overflow-hidden">
            <div className="flex justify-center items-center h-64">
              <p>Loading customer details...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <DashboardNav />
          <main className="flex w-full flex-col overflow-hidden">
            <div className="flex justify-center items-center h-64">
              <p>Customer not found</p>
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
              <Link href="/customers">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
                <p className="text-muted-foreground">Customer details and order history</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/customers/${customerId}/edit`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="flex items-center gap-1">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the customer and all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </DashboardShell>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer ID:</span>
                    <span className="font-medium">#{customer.customer_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact Info:</span>
                    <span className="font-medium">{customer.contact_info || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span>
                      {customer.total_spent > 1000 ? (
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">VIP</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Regular</Badge>
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Orders:</span>
                    <span className="font-medium">{customer.total_orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Spent:</span>
                    <span className="font-medium">${formatCurrency(customer.total_spent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Order Value:</span>
                    <span className="font-medium">
                      ${formatCurrency(customer.total_orders ? customer.total_spent / customer.total_orders : 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/orders/new?customer_id=${customerId}`} className="w-full">
                  <Button className="w-full">Create New Order</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <User className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-2 text-lg font-semibold">No Orders Yet</h3>
                  <p className="text-sm text-muted-foreground">This customer hasn't placed any orders yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={`${order.order_id}-${order.product_name}`}>
                        <TableCell>#{order.order_id}</TableCell>
                        <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                        <TableCell>{order.product_name}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>${formatCurrency(order.unit_price)}</TableCell>
                        <TableCell>${formatCurrency(order.total_price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

