"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function DeleteTransactionPage({
  params,
}: {
  params: { transactionId: string }
}) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [transaction, setTransaction] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(`/api/transactions/${params.transactionId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch transaction")
        }

        const data = await response.json()
        setTransaction(data)
      } catch (error) {
        console.error("Error fetching transaction:", error)
        toast.error("Error", {
          description: "Failed to fetch transaction details.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransaction()
  }, [params.transactionId])

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/transactions/${params.transactionId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete transaction")
      }

      toast("Transaction deleted", {
        description: "Your transaction has been deleted successfully.",
      })

      router.push("/transactions")
      router.refresh()
    } catch (error) {
      console.error("Error deleting transaction:", error)
      toast.error("Error", {
        description: "Failed to delete transaction. Please try again.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Transaction not found</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Delete Transaction</h1>

      <Card>
        <CardHeader>
          <CardTitle>Confirm Deletion</CardTitle>
          <CardDescription>
            Are you sure you want to delete this transaction? This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-2">
              <div className="font-medium">Title:</div>
              <div>{transaction.title}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="font-medium">Amount:</div>
              <div>{transaction.amount}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="font-medium">Type:</div>
              <div>{transaction.type}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="font-medium">Category:</div>
              <div>{transaction.category}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="font-medium">Date:</div>
              <div>{new Date(transaction.date).toLocaleDateString()}</div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.back()} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Transaction"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

