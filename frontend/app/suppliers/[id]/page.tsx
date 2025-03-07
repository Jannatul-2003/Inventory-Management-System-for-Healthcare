"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Truck } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { getSupplier, deleteSupplier } from "@/lib/services/supplier-service"
import type { SupplierResponse } from "@/lib/types"
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

export default function SupplierDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [supplier, setSupplier] = useState<SupplierResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const supplierId = Number(params.id)

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        setLoading(true)
        const supplierData = await getSupplier(supplierId)
        setSupplier(supplierData)
      } catch (error) {
        console.error("Failed to fetch supplier:", error)
        toast({
          title: "Error",
          description: "Failed to load supplier details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (supplierId) {
      fetchSupplierData()
    }
  }, [supplierId, toast])

  const handleDelete = async () => {
    try {
      await deleteSupplier(supplierId)
      toast({
        title: "Success",
        description: "Supplier has been deleted successfully.",
      })
      router.push("/suppliers")
    } catch (error) {
      console.error("Failed to delete supplier:", error)
      toast({
        title: "Error",
        description: "Failed to delete supplier. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getPerformanceBadge = (avgDays: number | undefined) => {
    if (!avgDays) return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">No Data</Badge>

    if (avgDays < 3) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Excellent</Badge>
    } else if (avgDays < 5) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Good</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Slow</Badge>
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
              <p>Loading supplier details...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <DashboardNav />
          <main className="flex w-full flex-col overflow-hidden">
            <div className="flex justify-center items-center h-64">
              <p>Supplier not found</p>
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
              <Link href="/suppliers">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-bold tracking-tight">{supplier.name}</h1>
                <p className="text-muted-foreground">Supplier details and performance metrics</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/suppliers/${supplierId}/edit`}>
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
                        This action cannot be undone. This will permanently delete the supplier and all associated data.
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
                <CardTitle>Supplier Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Supplier ID:</span>
                    <span className="font-medium">#{supplier.supplier_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{supplier.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact Info:</span>
                    <span className="font-medium">{supplier.contact_info || "N/A"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Orders:</span>
                    <span className="font-medium">{supplier.total_orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Delivery Time:</span>
                    <span className="font-medium">{supplier.avg_delivery_days?.toFixed(1) || "N/A"} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Performance Rating:</span>
                    <span>{getPerformanceBadge(supplier.avg_delivery_days)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/orders/new?supplier_id=${supplierId}`} className="w-full">
                  <Button className="w-full">Create New Order</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Truck className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-2 text-lg font-semibold">No Recent Activity</h3>
                <p className="text-sm text-muted-foreground">Recent supplier activity will appear here.</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

