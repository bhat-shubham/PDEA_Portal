"use client";
import { Button, buttonVariants } from "./ui/button";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { Bot, Loader } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "./ui/chart";
import { subjects, calculateAttendance } from "./subject-attendence";
import { HfInference } from "@huggingface/inference";

// Define Subject type with totalLectures
type Subject = {
  name: string;
  attendance: number;
  totalLectures?: number;
  attended?: number;
  total?: number;
}

// Convert subjects to pie chart format with original color scheme
const subjectAttendance = subjects.map(subject => ({
  subject: subject.name, 
  attendance: subject.attendance, 
  fill: subject.name === "TOC" 
    ? "hsl(214, 84%, 56%)"  // Bright Blue for TOC
    : subject.name === "BCN" 
    ? "hsl(142, 11%, 45%)"  // Green for BCN
    : subject.name === "Internship" 
    ? "hsl(0, 84%, 70%)"    // Red for Internship
    : subject.name === "CyberSecurity" 
    ? "hsl(270, 67%, 58%)"  // Purple for CyberSecurity
    : "hsl(35, 91%, 59%)"   // Orange for WAD
}));

// Chart configuration
const chartConfig = {
  attendance: { label: "Attendance" },
  toc: { label: "TOC", color: "hsl(214, 84%, 56%)" },
  bcn: { label: "BCN", color: "hsl(142, 71%, 45%)" },
  internship: { label: "Internship", color: "hsl(0, 84%, 60%)" },
  cybersecurity: { label: "CyberSecurity", color: "hsl(270, 67%, 58%)" },
  wad: { label: "WAD", color: "hsl(35, 91%, 59%)" },
} satisfies ChartConfig;

export function AttendanceGraph() {
  const [loading, setLoading] = React.useState(false);
  const [aiResult, setAiResult] = React.useState("");
  const [result, setResult] = React.useState("");

  // Calculate total and average attendance
  const totalAttendance = React.useMemo(() => {
    return Math.round(subjectAttendance.reduce((acc, curr) => acc + curr.attendance, 0) / subjectAttendance.length);
  }, []);

  const getAttendanceColor = (attendance: number) => {
    if (attendance < 50) return "red";
    if (attendance < 75) return "yellow";
    return "green";
  };

  const calculateLectureRequirements = async () => {
    setLoading(true);
    setAiResult("");

    try {
      // Detailed attendance calculation
      const lecturesToAttend = subjects.map((subject: Subject) => {
        const currentAttendedLectures = subject.attended || 0; 
        const totalLectures = subject.total || 0; 
        const requiredAttendance = 75; // Standard minimum attendance

        // Prevent division by zero and ensure correct percentage calculation
        const currentAttendance = totalLectures > 0 
          ? Math.round((currentAttendedLectures / totalLectures) * 100) 
          : 0;
        
        const requiredLectures = totalLectures > 0
          ? Math.max(0, Math.ceil(
              (requiredAttendance * totalLectures / 100) - currentAttendedLectures
            ))
          : 0;

        return {
          subject: subject.name,
          currentAttendance,
          requiredLectures
        };
      });

      // Calculate average attendance
      const averageAttendance = lecturesToAttend.length > 0
        ? lecturesToAttend.reduce((sum, item) => sum + item.currentAttendance, 0) / lecturesToAttend.length
        : 0;

      // Prepare subject recommendations
      const subjectRecommendations = lecturesToAttend.map((item, index) => 
        `${index + 1}. ${item.subject}: ${item.requiredLectures} more lectures needed`
      ).join('\n');

      // Prepare prompt based on average attendance
      const prompt = averageAttendance > 75 
        ? `Output only this exact message without adding anything else:
           "Your overall attendance is excellent at ${averageAttendance.toFixed(2)}%. 
            Keep up the great work! Consistent attendance is key to academic success." 
           Include one short motivational quote on consistency. 
           Do not bold any words, do not add any extra text, and do not respond like a chatbot.`
        : `Output only this exact format without adding anything else:
           Detailed Attendance Analysis:
           Overall Attendance: ${averageAttendance.toFixed(2)}%

           Recommendations for each subject to reach 75% attendance:
           ${subjectRecommendations}
           
           Focus on these subjects to improve your overall attendance.
           Do not bold any words, do not add extra text, and do not respond like a chatbot.`;

      try {
        const response = await fetch('/api/huggingface', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: prompt }],
            max_tokens: 250
          })
        });

        // Log the full response for debugging
        console.log('Full API Response:', response);

        if (!response.ok) {
          // Try to get more details about the error
          const errorBody = await response.text();
          console.error('API Error Response Body:', errorBody);
          throw new Error(`Failed to fetch AI response. Status: ${response.status}, Body: ${errorBody}`);
        }

        const data = await response.json();
        console.log('Parsed Response Data:', data);
        
        // Safely access the message content
        const aiMessage = data.choices && data.choices[0] && data.choices[0].message 
          ? data.choices[0].message.content 
          : "Unable to generate analysis.";
        
        setAiResult(aiMessage);
      } catch (aiError) {
        console.error("Detailed AI Error:", aiError);
        setAiResult(aiError instanceof Error ? `AI Error: ${aiError.message}` : "Unexpected error in AI analysis");
      }
    } catch (error) {
      console.error("Comprehensive Error:", error);
      setAiResult("Error generating lecture attendance analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex h-full flex-col dark:bg-white/10 relative">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Attendance Overview</CardTitle>
          <CardDescription>Semester Performance</CardDescription>
        </div>
        <div className="rounded-xl shadow-[0_0_10px_2px_rgba(138,43,226,0.4)]">
          <Button 
            variant={"outline"} 
            className="w-25 h-25 p-2"
            onClick={calculateLectureRequirements}
            disabled={loading}
          >
            {loading ? (
              <Loader className="!size-10 text-[#B080FF] animate-spin"/>
            ) : (
              <Bot className="!size-10 text-[#B080FF] drop-shadow-[0_0_6px_rgba(186,104,255,0.7)]"/>
            )}
          </Button>
        </div>
        
      </CardHeader>
      
      <CardContent className="flex-1 items-center justify-center align-middle pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px]"
        >
          <PieChart>
            <ChartTooltip cursor={true} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={subjectAttendance}
              dataKey="attendance"
              nameKey="subject"
              innerRadius={80}
              strokeWidth={10}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const attendanceColor = getAttendanceColor(totalAttendance);
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} fill={attendanceColor} className="text-3xl font-bold">
                          {totalAttendance}%
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Average
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing overall attendance across subjects
        </div>
      </CardFooter>

      {aiResult && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm">{aiResult}</p>
        </div>
      )}
    </Card>
  );
}
