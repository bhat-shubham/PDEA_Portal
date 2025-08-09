"use client"

import { AdminHeader } from "@/components/ui/adminheader"
import AllClasses from "@/components/ui/classes";
// import { CiCirclePlus } from "react-icons/ci";
import { useState } from "react";
// import {Checkbox } from "../../dashboard/ui/checkbox";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/app/dashboard/ui/input";
// import { Label } from "@/app/dashboard/ui/label";
// import { Clipboard, Check,CircleAlert,ChevronsRight, ChevronsLeft   } from 'lucide-react';
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
//   TooltipProvider
// } from "@/components/ui/tooltip"

export default function AdminDashboard() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  // const [attendance, setAttendance] = useState<{[key: string]: boolean}>({});
  // const [showAddClass, setShowAddClass] = useState(false);
  // const [newClass, setNewClass] = useState({
  //   className: '',
  //   subject: ''
  // });

  const handleClassClick = (classId: string) => {
    // 
  };


  const classes = [
    { id: "SE_IT", name: "SE IT", students: 30, attendance: "80%", room: "101" },
    { id: "BE_IT", name: "BE IT", students: 28, attendance: "90%", room: "103" },
  ];

  return (
    <>
      <AdminHeader />
      <div className="flex w-full flex-col min-h-full gap-6 p-6">
        <AllClasses />
      </div>
    </>
  )
}
