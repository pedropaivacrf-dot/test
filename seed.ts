import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create default tasks
  const tasks = [
    {
      order: 1,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris",
      rewardAmount: 12,
    },
    {
      order: 2,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      question: "What is the largest planet in our solar system?",
      options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
      correctAnswer: "Jupiter",
      rewardAmount: 15,
    },
    {
      order: 3,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      question: "What year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correctAnswer: "1945",
      rewardAmount: 18,
    },
  ]

  for (const task of tasks) {
    const existing = await prisma.task.findFirst({
      where: { order: task.order },
    })

    if (!existing) {
      await prisma.task.create({ data: task })
      console.log(`Created task ${task.order}`)
    }
  }

  // Create admin user
  const adminPassword = await hash("admin123", 10)
  const adminExists = await prisma.user.findUnique({
    where: { email: "admin@taskflow.com" },
  })

  if (!adminExists) {
    await prisma.user.create({
      data: {
        email: "admin@taskflow.com",
        name: "Admin User",
        password: adminPassword,
        isAdmin: true,
        isActive: true,
        balance: 0,
      },
    })
    console.log("Created admin user (admin@taskflow.com / admin123)")
  }

  console.log("Database seeding complete!")
}

main()
  .catch((e) => {
    console.error("Seeding error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
