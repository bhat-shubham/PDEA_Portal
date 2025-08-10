// app/teacher/dashboard/layout.tsx
"use client";
import { AdminSidebar } from "@/components/ui/adminsidebar";
// import withAuth from "@/app/lib/withAuth";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="fixed inset-0 w-screen h-screen">
        <div className="relative w-full h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e] flex items-center justify-center overflow-hidden">
          <div className="absolute top-[20%] left-[25%] w-[200px] h-[200px] bg-purple-500 rounded-full opacity-50 blur-3xl" />
          <div className="absolute bottom-[35%] right-[30%] w-[180px] h-[180px] bg-pink-500 rounded-full opacity-45 blur-3xl" />
          <div className="absolute top-[55%] left-[55%] w-[160px] h-[160px] bg-blue-500 rounded-full opacity-40 blur-3xl" />
          <div className="absolute top-[40%] right-[10%] w-[140px] h-[140px] bg-cyan-500 rounded-full opacity-35 blur-3xl" />
          <div className="absolute bottom-[15%] left-[45%] w-[120px] h-[120px] bg-violet-500 rounded-full opacity-30 blur-3xl" />
          <div className="absolute bottom-[70%] right-[70%] w-[100px] h-[100px] bg-indigo-500 rounded-full opacity-25 blur-3xl" />
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[8px]" />
        </div>
      </div>
      <div className="flex h-screen w-full relative z-10">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          {/* <Header /> */}
          <main className="">{children}</main>
        </div>
      </div>
    </div>
  );
}
// export default withAuth(DashboardLayout);
export default DashboardLayout;
