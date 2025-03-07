"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { getShipment, deleteShipment } from "@/lib/services/shipment-service"
import type { ShipmentResponse } from "@/lib/types"
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

export default function ShipmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [shipment, setShipment] = useState<ShipmentResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const shipmentId = Number(params.id)

  useEffect(() => {
    const fetchShipmentData = async () => {
      try {
        setLoading(true)
        const shipmentData = await getShipment(shipmentId)
        setShipment(shipmentData)
      } catch (error) {
        console.error("Failed to fetch shipment:", error)
        toast({
          title: "Error",
          description: "Failed to load shipment details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (shipmentId) {
      fetchShipmentData()
    }
  }, [shipmentId, toast])

  const handleDelete = async () => {
    try {
      await deleteShipment(shipmentId)
      toast({
        title: "Success",
        description: "Shipment has been deleted successfully.",
      })
      router.push("/shipments")
    } catch (error) {
      console.error("Failed to delete shipment:", error)
      toast({
        title: "Error",
        description: "Failed to delete shipment. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  // Helper function to get status badge
  const getStatusBadge = (deliveryDays: number | null | undefined) => {
    if (deliveryDays === null || deliveryDays === undefined) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex w-fit items-center gap-1">
          <Clock className="h-3 w-3" /> Pending
        </Badge>
      )
    }

    if (deliveryDays <= 3) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex w-fit items-center gap-1">
          <CheckCircle className="h-3 w-3" /> Fast
        </Badge>
      )
    }

    if (deliveryDays <= 7) {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex w-fit items-center gap-1">
          <CheckCircle className="h-3 w-3" /> Normal
        </Badge>
      )
    }

    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex w-fit items-center gap-1">
        <AlertTriangle className="h-3 w-3" /> Delayed
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <DashboardNav />
          <main className="flex w-full flex-col overflow-hidden">
            <div className="flex justify-center items-center h-64">
              <p>Loading shipment details...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!shipment) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <DashboardNav />
          <main className="flex w-full flex-col overflow-hidden">
            <div className="flex justify-center items-center h-64">
              <p>Shipment not found</p>
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
              <Link href="/shipments">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-bold tracking-tight">Shipment #{shipment.shipment_id}</h1>
                <p className="text-muted-foreground">Shipment details and tracking information</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/shipments/${shipmentId}/edit`}>
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
                        This action cannot be undone. This will permanently delete the shipment record.
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
                <CardTitle>Shipment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipment ID:</span>
                    <span className="font-medium">#{shipment.shipment_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <Link href={`/orders/${shipment.order_id}`} className="font-medium text-blue-600 hover:underline">
                      #{shipment.order_id}
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Date:</span>
                    <span className="font-medium">{formatDate(shipment.order_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipment Date:</span>
                    <span className="font-medium">{formatDate(shipment.shipment_date)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Time:</span>
                    <span className="font-medium">
                      {shipment.delivery_days ? `${shipment.delivery_days} days` : "In transit"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span>{getStatusBadge(shipment.delivery_days)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Shipment Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipment.details && shipment.details.length > 0 ? (
                    shipment.details.map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell>{detail.product_name || `Product #${detail.product_id}`}</TableCell>
                        <TableCell>{detail.quantity}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-4">
                        No items in this shipment
                      </TableCell>
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

