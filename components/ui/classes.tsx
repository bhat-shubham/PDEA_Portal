"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
  const classesRaw = [
    { id: "SE_IT", name: "SE IT", students: 30, attendance: "80%", room: "101" },
    { id: "BE_IT", name: "BE IT", students: 28, attendance: "90%", room: "103" },
    { id: "TE_IT", name: "TE IT", students: 28, attendance: "90%", room: "103" },
    { id: "FE_IT", name: "FE IT", students: 28, attendance: "90%", room: "103" },
    { id: "FE_IT", name: "FE IT", students: 28, attendance: "90%", room: "103" },
    { id: "FE_IT", name: "FE IT", students: 28, attendance: "90%", room: "103" },
  ];
  const classes = Array.from(new Map(classesRaw.map(cls => [cls.id, cls])).values());
    

export default function AllClasses() {
    const handleClassClick = (classId: string) => {
    if (selectedClass === classId) {
      setSelectedClass(null);
    } else {
      setSelectedClass(classId);
    } 
  };
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredClasses = React.useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return classes;
    let filtered = classes.filter(cls =>
      cls.name.toLowerCase().includes(query)
    );
    filtered = filtered.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName === query && bName !== query) return -1;
      if (bName === query && aName !== query) return 1;
      if (aName.startsWith(query) && !bName.startsWith(query)) return -1;
      if (bName.startsWith(query) && !aName.startsWith(query)) return 1;
      return aName.localeCompare(bName);
    });
    return filtered;
  }, [searchValue, classes]);

  return (
    <div className="w-full">
            <div className="w-full flex flex-col">
              <div className="flex justify-between">
                      <h1 className="text-2xl font-bold">All Classes</h1>
                      <div>
                        <div className="relative flex items-center">
                          <button
                            type="button"
                            className="block md:hidden p-2 focus:outline-none"
                            aria-label="Open search"
                            onClick={() => setShowSearch((prev) => !prev)}
                          >
                            <Search className="text-muted-foreground" />
                          </button>
                          <div
                            className={`transition-all duration-300 ease-in-out flex  ${showSearch ? 'w-40 px-' : 'w-0 px-0'} overflow-hidden md:w-64 md:px-1 md:block`}
                          >
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hidden md:block" />
                            <Input
                              type="search"
                              placeholder="Search Classes..."
                              className="pl-3 md:pl-10 w-full h-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              style={{ minWidth: 0 }}
                              value={searchValue}
                              onChange={e => setSearchValue(e.target.value)}
                              autoComplete="off"
                              aria-label="Search Classes"
                            />
                          </div>
                        </div>
                      </div>
                      </div>
                <div className="flex gap-5 mt-5 overflow-x-scroll pb-4 [scrollbar-width:1]">
              {filteredClasses.length === 0 ? (
  <div className="text-white text-center w-full">No classes found.</div>
) : (
  filteredClasses.map((cls) => ( 
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
                  className={`w-72 min-w-[300px] cursor-pointer flex-col gap-3 rounded-xl flex items-center justify-center text-white text-lg font-semibold p-4 md:p-6
                    border border-white/10 backdrop-blur-xl bg-black/20
                    transition-all duration-300 ease-out
                    hover:ring-blue-400/50 hover:border-blue-400/70
                    ${selectedClass === cls.id ? 
                      'ring-blue-400/50 border-blue-400/70' : 
                      'hover:border-blue-400/70'
                    }`}

              >
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {cls.name}
                </p>
                <div className="space-y-2 text-center">
                  <p className="text-sm md:text-base text-gray-300">
                    <span className="sr-only">Total Number of Students:</span>
                    Students: <span className="text-white">{cls.students}</span>
                  </p>
                  <p className="text-sm md:text-base text-gray-300">
                    <span className="sr-only">Aggregate Attendance:</span>
                    Attendance:{" "}
                    <span className="text-white">{cls.attendance}</span>
                  </p>
                  <p className="text-sm md:text-base text-gray-300">
                    <span className="sr-only">Room Number:</span>
                    Room: <span className="text-white">{cls.room}</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="lg:col-span-3 bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 min-h-[300px] p-4 md:p-6 flex justify-center flex-col">
          { (
            <div className="h-full flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-white">
                  Today&apos;s Attendance -{" "}
                 
                </h2>
                <button
                  //   onClick={handleClearAttendance}
                  aria-label="Clear all attendance records"

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
                
              )))}
              </div>
                          <div className="lg:col-span-3 bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 min-h-[300px] p-4 md:p-6 flex justify-center flex-col">
              {selectedClass ? (
                <div className="h-full flex flex-col">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h2 className="text-lg md:text-xl font-semibold text-white">Today&apos;s Attendance - {classes.find(c => c.id === selectedClass)?.name}</h2>
                    <button
                    //   onClick={handleClearAttendance}
                      aria-label="Clear all attendance records"
                      className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:outline-none text-white rounded-lg text-sm transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex-1 min-h-0">
                    <div className="overflow-x-auto">
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
                                {/* <Checkbox checked={attendance[student.roll] || false} onCheckedChange={(checked) => handleAttendanceChange(student.roll, checked === true)} /> */}
                                <span className="text-sm text-gray-300">Present</span>
                              </label>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-6 flex justify-end">
                      <button
                        // onClick={handleSubmitAttendance}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Submit Attendance
                      </button>
                    </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center align-middle h-full justify-center">
                  <p className="text-gray-100 text-lg text-center" role="alert">
                    Select a class to view students attendance
                  </p>
                </div>
              )}
            </div>
            </div>

          ) :(
            <div className="flex items-center align-middle h-full justify-center">
              <p className="text-gray-100 text-lg text-center" role="alert">
                Select a class to view students attendance
              </p>

            </div>
  );
}

