/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GitBranch, UserPlus } from "lucide-react";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AdminHeader } from "@/components/ui/adminheader";
import { adminHandler } from "@/app/lib/adminHandler";
type teacher = {
  firstname: string;
  lastname: string;
  id: string;
  email: string;
  branch: string;
};

export default function Teachers() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [teachers, setTeachers] = useState<teacher[]>([]);

  const fetchteachers = async () => {
    const res = await adminHandler("admin/teachers", "GET");
    console.log("teacher list for admin page :", res);
    setTeachers(res.teachers);
  };

  useEffect(() => {
    fetchteachers();
  }, []);

  const printTeacher = () => {
    teachers?.map((t) => {
      console.log(t);
    });
  };

  return (
    <div className="h-full w-full">
      <div>
        <AdminHeader />
      </div>
      <div className="">
        <div className="lg:col-span-3 rounded-xl  p-4 md:p-6 flex justify-center flex-col">
          <div className="h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-2xl md:text-xl font-bold text-white">
                Teachers&apos;s List
              </h2>
              <div className="flex items-center align-middle gap-5">
                <Button
                  onClick={printTeacher}
                  variant="secondary"
                  // onClick={handleNewNotice}
                  className="dark:bg-green-500 h-10 justify-start"
                >
                  <UserPlus className="mr- h-5 w-5" />
                  Add New Teacher
                  {/* </Link> */}
                </Button>
                <div
                  className={`relative transition-all duration-300 ease-in-out flex  ${
                    showSearch ? "w-40 px-" : "w-0 px-0"
                  } overflow-hidden md:w-64 md:px-1 md:block`}
                >
                  <Search className="absolute top-2.5 ml-2 text-muted-foreground hidden md:block" />
                  <Input
                    type="search"
                    placeholder="Search Teachers..."
                    className="pl-3 md:pl-10 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ minWidth: 0 }}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
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
                      <th className="pb-3 px-4">Email</th>
                      <th className="pb-3 px-4">Branch</th>
                    </tr>
                  </thead>
                  <tbody className="font-medium">
                    {teachers?.map((t, index) => (
                      <tr
                        key={t.id}
                        className="border-b border-gray-700 hover:bg-gray-800"
                      >
                        <td className="py-3 px-6 text-xl">{index + 1}</td>
                        <td className="py-3 px-4  text-xl">
                          {t.firstname} {t.lastname}
                        </td>
                        <td className="py-3 px-4 text-xl">{t.email}</td>
                        <td className="py-3">
                          <label className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400 text-xl font-medium">
                              {t.branch}
                            </span>
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
