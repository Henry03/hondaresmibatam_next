'use client';

import { useKeenSlider } from "keen-slider/react";
import { toRupiah } from "./Utils";
import { useState } from "react";

export default function CommentSection ({data}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    spacing:16,
    slides: {
      perView: 1
    },
    breakpoints: {
      "(min-width: 1024px)": {
        slides: {
          perView: 2,
          spacing: 16,
        },
      },
    },
  });

  return (
    <>
      {
        data.length > 0 && (
          <>
            <div ref={sliderRef} className="keen-slider">
              {data.map((item, index) => (
                <div key={"comment_" + item.id} className="keen-slider__slide px-2">
                  <div className="rounded-xl w-full h-full">
                    <figure className='rounded-xl w-full'>
                      <img loading='lazy' className='w-full h-60 md:h-96 rounded-xl object-cover' src={item.imageUrl} alt="Testimoni" />
                    </figure>
                    <div className="card-body">
                      <blockquote className="relative p-4">
                        <span className="icon-[tabler--quote] text-base-300/20 absolute -start-3 -top-3 size-16 rotate-180 rtl:rotate-0"></span>
                        <div className="relative z-1">
                          <p className="text-base-content text-sm md:text-lg">
                            <em>
                              {item.message}
                            </em>
                          </p>
                        </div>
                        <footer className="mt-4">
                          <div className="text-base-content/50 text-base font-semibold">~ {item.name}</div>
                        </footer>
                      </blockquote>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-4 gap-2">
              {data.map((item, idx) => (
                <button
                  key={"comment_nav_" + item.id}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  className={`w-3 h-3 rounded-full ${
                    currentSlide === idx ? "bg-primary" : "bg-base-300"
                  }`}
                />
              ))}
            </div>
          </>
        )
      }
    </>
  )
}