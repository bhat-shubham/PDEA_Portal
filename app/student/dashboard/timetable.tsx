/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

type TimetableRow = {
  time: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
};

const timetable: TimetableRow[] = [
  {
    time: "09:00 AM",
    monday: "Mathematics",
    tuesday: "Physics",
    wednesday: "Computer Science",
    thursday: "English",
    friday: "Chemistry",
  },
  {
    time: "11:00 AM",
    monday: "Physics",
    tuesday: "Computer Science",
    wednesday: "English",
    thursday: "Chemistry",
    friday: "Mathematics",
  },
  {
    time: "02:00 PM",
    monday: "Computer Science",
    tuesday: "English",
    wednesday: "Chemistry",
    thursday: "Mathematics",
    friday: "Physics",
  },
]

export function Timetable() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Timetable</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Monday</TableHead>
              <TableHead>Tuesday</TableHead>
              <TableHead>Wednesday</TableHead>
              <TableHead>Thursday</TableHead>
              <TableHead>Friday</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timetable.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.time}</TableCell>
                <TableCell>{row.monday}</TableCell>
                <TableCell>{row.tuesday}</TableCell>
                <TableCell>{row.wednesday}</TableCell>
                <TableCell>{row.thursday}</TableCell>
                <TableCell>{row.friday}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
