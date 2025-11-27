import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSession, getCurrentUser } from "@/lib/auth"
import db from "@/lib/db"
import TaskDetail from "@/components/dashboard/task-detail"

export const metadata: Metadata = {
  title: "Complete Task - Task Platform",
}

export default async function TaskPage({ params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const task = await db.task.findUnique({
    where: { id: params.id },
  })

  if (!task) {
    redirect("/dashboard")
  }

  const completion = await db.taskCompletion.findUnique({
    where: {
      userId_taskId: {
        userId: user.id,
        taskId: task.id,
      },
    },
  })

  if (completion) {
    redirect("/dashboard")
  }

  return <TaskDetail task={task} userId={user.id} />
}
