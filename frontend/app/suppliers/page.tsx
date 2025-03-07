"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreHorizontal, Search } from "lucide-react"
import Link from "next/link"
import { getSuppliers, getSupplierPerformance } from "@/lib/services/supplier-service"
import type { SupplierResponse, SupplierPerformance } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([])
  const [performance, setPerformance] = useState<SupplierPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch suppliers
        const suppliersData = await getSuppliers(searchTerm)
        setSuppliers(suppliersData)

        // Fetch supplier performance
        const performanceData = await getSupplierPerformance()
        setPerformance(performanceData)
      } catch (error) {
        console.error("Failed to fetch suppliers:", error)
        toast({
          title: "Error",
          description: "Failed to load supplier data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchTerm, toast])

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <DashboardNav />
        <main className="flex w-full flex-col overflow-hidden">
          <DashboardShell>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Suppliers</h1>
                <p className="text-muted-foreground">Manage your supplier relationships</p>
              </div>
              <Link href="/suppliers/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Supplier
                </Button>
              </Link>
            </div>
          </DashboardShell>

          {performance.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Supplier Performance</CardTitle>
                <CardDescription>Average delivery time in days by supplier</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performance}>
                    <XAxis dataKey="name" hide={true}/>
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avg_delivery_days" fill="#8884d8" name="Avg. Delivery Days" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search suppliers..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading supplier data...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Avg. Delivery Time</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        No suppliers found. Try a different search term or add a new supplier.
                      </TableCell>
                    </TableRow>
                  ) : (
                    suppliers.map((supplier) => (
                      <TableRow key={supplier.supplier_id}>
                        <TableCell>#{supplier.supplier_id}</TableCell>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>{supplier.contact_info || "N/A"}</TableCell>
                        <TableCell>{supplier.total_orders}</TableCell>
                        <TableCell>{supplier.avg_delivery_days?.toFixed(1) || "N/A"} days</TableCell>
                        <TableCell>
                          {supplier.avg_delivery_days ? (
                            supplier.avg_delivery_days < 3 ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Excellent</Badge>
                            ) : supplier.avg_delivery_days < 5 ? (
                              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Good</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Slow</Badge>
                            )
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">No Data</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/suppliers/${supplier.supplier_id}`}>View details</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/suppliers/${supplier.supplier_id}/edit`}>Edit supplier</Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/orders/new?supplier_id=${supplier.supplier_id}`}>Create order</Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

