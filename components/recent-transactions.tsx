import { formatCurrency, formatDate } from "@/lib/utils"
import { getCategoryById } from "@/lib/categories"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface Transaction {
  id: string
  title: string
  amount: number
  type: string
  category: string
  date: Date
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Link
          key={transaction.id}
          href={`/transactions/${transaction.id}`}
          className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
        >
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
            <span className={`font-medium ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}>
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

