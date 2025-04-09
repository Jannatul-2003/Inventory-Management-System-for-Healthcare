
"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Plus, Truck, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { getShipments, getLateShipments } from "@/lib/services/shipment-service"

// Define types for ShipmentResponse and LateShipment (replace with your actual types)
interface ShipmentResponse {
  shipment_id: number
  order_id: number
  order_date: string
  shipment_date: string
  delivery_days?: number
}

interface LateShipment {
  order_id: number
  order_date: string
  shipment_id?: number
  shipment_date?: string
  delivery_days?: number
}

export default function ShipmentsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [shipments, setShipments] = useState<ShipmentResponse[]>([])
  const [lateShipments, setLateShipments] = useState<LateShipment[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [shipmentsData, lateData] = await Promise.all([getShipments(), getLateShipments()])

        setShipments(shipmentsData || [])
        setLateShipments(lateData || [])
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

    fetchData()
  }, [toast])

  // Calculate delivery performance metrics
  const totalShipments = shipments.length
  const lateCount = lateShipments.length
  const onTimeCount = totalShipments - lateCount
  const onTimePercentage = totalShipments > 0 ? ((onTimeCount / totalShipments) * 100).toFixed(1) : 0

  // Data for delivery performance chart
  const performanceData = [
    { name: "On Time", value: onTimeCount },
    { name: "Late", value: lateCount },
  ]

  // Colors for pie chart
  const COLORS = ["#00C49F", "#FF8042"]

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not shipped"
    return new Date(dateString).toLocaleDateString()
  }

  // Helper function to get status badge
  const getStatusBadge = (deliveryDays: number | null | undefined) => {    if (deliveryDays === null || deliveryDays === undefined) {
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

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <DashboardNav />
        <main className="flex w-full flex-col overflow-hidden">
          <DashboardShell>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Shipments</h1>
                <p className="text-muted-foreground">Track and manage order shipments</p>
              </div>
              <Link href="/shipments/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Shipment
                </Button>
              </Link>
            </div>
          </DashboardShell>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading shipment data...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalShipments}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{onTimePercentage}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Late Shipments</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{lateCount}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {shipments.length > 0
                        ? (shipments.reduce((sum, s) => sum + (s.delivery_days || 0), 0) / shipments.length).toFixed(1)
                        : 0}{" "}
                      days
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Delivery Times</CardTitle>
                    <CardDescription>Average delivery time in days by shipment</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={shipments.slice(0, 10)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="shipment_id" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="delivery_days" fill="#8884d8" name="Delivery Days" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Performance</CardTitle>
                    <CardDescription>On-time vs late shipments</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={performanceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {performanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all">All Shipments</TabsTrigger>
                  <TabsTrigger value="late">Late Shipments</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Shipments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Shipment ID</TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Shipment Date</TableHead>
                            <TableHead>Delivery Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {shipments.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-10">
                                No shipments found. Create a new shipment to get started.
                              </TableCell>
                            </TableRow>
                          ) : (
                            shipments.map((shipment) => (
                              <TableRow key={shipment.shipment_id}>
                                <TableCell className="font-medium">#{shipment.shipment_id}</TableCell>
                                <TableCell>#{shipment.order_id}</TableCell>
                                <TableCell>{formatDate(shipment.order_date)}</TableCell>
                                <TableCell>{formatDate(shipment.shipment_date)}</TableCell>
                                <TableCell>
                                  {shipment.delivery_days ? `${shipment.delivery_days} days` : `${shipment.delivery_days} day`}
                                </TableCell>
                                <TableCell>{getStatusBadge(shipment.delivery_days)}</TableCell>
                                <TableCell className="text-right">
                                  <Link href={`/shipments/${shipment.shipment_id}`}>
                                    <Button variant="outline" size="sm">
                                      View Details
                                    </Button>
                                  </Link>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="late" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Late Shipments</CardTitle>
                      <CardDescription>Shipments that are delayed or past due</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Shipment ID</TableHead>
                            <TableHead>Shipment Date</TableHead>
                            <TableHead>Days Delayed</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {lateShipments.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-10">
                                No late shipments found. Great job!
                              </TableCell>
                            </TableRow>
                          ) : (
                            lateShipments.map((shipment) => (
                              <TableRow key={`late-${shipment.order_id}`} className="bg-red-50">
                                <TableCell className="font-medium">#{shipment.order_id}</TableCell>
                                <TableCell>{formatDate(shipment.order_date)}</TableCell>
                                <TableCell>
                                  {shipment.shipment_id ? `#${shipment.shipment_id}` : "Not shipped"}
                                </TableCell>
                                <TableCell>{formatDate(shipment.shipment_date)}</TableCell>
                                <TableCell>
                                  {shipment.delivery_days ? `${shipment.delivery_days} days` : "Not shipped yet"}
                                </TableCell>
                                <TableCell className="text-right">
                                  {shipment.shipment_id ? (
                                    <Link href={`/shipments/${shipment.shipment_id}`}>
                                      <Button variant="outline" size="sm">
                                        View Details
                                      </Button>
                                    </Link>
                                  ) : (
                                    <Link href={`/shipments/new?order_id=${shipment.order_id}`}>
                                      <Button size="sm">Create Shipment</Button>
                                    </Link>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

