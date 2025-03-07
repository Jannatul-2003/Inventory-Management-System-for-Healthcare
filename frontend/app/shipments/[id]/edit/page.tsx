"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { getShipment, updateShipment } from "@/lib/services/shipment-service"
import { getProducts } from "@/lib/services/product-service"
import type { ShipmentUpdate, ShipmentDetailBase, ShipmentResponse, ProductResponse } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EditShipmentPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [shipment, setShipment] = useState<ShipmentResponse | null>(null)
  const [products, setProducts] = useState<ProductResponse[]>([])

  const [formData, setFormData] = useState<ShipmentUpdate>({
    shipment_date: "",
    details: [],
  })

  const [selectedProduct, setSelectedProduct] = useState<number>(0)
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)

  const shipmentId = Number(params.id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch shipment data
        const shipmentData = await getShipment(shipmentId)
        setShipment(shipmentData)

        // Fetch products
        const productsData = await getProducts()
        setProducts(productsData)

        // Set initial form data
        setFormData({
          shipment_date: shipmentData.shipment_date,
          details:
            shipmentData.details?.map((detail) => ({
              product_id: detail.product_id,
              quantity: detail.quantity,
            })) || [],
        })
      } catch (error) {
        console.error("Failed to fetch shipment data:", error)
        toast({
          title: "Error",
          description: "Failed to load shipment data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (shipmentId) {
      fetchData()
    }
  }, [shipmentId, toast])

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addShipmentDetail = () => {
    if (!selectedProduct || selectedQuantity <= 0) return

    // Check if product already exists in the shipment
    const existingIndex = formData.details?.findIndex((detail) => detail.product_id === selectedProduct) ?? -1

    if (existingIndex >= 0 && formData.details) {
      // Update quantity if product already exists
      const updatedDetails = [...formData.details]
      updatedDetails[existingIndex].quantity += selectedQuantity
      setFormData((prev) => ({ ...prev, details: updatedDetails }))
    } else {
      // Add new product
      const newDetail: ShipmentDetailBase = {
        product_id: selectedProduct,
        quantity: selectedQuantity,
      }

      setFormData((prev) => ({
        ...prev,
        details: [...(prev.details || []), newDetail],
      }))
    }

    // Reset selection
    setSelectedProduct(0)
    setSelectedQuantity(1)
  }

  const removeShipmentDetail = (index: number) => {
    if (!formData.details) return

    const updatedDetails = [...formData.details]
    updatedDetails.splice(index, 1)
    setFormData((prev) => ({ ...prev, details: updatedDetails }))
  }

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.product_id === productId)
    return product ? product.name : "Unknown Product"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.details || formData.details.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product to the shipment.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await updateShipment(shipmentId, formData)
      toast({
        title: "Success",
        description: "Shipment has been updated successfully.",
      })
      router.push(`/shipments/${shipmentId}`)
    } catch (error) {
      console.error("Failed to update shipment:", error)
      toast({
        title: "Error",
        description: "Failed to update shipment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
              <p>Loading shipment data...</p>
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
              <Link href={`/shipments/${shipmentId}`}>
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Edit Shipment #{shipmentId}</h1>
                <p className="text-muted-foreground">Update shipment information and items</p>
              </div>
            </div>
          </DashboardShell>

          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Shipment Information</CardTitle>
                <CardDescription>Edit the basic details of the shipment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="order_id">Order</Label>
                    <Input id="order_id" value={`Order #${shipment.order_id}`} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipment_date">Shipment Date</Label>
                    <Input
                      id="shipment_date"
                      type="date"
                      value={formData.shipment_date}
                      onChange={(e) => handleChange("shipment_date", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Shipment Items</CardTitle>
                <CardDescription>Edit products in this shipment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="product">Product</Label>
                    <Select
                      value={selectedProduct ? selectedProduct.toString() : ""}
                      onValueChange={(value) => setSelectedProduct(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.product_id} value={product.product_id.toString()}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 w-full md:w-32">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                    />
                  </div>
                  <Button type="button" onClick={addShipmentDetail} className="mt-2 md:mt-0">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!formData.details || formData.details.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4">
                            No items added to this shipment yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        formData.details.map((detail, index) => (
                          <TableRow key={index}>
                            <TableCell>{getProductName(detail.product_id)}</TableCell>
                            <TableCell>{detail.quantity}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => removeShipmentDetail(index)}>
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href={`/shipments/${shipmentId}`}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting || !formData.details || formData.details.length === 0}>
                  {isSubmitting ? "Updating..." : "Update Shipment"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </main>
      </div>
    </div>
  )
}

