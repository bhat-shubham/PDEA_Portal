"use client";

import { Button } from "../../../components/ui/button";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { Bot, Loader } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../../../components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "../../../components/ui/chart";
import { subjects } from "./subject-attendence";
import Groq from "groq-sdk";
import { set } from "date-fns";

// ---- Types ----
type Subject = {
  name: string;
  attendance: number;   // percentage snapshot used for the chart
  attended?: number;    // total attended sessions
  total?: number;       // total conducted sessions
};

type SubjectPlan = {
  subject: string;
  currentAttendancePct: number; // 0-100
  risk: "HIGH" | "MEDIUM" | "LOW";
  rateAssumption: number;       // r in [0..1]
  neededAt75IfAttendAll: number; // number of lectures needed if r=1
  neededAt75AtRate?: number;    // number at rate r (if feasible), else undefined
  feasibleAtRate: boolean;
};

// ---- Chart prep (unchanged palette) ----
const subjectAttendance = subjects.map((subject) => ({
  subject: subject.name,
  attendance: subject.attendance,
  fill:
    subject.name === "TOC"
      ? "hsl(214, 84%, 56%)"
      : subject.name === "BCN"
      ? "hsl(142, 11%, 45%)"
      : subject.name === "Internship"
      ? "hsl(0, 84%, 70%)"
      : subject.name === "CyberSecurity"
      ? "hsl(270, 67%, 58%)"
      : "hsl(35, 91%, 59%)"
}));

const chartConfig = {
  attendance: { label: "Attendance" },
  toc: { label: "TOC", color: "hsl(214, 84%, 56%)" },
  bcn: { label: "BCN", color: "hsl(142, 71%, 45%)" },
  internship: { label: "Internship", color: "hsl(0, 84%, 60%)" },
  cybersecurity: { label: "CyberSecurity", color: "hsl(270, 67%, 58%)" },
  wad: { label: "WAD", color: "hsl(35, 91%, 59%)" }
} satisfies ChartConfig;

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY!,dangerouslyAllowBrowser: true
});

export function AttendanceGraph() {
  const [loading, setLoading] = React.useState(false);
  const [output, setOutput] = React.useState("");
  const [isLoading,setisLoading] = React.useState(false);

  const totalAttendance = React.useMemo(() => {
    return Math.round(
      subjectAttendance.reduce((acc, curr) => acc + curr.attendance, 0) /
        subjectAttendance.length
    );
  }, []);

  const getAttendanceColor = (attendance: number) => {
    if (attendance < 50) return "red";
    if (attendance < 75) return "yellow";
    return "green";
  };


  const rateFromRisk = (pct: number) => {
    if (pct < 60) return 0.6; // high risk
    if (pct < 75) return 0.8; // medium risk
    return 0.95;              // low risk
  };

  const ceilNonNeg = (x: number) => Math.max(0, Math.ceil(x));

  // Minimum x such that (a + x)/(t + x) >= p  -> x >= (p*t - a) / (1 - p)
  const neededIfAttendAll = (a: number, t: number, p: number) => {
    if (t <= 0) return 0;
    const num = p * t - a;
    const den = 1 - p;
    if (den <= 0) return 0;
    return ceilNonNeg(num / den);
    // If already at/above p, this returns <=0, which we clamp to 0
  };

  // Minimum x such that (a + r*x)/(t + x) >= p  -> x >= (p*t - a) / (r - p), requires r>p
  const neededAtRate = (a: number, t: number, p: number, r: number) => {
    if (t <= 0) return 0;
    if (r <= p) return undefined; // not feasible at current consistency
    const x = (p * t - a) / (r - p);
    return ceilNonNeg(x);
  };

  const calculateLectureRequirements = async () => {
    setLoading(true);
    setisLoading(true);
    setOutput("");

    try {
      const thresholdPct = 75;
      const p = thresholdPct / 100;

      //subject plan
      const plans: SubjectPlan[] = subjects.map((s) => {
        const t = s.total ?? 0;
        const a = s.attended ?? 0;

        const currentPct = t > 0 ? Math.round((a / t) * 100) : 0;
        const risk: SubjectPlan["risk"] =
          currentPct < 60 ? "HIGH" : currentPct < thresholdPct ? "MEDIUM" : "LOW";
        const r = rateFromRisk(currentPct);

        const xAll = neededIfAttendAll(a, t, p);
        const xRate = neededAtRate(a, t, p, r);
        const feasible = xRate !== undefined;

        return {
          subject: s.name,
          currentAttendancePct: currentPct,
          risk,
          rateAssumption: r,
          neededAt75IfAttendAll: xAll,
          neededAt75AtRate: xRate,
          feasibleAtRate: feasible
        };
      });
      const overallAvg =
        plans.reduce((sum, p) => sum + p.currentAttendancePct, 0) /
        Math.max(1, plans.length);

      const compact = plans
        .map((p) => {
          const line = `${p.subject} | now=${p.currentAttendancePct}% | risk=${p.risk}` +
            ` | r=${Math.round(p.rateAssumption * 100)}%` +
            ` | need@1.0=${p.neededAt75IfAttendAll}` +
            ` | need@r=${p.neededAt75AtRate ?? "N/A"}`;
          return line;
        })
        .join("\n");
      const prompt = `
${process.env.NEXT_PUBLIC_ATTENDANCE_PROMPT!.trim()}

Context: 
- Threshold: ${thresholdPct}%
- Overall average: ${overallAvg.toFixed(2)}%
- Per-subject snapshot:
${compact}
`.trim();

      const completion = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: "You are a crisp, pragmatic academic advisor." },
          { role: "user", content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 300
      });

      const content =
        completion.choices?.[0]?.message?.content?.trim() ||
        "Unable to generate a plan.";

      setOutput(content);
    } catch (err) {
      console.error("AI planning error:", err);
      setOutput("AI planning error. Please try again.");
    } finally {
      setLoading(false);
      setisLoading(false);
    }
  };

  return (
    <div className="h-full">
    <Card className="flex h-full border flex-col dark:bg-white/10 relative">
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
              <Loader className="!size-10 text-[#B080FF] animate-spin" />
            ) : (
              <Bot className="!size-10 text-[#B080FF] drop-shadow-[0_0_6px_rgba(186,104,255,0.7)]" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 items-center justify-center align-middle">
        <ChartContainer
          config={chartConfig}
          className="flex items-center "
        >
          <PieChart>
            <ChartTooltip cursor={true} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={subjectAttendance}
              dataKey="attendance"
              nameKey="subject"
              innerRadius={60}
              strokeWidth={1}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const attendanceColor = getAttendanceColor(totalAttendance);
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          fill={attendanceColor}
                          className="text-4xl font-bold"
                        >
                          {totalAttendance}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
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
    </Card>
    {/* <Card className="relative h-full items-center dark:bg-white/10">
      <CardHeader>
        <CardTitle className="flex items-center">
          {!isLoading 
      ? <p>Tired Of Seeing The Graphs?Get AI insights by Clicking On The Icon Above</p> 
      : <p>Data loaded successfully!</p>
    }
        </CardTitle>
      </CardHeader>
      <CardContent>
        {output && (
          <pre className="mt-3 w-full p-3 bg-black/30 text-white rounded whitespace-pre-wrap border border-white/10">
            {output}
          </pre>
        )}
      </CardContent>
    </Card> */}
    </div>
    
  );
}
