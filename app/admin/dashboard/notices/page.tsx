'use client';

import { useState } from 'react';
import { AdminHeader } from "@/components/ui/adminheader"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link  from "next/link";
import { Button } from '@/components/ui/button';
import { BookPlus } from 'lucide-react';
interface Notification {
    id: number;
    type: 'Notice' | 'Circular';
    title: string;
    date: string;
    time: string; 
    content: string;
}

export default function noticesPage() {
    const [notices] = useState<Notification[]>([
        {
            id: 1,
            type: 'Notice',
            title: 'Annual Sports Day',
            date: '2024-02-15',
            time: '10:00 AM',
            content: 'Annual Sports Day will be held on February 20th. All teachers must attend.',
        },
        {
            id: 2,
            type: 'Circular',
            title: 'Staff Meeting',
            date: '2024-02-10',
            time: '2:00 PM',
            content: 'Monthly staff meeting scheduled for next Monday at 2 PM.',
        },
        {
            id: 3,
            type: 'Notice',
            title: 'Parent-Teacher Meeting',
            date: '2024-02-25',
            time: '3:00 PM',
            content: 'PTM for all classes will be conducted on February 25th.',
        },
    ]);

    return (
        
        <div className="">
        <AdminHeader />
        <div className='p-6'>
            <div className='flex align-middle justify-between'>
            <h1 className="text-2xl font-bold mb-8 text-gray-100">Notices and Circulars</h1>
            <div>
                <Button
                variant="secondary"
                // onClick={handleNewNotice}
                className="w-full dark:bg-green-500 justify-start"
                asChild
              >
                <Link href="/admin/dashboard/notices">
                  <BookPlus className="mr- h-5 w-5" />
                  Publish New
                </Link>
              </Button>
            </div>
            </div>
            <div className=" md:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                {notices.map((notification) => (
                    <Link key={notification.id} href={`/notices/${notification.id}`}>
                        <Card className="cursor-pointer border border-white/10 backdrop-blur-xl bg-black/20
                        transition-all duration-300 ease-out
                        hover:shadow-[0_0_25px_rgba(100,149,237,0.4)] text-white shadow-lg mb-5">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">{notification.title}</CardTitle>
                            <CardDescription className="text-sm text-gray-400">{notification.date},{notification.time}</CardDescription>
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
