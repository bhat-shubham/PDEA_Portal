"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import {
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { AdminHeader } from "@/components/ui/adminheader";
export default function Teachers() {
    const [showSearch, setShowSearch] = useState(false);
      const [searchValue, setSearchValue] = useState("");
  
  return (
    <div className="h-full w-full">
    <div>
      <AdminHeader/>
    </div>
    <div className="">
        <div className="lg:col-span-3 rounded-xl  p-4 md:p-6 flex justify-center flex-col">
                <div className="h-full flex flex-col">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h2 className="text-2xl md:text-xl font-bold text-white">Teachers&apos;s List</h2>
                    <div className="flex items-center align-middle gap-5">
                    <Button
                      variant="secondary"
                      // onClick={handleNewNotice}
                      className="dark:bg-green-500 h-10 justify-start" 
                      >
                      <UserPlus className="mr- h-5 w-5" />
                       Add New Teacher
                        {/* </Link> */}
                      </Button>
                          <div
                            className={`relative transition-all duration-300 ease-in-out flex  ${showSearch ? 'w-40 px-' : 'w-0 px-0'} overflow-hidden md:w-64 md:px-1 md:block`}
                          >
                            <Search className="absolute top-2.5 ml-2 text-muted-foreground hidden md:block" />
                            <Input
                              type="search"
                              placeholder="Search Teachers..."
                              className="pl-3 md:pl-10 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              style={{ minWidth: 0 }}
                              value={searchValue}
                              onChange={e => setSearchValue(e.target.value)}
                              autoComplete="off"
                              aria-label="Search Classes"
                            />
                          </div>
                          </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <div className="overflow-x-auto">
                    <table className="w-full text-white">
                      <thead className="border-b border-gray-600">
                        <tr className="text-left">
                          <th className="pb-3 px-4">S.No.</th>
                          <th className="pb-3 px-4">Name</th>
                          <th className="pb-3 px-4">Branch</th>
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
                            <td className="py-3">
                              <label className="flex items-center space-x-2">
                                {/* <Checkbox checked={attendance[student.roll] || false} onCheckedChange={(checked) => handleAttendanceChange(student.roll, checked === true)} /> */}
                                <span className="text-sm text-gray-300">Information Tech.</span>
                              </label>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                </div>
            </div>
            </div>
    </div>
    
  );
}