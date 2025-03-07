
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/lib/services/product-service";
import type { ProductResponse } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts(searchTerm);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, toast]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  // Helper function to format price safely
  const formatPrice = (price: any): string => {
    // Convert to number if it's not already
    const numPrice = typeof price === "number" ? price : Number(price);

    // Check if conversion resulted in a valid number
    if (isNaN(numPrice)) {
      return "0.00"; // Return default if not a valid number
    }

    return numPrice.toFixed(2); // Fix: Format without recursion
  };
  const getStockBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "in stock":
        return (
          <Badge variant="outline" className="text-green-600">
            In Stock
          </Badge>
        );
      case "low stock":
        return (
          <Badge variant="outline" className="text-yellow-600">
            Low Stock
          </Badge>
        );
      case "out of stock":
        return (
          <Badge variant="outline" className="text-red-600">
            Out of Stock
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-green-600">
            In Stock
          </Badge>
        );
    }
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
                <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                <p className="text-muted-foreground">
                  Manage your product catalog
                </p>
              </div>
              <Link href="/products/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </div>
          </DashboardShell>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Remove the category and sorting selects that were here */}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading products...</p> 
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">
                    No products found. Try a different search term or add a new
                    product.
                  </p>
                </div>
              ) : (
                products.map((product) => (
                  <Card key={product.product_id} className="overflow-hidden">
                    {/* Remove the image div that was here */}
                    <CardContent className="p-4">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {product.description || "No description available"}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-bold">
                        ৳{formatPrice(product.price)}
                        </span>
                        {getStockBadge(product.stock_status)}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Link href={`/products/${product.product_id}`}>
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/products/${product.product_id}/edit`}>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
