import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getUserByClerkId, getTransactions } from "@/lib/transaction-service"
import { getCurrentMonthYear, formatCurrency, formatDate, getMonthName } from "@/lib/utils"
import { getCategoryById } from "@/lib/categories"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, ArrowUpRight, ArrowDownRight, Pencil, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TransactionFilters } from "@/components/transaction-filters"

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { userId: clerkId } = auth()

  if (!clerkId) {
    redirect("/")
  }

  const user = await getUserByClerkId(clerkId)

  if (!user) {
    return <div>User not found</div>
  }

  const { month: currentMonth, year: currentYear } = getCurrentMonthYear()

  const month = searchParams.month ? Number.parseInt(searchParams.month as string) : currentMonth
  const year = searchParams.year ? Number.parseInt(searchParams.year as string) : currentYear
  const category = searchParams.category as string | undefined
  const type = searchParams.type as "income" | "expense" | undefined

  const transactions = await getTransactions(user.id, {
    month,
    year,
    category,
    type,
  })

  const monthName = getMonthName(month)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <Link href="/transactions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Viewing transactions for {monthName} {year}
            {category && ` in ${getCategoryById(category).name} category`}
            {type && ` (${type})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionFilters />

          <div className="mt-6 space-y-4">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"}`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.title}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{getCategoryById(transaction.category).name}</Badge>
                    <span
                      className={`font-medium ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link href={`/transactions/${transaction.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <Link href={`/transactions/${transaction.id}/delete`}>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No transactions found</p>
                <Link href="/transactions/new" className="mt-4 inline-block">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Transaction
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

