"use client";
import {
  Home,
  Megaphone,
  User,
  Menu,
  X,
  LogOut,
  PanelsTopLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { profileHandler } from "@/app/lib/studentHandler";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PagesProgressProvider as ProgressProvider } from "@bprogress/next";
import { noticeHandler } from "@/app/lib/noticeHandler";
export function StudentSidebar() {
  const [noticeCount, setNoticeCount] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
      const fetchNoticeCount = async () => {
        try {
          const res = await noticeHandler("notice", "GET");
          if (res && Array.isArray(res.notices)) {
            setNoticeCount(res.notices.length);
          }
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to fetch notices'));
          console.error('Error fetching notices:', err);
        } finally {
          setIsLoading(false);
        }
      };
  
  
      fetchNoticeCount();
  
  
      const intervalId = setInterval(fetchNoticeCount, 30000);
  
      return () => clearInterval(intervalId);
    }, []);
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showProfile, setShowProfile] = useState(false);

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
    const res = await profileHandler("logout", "POST");
    console.log("nfkbwfbkb");
    if (res.message === "Logout successful") {
      toast.success("Logged Out Successfully!", {
        description: "Redirecting to Login Page...",
      });

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      toast.error("Logout failed");
    }
  };

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
                <Link href="/student/dashboard">
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
                <Link href="/student/dashboard/notices">
                  <Megaphone className="mr-3 h-5 w-5" />
                  Notices
                  {!isLoading && noticeCount !== null && noticeCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {noticeCount}
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
              {/* <Button
                variant="ghost"
                onClick={handleLinkClick}
                className="w-full justify-start"
                asChild
              >
                <Link href="/admin/dashboard/notifications">
                  <Bell className="mr-3 h-5 w-5" />
                  Notifications
                </Link>
              </Button> */}
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setShowProfile(true);
                  handleLinkClick();
                }}
                asChild
              >
                <Link href="/student/dashboard/profile">
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
