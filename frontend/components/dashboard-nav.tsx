// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Package, ShoppingCart, CreditCard, LayoutDashboard, Users, ClipboardList, Truck } from "lucide-react"

// export function DashboardNav() {
//   const pathname = usePathname()

//   return (
//     <nav className="grid items-start gap-2 text-sm font-medium">
//       <Link href="/">
//         <Button variant={pathname === "/" ? "default" : "ghost"} className="w-full justify-start gap-2">
//           <LayoutDashboard className="h-4 w-4" />
//           Dashboard
//         </Button>
//       </Link>
//       <Link href="/inventory">
//         <Button
//           variant={pathname === "/inventory" || pathname.startsWith("/inventory/") ? "default" : "ghost"}
//           className="w-full justify-start gap-2"
//         >
//           <ShoppingCart className="h-4 w-4" />
//           Inventory
//         </Button>
//       </Link>
//       <Link href="/products">
//         <Button
//           variant={pathname === "/products" || pathname.startsWith("/products/") ? "default" : "ghost"}
//           className="w-full justify-start gap-2"
//         >
//           <Package className="h-4 w-4" />
//           Products
//         </Button>
//       </Link>
//       <Link href="/customers">
//         <Button
//           variant={pathname === "/customers" || pathname.startsWith("/customers/") ? "default" : "ghost"}
//           className="w-full justify-start gap-2"
//         >
//           <Users className="h-4 w-4" />
//           Customers
//         </Button>
//       </Link>
//       <Link href="/orders">
//         <Button
//           variant={pathname === "/orders" || pathname.startsWith("/orders/") ? "default" : "ghost"}
//           className="w-full justify-start gap-2"
//         >
//           <ClipboardList className="h-4 w-4" />
//           Orders
//         </Button>
//       </Link>
//       <Link href="/suppliers">
//         <Button
//           variant={pathname === "/suppliers" || pathname.startsWith("/suppliers/") ? "default" : "ghost"}
//           className="w-full justify-start gap-2"
//         >
//           <Truck className="h-4 w-4" />
//           Suppliers
//         </Button>
//       </Link>
//       <Link href="/payments">
//         <Button
//           variant={pathname === "/payments" || pathname.startsWith("/payments/") ? "default" : "ghost"}
//           className="w-full justify-start gap-2"
//         >
//           <CreditCard className="h-4 w-4" />
//           Payments
//         </Button>
//       </Link>
//     </nav>
//   )
// }

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Package,
  ShoppingCart,
  CreditCard,
  LayoutDashboard,
  Users,
  ClipboardList,
  Truck,
  BarChart2,
} from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2 text-sm font-medium">
      <Link href="/">
        <Button variant={pathname === "/" ? "default" : "ghost"} className="w-full justify-start gap-2">
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Button>
      </Link>
      <Link href="/inventory">
        <Button
          variant={pathname === "/inventory" || pathname.startsWith("/inventory/") ? "default" : "ghost"}
          className="w-full justify-start gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Inventory
        </Button>
      </Link>
      <Link href="/products">
        <Button
          variant={pathname === "/products" || pathname.startsWith("/products/") ? "default" : "ghost"}
          className="w-full justify-start gap-2"
        >
          <Package className="h-4 w-4" />
          Products
        </Button>
      </Link>
      <Link href="/customers">
        <Button
          variant={pathname === "/customers" || pathname.startsWith("/customers/") ? "default" : "ghost"}
          className="w-full justify-start gap-2"
        >
          <Users className="h-4 w-4" />
          Customers
        </Button>
      </Link>
      <Link href="/orders">
        <Button
          variant={pathname === "/orders" || pathname.startsWith("/orders/") ? "default" : "ghost"}
          className="w-full justify-start gap-2"
        >
          <ClipboardList className="h-4 w-4" />
          Orders
        </Button>
      </Link>
      <Link href="/suppliers">
        <Button
          variant={pathname === "/suppliers" || pathname.startsWith("/suppliers/") ? "default" : "ghost"}
          className="w-full justify-start gap-2"
        >
          <Truck className="h-4 w-4" />
          Suppliers
        </Button>
      </Link>
      <Link href="/shipments">
        <Button
          variant={pathname === "/shipments" || pathname.startsWith("/shipments/") ? "default" : "ghost"}
          className="w-full justify-start gap-2"
        >
          <Truck className="h-4 w-4" />
          Shipments
        </Button>
      </Link>
      <Link href="/analytics">
        <Button
          variant={pathname === "/analytics" || pathname.startsWith("/analytics/") ? "default" : "ghost"}
          className="w-full justify-start gap-2"
        >
          <BarChart2 className="h-4 w-4" />
          Analytics
        </Button>
      </Link>
      <Link href="/payments">
        <Button
          variant={pathname === "/payments" || pathname.startsWith("/payments/") ? "default" : "ghost"}
          className="w-full justify-start gap-2"
        >
          <CreditCard className="h-4 w-4" />
          Payments
        </Button>
      </Link>
    </nav>
  )
}



