"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CATEGORIES, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/lib/categories"
import { getCurrentMonthYear, getMonthName } from "@/lib/utils"

export function TransactionFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { month: currentMonth, year: currentYear } = getCurrentMonthYear()

  const [month, setMonth] = useState(searchParams.get("month") || currentMonth.toString())
  const [year, setYear] = useState(searchParams.get("year") || currentYear.toString())
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [type, setType] = useState(searchParams.get("type") || "")

  // Generate years (current year and 2 years back)
  const years = Array.from({ length: 3 }, (_, i) => (currentYear - 2 + i).toString())

  // Generate months
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: getMonthName(i + 1),
  }))

  // Filter categories based on selected type
  const filteredCategories =
    type === "income" ? INCOME_CATEGORIES : type === "expense" ? EXPENSE_CATEGORIES : CATEGORIES

  useEffect(() => {
    // If type changes, reset category if it's not valid for the new type
    if (type === "income" && category && !INCOME_CATEGORIES.some((c) => c.id === category)) {
      setCategory("")
    } else if (type === "expense" && category && !EXPENSE_CATEGORIES.some((c) => c.id === category)) {
      setCategory("")
    }
  }, [type, category])

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (month) params.set("month", month)
    if (year) params.set("year", year)
    if (category) params.set("category", category)
    if (type) params.set("type", type)

    router.push(`/transactions?${params.toString()}`)
  }

  const resetFilters = () => {
    setMonth(currentMonth.toString())
    setYear(currentYear.toString())
    setCategory("")
    setType("")
    router.push("/transactions")
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Select value={month} onValueChange={setMonth}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={year} onValueChange={setYear}>
        <SelectTrigger className="w-full sm:w-[120px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="income">Income</SelectItem>
          <SelectItem value="expense">Expense</SelectItem>
        </SelectContent>
      </Select>

      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {filteredCategories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button onClick={applyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>
    </div>
  )
}

