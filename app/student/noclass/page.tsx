"use client"
import { Button } from "@/components/ui/button"
import Galaxy from "@/components/ui/galaxybg"
import { IoIosLogIn } from "react-icons/io";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Check, Loader2 } from "lucide-react"
import { useState } from "react";
import {motion} from "framer-motion"
export default function NoClass() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSuccess(true);
    setIsSubmitting(false);
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
      <p className="font-bold text-5xl">You can&apos;t skip what you haven&apos;t joined.<br /><span className="text-purple-500">Join a class</span> to kick things off.</p>
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
              <Input
                id="code"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                placeholder="Enter class code..."
                className="h-10 bg-black/100 border-purple-500/30 focus:border-purple-500/50 
                focus:ring-purple-500/20 placeholder:text-gray-500"
                disabled={isSubmitting || isSuccess}
              />
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={!classCode || isSubmitting || isSuccess}
                  className="w-full h-10 bg-purple-500/20 hover:bg-purple-500/30 
                  text-purple-300 hover:text-purple-200 border border-purple-500/30
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
      <p className="text-muted-foreground mt-5">Do  not have a code yet? Ask your teacher to give you one</p>
    </div>
    </div>
    </main>
  )
}
