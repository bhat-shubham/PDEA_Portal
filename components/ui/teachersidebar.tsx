"use client";
import {
  Home,
  Calendar,
  Megaphone,
  User,
  Menu,
  X,
  LogOut,
  PanelsTopLeft,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTestSocket } from "@/app/lib/TestSocket";
import { toast } from "sonner";
import { PagesProgressProvider as ProgressProvider } from "@bprogress/next";
import { useRouter } from "next/navigation";
import { teacherLogout } from "@/app/lib/teacherLogout";

// interface notices {
//   id:number,
//   classname:string,
//   studentName:string,
//   status
// }

export function Sidebar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showProfile, setShowProfile] = useState(false);
  const [newNoticesCount, setNewNoticesCount] = useState(0);
  const [newNotificationCount, setnewNotificationCount] = useState(0);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleLinkClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    const success = await teacherLogout();
    if (success) {
      toast.success("Logged Out Successfully!", {
        description: "Redirecting to Login Page...",
      });
      setTimeout(() => {
        // window.location.href = "/teacher/login";
        router.push("/teacher/login");
      }, 1500);
    } else {
      toast.error("Logout failed");
    }
  };

  const handleNoticeClick = () => {
    setnewNotificationCount(0);
  };

  const socket = useTestSocket();
  useEffect(() => {
    if (!socket) return;

    socket.on("new_notification", () => {
      setnewNotificationCount((prevCount) => prevCount + 1);
    });
    socket.on("newNotice", () => {
      setNewNoticesCount((prevCount) => prevCount + 1);
    });

    return () => {
      socket.off("new_notification");
      socket.off("newNotice");
    };
  }, [socket]);

  return (
    <>
      <ProgressProvider
        height="4px"
        color="#0F13FF"
        options={{ showSpinner: false }}
        shallowRouting
      />
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-3 left-4 z-[999] h-10 w-10 flex items-center justify-center rounded-xl bg-background/20 backdrop-blur-lg border border-white/10"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[60] w-64 h-full border-r bg-background/10 backdrop-blur-lg p-6 transition-transform duration-200 ease-in-out",
          isMobile && !isMobileMenuOpen ? "-translate-x-full" : "translate-x-0",
          "lg:translate-x-0 lg:static"
        )}
      >
        <div className="flex items-center mb-8 z-10">
          <PanelsTopLeft className="h-6 w-6 text-white" />
          <h2 className="text-xl font-semibold ml-5">Menu</h2>
        </div>
        <nav className="space-y-8">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Main
            </h3>
            <div className="space-y-2">
              <Button
                variant="ghost"
                onClick={handleLinkClick}
                className="w-full justify-start"
                asChild
              >
                <Link href="/teacher/dashboard">
                  <Home className="mr-3 h-5 w-5" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={handleLinkClick}
                className="w-full justify-start"
                asChild
              >
                <Link href="/teacher/dashboard/timetable">
                  <Calendar className="mr-3 h-5 w-5" />
                  Timetable
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={handleLinkClick}
                className="w-full justify-start"
                asChild
              >
                <Link
                  href="/teacher/dashboard/notices"
                  onClick={handleNoticeClick}
                >
                  <Megaphone className="mr-3 h-5 w-5" />
                  Notices
                  {newNoticesCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-500 rounded-full">
                      {newNoticesCount}
                    </span>
                  )}
                </Link>
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Account
            </h3>
            <div className="space-y-2">
              <Button
                variant="ghost"
                onClick={handleLinkClick}
                className="w-full justify-start"
                asChild
              >
                <Link
                  href="/teacher/dashboard/notifications"
                  onClick={handleNoticeClick}
                >
                  <Bell className="mr-3 h-5 w-5" />
                  Notifications
                  {newNotificationCount > 0 && (
                    <span className=" ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {newNotificationCount}
                    </span>
                  )}
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setShowProfile(true);
                  handleLinkClick();
                }}
                asChild
              >
                <Link href="/teacher/dashboard/profile">
                  <User className="mr-3 h-5 w-5" />
                  Profile
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  handleLogout();
                  handleLinkClick();
                }}
                className="w-full justify-start"
              >
                {/* <Link href="/teacher/dashboard/profile"> */}
                <LogOut className="mr-3 h-5 w-5" />
                Log out
                {/* </Link> */}
              </Button>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
