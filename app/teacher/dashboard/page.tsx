"use client";

import { Header } from "@/components/ui/teacherheader";

import { CiCirclePlus } from "react-icons/ci";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CircleAlert,
  ChevronsRight,
  ChevronsLeft,
  EllipsisVertical,
  PencilLine,
  Trash2,
} from "lucide-react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
//   TooltipProvider,
// } from "@/components/ui/tooltip";
import { teacherClass } from "@/app/lib/teacherClass";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// import { set } from "date-fns";
export default function Dashboard() {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});
  const [presentCount, setPresentCount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [showAddClass, setShowAddClass] = useState(false);
  const [newClass, setNewClass] = useState({ name: "", subject: "" });

  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    type: null as "edit" | "delete" | null,
    classId: null as string | null,
    className: "",
    newClassName: "",
  });

  type ClassType = {
    _id: string;
    id: string;
    name: string;
    subject: number;
    count: string;
    class_code: string;
  };

  // --- API FUNCTIONS ---
  const fetchClasses = async () => {
    try {
      const data = await teacherClass("GET", "getClass");
      console.log("Fetched classes:", data);
      if (data?.classes && Array.isArray(data.classes)) {
        setClasses(data.classes as ClassType[]);
      } else {
        console.log("No classes found");
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const createClass = async () => {
    try {
      const data = await teacherClass("POST", "class", newClass);

      if (data?.message === "Class creat" && data?.class) {
        setClasses((prev) => [...prev, data.class]);

        setShowAddClass(false);
        setNewClass({ name: "", subject: "" });

        console.log("Class created successfully:", data.class);
      } else {
        console.error("Failed to create class:", data);
      }
    } catch (err) {
      console.error("Error creating class:", err);
    }
  };
  const deleteClass = async (classId: string) => {
    try {
      const res = await teacherClass("DELETE", `deleteClass/${classId}`);

      if (res?.message === "Class deleted successfully.") {
        // Remove from UI instantly
        setClasses((prev) =>
          prev.filter((cls) => cls._id !== classId && cls.id !== classId)
        );

        console.log("Class deleted successfully:", classId);

        // Optional: refresh list to stay 100% in sync
        // await fetchClasses();
      } else {
        console.error("Failed to delete class:", res);
      }
    } catch (err) {
      console.error("Error deleting class:", err);
    }
  };

  const handleEditClick = (classId: string, className: string) => {
    setConfirmationDialog({
      isOpen: true,
      type: "edit",
      classId,
      className,
      newClassName: className,
    });
  };

  const handleDeleteClick = (classId: string, className: string) => {
    setConfirmationDialog({
      isOpen: true,
      type: "delete",
      classId,
      className,
      newClassName: "",
    });
  };

  const handleDialogConfirm = () => {
    if (confirmationDialog.type === "delete" && confirmationDialog.classId) {
      deleteClass(confirmationDialog.classId);
      console.log("Deleted class:", confirmationDialog.classId);
    }
    setConfirmationDialog({
      isOpen: false,
      type: null,
      classId: null,
      className: "",
      newClassName: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationDialog((prev) => ({
      ...prev,
      newClassName: e.target.value,
    }));
  };

  // --- CLASS ACTIONS ---
  const handleClassClick = (classId: string) => {
    setSelectedClass((prev) => (prev === classId ? null : classId));
  };

  const handleAddClass = () => {
    if (!newClass.name.trim() || !newClass.subject.trim()) {
      console.error("Class name and subject are required");
      return;
    }

    // console.log("Adding new class:", newClass);
    createClass();
  };

  // --- ATTENDANCE ACTIONS ---
  const handleClearAttendance = () => {
    setAttendance({});
  };

  const handleAttendanceChange = (rollNo: string, value: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [rollNo]: value,
    }));
  };

  const handleSubmitAttendance = () => {
    const count = Object.values(attendance).filter(Boolean).length;
    setPresentCount(count);
    setShowConfirmation(true);
    console.log("Submitting attendance:", attendance);
  };

  // --- INITIAL FETCH ---
  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="flex font-figtree h-screen">
      <div className="flex-1 z-50 flex flex-col overflow relative">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="flex flex-col min-h-full gap-6">
            <h1 className="text-2xl font-bold">Your Classes</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 p-4 md:p-5">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  onClick={() => handleClassClick(cls.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleClassClick(cls.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedClass === cls.id}
                  aria-label={`${cls.name} class with ${cls.subject} students, ${cls.count} attendance in room ${cls.class_code}`}
                  className={`cursor-pointer flex-col gap-3 rounded-xl flex items-center justify-center text-white text-lg font-semibold p-4 md:p-6
                    border border-white/10 backdrop-blur-xl bg-black/20
                    transition-all duration-300 ease-out
                    hover:shadow-[0_0_25px_rgba(100,149,237,0.4)]
                    ${
                      selectedClass === cls.id
                        ? "border-white/90 shadow-[0_0_30px_rgba(100,149,237,0.5)]"
                        : "hover:border-blue-500/30"
                    }`}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="dark:bg-transparent absolute top-3 right-3 border-none"
                        variant="outline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <EllipsisVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-50"
                      onPointerDownOutside={(e) => e.preventDefault()}
                    >
                      <DropdownMenuItem
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(cls.id, cls.name);
                        }}
                      >
                        <PencilLine className="mr-2 h-5 w-5" />
                        <span className="text-md">Edit Class</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(cls.id, cls.name);
                        }}
                      >
                        <Trash2 className="mr-2 h-5 w-5" />
                        <span className="text-md">Delete Class</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {cls.name}
                  </p>
                  <div className="space-y-2 text-center">
                    <p className="text-sm md:text-base text-gray-300">
                      <span className="sr-only">Subject</span>
                      Subject: <span className="text-white">{cls.subject}</span>
                    </p>

                    <p className="text-sm md:text-base text-gray-300">
                      <span className="sr-only">class_code:</span>
                      class_code:
                      <span className="text-white">{cls.class_code}</span>
                    </p>
                  </div>
                </div>
              ))}
              <div
                onClick={() => setShowAddClass(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setShowAddClass(true);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Add a new class"
                className="cursor-pointer gap-5 flex-col rounded-xl flex items-center justify-center text-white text-lg font-semibold p-4 md:p-6
                border border-green-500/30 backdrop-blur-md bg-white/5 focus:outline-none focus:ring-2 focus:ring-green-500
                transition-all duration-300 ease-out
                hover:scale-[1.02] hover:bg-white/10
                hover:border-green-400 hover:shadow-[0_0_20px_rgba(74,222,128,0.2)]"
              >
                <p className="text-xl">Add Class</p>
                <p className="text-sm text-center">
                  Create a new class for your students
                </p>
                <CiCirclePlus className="w-16 h-16 text-white cursor-pointer hover:text-green-500 transition-colors" />
              </div>
            </div>

            <Dialog open={showAddClass} onOpenChange={setShowAddClass}>
              <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] text-white border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-white">
                    Add New Class
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="className" className="text-white">
                      Class Name
                    </Label>
                    <Input
                      id="className"
                      placeholder="Enter class name"
                      value={newClass.name}
                      onChange={(e) =>
                        setNewClass({ ...newClass, name: e.target.value })
                      }
                      className="bg-[#2a2a2a] border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-white">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      placeholder="Enter subject name"
                      value={newClass.subject}
                      onChange={(e) =>
                        setNewClass({ ...newClass, subject: e.target.value })
                      }
                      className="bg-[#2a2a2a] border-gray-700 text-white"
                    />
                  </div>

                  <div className="flex justify-between gap-3 mt-4">
                    <button
                      onClick={() => {
                        setShowAddClass(false);
                        setNewClass({ name: "", subject: "" });
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleAddClass}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Create Class
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
              <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] text-white border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-xl flex justify-start align-middle items-center font-semibold text-white">
                    <CircleAlert className="mr-2" />
                    Submit Attendance?
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-white text-lg">
                    You have marked{" "}
                    <span className="font-bold">{presentCount}</span> students
                    as present.
                  </p>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 flex bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <ChevronsLeft className="inline-block mr-1" />
                    Close
                  </button>
                  <button
                    onClick={handleSubmitAttendance}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex transition-colors"
                  >
                    Submit <ChevronsRight className="inline-block ml-1" />
                  </button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit/Delete Confirmation Dialog */}
            <Dialog
              open={confirmationDialog.isOpen}
              onOpenChange={(isOpen) =>
                setConfirmationDialog((prev) => ({ ...prev, isOpen }))
              }
            >
              <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] text-white border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-xl flex items-center font-semibold">
                    <CircleAlert className="mr-2 h-5 w-5" />
                    {confirmationDialog.type === "edit"
                      ? "Edit Class"
                      : "Delete Class"}
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  {confirmationDialog.type === "edit" ? (
                    <div className="space-y-2">
                      <Label htmlFor="className" className="text-white">
                        New Class Name
                      </Label>
                      <Input
                        id="className"
                        value={confirmationDialog.newClassName}
                        onChange={handleInputChange}
                        className="bg-[#2a2a2a] border-gray-700 text-white"
                        placeholder="Enter new class name"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <p className="text-white">
                      Are you sure you want to delete
                      {confirmationDialog.className}? This action cannot be
                      undone.
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setConfirmationDialog((prev) => ({
                        ...prev,
                        isOpen: false,
                      }))
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={
                      confirmationDialog.type === "delete"
                        ? "destructive"
                        : "default"
                    }
                    onClick={handleDialogConfirm}
                    disabled={
                      confirmationDialog.type === "edit" &&
                      !confirmationDialog.newClassName.trim()
                    }
                  >
                    {confirmationDialog.type === "edit"
                      ? "Save Changes"
                      : "Delete"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="lg:col-span-3 bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 min-h-[300px] p-4 md:p-6 flex justify-center flex-col">
              {selectedClass ? (
                <div className="h-full flex flex-col">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h2 className="text-lg md:text-xl font-semibold text-white">
                      Today&apos;s Attendance -{" "}
                      {classes.find((c) => c.id === selectedClass)?.name}
                    </h2>
                    <button
                      onClick={handleClearAttendance}
                      aria-label="Clear all attendance records"
                      className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:outline-none text-white rounded-lg text-sm transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex-1 overflow-x-auto min-h-0">
                    <table className="w-full text-white">
                      <thead className="border-b border-gray-600">
                        <tr className="text-left">
                          <th className="pb-3 px-4">Roll No.</th>
                          <th className="pb-3 px-4">Name</th>
                          <th className="pb-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { roll: "1", name: "Aditya Sharma" },
                          { roll: "2", name: "Priya Patel" },
                          { roll: "3", name: "Rahul Mehta" },
                          { roll: "4", name: "Sneha Singh" },
                          { roll: "5", name: "Arjun Kumar" },
                          { roll: "6", name: "Ananya Gupta" },
                          { roll: "7", name: "Rohan Verma" },
                          { roll: "8", name: "Nisha Reddy" },
                          { roll: "9", name: "Kunal Shah" },
                          { roll: "10", name: "Meera Kapoor" },
                        ].map((student) => (
                          <tr
                            key={student.roll}
                            className="border-b border-gray-700 hover:bg-gray-800"
                          >
                            <td className="py-3 px-4">{student.roll}</td>
                            <td className="py-3 px-4">{student.name}</td>
                            <td className="py-3 px-4">
                              <label className="flex items-center space-x-2">
                                <Checkbox
                                  checked={attendance[student.roll] || false}
                                  onCheckedChange={(checked) =>
                                    handleAttendanceChange(
                                      student.roll,
                                      checked === true
                                    )
                                  }
                                />
                                <span className="text-sm text-gray-300">
                                  Present
                                </span>
                              </label>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleSubmitAttendance}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Submit Attendance
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center align-middle h-full justify-center">
                  <p className="text-gray-100 text-lg text-center" role="alert">
                    Select a class to mark students attendance
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
