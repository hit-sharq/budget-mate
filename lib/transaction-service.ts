import { db } from "@/lib/db"
import { getCurrentMonthYear } from "@/lib/utils"

export async function getUserByClerkId(clerkId: string) {
  return db.user.findUnique({
    where: { clerkId },
  })
}

export async function getTransactions(
  userId: string,
  options: {
    month?: number
    year?: number
    category?: string
    type?: "income" | "expense"
    limit?: number
  } = {},
) {
  const { month, year, category, type, limit } = options
  const { month: currentMonth, year: currentYear } = getCurrentMonthYear()

  const whereClause: any = { userId }

  if (month) {
    whereClause.date = {
      gte: new Date(year || currentYear, month - 1, 1),
      lt: new Date(year || currentYear, month, 0),
    }
  } else if (year) {
    whereClause.date = {
      gte: new Date(year, 0, 1),
      lt: new Date(year + 1, 0, 1),
    }
  }

  if (category) {
    whereClause.category = category
  }

  if (type) {
    whereClause.type = type
  }

  return db.transaction.findMany({
    where: whereClause,
    orderBy: { date: "desc" },
    take: limit,
  })
}

export async function getTransactionById(id: string, userId: string) {
  return db.transaction.findFirst({
    where: { id, userId },
  })
}

export async function createTransaction(data: {
  userId: string
  title: string
  amount: number
  type: string
  category: string
  date: Date
  notes?: string
}) {
  return db.transaction.create({
    data,
  })
}

export async function updateTransaction(
  id: string,
  userId: string,
  data: {
    title?: string
    amount?: number
    type?: string
    category?: string
    date?: Date
    notes?: string
  },
) {
  return db.transaction.update({
    where: { id, userId },
    data,
  })
}

export async function deleteTransaction(id: string, userId: string) {
  return db.transaction.delete({
    where: { id, userId },
  })
}

export async function getMonthlyStats(userId: string, month: number, year: number) {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  })

  const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expenses

  const categorySummary = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        const category = t.category
        if (!acc[category]) {
          acc[category] = 0
        }
        acc[category] += t.amount
        return acc
      },
      {} as Record<string, number>,
    )

  return {
    income,
    expenses,
    balance,
    categorySummary,
  }
}

