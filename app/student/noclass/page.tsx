import { Button } from "@/components/ui/button"
import Galaxy from "@/components/ui/galaxybg"
import { IoIosLogIn } from "react-icons/io";
export default function NoClass() {
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
      <div className="mt-5 border rounded-2xl max-w-fit p-4 flex gap-3 justify-center align-middle items-center">
      <p className="text-2xl font-semibold">Have a class code?</p>
      <Button 
      variant={"outline"}
      size={"lg"}
      className="rounded-xl text-lg">
      <span className="text-purple-500">Join Class      </span>
      <IoIosLogIn className="text-purple-500"/>

      </Button> 
      </div>
      <p className="text-muted-foreground mt-5">Do  not have a code yet? Ask your teacher to give you one</p>
    </div>
    </div>
    </main>
  )
}
