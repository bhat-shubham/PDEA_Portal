/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// import { StudentSidebar } from "@/components/ui/studentsidebar"
import { StudentHeader } from "@/components/ui/studentheader";
import { SubjectAttendance } from "./subject-attendence";
import { Notifications } from "./notifications";
// import { Timetable } from "./timetable"
// import { LatestResults } from "./latest-results"
import { AttendanceGraph } from "./attendence-graph";
import {TestSocket} from "@/app/lib/TestSocket";
import { useEffect } from "react";

export default function Dashboard() {
   const res = useEffect(() => {
    const socket = TestSocket();
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

   })

  return (
    <div className="h-full flex flex-col">
      <StudentHeader />
      <main className="flex-1 p-6 overflow-hidden">
        <div className="grid grid-cols-2 gap-6 h-full">
          <div className="h-full">
            <AttendanceGraph />
          </div>
          <div className="flex flex-col gap-6 h-full">
            <div className="h-[60%]">
              <SubjectAttendance />
            </div>
            <div className="h-[40%]">
              <Notifications />
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
  );
}
