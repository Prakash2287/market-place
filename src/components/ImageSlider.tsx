"use client"
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
// These two are imported to provide the swipper the css it needs to take
import SwiperType from "swiper";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";


interface ImageSliderProps {
  urls: string[];
}
const ImageSlider = ({ urls }: ImageSliderProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [swiper, setSwipper] = useState<null | SwiperType>(null);
  const activeStyles =
    "active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300";
  const inactiveStyles = "hidden text-gray-400";
  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: activeIndex === urls.length ?? 0 - 1,
  });

  useEffect(() => {
    swiper?.on("slideChange", ({ activeIndex }) => {
      setActiveIndex(activeIndex);
      setSlideConfig({
        isBeginning: activeIndex === 0,
        isEnd: activeIndex === (urls.length ?? 0) - 1,
      });
    });
  }, [swiper, urls]);
  return (
    <div className="group relative bg-zinc-100 aspect-square overflow-hidden rounded-xl">
      <div className="absolute z-10 inset-0 opacity-0 group-hover:opacity-100 transition">
        <button
        onClick={(e)=>{
          e.preventDefault();
          swiper?.slideNext()
        }}
        className={cn(
          activeStyles,"right-3 transition",{
            [inactiveStyles]:slideConfig.isEnd,
            'hover:bg-primary-300 text-primary-800 opacity-100':!slideConfig.isEnd
          },
        )}
        >
          <ChevronRight className="h-4 w-4 text-zinc-700"></ChevronRight>
        </button>
        <button
        onClick={(e)=>{
          e.preventDefault();
          swiper?.slidePrev()
        }}
        className={cn(
          activeStyles,"transition",{
            [inactiveStyles]:slideConfig.isBeginning,
            'hover:bg-primary-300 text-primary-800 opacity-100':!slideConfig.isBeginning
          },
        )}
        >
          <ChevronLeft className="h-4 w-4 text-zinc-700"></ChevronLeft>
        </button>
      </div>
      <Swiper

        className="h-full w-full"
        onSwiper={(swiper) => setSwipper(swiper)}
        spaceBetween={50}
        slidesPerView={1}
        modules={[Pagination]}
        
      >
        {urls?.map((url, i) => {
          return (
            <SwiperSlide key={i} className="h-full w-full">
              <Image
                loading="eager"
                src={url}
                alt="Product Image"
                className="-z-10 h-full w-full object-cover object-center"
                width={100}
                height={100}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
export default ImageSlider;
