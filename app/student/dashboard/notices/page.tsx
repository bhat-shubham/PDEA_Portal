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
      {isLoading ? (
        <div className="md:grid-cols-2 lg:grid-`cols-3 flex flex-col gap-4 mb-5">
          <div className="space-y-2">
            <Skeleton className="h-[200px] rounded-lg flex bg-black/20 flex-col p-5 gap-1 w-full">

            <Skeleton className="h-[20px] w-64 backdrop-blur-xl  bg-black/20" />
            <Skeleton className="h-[20px] w-32 backdrop-blur-xl  bg-black/20" />
            <Skeleton className="h-[40px] mt-5 backdrop-blur-xl w-full bg-black/20" />
            <Skeleton className="h-[20px] px-3 backdrop-blur-xl py-1 rounded-full mt-5 w-16 bg-black/20" />
            </Skeleton>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-[200px] rounded-lg flex bg-black/20 flex-col p-5 gap-1 w-full">

            <Skeleton className="h-[20px] w-64 backdrop-blur-xl  bg-black/20" />
            <Skeleton className="h-[20px] w-32 backdrop-blur-xl  bg-black/20" />
            <Skeleton className="h-[40px] mt-5 backdrop-blur-xl w-full bg-black/20" />
            <Skeleton className="h-[20px] px-3 backdrop-blur-xl py-1 rounded-full mt-5 w-16 bg-black/20" />
            </Skeleton>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-[200px] rounded-xl flex bg-black/20 flex-col p-5 gap-1 w-full">

            <Skeleton className="h-[20px] w-64 backdrop-blur-xl  bg-black/20" />
            <Skeleton className="h-[20px] w-32 backdrop-blur-xl  bg-black/20" />
            <Skeleton className="h-[40px] mt-5 backdrop-blur-xl w-full bg-black/20" />
            <Skeleton className="h-[20px] px-3 backdrop-blur-xl py-1 rounded-full mt-5 w-16 bg-black/20" />
            </Skeleton>
          </div>
          </div>
          
        ) : (
        <div className="md:grid-cols-2 lg:grid-`cols-3 gap-2 mb-3">
          {[...notices].reverse().map((notification) => (
              <Card
                key={notification.id}
                className="cursor-pointer border border-white/10 backdrop-blur-xl bg-black/20
                        transition-all duration-300 ease-out
                        hover:shadow-[0_0_25px_rgba(100,149,237,0.4)] text-white shadow-lg mb-5"
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
              </Card>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}