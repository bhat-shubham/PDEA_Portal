"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/ui/adminheader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  BookPlus,
  FileText,
  Send,
  X,
  Bell,
  AlertCircle,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { noticeHandler } from "@/app/lib/noticeHandler";
import { toast } from "sonner";
import { noticeHandlerPost } from "@/app/lib/noticeHandler";
interface notices {
  id: number;
  type: "Notice" | "Circular";
  title: string;

  createdAt: Date;

  content: string;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<notices[]>([]);
  const [showNewNoticeDialog, setShowNewNoticeDialog] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    type: "Notice" as "Notice" | "Circular",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<notices | null>(null);

  const handleDeleteNotice = async () => {
    if (!selectedNotice) return;

    // try {
    //   const res = await noticeHandler(`notice/${selectedNotice.id}`, "DELETE");
    //   if (res) {
    //     setNotices(notices.filter(notice => notice.id !== selectedNotice.id));
    //     toast.success("Notice Deleted", {
    //       description: "The notice has been successfully deleted",
    //     });
    //   }
    // } catch (error) {
    //   toast.error("Failed to delete notice", {
    //     description: "Please try again later",
    //   });
    //   console.error("Error deleting notice:", error);
    // } finally {
    //   setShowDeleteDialog(false);
    //   setSelectedNotice(null);
    // }
  };

  const handleNewNoticeSubmit = async () => {
    if (!newNotice.title || !newNotice.content) {
      toast.error("Required Fields Missing", {
        description: "Please fill in all required fields",
      });

      return;
    }

    try {
      const res = await noticeHandlerPost("notice", "POST", newNotice);
      if (res) {
        setNotices([...notices, res.notice]);
        toast.success("Notice Published", {
          description: "The notice has been successfully published",
        });
      }
    } catch (error) {
      toast.error("Failed to publish notice", {
        description: "Please try again later",
      });
      console.error("Error publishing notice:", error);
    } finally {
      setShowNewNoticeDialog(false);
    }

    console.log(newNotice);
  };

  const noticeDate = (notice: notices) => {
    const date = new Date(notice.createdAt);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const handleNewNotice = async () => {
      try {
        const res = await noticeHandler("notice", "GET");
        if (res) {
          setNotices(res.notices);
          console.log();
        }
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };
    handleNewNotice();
  }, []);

  return (
    <div className="">
      <AdminHeader />
      <div className="p-6">
        <div className="flex align-middle justify-between">
          <h1 className="text-2xl font-bold mb-8 text-gray-100">
            Notices and Circulars
          </h1>
          <div>
            <Button
              variant="secondary"
              onClick={() => setShowNewNoticeDialog(true)}
              className="w-full bg-green-600/20 hover:bg-green-600 text-green-500 hover:text-white justify-start transition-all duration-300"
            >
              <BookPlus className="mr-2 h-5 w-5" />
              Publish New
            </Button>

            <Dialog
              open={showNewNoticeDialog}
              onOpenChange={setShowNewNoticeDialog}
            >
              <DialogContent className="bg-gray-900/95 border-gray-800 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Publish New Notice
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Create a new notice or circular for the college
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter notice title"
                      value={newNotice.title}
                      onChange={(e) =>
                        setNewNotice({ ...newNotice, title: e.target.value })
                      }
                      className="bg-gray-800/50 border-gray-700 focus:border-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Type</Label>
                    <div className="flex space-x-4 items-center">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="notice"
                          name="type"
                          value="Notice"
                          checked={newNotice.type === "Notice"}
                          onChange={(e) =>
                            setNewNotice({
                              ...newNotice,
                              type: e.target.value as "Notice" | "Circular",
                            })
                          }
                          className="text-green-500 focus:ring-green-500 bg-gray-800 border-gray-700"
                        />
                        <Label
                          htmlFor="notice"
                          className="flex items-center gap-1"
                        >
                          <Bell className="h-4 w-4" />
                          Notice
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="circular"
                          name="type"
                          value="Circular"
                          checked={newNotice.type === "Circular"}
                          onChange={(e) =>
                            setNewNotice({
                              ...newNotice,
                              type: e.target.value as "Notice" | "Circular",
                            })
                          }
                          className="text-blue-500 focus:ring-blue-500 bg-gray-800 border-gray-700"
                        />
                        <Label
                          htmlFor="circular"
                          className="flex items-center gap-1"
                        >
                          <AlertCircle className="h-4 w-4" />
                          Circular
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Enter notice content"
                      value={newNotice.content}
                      onChange={(e) =>
                        setNewNotice({ ...newNotice, content: e.target.value })
                      }
                      className="min-h-[100px] bg-gray-800/50 border-gray-700 focus:border-green-500"
                    />
                  </div>
                </div>

                <DialogFooter className="gap-3 sm:gap-0">
                  <Button
                    variant="ghost"
                    onClick={() => setShowNewNoticeDialog(false)}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleNewNoticeSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={!newNotice.title || !newNotice.content}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Publish
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className=" md:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
          {[...notices].reverse().map((notification) => (
            <Link key={notification.id} href={`/notices/${notification.id}`}>
              <Card
                className="group relative border border-white/10 backdrop-blur-xl bg-black/20
                        transition-all duration-300 ease-out
                        hover:shadow-[0_0_25px_rgba(100,149,237,0.4)] text-white shadow-lg mb-5"
              >
                <div
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedNotice(notification);
                    setShowDeleteDialog(true);
                  }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Link
                  href={`/notices/${notification.id}`}
                  className="block cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">
                      {notification.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-400">
                      {noticeDate(notification)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-300 mb-4">{notification.content}</p>
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        notification.type === "Notice"
                          ? "bg-green-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {notification.type}
                    </span>
                  </CardContent>
                </Link>
              </Card>
            </Link>
          ))}
        </div>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="bg-gray-900/95 border-gray-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Delete Notice
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to delete this notice? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {selectedNotice && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h4 className="font-medium text-red-400 mb-1">
                    {selectedNotice.title}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {selectedNotice.type} • {noticeDate(selectedNotice)}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="gap-3 sm:gap-0">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteDialog(false)}
                className="bg-gray-800 hover:bg-gray-700 text-white"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleDeleteNotice}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Notice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
