import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getUserByClerkId, createTransaction, getTransactions } from "@/lib/transaction-service"

export async function POST(req: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await getUserByClerkId(userId)

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const body = await req.json()
    const { title, amount, type, category, date, notes } = body

    if (!title || !amount || !type || !category || !date) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const transaction = await createTransaction({
      userId: user.id,
      title,
      amount,
      type,
      category,
      date: new Date(date),
      notes,
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("[TRANSACTIONS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await getUserByClerkId(userId)

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const month = searchParams.get("month") ? Number.parseInt(searchParams.get("month")!) : undefined
    const year = searchParams.get("year") ? Number.parseInt(searchParams.get("year")!) : undefined
    const category = searchParams.get("category") || undefined
    const type = searchParams.get("type") as "income" | "expense" | undefined

    const transactions = await getTransactions(user.id, {
      month,
      year,
      category,
      type,
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("[TRANSACTIONS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

