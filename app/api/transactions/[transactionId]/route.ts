import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getUserByClerkId, getTransactionById, updateTransaction, deleteTransaction } from "@/lib/transaction-service"

export async function GET(req: Request, { params }: { params: { transactionId: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await getUserByClerkId(userId)

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const transaction = await getTransactionById(params.transactionId, user.id)

    if (!transaction) {
      return new NextResponse("Transaction not found", { status: 404 })
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("[TRANSACTION_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { transactionId: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await getUserByClerkId(userId)

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const transaction = await getTransactionById(params.transactionId, user.id)

    if (!transaction) {
      return new NextResponse("Transaction not found", { status: 404 })
    }

    const body = await req.json()
    const { title, amount, type, category, date, notes } = body

    const updatedTransaction = await updateTransaction(params.transactionId, user.id, {
      title,
      amount,
      type,
      category,
      date: date ? new Date(date) : undefined,
      notes,
    })

    return NextResponse.json(updatedTransaction)
  } catch (error) {
    console.error("[TRANSACTION_PUT]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { transactionId: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await getUserByClerkId(userId)

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const transaction = await getTransactionById(params.transactionId, user.id)

    if (!transaction) {
      return new NextResponse("Transaction not found", { status: 404 })
    }

    await deleteTransaction(params.transactionId, user.id)

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[TRANSACTION_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

