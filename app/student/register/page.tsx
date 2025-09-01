"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Aurora from "@/components/ui/aurorabg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { studentHandler } from "@/app/lib/studentHandler";
import ImageGallery from "@/components/ui/image-gallery";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type FormData = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmpassword: string;
  mobile: string;
  parentPhone: string;
};

export default function Home() {
  const [Branch, setBranch] = React.useState("Branch");
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    trigger,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: "",
      mobile: "",
      parentPhone: "",
    },
  });

  const password = watch("password", "");
  const watchedValues = watch();

  const isFormValid = React.useMemo(() => {
    const hasAllFields = Object.values(watchedValues).every(value => value && value.trim() !== "");
    const isBranchSelected = Branch !== "Branch";
    return isValid && hasAllFields && isBranchSelected;
  }, [watchedValues, isValid, Branch]);

  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) || "Please enter a valid email address";
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return "Password must be 8 characters long";
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
    return true;
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone) || "Please enter a valid 10-digit phone number";
  };

  const onSubmit = async (data: FormData) => {
    if (!isFormValid) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    const fullData = { ...data, branch: Branch };
    
    console.log("Form submitted with data:", fullData);
    
    try {
      const res = await studentHandler("register", "POST", fullData);
      
      if (res.message === "Student registered successfully") {
        toast.success("Registration successful!");
        router.push("/");
      } else {
        toast.error(res.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration. Please try again.");
    }
  };

  const handleBranchChange = (value: string) => {
    setBranch(value);
  };

  return (
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
              className="flex w-full p-7 items-center flex-col gap-3 py-5 rounded-2xl"
              onSubmit={handleSubmit(onSubmit)}
            >
              <p className="text-white text-center text-2xl">
                Register as a Student at PDEA&apos;s Portal
              </p>
              <p>
                Already Registered as a Student?
                <Link className="text-blue-500" href="/">
                  Login.
                </Link>
              </p>
              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-2 h-[1px] w-full" />
              <div className="w-full flex gap-2">
                <LabelInputContainer>
                  <Label htmlFor="firstname">First name *</Label>
                  <Input
                    id="firstname"
                    placeholder="Tyler"
                    type="text"
                    className={cn(errors.firstname && "border-red-500 focus:border-red-500")}
                    {...register("firstname", { 
                      required: "First name is required",
                      minLength: { value: 2, message: "First name must be at least 2 characters" }
                    })}
                  />
                  {errors.firstname && (
                    <span className="text-red-500 text-sm">{errors.firstname.message}</span>
                  )}
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="lastname">Last name *</Label>
                  <Input
                    id="lastname"
                    placeholder="Durden"
                    type="text"
                    className={cn(errors.lastname && "border-red-500 focus:border-red-500")}
                    {...register("lastname", { 
                      required: "Last name is required",
                      minLength: { value: 2, message: "Last name must be at least 2 characters" }
                    })}
                  />
                  {errors.lastname && (
                    <span className="text-red-500 text-sm">{errors.lastname.message}</span>
                  )}
                </LabelInputContainer>
              </div>

              <LabelInputContainer>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  placeholder="projectmayhem@fc.com"
                  type="email"
                  className={cn(errors.email && "border-red-500 focus:border-red-500")}
                  {...register("email", { 
                    required: "Email is required",
                    validate: validateEmail
                  })}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email.message}</span>
                )}
              </LabelInputContainer>

              <div className="w-full flex gap-2">
                <LabelInputContainer>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    className={cn(errors.password && "border-red-500 focus:border-red-500")}
                    {...register("password", { 
                      required: "Password is required",
                      validate: validatePassword
                    })}
                  />
                  {errors.password && (
                    <span className="text-red-500 text-sm">{errors.password.message}</span>
                  )}
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="confirmpassword">Confirm Password *</Label>
                  <Input
                    id="confirmpassword"
                    placeholder="••••••••"
                    type="password"
                    className={cn(errors.confirmpassword && "border-red-500 focus:border-red-500")}
                    {...register("confirmpassword", {
                      required: "Confirm password is required",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />
                  {errors.confirmpassword && (
                    <span className="text-red-500 text-sm">{errors.confirmpassword.message}</span>
                  )}
                </LabelInputContainer>
              </div>

              <div className="w-full flex gap-2">
                <LabelInputContainer>
                  <Label htmlFor="mobile">Phone Number *</Label>
                  <Input
                    id="mobile"
                    placeholder="1234567890"
                    type="tel"
                    className={cn(errors.mobile && "border-red-500 focus:border-red-500")}
                    {...register("mobile", { 
                      required: "Phone number is required",
                      validate: validatePhone
                    })}
                  />
                  {errors.mobile && (
                    <span className="text-red-500 text-sm">{errors.mobile.message}</span>
                  )}
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="parentPhone">Parent&apos;s Phone Number *</Label>
                  <Input
                    id="parentPhone"
                    placeholder="1234567890"
                    type="tel"
                    className={cn(errors.parentPhone && "border-red-500 focus:border-red-500")}
                    {...register("parentPhone", { 
                      required: "Parent's phone number is required",
                      validate: validatePhone
                    })}
                  />
                  {errors.parentPhone && (
                    <span className="text-red-500 text-sm">{errors.parentPhone.message}</span>
                  )}
                </LabelInputContainer>
              </div>

              <div className="w-full">
                <Label htmlFor="branch">Branch *</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      id="branch"
                      className={cn(
                        "bg-gray-800 w-full mt-2 text-md",
                        Branch === "Branch" && "text-gray-400"
                      )}
                      variant="secondary"
                      type="button"
                    >
                      {Branch === "Branch" ? "Select Branch" : Branch}
                      <ChevronDown className="ml-2 h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuRadioGroup
                      className="w-[480px]"
                      value={Branch}
                      onValueChange={handleBranchChange}
                    >
                      <DropdownMenuRadioItem value="Information Technology">
                        Information Technology
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Computer Science">
                        Computer Science
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Mechanical">
                        Mechanical
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="AI/DS">
                        AI/DS
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="MCA">
                        MCA
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-1 h-[1px] w-full" />

              <Button
                className="bg-[#443379] text-lg text-white rounded-lg cursor-pointer hover:bg-black transition w-full h-10 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={!isFormValid}
              >
                Submit
              </Button>
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
