"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { createShipment } from "@/lib/services/shipment-service"
import { getOrders } from "@/lib/services/order-service"
import { getProducts } from "@/lib/services/product-service"
import type { ShipmentCreate, ShipmentDetailBase, OrderResponse, ProductResponse } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function NewShipmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [loading, setLoading] = useState(true)

  const initialOrderId = searchParams.get("order_id") ? Number(searchParams.get("order_id")) : undefined

  const [formData, setFormData] = useState<ShipmentCreate>({
    order_id: initialOrderId || 0,
    shipment_date: new Date().toISOString().split("T")[0],
    details: [],
  })

  const [selectedProduct, setSelectedProduct] = useState<number>(0)
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch orders and products
        const [ordersData, productsData] = await Promise.all([getOrders(), getProducts()])

        setOrders(ordersData)
        setProducts(productsData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast({
          title: "Error",
          description: "Failed to load required data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addShipmentDetail = () => {
    if (!selectedProduct || selectedQuantity <= 0) return

    // Check if product already exists in the shipment
    const existingIndex = formData.details.findIndex((detail) => detail.product_id === selectedProduct)

    if (existingIndex >= 0) {
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
        details: [...prev.details, newDetail],
      }))
    }

    // Reset selection
    setSelectedProduct(0)
    setSelectedQuantity(1)
  }

  const removeShipmentDetail = (index: number) => {
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

    if (formData.details.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product to the shipment.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createShipment(formData)
      toast({
        title: "Success",
        description: "Shipment has been created successfully.",
      })
      router.push("/shipments")
    } catch (error) {
      console.error("Failed to create shipment:", error)
      toast({
        title: "Error",
        description: "Failed to create shipment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Create New Shipment</h1>
                <p className="text-muted-foreground">Create a new shipment for an order</p>
              </div>
            </div>
          </DashboardShell>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading data...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Shipment Information</CardTitle>
                  <CardDescription>Enter the basic details of the shipment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="order_id">Order</Label>
                      <Select
                        value={formData.order_id.toString()}
                        onValueChange={(value) => handleChange("order_id", Number(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select order" />
                        </SelectTrigger>
                        <SelectContent>
                          {orders.map((order) => (
                            <SelectItem key={order.order_id} value={order.order_id.toString()}>
                              Order #{order.order_id} - {order.customer_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  <CardDescription>Add products to this shipment</CardDescription>
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
                        {formData.details.length === 0 ? (
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
                    <Link href="/shipments">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isSubmitting || formData.details.length === 0}>
                    {isSubmitting ? "Creating..." : "Create Shipment"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          )}
        </main>
      </div>
    </div>
  )
}

