"use client";
import {cn} from "@/lib/utils";
import Link from "next/link";
import Aurora from  "@/components/ui/aurorabg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Redirect } from "@/components/ui/Redirect";
import ImageGallery from "@/components/ui/image-gallery";
import { useForm } from "react-hook-form";
export default function Home() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data: any) => console.log(data);
  console.log(errors);
  return (
    <div className="w-screen relative h-screen flex justify-center items-center align-middle">
      <Aurora
  colorStops={["#76ff67", "#B19EEF", "#5227FF"]}
  blend={1}
  amplitude={1.5}
  speed={0.5}
/>
    <div className="font-figtree absolute w-3/4 z-20 backdrop-blur-md flex p-5 h-4/5 align-middle items-center rounded-3xl bg-[#6a69691e] overflow-hidden">
        <div className="w-1/2 hidden md:flex overflow-hidden rounded-3xl items-center justify-center h-full">
          <ImageGallery/>
        </div>
        <div className="w-full md:w-1/2">
          <Redirect/>
          <div className="flex items-center align-middle justify-center overflow-hidden z-10">
            <form 
              className="flex flex-col gap-3 py-5 rounded-2xl "
              onSubmit={handleSubmit(onSubmit)}
            >
              <p className="text-white text-center text-2xl">
                Login/Register For Teacher and Admin
              </p>
              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-2 h-[1px] w-full" />

              <LabelInputContainer>
                <Label htmlFor="firstname">First name</Label>
                <Input id="firstname" placeholder="Tyler" type="text" {...register("firstname", { required: true })} />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="lastname">Last name</Label>
                <Input id="lastname" placeholder="Durden" type="text" {...register("lastname", { required: true })} />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" placeholder="projectmayhem@fc.com" type="email" {...register("email", { required: true })} />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="••••••••" type="password" {...register("password", { required: true })} />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="branch">Branch</Label>
                <select
                  id="branch"
                  className="rounded-md bg-[#3C364A] p-2 w-full"
                  {...register("Branch", { required: true })}
                >
                  <option value="Information Technology">Information Technology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="AI/DS">AI/DS</option>
                  <option value="MCA">MCA</option>
                </select>
              </LabelInputContainer>

              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-1 h-[1px] w-full" />

              <input
                className="bg-[#2e2d31] text-lg text-white h-10 rounded-lg cursor-pointer hover:bg-black transition"
                type="submit"
              />
        <div className="text-center text-lg text-blue-500 font-figtree"><Link href="/" >Click Here For Student Login!</Link></div>
            </form>
          </div>
        </div>
      </div>
    </div>

    // </BackgroundBeamsWithCollision>
  );
}
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>
}

