"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { getOrder, getOrderDetails, deleteOrder } from "@/lib/services/order-service"
import type { OrderResponse, OrderDetail } from "@/lib/types"
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

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const orderId = Number(params.id)

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true)
        const orderData = await getOrder(orderId)
        setOrder(orderData)

        try {
          const detailsData = await getOrderDetails(orderId)
          setOrderDetails(detailsData)
        } catch (error) {
          console.error("Failed to fetch order details:", error)
        }
      } catch (error) {
        console.error("Failed to fetch order:", error)
        toast({
          title: "Error",
          description: "Failed to load order details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrderData()
    }
  }, [orderId, toast])

  const handleDelete = async () => {
    try {
      await deleteOrder(orderId)
      toast({
        title: "Success",
        description: "Order has been deleted successfully.",
      })
      router.push("/orders")
    } catch (error) {
      console.error("Failed to delete order:", error)
      toast({
        title: "Error",
        description: "Failed to delete order. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Helper function to safely format currency values
  const formatCurrency = (amount: any): string => {
    const numAmount = typeof amount === "number" ? amount : Number(amount)
    return isNaN(numAmount) ? "0.00" : numAmount.toFixed(2)
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "shipped":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex w-fit items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Shipped
          </Badge>
        )
      case "paid":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex w-fit items-center gap-1">
            <Clock className="h-3 w-3" /> Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex w-fit items-center gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <DashboardNav />
          <main className="flex w-full flex-col overflow-hidden">
            <div className="flex justify-center items-center h-64">
              <p>Loading order details...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <DashboardNav />
          <main className="flex w-full flex-col overflow-hidden">
            <div className="flex justify-center items-center h-64">
              <p>Order not found</p>
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
              <Link href="/orders">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-bold tracking-tight">Order #{order.order_id}</h1>
                <p className="text-muted-foreground">Order details and line items</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/orders/${orderId}/edit`}>
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
                        This action cannot be undone. This will permanently delete the order and all associated data.
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
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-medium">#{order.order_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{new Date(order.order_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span>{getStatusBadge(order.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Items:</span>
                    <span className="font-medium">
                      {order.total_items} ({order.total_quantity} units)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer & Supplier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer:</span>
                    <Link
                      href={`/customers/${order.customer_id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {order.customer_name}
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Supplier:</span>
                    <Link
                      href={`/suppliers/${order.supplier_id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {order.supplier_name}
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-medium">৳{formatCurrency(order.total_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Paid:</span>
                    <span className="font-medium">৳{formatCurrency(order.amount_paid)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/payments/new?order_id=${orderId}`} className="w-full">
                  <Button className="w-full" disabled={order.amount_paid >= order.total_amount}>
                    {order.amount_paid >= order.total_amount ? "Fully Paid" : "Record Payment"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderDetails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No order details available
                      </TableCell>
                    </TableRow>
                  ) : (
                    orderDetails.map((detail) => (
                      <TableRow key={detail.order_detail_id}>
                        <TableCell>{detail.product_name}</TableCell>
                        <TableCell>৳{formatCurrency(detail.unit_price)}</TableCell>
                        <TableCell>{detail.quantity}</TableCell>
                        <TableCell>৳{formatCurrency(detail.total_price)}</TableCell>
                      </TableRow>
                    ))
                  )}
                  {orderDetails.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">
                        Order Total:
                      </TableCell>
                      <TableCell className="font-bold">৳{formatCurrency(order.total_amount)}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

