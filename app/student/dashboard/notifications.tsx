import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Bell } from "lucide-react"

const notifications = [
  { id: 1, message: "Assignment due tomorrow", time: "2 hours ago" },
  { id: 2, message: "New course material available", time: "1 day ago" },
  { id: 3, message: "Exam schedule updated", time: "2 days ago" },
]

export function Notifications() {
  return (
    <Card className="relative h-full items-center dark:bg-white/10">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li key={notification.id} className="flex justify-between items-start">
              <span className="text-md">{notification.message}</span>
              <span className="text-sm text-muted-foreground">{notification.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

