import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getUserByClerkId } from "@/lib/transaction-service"
import { getBudgets } from "@/lib/budget-service"
import { getCurrentMonthYear } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BudgetSettings } from "@/components/budget-settings"
import { ProfileSettings } from "@/components/profile-settings"

export default async function SettingsPage() {
  const { userId: clerkId } = auth()

  if (!clerkId) {
    redirect("/")
  }

  const user = await getUserByClerkId(clerkId)

  if (!user) {
    return <div>User not found</div>
  }

  const { month, year } = getCurrentMonthYear()
  const budgets = await getBudgets(user.id, { month, year })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <Tabs defaultValue="budget" className="space-y-4">
        <TabsList>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Budget Settings</CardTitle>
              <CardDescription>Set monthly spending limits for each category</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetSettings budgets={budgets} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileSettings user={user} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

