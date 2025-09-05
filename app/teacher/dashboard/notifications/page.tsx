/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/teacherheader";
import { notificationHandler } from "@/app/lib/notificationHandler";
import { Button } from "@/components/ui/button";
import { Check, X, AlertTriangle } from "lucide-react";
import { useTestSocket } from "@/app/lib/TestSocket";
import { approveStudentHandler } from "@/app/lib/approveStudenthandler";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface notifications {
  classname: string;
  id: string;
  status: string;
  studentName: string;
  teacherID: string;
  studentID: string;
  classID: string;
  subject: string;
}

interface ConfirmationDialogState {
  isOpen: boolean;
  type: "approve" | "deny" | null;
  notificationId: string | null;
  classId: string | null;
  studentID: string;
  studentName: string;
  subject: string;
}

export default function NotificationsPage() {
  const [confirmationDialog, setConfirmationDialog] =
    useState<ConfirmationDialogState>({
      isOpen: false,
      type: null,
      notificationId: null,
      classId: null,
      studentID: "",
      studentName: "",
      subject: "",
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
      subject: notification.subject,
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
      subject: notification.subject,
    });
  };

  const handleNotification = async () => {
    const data = await notificationHandler("notifications", "GET");
    setNotifications(data.notifications);
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
      subject: "",
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

  const handleCancel = async () => {
    setConfirmationDialog({
      isOpen: false,
      type: null,
      notificationId: null,
      studentName: "",
      studentID: "",
      classId: null,
      subject: "",
    });
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

  return (
    <div className="">
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-5 text-gray-100">Notifications</h1>

        <div className="overflow-y-auto">
          {[...notifications].reverse().map((notification) => (
            <div
              key={notification.id}
              className="p-5 rounded-lg mb-2 border hover:bg-gray-900/50 flex items-center justify-between"
            >
              <div className="flex text-lg">
                <p>
                  <span className="font-bold">{notification.studentName}</span>{" "}
                  is trying to join the{" "}
                  <span className="font-bold">{notification.classname} {notification.subject}</span>{" "}
                  Classroom
                </p>
              </div>

              <div className="flex items-center gap-4 lg:gap-6 ml-4 mr-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApproveClick(notification)}
                  className="flex items-center gap-2 px-3 py-1 rounded-lg border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition"
                >
                  Approve
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDenyClick(notification)}
                  className="flex items-center gap-2 px-3 py-1 rounded-lg border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                >
                  Deny
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden md:hidden h-9 w-fit px-3 text-red-500 hover:text-red-700 bg-[#2A3147] rounded-lg"
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

          <Dialog
            open={confirmationDialog.isOpen}
            onOpenChange={() => handleCancel()}
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
                <Button variant="outline" onClick={() => handleCancel()}>
                  Cancel
                </Button>
                <Button
                  variant={
                    confirmationDialog.type === "approve"
                      ? "default"
                      : "destructive"
                  }
                  onClick={() => handleConfirm()}
                >
                  {confirmationDialog.type === "approve" ? "Approve" : "Deny"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
