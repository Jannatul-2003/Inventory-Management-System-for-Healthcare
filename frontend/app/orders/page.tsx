"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MoreHorizontal,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { getOrders, getOrderStatus } from "@/lib/services/order-service";
import type { OrderResponse, OrderStatusSummary } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [statusSummary, setStatusSummary] = useState<OrderStatusSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customerId, setCustomerId] = useState<string>("");
  const [supplierId, setSupplierId] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch orders
        const ordersData = await getOrders(
          startDate,
          endDate,
          customerId ? Number(customerId) : undefined,
          supplierId ? Number(supplierId) : undefined
        );
        setOrders(ordersData);

        // Fetch order status summary
        const statusData = await getOrderStatus();
        setStatusSummary(statusData);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast({
          title: "Error",
          description: "Failed to load order data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, customerId, supplierId, toast]);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true;
    return order.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Helper function to safely format currency values
  const formatCurrency = (amount: any): string => {
    const numAmount = typeof amount === "number" ? amount : Number(amount);
    return isNaN(numAmount) ? "0.00" : numAmount.toFixed(2);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "shipped":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex w-fit items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Shipped
          </Badge>
        );
      case "paid":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex w-fit items-center gap-1">
            <Clock className="h-3 w-3" /> Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex w-fit items-center gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );

      default:
        return <Badge>{status}</Badge>;
    }
  };
  const uniqueOrders = filteredOrders.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.order_id === value.order_id)
  );

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <DashboardNav />
        <main className="flex w-full flex-col overflow-hidden">
          <DashboardShell>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground">
                  Manage your orders and track their status
                </p>
              </div>
              <Link href="/orders/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </Button>
              </Link>
            </div>
          </DashboardShell>

          {/* Order Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Orders
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    orders.filter(
                      (order) => order.status.toLowerCase() === "shipped"
                    ).length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Orders
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    orders.filter(
                      (order) => order.status.toLowerCase() === "paid"
                    ).length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ৳
                  {formatCurrency(
                    orders.reduce((sum, order) => sum + order.total_amount, 0)
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 w-full">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Input
                  type="date"
                  className="w-full md:w-auto"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start Date"
                />
                <span>to</span>
                <Input
                  type="date"
                  className="w-full md:w-auto"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End Date"
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                <Input
                  type="text"
                  placeholder="Customer ID"
                  className="w-full md:w-auto"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Supplier ID"
                  className="w-full md:w-auto"
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading order data...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        No orders found. Try different filters or create a new
                        order.
                      </TableCell>
                    </TableRow>
                  ) : (
                    uniqueOrders.map((order) => (
                      <TableRow key={order.order_id}>
                        <TableCell>#{order.order_id}</TableCell>
                        <TableCell>
                          {new Date(order.order_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{order.customer_name}</TableCell>
                        <TableCell>{order.supplier_name}</TableCell>
                        <TableCell>
                          {order.total_items} ({order.total_quantity} units)
                        </TableCell>
                        <TableCell>
                          ৳{formatCurrency(order.total_amount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>

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
                                <Link href={`/orders/${order.order_id}`}>
                                  View details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/orders/${order.order_id}/edit`}>
                                  Edit order
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/payments/new?order_id=${order.order_id}`}
                                >
                                  Record payment
                                </Link>
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
  );
}
