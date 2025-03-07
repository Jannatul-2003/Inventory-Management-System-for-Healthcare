"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getStockAlerts } from "@/lib/services/inventory-service"
import type { StockAlert } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export default function InventoryAlertsPage() {
  const [alerts, setAlerts] = useState<StockAlert[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true)
        const alertsData = await getStockAlerts()
        setAlerts(alertsData)
      } catch (error) {
        console.error("Failed to fetch stock alerts:", error)
        toast({
          title: "Error",
          description: "Failed to load stock alerts. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [toast])

  // Helper function to format price safely
  const formatPrice = (price: any): string => {
    const numPrice = typeof price === "number" ? price : Number(price)
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <DashboardNav />
        <main className="flex w-full flex-col overflow-hidden">
          <DashboardShell>
            <div className="flex items-center">
              <Link href="/inventory">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Stock Alerts</h1>
                <p className="text-muted-foreground">Products with critically low stock levels</p>
              </div>
            </div>
          </DashboardShell>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Loading stock alerts...</p>
                </div>
              ) : alerts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No stock alerts at this time. All inventory levels are adequate.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product ID</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((alert) => (
                      <TableRow key={alert.product_id} className="bg-red-50">
                        <TableCell>{alert.product_id}</TableCell>
                        <TableCell className="font-medium">{alert.name}</TableCell>
                        <TableCell>{alert.description || "No description"}</TableCell>
                        <TableCell>${formatPrice(alert.price)}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/inventory/${alert.product_id}`}>
                            <Button size="sm">Update Stock</Button>
                          </Link>
                        </TableCell>
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

