'use client';
import { noticeHandler } from '@/app/lib/noticeHandler';
import { useEffect,useState } from 'react';
import { Header } from "@/components/ui/teacherheader"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link  from "next/link";
interface notices {
  id: number;
  type: "Notice" | "Circular";
  title: string;
  createdAt: Date;
  content: string;
}


export default function noticesPage() {
    const [notices, setNotices] = useState<notices[]>([]);
    
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
        <Header />
        <div className='p-6'>

            <h1 className="text-2xl font-bold mb-8 text-gray-100">Notices and Circulars</h1>
            <div className=" md:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                {[...notices].reverse().map((notification) => (
                    <Link key={notification.id} href={`/notices/${notification.id}`}>
                        <Card className="cursor-pointer border border-white/10 backdrop-blur-xl bg-black/20
                        transition-all duration-300 ease-out
                        hover:shadow-[0_0_25px_rgba(100,149,237,0.4)] text-white shadow-lg mb-5">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">{notification.title}</CardTitle>
                            <CardDescription className="text-sm text-gray-400">{notification.createdAt.toLocaleDateString()},{notification.createdAt.toLocaleTimeString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-300 mb-4">{notification.content}</p>
                            <span className={`px-3 py-1 text-sm rounded-full ${notification.type === 'Notice' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                                {notification.type}
                            </span>
                        </CardContent>
                    </Card>
                    </Link>
                ))}
            </div>
            </div>
        </div>
    );
}
