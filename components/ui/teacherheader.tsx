"use client";
import {
  Bell,
  User,
  LogOut,
  UserCircle,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { notificationHandler } from "@/app/lib/notificationHandler";
import { Button } from "./button";
import { ModeToggle } from "./mode-toggle";
import { teacherProfile } from "@/app/lib/teacherProfile";
import { useEffect, useState } from "react";
import { useTestSocket } from "@/app/lib/TestSocket";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { approveStudentHandler } from "@/app/lib/approveStudenthandler";
import { teacherLogout } from "@/app/lib/teacherLogout";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
interface notifications {
  classname: string;
  id: string;
  status: string;
  studentName: string;
  teacherID: string;
  studentID: string;
  classID: string;
}
interface ConfirmationDialogState {
  isOpen: boolean;
  type: "approve" | "deny" | null;
  notificationId: string | null;
  classId: string | null;
  studentID: string;
  studentName: string;
}
export function Header() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [confirmationDialog, setConfirmationDialog] =
    useState<ConfirmationDialogState>({
      isOpen: false,
      type: null,
      notificationId: null,
      classId: null,
      studentID: "",
      studentName: "",
    });
  const [notifications, setNotifications] = useState<notifications[]>([]);
  const socket = useTestSocket();
  const handleApproveClick = (notification: notifications) => {
    setConfirmationDialog({
      isOpen: true,
      type: "approve",
      notificationId: notification.id,
      studentName: notification.studentName,
      studentID: notification.studentID,
      classId: notification.classID,
    });
  };
    const handleDenyClick = (notification: notifications) => {
    setConfirmationDialog({
      isOpen: true,
      type: "deny",
      notificationId: notification.id,
      studentID: notification.studentID,
      studentName: notification.studentName,
      classId: notification.classID,
    });
  };
  const handleNotification = async () => {
      const data = await notificationHandler("notifications", "GET");
      setNotifications(data.notifications);
  };
    useEffect(() => {
      if (socket) {
        const handler = (notification: notifications) => {
          // console.log("New notification:", notification);
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            notification,
          ]);
        };
        socket.on("new_notification", handler);
        handleNotification();
        return () => {
          socket.off("new_notification", handler);
        };
      }
    }, [socket]);

  const handleLogout = async () => {
    const success = await teacherLogout();
    if (success) {
      setTimeout(() => {
        setTeacher({
          firstname: "",
          lastname: "",
          email: "",
          branch: "",
        });
      }, 1500);

      localStorage.removeItem("token");
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

  const handleConfirm = async () => {
    const { studentID, notificationId, classId, type } = confirmationDialog;

    const studentData = {
      studentID: studentID,
      classID: classId,
      notificationID: notificationId,
    };
    setConfirmationDialog({
      isOpen: false,
      type: null,
      notificationId: null,
      studentName: "",
      studentID: "",
      classId: null,
    });

    if (type === "approve") {
      try {
        const res = await approveStudentHandler(
          "approveStudent",
          "PUT",
          studentData
        );
        console.log(res);
        if (res.message === "Student approved successfully") {
          setNotifications((prev) =>
            prev.filter((n) => n.id !== notificationId)
          );
          handleNotification();
        }
      } catch (error) {
        console.error("Error approving student:", error);
      }
    }
    if (type === "deny") {
      try {
        const res = await approveStudentHandler(
          "denyStudent",
          "Delete",
          studentData
        );
        console.log(res);
        if (res.message === "Student denied successfully") {
          setNotifications((prev) =>
            prev.filter((n) => n.id !== notificationId)
          );
          handleNotification();
        }
      } catch (error) {
        console.error("Error approving student:", error);
      }
    }
  };

  const [teacher, setTeacher] = useState({
    firstname: "",
    lastname: "",
    email: "",
    branch: "",
  });

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
  },[]);

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
        <div className="relative">
          <Button
            variant="outline"
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label={`Notifications ${
              notifications.length > 0 ? `(${notifications.length} unread)` : ""
            }`}
          >
            <Bell className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </Button>

          {showNotifications && (
            <motion.div
             initial={{ 
              y:-10 
            }}
             animate={{ scale: 1, y:0 }}
             transition={{ duration: 0.1 }}
             className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[460px] lg:w-[500px] bg-background border rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="p-3 sm:p-4 border-b">
                <h3 className="text-base sm:text-lg font-semibold">
                  Notifications
                </h3>
              </div>
              <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 border-b hover:bg-[#1a1a1a] flex items-center justify-between"
                  >
                    <p className="text-sm flex-1">{notification.studentName} is trying to join {notification.classname}</p>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleApproveClick(notification)}
                        className="h-8 w-8 text-green-500 hover:text-green-700 hover:bg-green-100"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDenyClick(notification)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No new notifications
                  </div>
                )}
              </div>
            </motion.div>
          )}

          <Dialog
            open={confirmationDialog.isOpen}
            onOpenChange={() => setConfirmationDialog(prev => ({ ...prev, isOpen: false }))}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {confirmationDialog.type === "approve" ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  {confirmationDialog.type === "approve"
                    ? "Approve Student"
                    : "Deny Student"}
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to{" "}
                  {confirmationDialog.type === "approve" ? "approve" : "deny"}{" "}
                  the admission request for{" "}
                  <span className="font-medium">
                    {confirmationDialog.studentName}
                  </span>
                  ?
                  {confirmationDialog.type === "deny" && (
                    <p className="mt-2 text-red-500">
                      This action cannot be undone.
                    </p>
                  )}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmationDialog(prev => ({ ...prev, isOpen: false }))}>
                  Cancel
                </Button>
                <Button
                  variant={
                    confirmationDialog.type === "approve"
                      ? "default"
                      : "destructive"
                  }
                  onClick={handleConfirm}
                >
                  {confirmationDialog.type === "approve" ? "Approve" : "Deny"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
