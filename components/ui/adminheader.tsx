"use client";
import {
  User,
  LogOut,
  UserCircle,
} from "lucide-react";

import { Button } from "./button";
import { ModeToggle } from "../../app/dashboard/mode-toggle";
import { teacherProfile } from "@/app/lib/teacherProfile";
import { useEffect, useState } from "react";
import { teacherLogout } from "@/app/lib/teacherLogout";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../app/dashboard/ui/dropdown-menu";
import { toast } from "sonner";

export function AdminHeader() {
  // const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    type: "approve" | "deny" | null;
    notificationId: number | null;
    studentName: string;
  }>({
    isOpen: false,
    type: null,
    notificationId: null,
    studentName: "",
  });
    const [teacher, setTeacher] = useState({
    firstname: "",
    lastname: "",
    email: "",
    branch: "",
  });


  const handleLogout = async () => {
    const success = await teacherLogout();
    if (success) {
      setTeacher({
        firstname: "",
        lastname: "",
        email: "",
        branch: "",
      });
      toast.success("Logged Out Successfully!", {
        description: "Redirecting to Login Page...",
      });
      setTimeout(() => {
        window.location.href = "/teacher/login";
      }, 1500);
    } else {
      toast.error("Logout failed");
    }
  };

  // const handleLogout = async () => {
  //   const response = await fetch("http://localhost:3001/teacher/logout", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   if (response.ok) {
  //     // <Toaster position="top-center" />
  //     toast.success("Logged Out Successfully!", {
  //         description: "Redirecting to login page...",
  //         // position: "top-center",
  //         // action: {
  //         //   label: "Cancel",
  //         //   // position: "top-center",
  //         //   onClick: () => console.log("Cancel"),
  //         // },
  //       })
  //     // alert("Logout Successful");

  //     setTimeout(() => {
  //     window.location.href = "/teacher/login";},3000); // Manual redirect
  //   } else {
  //     console.error("Logout failed");
  //     toast.error("Logout failed", {
  //       description: "Please try again",
  //     });
  //   }
  // };


  useEffect(() => {
    const fetcheTeacher = async () => {
      const data = await teacherProfile();
      if (data) {
        setTeacher({
          firstname: data.teacher.firstname,
          lastname: data.teacher.lastname,
          email: data.teacher.email,
          branch: data.teacher.branch,
        });
      } else {
        console.error("Failed to fetch teacher profile");
      }
    };

    fetcheTeacher();

    // const fetchTeacher = async () => {
    //   try {

    //     const response = await fetch(`${process.env.NEXT_PUBLIC_API}/teacher/getTeacher`, {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       credentials: "include",
    //     });

    //     if (!response.ok) {
    //       const errorData = await response.json();

    //       console.error("Fetch failed:", errorData);
    //       return;
    //     }

    //     const data = await response.json();
    //     setTeacher(data.teacher);

    //   } catch (error) {
    //     console.error("Unhandled error in fetchTeacher:", error);
    //   }
    // };

    // fetchTeacher();
  }, []);

  return (
    <header className="lg:relative lg:bg-transparent bg-[#0F131F] z-10 sticky top-0 border-b p-4 lg:p-6 flex items-center justify-between">
      <div className="flex items-center justify-between w-full">
        {/* <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="lg:hidden z-50 p-2 rounded-lg bg-background/10 backdrop-blur-lg border border-white/10"
          aria-label={showNotifications ? "Close notifications" : "Open notifications"}
        >
          {showNotifications ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button> */}
        <h1 className="text-2xl sm:text-2xl md:text-center lg:text-left font-semibold text-center w-full">
          <span className="text-muted-foreground">Welcome,</span>{" "}
          {teacher.firstname} {teacher.lastname}
        </h1>
      </div>
      <div className="hidden lg:flex items-center gap-4 sm:gap-8 lg:gap-14 w-full sm:w-auto justify-end">

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex flex-col sm:flex-row items-center gap-2"
              variant="outline"
            >
              <div className="flex items-center gap-2">
                <User className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
                <p className="hidden sm:block text-sm lg:text-base">
                  {teacher.firstname} {teacher.lastname}
                </p>
              </div>
              <p className="hidden lg:block text-sm text-muted-foreground">
                {teacher.branch}
              </p>
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
