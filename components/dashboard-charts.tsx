"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatCurrency } from "@/lib/utils"

interface DashboardChartsProps {
  stats: {
    income: number
    expenses: number
  }
}

export function DashboardCharts({ stats }: DashboardChartsProps) {
  const data = [
    {
      name: "Income",
      value: stats.income,
      fill: "#22c55e",
    },
    {
      name: "Expenses",
      value: stats.expenses,
      fill: "#ef4444",
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `$${value}`} />
        <Tooltip formatter={(value) => formatCurrency(value as number)} />
        <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

