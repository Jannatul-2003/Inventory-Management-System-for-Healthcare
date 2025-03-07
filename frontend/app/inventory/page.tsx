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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import { getInventory, getStockAlerts } from "@/lib/services/inventory-service";
import type { InventoryResponse, StockAlert } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryResponse[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const data = await getInventory(filterStatus === "low-stock");
        setInventory(data);

        // Fetch stock alerts
        const alertsData = await getStockAlerts();
        setAlerts(alertsData);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
        toast({
          title: "Error",
          description: "Failed to load inventory data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [filterStatus, toast]);

  const filteredInventory = inventory.filter((item) =>
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "in stock":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            In Stock
          </Badge>
        );
      case "low stock":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Low Stock
          </Badge>
        );
      case "out of stock":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Out of Stock
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Helper function to format price safely
  const formatPrice = (price: any): string => {
    // Convert to number if it's not already
    const numPrice = typeof price === "number" ? price : Number(price);

    // Check if conversion resulted in a valid number
    if (isNaN(numPrice)) {
      return "0.00"; // Return default if not a valid number
    }

    return numPrice.toFixed(2);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <DashboardNav />
        <main className="flex w-full flex-col overflow-hidden">
          <DashboardShell>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
                <p className="text-muted-foreground">
                  Manage your inventory items and stock levels
                </p>
              </div>
              <Link href="/inventory/alerts">
                <Button>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Alerts
                </Button>
              </Link>
            </div>
          </DashboardShell>

          {alerts.length > 0 && (
            <div className="mb-6 p-4 border rounded-md bg-red-50">
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                Stock Alerts
              </h2>
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.product_id}
                    className="flex justify-between items-center p-2 bg-white rounded border border-red-200"
                  >
                    <span className="font-medium">{alert.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        Price: ৳{formatPrice(alert.price)}
                      </span>
                      <Link href={`/inventory/${alert.product_id}`}>
                        <Button size="sm" variant="outline">
                          Update
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search inventory..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading inventory data...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        No inventory items found. Try a different search term or
                        add new items.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInventory.map((item) => (
                      <TableRow key={item.inventory_id}>
                        <TableCell className="font-medium">
                          {item.product_name}
                        </TableCell>
                        <TableCell>{item.product_id}</TableCell>
                        <TableCell>৳{formatPrice(item.price)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
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
                                <Link href={`/products/${item.product_id}`}>
                                  View product details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/inventory/${item.product_id}`}>
                                  Update stock
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/products/${item.product_id}/edit`}
                                >
                                  Edit product
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
