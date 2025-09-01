/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import type React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import { Button } from "./button";
import { PiChalkboardTeacher } from "react-icons/pi";
import { GrUserAdmin } from "react-icons/gr";
import { studentHandler } from "@/app/lib/studentHandler";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function StudentLoginForm() {
  const Router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await studentHandler("login", "POST", formData);
    if (res.message === "Login successful") {
      console.log(res)
      localStorage.setItem("token", res.token);
      toast.success("Logged In Successfully!", {
        description: "Checking Information...",
        richColors:true
      });
      if(res.student.classes.length===0){
        Router.push("/student/noclass")
        return;
      }
      Router.push("/student/dashboard");
    }
    else {
      toast.error("Login Failed", {
        description: res.message || "Please try again later.",
        richColors: true
      });
    }
  };
  return (
    <div className="w-full rounded-none md:rounded-2xl flex flex-col items-center md:p-8 shadow-input z-10 ">
      <h2 className="font-figtree z-10 text-lg md:text-3xl text-white text-center">
        Login to PDEA&apos;s Portal
      </h2>
      <p className="text-center text-white font-figtree text-md mt-1">
        Not Registered as a Student Yet?
        <Link className="text-blue-500" href="/student/register">
          {" "}
          Register Here
        </Link>
      </p>
      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-5 h-[1px] w-full" />
      <p className="text-center md:mb-5 text-white font-figtree text-md mt-1">
        Enter Your Credentials to View Attendance and Notifications
      </p>
      <form className="w-full md:p-0 p-5" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            value={formData.email}
            onChange={handlechange}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={formData.password}
            onChange={handlechange}
          />
        </LabelInputContainer>
        <input
          className="bg-[#443379] text-lg text-white rounded-lg cursor-pointer hover:bg-black transition w-full h-10"
          type="submit"
          value="Login"
        />
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-5 h-[1px] w-full" />
        <div className="text-center text-lg flex justify-center align-middle items-center text-blue-500 font-figtree">
          <div className="text-center flex mt-3 md:gap-20 gap-2 text-lg text-blue-500 font-figtree">
            <Link href="/teacher/login">
              <Button
                variant="outline"
                className="w-full justify-center bg-[#443379] text-white"
              >
                <PiChalkboardTeacher className="mr-1 h-5 w-5" />
                Teacher Login
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button
                variant="outline"
                className="w-full justify-center bg-[#443379] text-white"
              >
                <GrUserAdmin className="mr-1 h-4 w-4" />
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
