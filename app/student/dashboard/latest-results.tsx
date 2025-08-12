import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"

const results = [
  { subject: "Mathematics", score: 92, grade: "A" },
  { subject: "Physics", score: 88, grade: "B+" },
  { subject: "Computer Science", score: 95, grade: "A+" },
  { subject: "English", score: 90, grade: "A" },
  { subject: "Chemistry", score: 85, grade: "B" },
]

export function LatestResults() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{result.subject}</TableCell>
                <TableCell>{result.score}</TableCell>
                <TableCell>
                  <Badge variant={result.grade.startsWith("A") ? "default" : "secondary"}>{result.grade}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

