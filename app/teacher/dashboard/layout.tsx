// app/teacher/dashboard/layout.tsx
"use client";
import { Sidebar } from "@/components/ui/teachersidebar"
import withAuth from "../../lib/withAuth";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <div className="fixed inset-0 w-full h-screen">
        <div className="relative w-full h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e] flex items-center justify-center overflow-hidden">
          <div className="absolute top-[25%] left-[25%] w-[120px] h-[120px] bg-cyan-400 rounded-full opacity-50 blur-3xl" />
          <div className="absolute top-[25%] right-[25%] w-[100px] h-[100px] bg-blue-500 rounded-full opacity-45 blur-3xl" />
          <div className="absolute bottom-[25%] left-[25%] w-[140px] h-[140px] bg-purple-500 rounded-full opacity-40 blur-3xl" />
          <div className="absolute bottom-[25%] right-[25%] w-[110px] h-[110px] bg-pink-500 rounded-full opacity-35 blur-3xl" />
          <div className="absolute top-[50%] left-[50%] w-[160px] h-[160px] bg-green-400 rounded-full opacity-55 blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-[40%] left-[40%] w-[2px] h-[100px] bg-cyan-400 opacity-30 blur-sm transform rotate-45" />
          <div className="absolute top-[40%] right-[40%] w-[2px] h-[100px] bg-blue-500 opacity-25 blur-sm transform -rotate-45" />
          <div className="absolute bottom-[40%] left-[40%] w-[2px] h-[100px] bg-purple-500 opacity-20 blur-sm transform -rotate-45" />
          <div className="absolute bottom-[40%] right-[40%] w-[2px] h-[100px] bg-pink-500 opacity-15 blur-sm transform rotate-45" />
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[8px]" />
        </div>
      </div>
      <div className="flex h-screen w-full relative z-10">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-auto">
          {/* <Header /> */}
          <main className="">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default withAuth(DashboardLayout);
