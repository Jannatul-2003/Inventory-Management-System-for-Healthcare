"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface OverviewProps {
  data?: { name: string; total: number }[]
}

export function Overview({ data }: OverviewProps) {
  const defaultData = [
    {
      name: "Jan",
      total: 1200,
    },
    {
      name: "Feb",
      total: 2100,
    },
    {
      name: "Mar",
      total: 1800,
    },
    {
      name: "Apr",
      total: 2400,
    },
    {
      name: "May",
      total: 2700,
    },
    {
      name: "Jun",
      total: 1700,
    },
    {
      name: "Jul",
      total: 2900,
    },
    {
      name: "Aug",
      total: 3100,
    },
    {
      name: "Sep",
      total: 2400,
    },
    {
      name: "Oct",
      total: 2800,
    },
    {
      name: "Nov",
      total: 3200,
    },
    {
      name: "Dec",
      total: 3600,
    },
  ]

  const chartData = data && data.length > 0 ? data : defaultData

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `৳${value}`}
        />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

