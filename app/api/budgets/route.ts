import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getUserByClerkId } from "@/lib/transaction-service"
import { getBudgets, createOrUpdateBudget } from "@/lib/budget-service"

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
    const { budgets } = body

    if (!budgets || !Array.isArray(budgets)) {
      return new NextResponse("Invalid budgets data", { status: 400 })
    }

    const results = []

    for (const budget of budgets) {
      const { category, monthlyLimit, month, year } = budget

      if (!category || monthlyLimit === undefined || !month || !year) {
        continue
      }

      const result = await createOrUpdateBudget({
        userId: user.id,
        category,
        monthlyLimit,
        month,
        year,
      })

      results.push(result)
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("[BUDGETS_POST]", error)
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

    const budgets = await getBudgets(user.id, {
      month,
      year,
      category,
    })

    return NextResponse.json(budgets)
  } catch (error) {
    console.error("[BUDGETS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

