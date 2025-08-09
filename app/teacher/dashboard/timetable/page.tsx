'use client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/dashboard/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/app/dashboard/ui/input"
import { Label } from "@/app/dashboard/ui/label"
import { useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Check, Clock, CalendarIcon, Badge,MapPin,Users,Book } from 'lucide-react'
import { format } from 'date-fns'
import { Header } from "@/components/ui/teacherheader"

export default function TeacherTimetable() {
    const [date, setDate] = useState<Date>(new Date())
    const [view, setView] = useState('daily')
    const [showUpdateSchedule, setShowUpdateSchedule] = useState(false)
    const [selectedSchedule, setSelectedSchedule] = useState<string>('')
    const [replacementTeacher, setReplacementTeacher] = useState('')
    const [changeReason, setChangeReason] = useState('')
    const [otherReason, setOtherReason] = useState('')

    // Enhanced timetable data with additional info
    const timetableData = [
        { 
            time: "8:00 AM - 9:00 AM", 
            subject: "DSA", 
            class: "SE IT", 
            room: "Room 101",
            topic: "Arrays",
            status: "Upcoming"
        },
        { 
            time: "9:15 AM - 10:15 AM", 
            subject: "LDCO-Practical", 
            class: "TE IT", 
            room: "Lab 201",
            topic: "Transistors",
            status: "Next"
        },
        { 
            time: "10:30 AM - 11:30 AM", 
            subject: "SME", 
            class: "FE", 
            room: "Lab 202",
            topic: "Vechicle Dynamics",
            status: "Upcoming"
        },
        { 
            time: "12:30 PM - 1:30 PM", 
            subject: "Engineering Mathematics", 
            class: "FE", 
            room: "Room 103",
            topic: "Triple Integrals",
            status: "Upcoming"
        },
        { 
            time: "1:45 PM - 2:45 PM", 
            subject: "Engineering Physics", 
            class: "FE", 
            room: "Lab 201",
            topic: "Double Slit Experiment",
            status: "Upcoming"
        },
    ]

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-500/10 text-green-500'
            case 'next':
                return 'bg-blue-500/10 text-blue-500'
            case 'upcoming':
                return 'bg-gray-500/10 text-gray-400'
            default:
                return 'bg-gray-500/10 text-gray-400'
        }
    }

    const handleScheduleUpdate = () => {
        // yahan update the schedule in backend
        const selectedClass = timetableData[parseInt(selectedSchedule)]
        console.log('Updating schedule:', {
            date: format(date, 'yyyy-MM-dd'),
            class: selectedClass,
            replacementTeacher,
            reason: changeReason === 'other' ? otherReason : changeReason
        })
        setShowUpdateSchedule(false)
        // Reset form
        setSelectedSchedule('')
        setReplacementTeacher('')
        setChangeReason('')
        setOtherReason('')
    }

    return (
        <div className="text-white">
            <Header />
            <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        My Schedule
                    </h1>
                    <p className="text-gray-400 mt-2">
                        {format(date, 'EEEE, MMMM do, yyyy')}
                    </p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-4">
                    <Select value={view} onValueChange={setView}>
                        <SelectTrigger className="w-[180px] bg-gray-900/50 border-gray-700">
                            <SelectValue placeholder="Select view" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="daily">Daily View</SelectItem>
                            <SelectItem value="weekly">Weekly View</SelectItem>
                            <SelectItem value="monthly">Monthly View</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-gray-900/50 border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">Today's Classes</CardTitle>
                            <CardDescription className="text-gray-400">
                                You have {timetableData.length} classes scheduled
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {timetableData.map((schedule, index) => (
                                    <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800 transition-colors">
                                        <CardContent className="p-4">
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge className={getStatusColor(schedule.status)}>
                                                            {schedule.status}
                                                        </Badge>
                                                        <h3 className="font-semibold text-lg text-white">{schedule.subject}</h3>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{schedule.time}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4" />
                                                            <span>{schedule.room}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            <span>{schedule.class}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Book className="h-4 w-4" />
                                                            <span>{schedule.topic}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-gray-900/50 flex flex-col border-gray-800">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5" />
                                Calendar
                            </CardTitle>
                            <button
                                onClick={() => setShowUpdateSchedule(true)}
                                className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Clock className="h-4 w-4" />
                                Update Schedule
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center mt-4">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(date) => date && setDate(date)}
                            className="rounded-lg dark:bg-gray-800/50 backdrop-blur-lg border-gray-700"
                            classNames={{
                                day_selected: "bg-blue-600 text-white hover:bg-blue-600",
                                day_today: "bg-gray-800 text-white",
                                day: "text-gray-300 hover:bg-gray-800",
                                head_cell: "text-gray-400",
                                nav_button: "text-gray-400 hover:bg-gray-800",
                                table: "border-gray-800",
                            }}
                        />
                        </div>

                        <Dialog open={showUpdateSchedule} onOpenChange={setShowUpdateSchedule}>
                            <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        Update Class Schedule
                                    </DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                        {format(date, 'EEEE, MMMM do, yyyy')}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="class">Select Class</Label>
                                        <Select onValueChange={setSelectedSchedule}>
                                            <SelectTrigger className="w-full bg-gray-800 border-gray-700">
                                                <SelectValue placeholder="Select a class" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-700">
                                                {timetableData.map((schedule, index) => (
                                                    <SelectItem key={index} value={index.toString()}>
                                                        {schedule.time} - {schedule.subject} ({schedule.class})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="newTeacher">Replacement Teacher</Label>
                                        <Input
                                            id="newTeacher"
                                            placeholder="Enter teacher's name"
                                            className="bg-gray-800 border-gray-700"
                                            value={replacementTeacher}
                                            onChange={(e) => setReplacementTeacher(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Reason for Change</Label>
                                        <Select onValueChange={setChangeReason}>
                                            <SelectTrigger className="w-full bg-gray-800 border-gray-700">
                                                <SelectValue placeholder="Select reason" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-700">
                                                <SelectItem value="sick-leave">Sick Leave</SelectItem>
                                                <SelectItem value="personal-leave">Personal Leave</SelectItem>
                                                <SelectItem value="emergency">Emergency</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {changeReason === 'other' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="otherReason">Specify Reason</Label>
                                            <Input
                                                id="otherReason"
                                                placeholder="Enter reason"
                                                className="bg-gray-800 border-gray-700"
                                                value={otherReason}
                                                onChange={(e) => setOtherReason(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between gap-4">
                                    <button
                                        onClick={() => setShowUpdateSchedule(false)}
                                        className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleScheduleUpdate}
                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                        disabled={!selectedSchedule || !replacementTeacher || !changeReason}
                                    >
                                        <Check className="h-4 w-4" />
                                        Update Schedule
                                    </button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>
            </div>
        </div>
    )
}