// import Link from "next/link"
// import { ModeToggle } from "@/components/mode-toggle"
// import { Package2 } from "lucide-react"
// import { UserNav } from "@/components/user-nav"

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
//         <div className="flex items-center gap-2">
//           <ModeToggle />
//           <UserNav />
//         </div>
//       </div>
//     </header>
//   )
// }

import Link from "next/link"
import { Package2 } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Package2 className="h-6 w-6" />
          <Link href="/" className="font-bold">
            Inventory System
          </Link>
        </div>
      </div>
    </header>
  )
}

