"use client";
import type React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
export default function SignupFormDemo() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };
  return (
    <div className="w-full rounded-none md:rounded-2xl flex flex-col items-center md:p-8 shadow-input z-10 ">
      <h2 className="font-figtree z-10 text-lg md:text-3xl text-white text-center">
        Login to PDEA&apos;s Portal
      </h2>
      <p className="text-center text-white font-figtree text-md mt-1">
        Not Registered as a Student Yet?<Link className="text-blue-500" href="/student/register"> Register Here</Link>
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
        <div className="text-center text-lg text-blue-500 font-figtree">
          <Link href="/admin/login">Admin Login </Link>
          <Link href="/teacher/login">/Teacher Login!</Link>
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
