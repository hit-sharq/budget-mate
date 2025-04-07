import { db } from "@/lib/db"

export async function createOrUpdateUser(clerkId: string, data: { name: string; email: string }) {
  const { name, email } = data

  const user = await db.user.upsert({
    where: { clerkId },
    create: {
      clerkId,
      name,
      email,
    },
    update: {
      name,
      email,
    },
  })

  return user
}

export async function deleteUser(clerkId: string) {
  await db.user.delete({
    where: { clerkId },
  })
}

