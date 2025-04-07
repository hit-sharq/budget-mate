import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getUserByClerkId, getTransactionById } from "@/lib/transaction-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionForm } from "@/components/transaction-form"

export default async function EditTransactionPage({
  params,
}: {
  params: { transactionId: string }
}) {
  const { userId: clerkId } = auth()

  if (!clerkId) {
    redirect("/")
  }

  const user = await getUserByClerkId(clerkId)

  if (!user) {
    return <div>User not found</div>
  }

  const transaction = await getTransactionById(params.transactionId, user.id)

  if (!transaction) {
    return <div>Transaction not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Edit Transaction</h1>

      <Card>
        <CardHeader>
          <CardTitle>Edit Transaction</CardTitle>
          <CardDescription>Update the details of your transaction</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionForm
            defaultValues={{
              title: transaction.title,
              amount: transaction.amount,
              type: transaction.type as "income" | "expense",
              category: transaction.category,
              date: new Date(transaction.date),
              notes: transaction.notes || "",
            }}
            transactionId={transaction.id}
          />
        </CardContent>
      </Card>
    </div>
  )
}

