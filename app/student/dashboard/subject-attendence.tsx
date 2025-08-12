"use client"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip"
import { motion } from "framer-motion";
export const calculateAttendance = (attended: number, total: number) => {
  return Math.round((attended / total) * 100)
}

export const subjects = [
  { 
    name: "TOC", 
    attended: 15, 
    total: 20,
    get attendance() {
      return calculateAttendance(this.attended, this.total)
    }
  },
  { 
    name: "BCN", 
    attended:19, 
    total: 20,
    get attendance() {
      return calculateAttendance(this.attended, this.total)
    }
  },
  { 
    name: "Internship", 
    attended: 9, 
    total: 20,
    get attendance() {
      return calculateAttendance(this.attended, this.total)
    }
  },
  { 
    name: "CyberSecurity", 
    attended: 5, 
    total: 20,
    get attendance() {
      return calculateAttendance(this.attended, this.total)
    }
  },
  { 
    name: "WAD", 
    attended: 10, 
    total: 20,
    get attendance() {
      return calculateAttendance(this.attended, this.total)
    }
  }
]

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
  return (
    <Card className="h-full w-full relative dark:bg-white/10">
      <CardHeader>
        <CardTitle>Subject-wise Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subjects.map((subject) => (
            <div key={subject.name} className="space-y-2">
              <div className="flex justify-between text-md">
                <span>{subject.name}</span>
                <span className="text-muted-foreground">
                  {subject.attendance}% ({subject.attended}/{subject.total})
                </span>
              </div>
              <CustomProgressBar value={subject.attendance} attended={subject.attended} total={subject.total} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
