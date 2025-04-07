"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EXPENSE_CATEGORIES } from "@/lib/categories"
import { getCurrentMonthYear } from "@/lib/utils"
import { toast } from "sonner"

interface Budget {
  id: string
  category: string
  monthlyLimit: number
  month: number
  year: number
}

interface BudgetSettingsProps {
  budgets: Budget[]
}

export function BudgetSettings({ budgets }: BudgetSettingsProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { month, year } = getCurrentMonthYear()

  // Initialize budget values from existing budgets or set to 0
  const initialBudgetValues = EXPENSE_CATEGORIES.reduce(
    (acc, category) => {
      const existingBudget = budgets.find((b) => b.category === category.id)
      acc[category.id] = existingBudget ? existingBudget.monthlyLimit : 0
      return acc
    },
    {} as Record<string, number>,
  )

  const [budgetValues, setBudgetValues] = useState(initialBudgetValues)

  const handleBudgetChange = (category: string, value: string) => {
    const numericValue = value === "" ? 0 : Number.parseFloat(value)
    setBudgetValues({
      ...budgetValues,
      [category]: numericValue,
    })
  }

  const saveBudgets = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          budgets: Object.entries(budgetValues).map(([category, monthlyLimit]) => ({
            category,
            monthlyLimit,
            month,
            year,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save budgets")
      }

      toast("Budgets saved", {
        description: "Your budget limits have been updated successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error saving budgets:", error)
      toast.error("Error", {
        description: "Failed to save budgets. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {EXPENSE_CATEGORIES.map((category) => (
          <div key={category.id} className="space-y-2">
            <Label htmlFor={`budget-${category.id}`}>{category.name}</Label>
            <Input
              id={`budget-${category.id}`}
              type="number"
              min="0"
              step="0.01"
              value={budgetValues[category.id] || ""}
              onChange={(e) => handleBudgetChange(category.id, e.target.value)}
              placeholder="0.00"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={saveBudgets} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Budget Limits"}
        </Button>
      </div>
    </div>
  )
}

