"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/legacy/image";
export default function ImageGallery() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )
  return (
<Carousel 
className="w-full"
plugins={[plugin.current]}
>
      <CarouselContent>
        {Array.from({ length: 3 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="rounded-3xl">
              <Image width={580} height={600} placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAAXNSR0IArs4c6QAAAPVJREFUKFNNkMtKA0EQRW9VTzuaMGaVhaDECAoiPvau/AE/3XUgzA/4wERjMpN0V0nVTMTe9uHcW5fieKocAogDiBj2VBWqGZIT6PDkSjkUcIgI1AMigmzA8OzGDczswN5ggIqAqvM7tc/gBoZ2BEQsIoNG0/veEIDe8AeYYXTxoMwBHBixiEgpecku4p/BIp6fHvEyqzGva8SDsutwbB36km7IGd+frygHFVSt5ORWiRls+X2HzdcHFAxJLWh4eu077E/ctRts10vX67axoS49IjVrhFiiWbyBisKXlWYFiuOJn55WCxSDCrvlO7g8grQ/gCh+AepXgAoPacioAAAAAElFTkSuQmCC" className="object-cover" src={`/pic${index + 1}.jpg`} alt={`college Pictures ${index + 1}`} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious /> */}
      {/* <CarouselNext /> */}
    </Carousel>
  );
}


