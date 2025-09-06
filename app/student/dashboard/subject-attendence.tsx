"use client"
import { Suspense, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { profileHandler } from "@/app/lib/studentHandler";
import { Button } from "@/components/ui/button";
import { BookmarkPlus } from "lucide-react";
import { studentHandler } from "@/app/lib/studentHandler";
import { toast } from "sonner";
import { Popover,PopoverContent,PopoverTrigger} from "@radix-ui/react-popover";
import { Input } from "@/components/ui/input";

export const calculateAttendance = (attended: number, total: number) => {
  return Math.round((attended / total) * 100)
}

type SubjectItem = { name: string; attended: number; total: number; attendance: number };

function getAttendanceColor(attendance: number) {
  if (attendance < 50) return "bg-red-500"
  if (attendance < 75) return "bg-yellow-500"
  return "bg-green-500"
}

function CustomProgressBar({ value, attended, total }: { value: number; attended: number; total: number }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${getAttendanceColor(value)}`} 
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Attended: {attended} out of {total} lectures
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function SubjectAttendance() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess,setIsSuccess]= useState(false);
  const [classCode, setClassCode] = useState("");
  const [subjects, setSubjects] = useState<SubjectItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await studentHandler("class", "POST", { classCode });
      const data = response;
      console.log(response);
      if (response.message == "Join request sent successfully") {
        toast.success("Class join request sent successfully!", {
          description: "Kindly wait while teacher admits you to the class",
          richColors: true,
        });
        setIsSuccess(true);
      } else if (
        response.message ===
        "You have already sent a join request for this class"
      ) {
        toast.error("Join request already sent", {
          description: "Kindly wait while the teacher accepts your request",
          richColors: true,
        });
      } else {
        toast.error("Couldn't join class", {
          description: data.message || "Please check the class code",
          richColors: true,
        });
      }
    } catch (error) {
      toast.error("Failed to send request", {
        description: "Please try again later",
        richColors: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await profileHandler("attendance", "GET");
        if (mounted && res && Array.isArray(res.subjects)) {
          const mapped: SubjectItem[] = res.subjects.map((s: any) => ({
            name: s.name,
            attended: Number(s.attended) || 0,
            total: Number(s.total) || 0,
            attendance: s.total ? calculateAttendance(Number(s.attended) || 0, Number(s.total) || 0) : 0,
          }));
          setSubjects(mapped);
        } else if (mounted) {
          setSubjects([]);
        }
      } catch (e) {
        if (mounted) setSubjects([]);
        console.error("Failed to load attendance", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Suspense fallback={<div className="h-48 w-full animate-pulse rounded-md bg-muted" />}>
    <Card className="h-full w-full border border-none relative dark:bg-white/10">
      <CardHeader>
        <div className="flex justify-between align-center items-center">
          <div>
        <CardTitle>Subject-wise Attendance</CardTitle>
        </div>
        <div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
              <Button className="bg-green-600/20 hover:bg-green-600 text-green-500 hover:text-white justify-start transition-all duration-300" variant="secondary">
                <BookmarkPlus className="h-4 w-4" />
                Join New Subject
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <form onSubmit={handleSubmit}>
                <Input
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  placeholder="Enter class code"
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Joining..." : "Join Class"}
                </Button>
              </form>
            </PopoverContent>
          </Popover>
        </div>

        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading && (
            <>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-3 w-full rounded-full" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-3 w-full rounded-full" />
            </>
          )}
          {!loading && subjects && subjects.length === 0 && (
            <div className="text-muted-foreground">No attendance records found.</div>
          )}
          {!loading && subjects && subjects.map((subject) => (
            <div key={subject.name} className="space-y-2">
              <div className="flex justify-between text-md">
                <span>{subject.name}</span>
                <span className="text-muted-foreground">
                  {subject.attendance}% ({subject.attended}/{subject.total})
                </span>
              </div>
              <Suspense fallback={<Skeleton className="h-3 w-full rounded-full" />}>
                <CustomProgressBar value={subject.attendance} attended={subject.attended} total={subject.total} />
              </Suspense>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    </Suspense>
  )
}
