"use client";

import { useState, useEffect } from "react";
import { StudentHeader } from "@/components/ui/studentheader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { noticeHandler } from "@/app/lib/noticeHandler";
import { useTestSocket } from "@/app/lib/TestSocket";
import { Skeleton } from "@/components/ui/skeleton";
import Notices from "@/components/ui/notices";
interface notices {
  id: number;
  type: "Notice" | "Circular";
  title: string;
  content: string;
  createdAt: Date;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<notices[]>([]);
  const [isLoading,setIsLoading] = useState(true);
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
        setIsLoading(true);
        const res = await noticeHandler("notice", "GET");
        if (res) {
          setNotices(res.notices);
          console.log();
        } 
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
      finally {
        setIsLoading(false);
      }
    };
    handleNewNotice();
  }, []);

  const socket = useTestSocket();

  useEffect(() => {
    if (socket) {
      socket.on("newNotice", (notification) => {
        console.log("newNotice:", notification);
      });
    }
  }, [socket]);

  return (
    <div className="">
      <StudentHeader />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8 text-gray-100">
          Notices and Circulars
        </h1>
        <Notices />
      </div>
    </div>
  );
}