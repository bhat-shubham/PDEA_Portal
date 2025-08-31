"use client"
import { Button } from "@/components/ui/button"
import Galaxy from "@/components/ui/galaxybg"
import { IoIosLogIn } from "react-icons/io";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Check, Loader2 } from "lucide-react"
import { useState } from "react";
import {motion} from "framer-motion"
import { toast } from "sonner";
import { studentHandler } from "@/app/lib/studentHandler";
export default function NoClass() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [open, setOpen] = useState(false);
  const [isValidCode, setIsValidCode] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await studentHandler("class", "POST", { classCode });
      const data = response;    
      console.log(response);
      if (response.message=="Join request sent successfully") {
        toast.success("Class join request sent successfully!",{
          description:"Kindly wait while teacher admits you to the class",
          richColors:true
        }
        );
        setIsSuccess(true);
      } 
      else {
        toast.error("Couldn't join class", {
          description: data.message || "Please check the class code",
          richColors: true
        });
      }
    } catch (error) {
      toast.error("Failed to send request", {
        description: "Please try again later",
        richColors: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden">
    <div className="absolute inset-0 z-0">
      <Galaxy
       particleColors={['#A855F7', '#A855F7']}
        // color="#ff6baa"
    // speed={0.6}
    // direction="forward"
    // scale={1.1}
    // opacity={0.8}
    // mouseInteractive={false}
      />
    </div>
    <div className="absolute inset-0 z-10 flex md:p-0 p-5 items-center justify-center">
    <div className="flex flex-col w-3/4 items-center justify-center align-middle text-center">
      <p className=" text-5xl font-figtree font-bold">You can&apos;t skip what you haven&apos;t joined.<br /><span className="text-purple-500">Join a class</span> to kick things off.</p>
      <div className="mt-5 border bg-gray-500/10 backdrop-blur-sm bg-opacity-10 border-purple-400 rounded-2xl max-w-fit p-4 flex gap-3 justify-center align-middle items-center">
      <p className="text-2xl font-semibold">Have a class code?</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant={"outline"}
            size={"lg"}
            className="rounded-xl text-lg">
            <span className="text-purple-500">Join Class</span>
            <IoIosLogIn className="text-purple-500 ml-2"/>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-96 
          border border-purple-500/20 bg-black/90 backdrop-blur-xl shadow-[0_0_25px_rgba(168,85,247,0.2)]"
          >
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-2 text-center">
              <h4 className="font-medium text-xl text-purple-500">Enter Class Code</h4>
              <p className="text-sm text-muted-foreground">
                Enter the code provided by your teacher
              </p>
            </motion.div>
            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                <Input
                  id="code"
                  value={classCode}
                  onChange={(e) => {
                    const value = e.target.value;
                    setClassCode(value);
                    setIsValidCode(!value || /^\d{6}$/.test(value));
                  }}
                  placeholder="Enter 6-digit class code"
                  className={`h-10 bg-black/100 ${!isValidCode ? 'border-red-500' : 'border-purple-500/30'} focus:border-purple-500/50 
                  focus:ring-purple-500/20 placeholder:text-gray-500`}
                  disabled={isSubmitting || isSuccess}
                />
                {!isValidCode && (
                  <p className="text-xs text-red-500">Class code must be exactly 6 digits</p>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={!classCode || isSubmitting || isSuccess || !isValidCode || classCode.length !== 6}
                  className="w-full h-10 bg-purple-500/60 hover:bg-purple-500/30 
                  text-white hover:text-purple-200 border border-purple-500/30
                  disabled:opacity-50 transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : isSuccess ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Request sent
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    setIsSuccess(false);
                    setClassCode("");
                    setIsValidCode(true);
                  }}
                  className="w-full h-10 border-purple-500/30 hover:bg-purple-500/10
                  text-purple-300 hover:text-purple-200"
                >
                  Cancel
                </Button>
              </div>
            </div>
            {isSuccess && (
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 mx-auto flex items-center justify-center">
                  <Check className="h-6 w-6 text-purple-500" />
                </div>
                <p className="text-sm text-purple-300">
                  Kindly wait while teacher admits you to the class
                </p>
              </div>
            )}
          </form>
        </PopoverContent>
      </Popover>
      </div>
      <p className="text-muted-foreground mt-5">Do  not have a code yet? Please Contact your teacher</p>
    </div>
    </div>
    </main>
  )
}
