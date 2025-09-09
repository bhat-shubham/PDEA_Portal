/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "../../../components/ui/button";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { ArrowBigLeftIcon, Bot, Loader } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../components/ui/chart";
import { profileHandler } from "@/app/lib/studentHandler";
import Groq from "groq-sdk";
import { Skeleton } from "@/components/ui/skeleton";

type Subject = {
  name: string;
  attendance: number;
  attended?: number;
  total?: number;
};

type SubjectPlan = {
  subject: string;
  currentAttendancePct: number;
  risk: "HIGH" | "MEDIUM" | "LOW";
  rateAssumption: number;
  neededAt75IfAttendAll: number;
  neededAt75AtRate?: number;
  feasibleAtRate: boolean;
};

const colorFor = (name: string) => {
  const Palette = [
    "hsl(214, 84%, 56%)",
    "hsl(142, 71%, 45%)",
    "hsl(0, 84%, 60%)",
    "hsl(270, 67%, 58%)",
    "hsl(35, 91%, 59%)",
  ];
  return Palette[Math.floor(Math.random() * Palette.length)];
};

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY!,
  dangerouslyAllowBrowser: true,
});

export function AttendanceGraph() {
  const [loading, setLoading] = React.useState(false);
  const [output, setOutput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAttendanceLoading, setIsAttendanceLoading] = React.useState(true);
  const [showAISummary, setShowAISummary] = React.useState(false);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (mounted) setIsAttendanceLoading(true);
        const res = await profileHandler("attendance", "GET");
        if (mounted && res && Array.isArray(res.subjects)) {
          const mapped: Subject[] = res.subjects.map((s: any) => ({
            name: s.name,
            attended: Number(s.attended) || 0,
            total: Number(s.total) || 0,
            attendance:
              Number(s.total) > 0
                ? Math.round(
                    ((Number(s.attended) || 0) / Number(s.total)) * 100
                  )
                : 0,
          }));
          setSubjects(mapped);
        } else if (mounted) {
          setSubjects([]);
        }
      } catch (e) {
        if (mounted) setSubjects([]);
        console.error("Failed to load attendance graph data", e);
      } finally {
        if (mounted) setIsAttendanceLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const subjectAttendance = React.useMemo(
    () =>
      subjects.map((subject) => ({
        subject: subject.name,
        attendance: subject.attendance,
        fill: colorFor(subject.name),
      })),
    [subjects]
  );

  const chartConfig = React.useMemo(() => {
    const cfg: Record<string, { label: string; color?: string }> = {
      attendance: { label: "Attendance" },
    };
    subjects.forEach((s) => {
      const key = s.name.toLowerCase().replace(/\s+/g, "_");
      cfg[key] = { label: s.name, color: colorFor(s.name) };
    });
    return cfg as ChartConfig;
  }, [subjects]);

  const totalAttendance = React.useMemo(() => {
    if (subjectAttendance.length === 0) return 0;
    return Math.round(
      subjectAttendance.reduce((acc, curr) => acc + curr.attendance, 0) /
        subjectAttendance.length
    );
  }, [subjectAttendance]);

  const getAttendanceColor = (attendance: number) => {
    if (attendance < 50) return "#FFF";
    if (attendance < 75) return "yellow";
    return "#22C55E";
  };

  const rateFromRisk = (pct: number) => {
    if (pct < 60) return 0.6;
    if (pct < 75) return 0.8;
    return 0.95;
  };

  const ceilNonNeg = (x: number) => Math.max(0, Math.ceil(x));

  const neededIfAttendAll = (a: number, t: number, p: number) => {
    if (t <= 0) return 0;
    const num = p * t - a;
    const den = 1 - p;
    if (den <= 0) return 0;
    return ceilNonNeg(num / den);
  };

  const neededAtRate = (a: number, t: number, p: number, r: number) => {
    if (t <= 0) return 0;
    if (r <= p) return undefined;
    const x = (p * t - a) / (r - p);
    return ceilNonNeg(x);
  };

  const calculateLectureRequirements = async () => {
    setLoading(true);
    setIsLoading(true);
    setOutput("");

    if (showAISummary) {
      setShowAISummary(false);
      setLoading(false);
      setIsLoading(false);
      return;
    }

    try {
      const thresholdPct = 75;
      const p = thresholdPct / 100;

      const plans: SubjectPlan[] = subjects.map((s) => {
        const t = s.total ?? 0;
        const a = s.attended ?? 0;

        const currentPct = t > 0 ? Math.round((a / t) * 100) : 0;
        const risk: SubjectPlan["risk"] =
          currentPct < 60
            ? "HIGH"
            : currentPct < thresholdPct
            ? "MEDIUM"
            : "LOW";
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
          feasibleAtRate: feasible,
        };
      });
      const overallAvg =
        plans.reduce((sum, p) => sum + p.currentAttendancePct, 0) /
        Math.max(1, plans.length);

      const compact = plans
        .map((p) => {
          const line =
            `${p.subject} | now=${p.currentAttendancePct}% | risk=${p.risk}` +
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
          {
            role: "system",
            content: "You are a crisp, pragmatic academic advisor.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      });

      const content =
        completion.choices?.[0]?.message?.content?.trim() ||
        "Unable to generate a plan.";

      setOutput(content);
      setShowAISummary(true);
    } catch (err) {
      console.error("AI planning error:", err);
      setOutput("AI planning error. Please try again.");
      setShowAISummary(true);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full">
      <Card className="flex h-full border border-none flex-col dark:bg-white/10 relative">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>
              {showAISummary ? "AI Attendance Analysis" : "Attendance Overview"}
            </CardTitle>
            <CardDescription>
              {showAISummary
                ? "Personalized attendance insights"
                : "Semester Performance"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {showAISummary && (
              <Button
                variant={"outline"}
                className="w-25 h-25 p-2"
                onClick={calculateLectureRequirements}
                disabled={loading}
              >
                <ArrowBigLeftIcon className="!size-10 text-[#B080FF] drop-shadow-[0_0_6px_rgba(186,104,255,0.7)]" />
              </Button>
            )}
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
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto">
          {showAISummary ? (
            <div className="h-full p-4 rounded-lg">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="h-8 w-8 animate-spin text-[#B080FF]" />
                </div>
              ) : output ? (
                <div className="prose dark:prose-invert max-w-none">
                  {output.split("\n").map((line, i) => (
                    <p key={i} className="font-figtree">
                      {line || <br />}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No AI analysis available. Click the bot icon to generate
                  insights.
                </div>
              )}
            </div>
          ) : (
            isAttendanceLoading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="border-[60px] border-accent bg-transparent h-72 w-72 rounded-full" />
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center h-full w-full p-4">
                <ChartContainer
                  config={chartConfig}
                  className="w-full [&_.recharts-pie-label-text]:fill-foreground h-full flex items-center justify-center"
                >
                  <PieChart width={400} height={400}>
                    <ChartTooltip
                      cursor={true}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      label
                      data={subjectAttendance}
                      dataKey="attendance"
                      nameKey="subject"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={1}
                      strokeWidth={1}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            const attendanceColor =
                              getAttendanceColor(totalAttendance);
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
                                  className="text-4xl font-bold"
                                  style={{ fill: attendanceColor }}
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
              </div>

            ))}
        
        </CardContent>

        {!showAISummary && (
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
              Graphs are cool, but gossip about your attendance is cooler, click
              the bot icon.
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
