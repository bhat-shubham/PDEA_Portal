import LoginForm from "@/components/ui/LoginForm";
import ImageGallery from "@/components/ui/image-gallery";
import LightRays from "@/components/ui/lightraysbg";
export default function Home() {
  return (
    <main className="relative  w-full h-screen overflow-hidden">
      <div className="hidden md:block absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={3}
          rayLength={3.5}
          followMouse={true}
          mouseInfluence={0.2}
          noiseAmount={0.1}
          distortion={0.09}
        />
      </div>

      <div className="bg-[#2C2C54] md:bg-transparent absolute inset-0 z-10 flex md:p-0 p-5 items-center justify-center">
        <div className="md:w-3/4 md:p-5 w-full md:h-4/5 h-3/5 flex rounded-3xl bg-[#699fa20d] backdrop-blur-md overflow-hidden">
          <div className="w-1/2 hidden md:flex overflow-hidden rounded-3xl items-center justify-center h-full">
            <ImageGallery/>
          </div>
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <LoginForm/>
            </div>
            </div>
          </div>
        </div>
    </main>
  );
}


