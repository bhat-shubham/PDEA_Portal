/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { AdminHeader } from "@/components/ui/adminheader";
import AllClasses from "@/components/ui/classes";

// import { useState, useEffect } from "react";
// import { useTestSocket } from "@/app/lib/TestSocket";

export default function AdminDashboard() {
  // const [selectedClass, setSelectedClass] = useState<string | null>(null);
  // const [attendance, setAttendance] = useState<{[key: string]: boolean}>({});
  // const [showAddClass, setShowAddClass] = useState(false);
  // const [newClass, setNewClass] = useState({
  //   className: '',
  //   subject: ''
  // });

  return (
    <>
      <AdminHeader />
      <div className="flex w-full flex-col min-h-full gap-6 p-6">
        <AllClasses />
      </div>
    </>
  );
}
