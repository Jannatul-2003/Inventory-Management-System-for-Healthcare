// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// export function RecentSales() {
//   return (
//     <div className="space-y-8">
//       <div className="flex items-center">
//         <Avatar className="h-9 w-9">
//           <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
//           <AvatarFallback>OM</AvatarFallback>
//         </Avatar>
//         <div className="ml-4 space-y-1">
//           <p className="text-sm font-medium leading-none">Olivia Martin</p>
//           <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
//         </div>
//         <div className="ml-auto font-medium">+$1,999.00</div>
//       </div>
//       <div className="flex items-center">
//         <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
//           <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
//           <AvatarFallback>JL</AvatarFallback>
//         </Avatar>
//         <div className="ml-4 space-y-1">
//           <p className="text-sm font-medium leading-none">Jackson Lee</p>
//           <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
//         </div>
//         <div className="ml-auto font-medium">+$39.00</div>
//       </div>
//       <div className="flex items-center">
//         <Avatar className="h-9 w-9">
//           <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
//           <AvatarFallback>IN</AvatarFallback>
//         </Avatar>
//         <div className="ml-4 space-y-1">
//           <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
//           <p className="text-sm text-muted-foreground">isabella.nguyen@email.com</p>
//         </div>
//         <div className="ml-auto font-medium">+$299.00</div>
//       </div>
//       <div className="flex items-center">
//         <Avatar className="h-9 w-9">
//           <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
//           <AvatarFallback>WK</AvatarFallback>
//         </Avatar>
//         <div className="ml-4 space-y-1">
//           <p className="text-sm font-medium leading-none">William Kim</p>
//           <p className="text-sm text-muted-foreground">will@email.com</p>
//         </div>
//         <div className="ml-auto font-medium">+$99.00</div>
//       </div>
//     </div>
//   )
// }

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Customer {
  name: string
  email: string
  amount: number
}

interface RecentSalesProps {
  customers?: Customer[]
}
// Helper function to format price safely
const formatPrice = (price: any): string => {
  // Convert to number if it's not already
  const numPrice = typeof price === 'number' ? price : Number(price);
  
  // Check if conversion resulted in a valid number
  if (isNaN(numPrice)) {
    return '0.00'; // Return default if not a valid number
  }
  
  return numPrice.toFixed(2);
}
export function RecentSales({ customers }: RecentSalesProps) {
  const defaultCustomers: Customer[] = [
    {
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      amount: 1999.0,
    },
    {
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      amount: 39.0,
    },
    {
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      amount: 299.0,
    },
    {
      name: "William Kim",
      email: "will@email.com",
      amount: 99.0,
    },
  ]

  const displayCustomers = customers && customers.length > 0 ? customers : defaultCustomers

  return (
    <div className="space-y-8">
      {displayCustomers.map((customer, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
            <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
          <div className="ml-auto font-medium">+${formatPrice(customer.amount)}</div>
        </div>
      ))}
    </div>
  )
}

