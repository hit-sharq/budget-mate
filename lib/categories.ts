export const CATEGORIES = [
  { id: "food", name: "Food", color: "#FF6B6B" },
  { id: "housing", name: "Housing", color: "#4ECDC4" },
  { id: "transportation", name: "Transportation", color: "#FFD166" },
  { id: "utilities", name: "Utilities", color: "#6B5B95" },
  { id: "entertainment", name: "Entertainment", color: "#FF8C42" },
  { id: "healthcare", name: "Healthcare", color: "#F25F5C" },
  { id: "shopping", name: "Shopping", color: "#65C3C8" },
  { id: "personal", name: "Personal", color: "#AEBD38" },
  { id: "education", name: "Education", color: "#598234" },
  { id: "salary", name: "Salary", color: "#2D936C" },
  { id: "investment", name: "Investment", color: "#5C80BC" },
  { id: "other", name: "Other", color: "#9C89B8" },
]

export function getCategoryById(id: string) {
  return CATEGORIES.find((category) => category.id === id) || CATEGORIES[CATEGORIES.length - 1]
}

export function getCategoryColor(id: string) {
  return getCategoryById(id).color
}

export function getCategoryName(id: string) {
  return getCategoryById(id).name
}

export const INCOME_CATEGORIES = CATEGORIES.filter((c) => ["salary", "investment", "other"].includes(c.id))

export const EXPENSE_CATEGORIES = CATEGORIES.filter((c) => !["salary", "investment"].includes(c.id))

