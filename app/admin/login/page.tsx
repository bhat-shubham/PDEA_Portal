"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Aurora from "@/components/ui/aurorabg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { adminLogin } from "@/app/lib/adminlogin";
import { Button } from "@/components/ui/button";
import { PiChalkboardTeacher } from "react-icons/pi";
import { PiStudent } from "react-icons/pi";
import ImageGallery from "@/components/ui/image-gallery";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type FormData = {
  email: string;
  password: string;
};
export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  // const onSubmit = (data: unknown) => console.log(data);
  const router = useRouter();
  const onSubmit = async (data: FormData) => {
    console.log("Form submitted with data:", data);
    const res = await adminLogin(data.email, data.password);
    console.log("Login response data:", res);

    if (res.message === "Admin logged in successfully") {
      localStorage.setItem("token", res.token);
      toast.success("Logged In Successfully!", {
        description: "Redirecting to Dashboard...",
      });
      router.push("/admin/dashboard");
    }
  };
  console.log(errors);
  return (
    <div className="w-screen relative h-screen flex justify-center items-center align-middle">
      <Aurora
        colorStops={["#76ff67", "#B19EEF", "#5227FF"]}
        blend={1}
        amplitude={1.5}
        speed={0.5}
      />
      <div className="font-figtree absolute md:w-3/4 w-5/6 z-20 backdrop-blur-md flex md:p-5 md:h-4/5 md:py-0 py-16 align-middle items-center rounded-3xl bg-[#6a69691e] overflow-hidden">
        <div className="w-1/2 hidden md:flex overflow-hidden rounded-3xl items-center justify-center h-full">
          <ImageGallery />
        </div>
        <div className="w-full md:w-1/2">
          <div className="flex items-center align-middle justify-center overflow-hidden z-10">
            <form
              className="flex w-full p-7 items-center flex-col gap-3 py-5 rounded-2xl "
              onSubmit={handleSubmit(onSubmit)}
            >
              <p className="text-white text-center text-2xl">
                Login as a Admin at PDEA&apos;s Portal
              </p>
              <p>
                Don&apos;t have an account as a Admin?{" "}
                <Link className="text-blue-500" href="/admin/register">
                  Register here.
                </Link>
              </p>
              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-2 h-[1px] w-full" />

              <LabelInputContainer>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="projectmayhem@fc.com"
                  type="email"
                  {...register("email", { required: true })}
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  {...register("password", { required: true })}
                />
              </LabelInputContainer>

              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-1 h-[1px] w-full" />

              <input
                className="bg-[#443379] text-lg text-white rounded-lg cursor-pointer hover:bg-black transition w-full h-10"
                type="submit"
                value="Login"
              />
            </form>
          </div>
          <div className="text-center flex w-full justify-center mt-5 md:gap-20 gap-2 text-lg text-blue-500 font-figtree">
            <Link href="/teacher/register">
              <Button
                variant="outline"
                className="w-full justify-center bg-[#443379] text-white"
              >
                <PiChalkboardTeacher className="mr-1 h-4 w-4" />
                Teacher Login
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="w-full justify-center bg-[#443379] text-white"
              >
                <PiStudent className="mr-1 h-4 w-4" />
                Student Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
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
