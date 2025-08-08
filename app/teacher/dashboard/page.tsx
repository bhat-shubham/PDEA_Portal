"use client"

import { Header } from "@/components/ui/teacherheader"
import { CiCirclePlus } from "react-icons/ci";
import { useState } from "react";
import {Checkbox } from "../../dashboard/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/app/dashboard/ui/input";
import { Label } from "@/app/dashboard/ui/label";
import { Clipboard, Check,CircleAlert,ChevronsRight, ChevronsLeft   } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"
export default function Dashboard() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<{[key: string]: boolean}>({});
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClass, setNewClass] = useState({
    className: '',
    subject: ''
  });
  const [classCode, setClassCode] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [presentCount, setPresentCount] = useState(0);

  const generateClassCode = () => {
    // random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setClassCode(code);
  };

  const handleAddClass = () => {
    console.log('New class:', { ...newClass, code: classCode });
    setShowAddClass(false);
    setNewClass({ className: '', subject: '' });
    setClassCode(null);
  };

  const handleClassClick = (classId: string) => {
    if (selectedClass === classId) {
      setSelectedClass(null);
    } else {
      setSelectedClass(classId);
    }
  };

  const handleClearAttendance = () => {
    setAttendance({});
  };

  const handleAttendanceChange = (rollNo: string, value: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [rollNo]: value
    }));
  };

  const handleSubmitAttendance = () => {
    const count = Object.values(attendance).filter(Boolean).length;
    setPresentCount(count);
    setShowConfirmation(true);
    console.log('Submitting attendance:', attendance);
    // send to backend
  };

  const classes = [
    { id: "SE_IT", name: "SE IT", students: 30, attendance: "80%", room: "101" },
    { id: "BE_IT", name: "BE IT", students: 28, attendance: "90%", room: "103" },
  ];

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
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleClassClick(cls.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedClass === cls.id}
                  aria-label={`${cls.name} class with ${cls.students} students, ${cls.attendance} attendance in room ${cls.room}`}
                  className={`cursor-pointer flex-col gap-3 rounded-xl flex items-center justify-center text-white text-lg font-semibold p-4 md:p-6
                    border border-white/10 backdrop-blur-xl bg-black/20
                    transition-all duration-300 ease-out
                    hover:shadow-[0_0_25px_rgba(100,149,237,0.4)]
                    ${selectedClass === cls.id ? 
                      'border-white/90 shadow-[0_0_30px_rgba(100,149,237,0.5)]' : 
                      'hover:border-blue-500/30'
                    }`}
                >
                  <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{cls.name}</p>
                  <div className="space-y-2 text-center">
                    <p className="text-sm md:text-base text-gray-300">
                      <span className="sr-only">Total Number of Students:</span>
                      Students: <span className="text-white">{cls.students}</span>
                    </p>
                    <p className="text-sm md:text-base text-gray-300">
                      <span className="sr-only">Aggregate Attendance:</span>
                      Attendance: <span className="text-white">{cls.attendance}</span>
                    </p>
                    <p className="text-sm md:text-base text-gray-300">
                      <span className="sr-only">Room Number:</span>
                      Room: <span className="text-white">{cls.room}</span>
                    </p>
                  </div>
                </div>
              ))}
              <div 
                onClick={() => setShowAddClass(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
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
                hover:border-green-400 hover:shadow-[0_0_20px_rgba(74,222,128,0.2)]">
                <p className="text-xl">Add Class</p>
                <p className="text-sm text-center">Create a new class for your students</p>
                <CiCirclePlus className="w-16 h-16 text-white cursor-pointer hover:text-green-500 transition-colors" />
              </div>
            </div>

            <Dialog open={showAddClass} onOpenChange={setShowAddClass}>
              <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] text-white border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-white">Add New Class</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="className" className="text-white">Class Name</Label>
                    <Input
                      id="className"
                      placeholder="Enter class name"
                      value={newClass.className}
                      onChange={(e) => setNewClass({ ...newClass, className: e.target.value })}
                      className="bg-[#2a2a2a] border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-white">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Enter subject name"
                      value={newClass.subject}
                      onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                      className="bg-[#2a2a2a] border-gray-700 text-white"
                    />
                  </div>
                  {!classCode ? (
                    <button
                      onClick={generateClassCode}
                      disabled={!newClass.className || !newClass.subject}
                      className={`mt-2 w-full px-4 py-2 text-white rounded-lg transition-colors ${
                        !newClass.className || !newClass.subject 
                          ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      Generate Class Code
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-white">Class Code</Label>
                      <div className="flex items-center justify-center p-5 bg-[#2a2a2a] rounded-lg border border-gray-700">
                        <span className="text-3xl font-mono font-bold text-green-500 tracking-wider">
                          {classCode}
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(classCode);
                                  setIsCopied(true);
                                  setTimeout(() => setIsCopied(false), 2000);
                                }}
                                className="top-21 h-fit cursor-default bottom-30 right-6 absolute p-1 text-sm rounded transition-colors"
                              >
                                {isCopied ? (
                                  <Check className="h-7 p-1 mt-1 w-7 mb-11 cursor-pointer text-green-500"/>
                                ) : (
                                  <Clipboard className="h-7 p-1 mt-1 w-7 mb-11 cursor-pointer text-slate-400 hover:bg-zinc-600 rounded-lg hover:text-green-500"/>
                                )}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy Code</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-400">
                          Share this code with your students to join the class
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between gap-3 mt-4">
                    <button
                      onClick={() => {
                        setShowAddClass(false);
                        setNewClass({ className: '', subject: '' });
                        setClassCode(null);
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    {classCode && (
                      <button
                        onClick={handleAddClass}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Create Class
                      </button>
                    )}
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
                    You have marked <span className="font-bold">{presentCount}</span> students as present.
                  </p>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 flex bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <ChevronsLeft className="inline-block mr-1" />Close 
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

            <div className="lg:col-span-3 bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 min-h-[300px] p-4 md:p-6 flex justify-center flex-col">
              {selectedClass ? (
                <div className="h-full flex flex-col">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h2 className="text-lg md:text-xl font-semibold text-white">Today&apos;s Attendance - {classes.find(c => c.id === selectedClass)?.name}</h2>
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
                          <tr key={student.roll} className="border-b border-gray-700 hover:bg-gray-800">
                            <td className="py-3 px-4">{student.roll}</td>
                            <td className="py-3 px-4">{student.name}</td>
                            <td className="py-3 px-4">
                              <label className="flex items-center space-x-2">
                                <Checkbox checked={attendance[student.roll] || false} onCheckedChange={(checked) => handleAttendanceChange(student.roll, checked === true)} />
                                <span className="text-sm text-gray-300">Present</span>
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
  )
}
