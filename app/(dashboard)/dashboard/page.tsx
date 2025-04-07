'use client'

import { redirect } from "next/navigation"
import { getMonthlyStats, getTransactions } from "@/lib/transaction-service"
import { getBudgetSummary } from "@/lib/budget-service"
import { getCurrentMonthYear, formatCurrency, getMonthName } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { getCategoryById, getCategoryColor } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { DashboardCharts } from "@/components/dashboard-charts"
import { RecentTransactions } from "@/components/recent-transactions"

interface BudgetSummary {
  id: string
  category: string
  spent: number
  monthlyLimit: number
  percentage: number
  remaining: number
}

interface DashboardPageProps {
  userId: string
}

export default async function DashboardPage({ userId }: DashboardPageProps) {
  if (!userId) {
    redirect("/")
  }

  const { month, year } = getCurrentMonthYear()
  const stats = await getMonthlyStats(userId, month, year)
  const budgetSummary = await getBudgetSummary(userId, month, year)
  const recentTransactions = await getTransactions(userId, { limit: 5 })

  const monthName = getMonthName(month)
  const pieData = Object.entries(stats.categorySummary).map(([category, amount]) => ({
    name: getCategoryById(category).name,
    value: amount,
    color: getCategoryColor(category),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/transactions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(stats.income)}</div>
            <p className="text-xs text-muted-foreground">For {monthName} {year}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatCurrency(stats.expenses)}</div>
            <p className="text-xs text-muted-foreground">For {monthName} {year}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.balance >= 0 ? "text-green-500" : "text-red-500"}`}>
              {formatCurrency(stats.balance)}
            </div>
            <p className="text-xs text-muted-foreground">For {monthName} {year}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Your spending by category for {monthName} {year}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>Comparison for {monthName} {year}</CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardCharts stats={stats} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest 5 transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions transactions={recentTransactions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {budgetSummary.length > 0 ? (
              budgetSummary.map((budget: BudgetSummary) => (
                <Card key={budget.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{getCategoryById(budget.category).name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{formatCurrency(budget.spent)}</span>
                      <span className="text-sm text-muted-foreground">of {formatCurrency(budget.monthlyLimit)}</span>
                    </div>
                    <Progress
                      value={budget.percentage}
                      className={`mt-2 ${
                        budget.percentage > 90
                          ? "[&>div]:bg-red-500"
                          : budget.percentage > 75
                            ? "[&>div]:bg-yellow-500"
                            : "[&>div]:bg-green-500"
                      }`}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {budget.remaining > 0
                        ? `${formatCurrency(budget.remaining)} remaining`
                        : `Over budget by ${formatCurrency(Math.abs(budget.remaining))}`}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>No Budgets Set</CardTitle>
                  <CardDescription>You haven't set any budget limits yet.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/settings">
                    <Button>Set Budget Limits</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
