import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  const { userId } = auth()

  if (userId) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">BudgetMate</span>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <SignInButton mode="modal">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Take control of your <span className="text-primary">finances</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Track your income and expenses, set budget goals, and visualize your spending habits with BudgetMate.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <SignUpButton mode="modal">
                <Button size="lg">Get Started</Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </SignInButton>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

