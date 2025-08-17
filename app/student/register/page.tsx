"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Aurora from "@/components/ui/aurorabg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { adminRegister } from "@/app/lib/adminRegister";
import ImageGallery from "@/components/ui/image-gallery";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type FormData = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
};

export default function Home() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted with data:", data);
    try {
      const res = await adminRegister(
        data.firstname,
        data.lastname,
        data.email,
        data.password,
        data.phone,
      );
      console.log(res);
      if (res.message === "Student registered successfully") {
        router.push("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration. Please try again.");
    }
  };
  console.log(errors);
  return (
    //  </BackgroundBeamsWithCollision>
    <div className="w-screen relative h-screen flex justify-center items-center align-middle">
      <Aurora
        colorStops={["#c94b4b", "#302b63", "#4b134f"]}
        blend={1}
        amplitude={1.5}
        speed={0.5}
      />
      <div className="font-figtree absolute md:w-3/4 w-5/6 z-20 backdrop-blur-md flex md:p-5 md:h-4/5 align-middle items-center rounded-3xl bg-[#6a69691e] overflow-hidden">
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
                Register as a Student at PDEA&apos;s Portal
              </p>
              <p>
                Already Registered as a Student?
                <Link className="text-blue-500" href="/">
                  {" "}
                  Login.
                </Link>
              </p>
              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-2 h-[1px] w-full" />

              <LabelInputContainer>
                <Label htmlFor="firstname">First name</Label>
                <Input
                  id="firstname"
                  placeholder="Tyler"
                  type="text"
                  {...register("firstname", { required: true })}
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="lastname">Last name</Label>
                <Input
                  id="lastname"
                  placeholder="Durden"
                  type="text"
                  {...register("lastname", { required: true })}
                />
              </LabelInputContainer>

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

              <LabelInputContainer>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="1234567890"
                  type="tel"
                  {...register("phone", { required: true })}
                />
              </LabelInputContainer>

              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-1 h-[1px] w-full" />

              <input
                className="bg-[#443379] text-lg text-white rounded-lg cursor-pointer hover:bg-black transition w-full h-10"
                type="submit"
                value="Register"
              />
            </form>
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
