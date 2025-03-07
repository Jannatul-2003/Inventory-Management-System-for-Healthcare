"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, CheckCircle2, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import { getPayments, getPaymentAnalysis } from "@/lib/services/payment-service"
import type { PaymentResponse, PaymentAnalysis } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ReceiptPDF } from "@/components/receipt-pdf"

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentResponse[]>([])
  const [analysis, setAnalysis] = useState<PaymentAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch payments
        const paymentsData = await getPayments(startDate, endDate)
        setPayments(paymentsData)

        // Fetch payment analysis
        const analysisData = await getPaymentAnalysis()
        setAnalysis(analysisData)
      } catch (error) {
        console.error("Failed to fetch payments:", error)
        toast({
          title: "Error",
          description: "Failed to load payment data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate, toast])

  // Helper function to safely format currency values
  const formatCurrency = (amount: any): string => {
    const numAmount = typeof amount === "number" ? amount : Number(amount)
    return isNaN(numAmount) ? "0.00" : numAmount.toFixed(2)
  }

  const getStatusBadge = (status: string | undefined) => {
    // Handle undefined or null status
    if (!status) {
      return <Badge>Unknown</Badge>
    }

    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex w-fit items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex w-fit items-center gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex w-fit items-center gap-1">
            <XCircle className="h-3 w-3" /> Failed
          </Badge>
        )
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <DashboardNav />
        <main className="flex w-full flex-col overflow-hidden">
          <DashboardShell>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
                <p className="text-muted-foreground">View and manage payment transactions</p>
              </div>
              <Link href="/payments/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Payment
                </Button>
              </Link>
            </div>
          </DashboardShell>

          {analysis.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment Analysis</CardTitle>
                <CardDescription>Payment trends by period</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analysis}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total_payments" fill="#8884d8" name="Total Payments" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  className="w-auto"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span>to</span>
                <Input type="date" className="w-auto" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading payment data...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        No payment transactions found. Try different filters or add a new payment.
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment) => (
                      <TableRow key={payment.payment_id}>
                        <TableCell className="font-medium">#{payment.payment_id}</TableCell>
                        <TableCell>#{payment.order_id}</TableCell>
                        <TableCell>
                          {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell>
                          {payment.order_date ? new Date(payment.order_date).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell>{payment.customer_name || "Unknown"}</TableCell>
                        <TableCell>৳ {formatCurrency(payment.amount)}</TableCell>
                        <TableCell className="text-right">
                          <ReceiptPDF payment={payment} />
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
  )
}

