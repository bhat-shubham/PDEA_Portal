
"use client";
import { StudentSidebar } from "@/components/ui/studentsidebar"
// import withAuth from "../../lib/withAuth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: `
          radial-gradient(ellipse at 20% 30%, rgba(56, 189, 248, 0.4) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 70%),
          radial-gradient(ellipse at 60% 20%, rgba(236, 72, 153, 0.25) 0%, transparent 50%),
          radial-gradient(ellipse at 40% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 65%)
        `,
        backgroundColor: '#0f172a',
        position: 'fixed',
        height: '100%',
        width: '100%'
      }} />
      <div className="relative z-10 flex flex-1 overflow-hidden">
        <div className="h-full">
          <StudentSidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}