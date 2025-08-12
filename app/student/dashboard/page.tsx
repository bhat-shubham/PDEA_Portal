import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { SubjectAttendance } from "./subject-attendence"
import { Notifications } from "./notifications"
import { Timetable } from "./timetable"
import { LatestResults } from "./latest-results"
import { AttendanceGraph } from "./attendence-graph"

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full relative">
  {/* Cosmic Aurora */}
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: `
        radial-gradient(ellipse at 20% 30%, rgba(56, 189, 248, 0.4) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 70%),
        radial-gradient(ellipse at 60% 20%, rgba(236, 72, 153, 0.25) 0%, transparent 50%),
        radial-gradient(ellipse at 40% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 65%)
      `,
    }}
  />
    <div className="flex z-[999] h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 h-full overflow-x-hidden overflow-y-auto p-6">
          <div className="flex justify- gap-3 w-full h-full">
            <div className="w-1/2 h-full">
              <AttendanceGraph />
            </div>
            <div className="w-1/2 flex flex-col gap-5">
            <div className="h-3/5">
              <SubjectAttendance />
            </div>
            <div>
              <Notifications/>
            </div>
            </div>
            {/* <div className="lg:col-span-2">
              <Timetable />
            </div>
            <div>
              <Notifications />
            </div>
            <div className="lg:col-span-3">
              <LatestResults />
            </div> */}
          </div>
        </main>
      </div>
    </div>
    </div>
  )
}


