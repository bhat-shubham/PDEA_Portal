"use client";
import { StudentHeader } from "@/components/ui/studentheader";
import Notices from "@/components/ui/notices";
export default function NoticesPage() {
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