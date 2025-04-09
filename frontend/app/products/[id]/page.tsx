"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { getProduct, deleteProduct } from "@/lib/services/product-service"
import { getProductInventory } from "@/lib/services/inventory-service"
import type { ProductResponse, InventoryResponse } from "@/lib/types"
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

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<ProductResponse | null>(null)
  const [inventory, setInventory] = useState<InventoryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const productId = Number(params.id)

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        const productData = await getProduct(productId)
        setProduct(productData)

        try {
          const inventoryData = await getProductInventory(productId)
          setInventory(inventoryData)
        } catch (error) {
          console.error("Failed to fetch inventory data:", error)
        }
      } catch (error) {
        console.error("Failed to fetch product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProductData()
    }
  }, [productId, toast])

  const handleDelete = async () => {
    try {
      await deleteProduct(productId)
      toast({
        title: "Success",
        description: "Product has been deleted successfully.",
      })
      router.push("/products")
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStockBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "in stock":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
      case "low stock":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Low Stock</Badge>
      case "out of stock":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Out of Stock</Badge>
      default:
        return <Badge>Unknown</Badge>
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
              <p>Loading product details...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <DashboardNav />
          <main className="flex w-full flex-col overflow-hidden">
            <div className="flex justify-center items-center h-64">
              <p>Product not found</p>
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
              <Link href="/products">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
                <p className="text-muted-foreground">Product details and inventory information</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/products/${productId}/edit`}>
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
                        This action cannot be undone. This will permanently delete the product and remove it from the
                        inventory.
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
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product ID:</span>
                    <span className="font-medium">{product.product_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">৳{product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stock Status:</span>
                    <span>{getStockBadge(product.stock_status)}</span>
                  </div>
                </div>
                {product.description && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Description:</h3>
                    <p>{product.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {inventory ? (
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Inventory ID:</span>
                        <span className="font-medium">{inventory.inventory_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Stock:</span>
                        <span className="font-medium">{inventory.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span>{getStockBadge(inventory.status)}</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Stock History</h3>
                      <p className="text-sm text-muted-foreground">No stock history available yet.</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No inventory information available for this product.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href={`/inventory/${productId}`} className="w-full">
                  <Button className="w-full">Update Inventory</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}


