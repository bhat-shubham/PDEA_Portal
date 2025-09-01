"use client";
import { AdminHeader } from "@/components/ui/adminheader";
import AllClasses from "@/components/ui/classes";
export default function AdminDashboard() {
  return (
    <>
      <AdminHeader />
      <div className="flex w-full flex-col min-h-full gap-6 p-6">
        <AllClasses />
      </div>
    </>
  );
}
