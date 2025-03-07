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
import { createOrder } from "@/lib/services/order-service"
import { getCustomers } from "@/lib/services/customer-service"
import { getSuppliers } from "@/lib/services/supplier-service"
import { getProducts } from "@/lib/services/product-service"
import type { OrderCreate, OrderDetailBase, CustomerResponse, SupplierResponse, ProductResponse } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function NewOrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customers, setCustomers] = useState<CustomerResponse[]>([])
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([])
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [loading, setLoading] = useState(true)

  const initialCustomerId = searchParams.get("customer_id") ? Number(searchParams.get("customer_id")) : undefined
  const initialSupplierId = searchParams.get("supplier_id") ? Number(searchParams.get("supplier_id")) : undefined

  const [formData, setFormData] = useState<OrderCreate>({
    order_date: new Date().toISOString().split("T")[0],
    customer_id: initialCustomerId || 0,
    supplier_id: initialSupplierId || 0,
    details: [],
  })

  const [selectedProduct, setSelectedProduct] = useState<number>(0)
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch customers, suppliers, and products
        const [customersData, suppliersData, productsData] = await Promise.all([
          getCustomers(),
          getSuppliers(),
          getProducts(),
        ])

        setCustomers(customersData)
        setSuppliers(suppliersData)
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

  const addOrderDetail = () => {
    if (!selectedProduct || selectedQuantity <= 0) return

    // Check if product already exists in the order
    const existingIndex = formData.details.findIndex((detail) => detail.product_id === selectedProduct)

    if (existingIndex >= 0) {
      // Update quantity if product already exists
      const updatedDetails = [...formData.details]
      updatedDetails[existingIndex].quantity += selectedQuantity
      setFormData((prev) => ({ ...prev, details: updatedDetails }))
    } else {
      // Add new product
      const newDetail: OrderDetailBase = {
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

  // Helper function to format price safely
const formatPrice = (price: any): string => {
  // Convert to number if it's not already
  const numPrice = typeof price === 'number' ? price : Number(price);
  
  // Check if conversion resulted in a valid number
  if (isNaN(numPrice)) {
    return '0.00'; // Return default if not a valid number
  }
  
  return numPrice.toFixed(2); // Fix: Format without recursion
}

  const removeOrderDetail = (index: number) => {
    const updatedDetails = [...formData.details]
    updatedDetails.splice(index, 1)
    setFormData((prev) => ({ ...prev, details: updatedDetails }))
  }

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.product_id === productId)
    return product ? product.name : "Unknown Product"
  }

  const getProductPrice = (productId: number) => {
    const product = products.find((p) => p.product_id === productId)
    return product ? product.price : 0
  }

  const calculateTotal = () => {
    return formData.details.reduce((total, detail) => {
      const price = getProductPrice(detail.product_id)
      return total + price * detail.quantity
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.details.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product to the order.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createOrder(formData)
      toast({
        title: "Success",
        description: "Order has been created successfully.",
      })
      router.push("/orders")
    } catch (error) {
      console.error("Failed to create order:", error)
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
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
              <Link href="/orders">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Create New Order</h1>
                <p className="text-muted-foreground">Create a new order with multiple products</p>
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
                  <CardTitle>Order Information</CardTitle>
                  <CardDescription>Enter the basic details of the order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="order_date">Order Date</Label>
                      <Input
                        id="order_date"
                        type="date"
                        value={formData.order_date}
                        onChange={(e) => handleChange("order_date", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer_id">Customer</Label>
                      <Select
                        value={formData.customer_id.toString()}
                        onValueChange={(value) => handleChange("customer_id", Number(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.customer_id} value={customer.customer_id.toString()}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier_id">Supplier</Label>
                      <Select
                        value={formData.supplier_id.toString()}
                        onValueChange={(value) => handleChange("supplier_id", Number(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.supplier_id} value={supplier.supplier_id.toString()}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                  <CardDescription>Add products to this order</CardDescription>
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
                              {product.name} (${formatPrice(product.price)})
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
                    <Button type="button" onClick={addOrderDetail} className="mt-2 md:mt-0">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formData.details.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                              No items added to this order yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          formData.details.map((detail, index) => {
                            const productPrice = getProductPrice(detail.product_id)
                            const itemTotal = productPrice * detail.quantity

                            return (
                              <TableRow key={index}>
                                <TableCell>{getProductName(detail.product_id)}</TableCell>
                                <TableCell>${formatPrice(productPrice)}</TableCell>
                                <TableCell>{detail.quantity}</TableCell>
                                <TableCell>${itemTotal.toFixed(2)}</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="icon" onClick={() => removeOrderDetail(index)}>
                                    <Trash className="h-4 w-4 text-red-500" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        )}
                        {formData.details.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={3} className="text-right font-bold">
                              Order Total:
                            </TableCell>
                            <TableCell className="font-bold">${calculateTotal().toFixed(2)}</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" asChild>
                    <Link href="/orders">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isSubmitting || formData.details.length === 0}>
                    {isSubmitting ? "Creating..." : "Create Order"}
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

