
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { Overview } from "@/components/overview";
import { RecentSales } from "@/components/recent-sales";
import { BarChart3, Package, ShoppingCart, Users } from "lucide-react";
import {
  getOverview,
  getMonthlyMetrics,
  getTopProducts,
  getTopCustomers,
} from "@/lib/services/dashboard-service";
import type {
  DashboardOverview,
  MonthlyMetrics,
  TopProducts,
  TopCustomers,
} from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Home() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [monthlyMetrics, setMonthlyMetrics] = useState<MonthlyMetrics[]>([]);
  const [topProducts, setTopProducts] = useState<TopProducts[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomers[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [overviewData, monthlyData, productsData, customersData] =
          await Promise.all([
            getOverview(),
            getMonthlyMetrics(),
            getTopProducts(),
            getTopCustomers(),
          ]);

        setOverview(overviewData);
        setMonthlyMetrics(monthlyData);
        setTopProducts(productsData);
        setTopCustomers(customersData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  // Helper function to safely format currency values
  const formatCurrency = (amount: any): string => {
    const numAmount = typeof amount === "number" ? amount : Number(amount);
    return isNaN(numAmount) ? "0.00" : numAmount.toFixed(2);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <DashboardNav />
        <main className="flex w-full flex-col overflow-hidden">
          <DashboardShell className="mb-1">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your inventory management system
            </p>
          </DashboardShell>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading dashboard data...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Monthly Orders
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {overview?.monthly_orders || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Orders this month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Monthly Revenue
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                    ৳ {formatCurrency(overview?.monthly_revenue || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Revenue this month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Customers
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {overview?.active_customers || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active customers this month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Low Stock Items
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {overview?.low_stock_items || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Items requiring attention
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Products Section */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>
                    Best selling products this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Total Sold</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4">
                            No product data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        topProducts.map((product) => (
                          <TableRow key={product.product_id}>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>{product.total_sold} units</TableCell>
                            <TableCell className="text-right">
                            ৳ {formatCurrency(product.total_revenue)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Monthly Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview
                      data={monthlyMetrics.map((metric) => ({
                        name: new Date(metric.month).toLocaleDateString(
                          "en-US",
                          { month: "short" }
                        ),
                        total: metric.total_revenue,
                      }))}
                    />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Top Customers</CardTitle>
                    <CardDescription>
                      Your highest value customers this month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales
                      customers={topCustomers.map((customer) => ({
                        name: customer.name,
                        email: `Customer #${customer.customer_id}`,
                        amount: customer.total_spent,
                      }))}
                    />
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
