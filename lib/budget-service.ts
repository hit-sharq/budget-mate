import { db } from "@/lib/db"
import { getCurrentMonthYear } from "@/lib/utils"

export async function getBudgets(
  userId: string,
  options: {
    month?: number
    year?: number
    category?: string
  } = {},
) {
  const { month, year, category } = options
  const { month: currentMonth, year: currentYear } = getCurrentMonthYear()

  const whereClause: any = { userId }

  if (month) {
    whereClause.month = month
  }

  if (year) {
    whereClause.year = year
  }

  if (category) {
    whereClause.category = category
  }

  return db.budget.findMany({
    where: whereClause,
  })
}

export async function getBudgetById(id: string, userId: string) {
  return db.budget.findFirst({
    where: { id, userId },
  })
}

export async function createOrUpdateBudget(data: {
  userId: string
  category: string
  monthlyLimit: number
  month: number
  year: number
}) {
  const { userId, category, monthlyLimit, month, year } = data

  return db.budget.upsert({
    where: {
      userId_category_month_year: {
        userId,
        category,
        month,
        year,
      },
    },
    update: {
      monthlyLimit,
    },
    create: data,
  })
}

export async function deleteBudget(id: string, userId: string) {
  return db.budget.delete({
    where: { id, userId },
  })
}

export async function getBudgetSummary(userId: string, month: number, year: number) {
  const budgets = await db.budget.findMany({
    where: {
      userId,
      month,
      year,
    },
  })

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      type: "expense",
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  })

  const categorySpending = transactions.reduce(
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

  const budgetSummary = budgets.map((budget) => {
    const spent = categorySpending[budget.category] || 0
    const remaining = budget.monthlyLimit - spent
    const percentage = budget.monthlyLimit > 0 ? Math.min(100, (spent / budget.monthlyLimit) * 100) : 0

    return {
      ...budget,
      spent,
      remaining,
      percentage,
    }
  })

  return budgetSummary
}

