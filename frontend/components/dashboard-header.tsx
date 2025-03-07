

// import Link from "next/link"
// import { Package2 } from "lucide-react"

// export function DashboardHeader() {
//   return (
//     <header className="sticky top-0 z-40 border-b bg-background">
//       <div className="container flex h-16 items-center justify-between py-4">
//         <div className="flex items-center gap-2">
//           <Package2 className="h-6 w-6" />
//           <Link href="/" className="font-bold">
//             Inventory System
//           </Link>
//         </div>
//       </div>
//     </header>
//   )
// }

"use client"

import Link from "next/link"
import { Package2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { UserNav } from "@/components/user-nav"

export function DashboardHeader() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Package2 className="h-6 w-6" />
          <Link href="/" className="font-bold">
            Inventory System
          </Link>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Logged in as <span className="font-medium">{user.name}</span> ({user.role})
            </span>
            <UserNav />
          </div>
        )}
      </div>
    </header>
  )
}

