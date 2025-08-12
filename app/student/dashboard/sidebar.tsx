import { Home, Calendar, BookOpen, Bell, User } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background p-6">
      <div className="flex items-center mb-8">
        <div className="w-8 h-8 rounded-full bg-primary mr-3"></div>
        <h2 className="text-xl font-semibold">EduDash</h2>
      </div>
      <nav className="space-y-8">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Main</h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/">
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/timetable">
                <Calendar className="mr-3 h-5 w-5" />
                Timetable
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/courses">
                <BookOpen className="mr-3 h-5 w-5" />
                Courses
              </Link>
            </Button>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Account</h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/notifications">
                <Bell className="mr-3 h-5 w-5" />
                Notifications
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/profile">
                <User className="mr-3 h-5 w-5" />
                Profile
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </aside>
  )
}

