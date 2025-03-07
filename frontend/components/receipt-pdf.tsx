"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { PaymentResponse } from "@/lib/types"

interface ReceiptPDFProps {
  payment: PaymentResponse
}
 // Helper function to format price safely
 const formatPrice = (price: any): string => {
    // Convert to number if it's not already
    const numPrice = typeof price === 'number' ? price : Number(price);
    
    // Check if conversion resulted in a valid number
    if (isNaN(numPrice)) {
      return '0.00'; // Return default if not a valid number
    }
    
    return numPrice.toFixed(2); // Fix: Format without recursion
  }
export function ReceiptPDF({ payment }: ReceiptPDFProps) {
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    setIsPrinting(true)

    // Create a printable version
    const printContent = document.getElementById("receipt-content")
    const printWindow = window.open("", "_blank")

    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Payment Receipt #${payment.payment_id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .receipt { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #eee; }
              .header { text-align: center; margin-bottom: 20px; }
              .details { margin-bottom: 20px; }
              .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
              .footer { margin-top: 30px; text-align: center; font-size: 14px; color: #666; }
              @media print {
                body { padding: 0; }
                .receipt { border: none; }
                .print-button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <h1>Payment Receipt</h1>
                <p>Inventory Management System</p>
              </div>
              <div class="details">
                <div class="row">
                  <strong>Receipt Number:</strong>
                  <span>#${payment.payment_id}</span>
                </div>
                <div class="row">
                  <strong>Order ID:</strong>
                  <span>#${payment.order_id}</span>
                </div>
                <div class="row">
                  <strong>Payment Date:</strong>
                  <span>${new Date(payment.payment_date).toLocaleDateString()}</span>
                </div>
                <div class="row">
                  <strong>Order Date:</strong>
                  <span>${payment.order_date ? new Date(payment.order_date).toLocaleDateString() : "N/A"}</span>
                </div>
                <div class="row">
                  <strong>Customer:</strong>
                  <span>${payment.customer_name || "N/A"}</span>
                </div>
                <div class="row">
                  <strong>Amount Paid:</strong>
                  <span>$${formatPrice(payment.amount)}</span>
                </div>
              </div>
              <div class="footer">
                <p>Thank you for your business!</p>
                <p>This is a computer-generated receipt and does not require a signature.</p>
              </div>
            </div>
            <div class="print-button" style="text-align: center; margin-top: 20px;">
              <button onclick="window.print(); window.close();" style="padding: 10px 20px;">Print Receipt</button>
            </div>
          </body>
        </html>
      `)

      printWindow.document.close()
      setIsPrinting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Payment Receipt #{payment.payment_id}</DialogTitle>
        </DialogHeader>
        <div id="receipt-content" className="mt-4 border rounded-md p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Receipt Number</p>
                <p className="font-medium">#{payment.payment_id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-medium">#{payment.order_id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Date</p>
                <p className="font-medium">{new Date(payment.payment_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">
                  {payment.order_date ? new Date(payment.order_date).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{payment.customer_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount Paid</p>
                <p className="font-medium">${formatPrice(payment.amount)}</p>
              </div>
            </div>
            <div className="pt-4 border-t text-center text-sm text-muted-foreground">
              <p>Thank you for your business!</p>
              <p>This is a computer-generated receipt and does not require a signature.</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handlePrint} disabled={isPrinting}>
            {isPrinting ? "Generating..." : "Download Receipt"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

