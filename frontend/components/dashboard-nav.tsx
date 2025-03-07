
// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import {
//   Package,
//   ShoppingCart,
//   CreditCard,
//   LayoutDashboard,
//   Users,
//   ClipboardList,
//   Truck,
//   BarChart2,
// } from "lucide-react"

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
//       <Link href="/shipments">
//         <Button
//           variant={pathname === "/shipments" || pathname.startsWith("/shipments/") ? "default" : "ghost"}
//           className="w-full justify-start gap-2"
//         >
//           <Truck className="h-4 w-4" />
//           Shipments
//         </Button>
//       </Link>
//       <Link href="/analytics">
//         <Button
//           variant={pathname === "/analytics" || pathname.startsWith("/analytics/") ? "default" : "ghost"}
//           className="w-full justify-start gap-2"
//         >
//           <BarChart2 className="h-4 w-4" />
//           Analytics
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
import { useAuth } from "@/lib/auth-context"

// Define navigation items with role-based access
const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "customer", "supplier"],
  },
  {
    href: "/inventory",
    label: "Inventory",
    icon: ShoppingCart,
    roles: ["admin"],
  },
  {
    href: "/products",
    label: "Products",
    icon: Package,
    roles: ["admin", "customer", "supplier"],
  },
  {
    href: "/customers",
    label: "Customers",
    icon: Users,
    roles: ["admin"],
  },
  {
    href: "/orders",
    label: "Orders",
    icon: ClipboardList,
    roles: ["admin", "customer", "supplier"],
  },
  {
    href: "/suppliers",
    label: "Suppliers",
    icon: Truck,
    roles: ["admin"],
  },
  {
    href: "/shipments",
    label: "Shipments",
    icon: Truck,
    roles: ["admin", "supplier"],
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart2,
    roles: ["admin"],
  },
  {
    href: "/payments",
    label: "Payments",
    icon: CreditCard,
    roles: ["admin"],
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) => item.roles.includes(user.role))

  return (
    <nav className="grid items-start gap-2 text-sm font-medium">
      {filteredNavItems.map((item) => {
        const Icon = item.icon
        return (
          <Link href={item.href} key={item.href}>
            <Button
              variant={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "default" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}

