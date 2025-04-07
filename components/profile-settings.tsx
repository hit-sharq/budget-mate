"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"

interface User {
  id: string
  name: string
  email: string
}

interface ProfileSettingsProps {
  user: User
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const router = useRouter()
  const { user: clerkUser, isLoaded } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUpdateProfile = async () => {
    if (!isLoaded || !clerkUser) return

    setIsSubmitting(true)

    try {
      await clerkUser.update({
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
      })

      toast("Profile updated", {
        description: "Your profile has been updated successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Error", {
        description: "Failed to update profile. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={clerkUser?.fullName || ""} disabled />
        <p className="text-sm text-muted-foreground">To change your name, please update your Clerk profile.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={clerkUser?.primaryEmailAddress?.emailAddress || ""} disabled />
        <p className="text-sm text-muted-foreground">To change your email, please update your Clerk profile.</p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleUpdateProfile} disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </div>
  )
}

