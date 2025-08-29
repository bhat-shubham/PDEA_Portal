import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Bell } from "lucide-react";
import {useState, useEffect} from "react";
import { noticeHandler } from "@/app/lib/noticeHandler";
import Link from "next/link";
interface notices {
  id: number;
  type: "Notice" | "Circular";
  title: string;
  content: string;
  createdAt: Date;
}

export function Notifications() {
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
    const [notices, setNotices] = useState<notices[]>([]);
    const noticeDate = (notice: notices) => {
      const date = new Date(notice.createdAt);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };
  return (
    <div className="hover:scale-105 transition-transform">
      <Link href="/student/dashboard/notices">
    <Card className="relative h-full border border-none items-center dark:bg-white/10">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Latest Notices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {[...notices].slice(0, 4).reverse().map((notification) => (
            <li
              key={notification.id}
              className="flex justify-between items-start"
            >
              <span className="text-md">{notification.title}</span>
              <span className="text-sm text-muted-foreground">
                {noticeDate(notification)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
    </Link>
    </div>
  );
}
