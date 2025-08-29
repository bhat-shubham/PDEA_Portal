/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { User, LogOut, UserCircle } from "lucide-react";
import { Button } from "./button";
import { ModeToggle } from "./mode-toggle";
import { Skeleton } from "./skeleton";
import { teacherProfile } from "@/app/lib/teacherProfile";
import { useEffect, useState } from "react";
import { teacherLogout } from "@/app/lib/teacherLogout";
// import { profileHandler } from "@/app/lib/studentHandler";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import { adminProfile } from "@/app/lib/adminHandler";
import { da } from "date-fns/locale";
// import { studentProfile } from "@/app/lib/studentProfile";
import { profileHandler } from "@/app/lib/studentHandler";

export function StudentHeader() {
  const router = useRouter();
  const [student, setStudent] = useState({
    firstname: "",
    lastname: "",
    email: "",
    branch: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async () => {
    const success = await teacherLogout();
    if (success) {
      setStudent({
        firstname: "",
        lastname: "",
        email: "",
        branch: "",
      });
      toast.success("Logged Out Successfully!", {
        description: "Redirecting to Login Page...",
        richColors: true
      });
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      toast.error("Logout failed", {
        description: "Please try again later.",
        richColors: true
      });
    }
  };

 useEffect(() => {
  const fetchStudent = async () => {
    try {
      setIsLoading(true);
      const data = await profileHandler("profile", "GET");
      if (data && data.student) {
        setStudent(data.student);
      } else {
        console.error("Failed to fetch valid student profile");
        setStudent({ firstname: "", lastname: "", email: "", branch: "" });
      }
    } catch (error) {
      console.error("Error fetching student profile:", error);
      toast.error("Failed to load profile", {
        description: "Please refresh the page",
      });
    } finally {
      setIsLoading(false);
    }
  };

  fetchStudent();
}, []);


  return (
    <header className="lg:relative lg:bg-transparent bg-[#0F131F] z-10 sticky top-0 border-b p-4 lg:p-6 flex items-center justify-between">
      <div className="flex items-center align-middle justify-between w-full">
        <div className="text-2xl sm:text-2xl md:text-center lg:text-left font-semibold text-center w-full">
          {isLoading ? (
            <div className="flex gap-2 items-center justify-center lg:justify-start">
              <Skeleton className="h-8 w-52 rounded-xl" />
            </div>
          ) : (
            <h1>
              <span className="text-muted-foreground">Welcome,</span>{" "}
              {`${student.firstname} ${student.lastname}`}
            </h1>
          )}
        </div>
      </div>
      <div className="hidden lg:flex items-center gap-4 sm:gap-8 lg:gap-14 w-full sm:w-auto justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex flex-col sm:flex-row items-center gap-2"
              variant="outline"
              disabled={isLoading}
            >
                <div className="flex items-center gap-2">
                <User className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
                {isLoading ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  <p className="hidden sm:block text-sm lg:text-base">
                  {student.firstname} {student.lastname} 
                  <span className="hidden lg:inline text-muted-foreground ml-2">
                    {student.branch}
                  </span>
                  </p>
                )}
                </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-72">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
    </header>
  );
}
