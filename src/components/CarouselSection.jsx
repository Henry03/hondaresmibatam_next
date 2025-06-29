'use client';

import { useKeenSlider } from "keen-slider/react";
import { useState } from "react";

export default function CarouselSection ({data}) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const [carouselSliderRef, carouselInstanceRef] = useKeenSlider({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    spacing:16,
    slides: {
      perView: 1
    },
  });

  return (
    <div className='relative w-full'>
      <div ref={carouselSliderRef} className="keen-slider aspect-[16/9] rounded-none md:rounded-xl overflow-hidden">
        {data.map((item, index) => (
          <a key={"carousel_" + item.id} href={item.link} 
            target={item.link !== '#' ? '_blank' : undefined}
            rel={item.link !== '#' ? 'noopener noreferrer' : undefined}
            onClick={(e) => {
              if (item.link === '#') {
                e.preventDefault();
              }
            }}
            className="keen-slider__slide flex justify-center items-center bg-gray-200">
            {
              item.mediaType == 'VIDEO' ? 
              <video
                className="h-full w-full object-cover"
                controls
                src={item.mediaUrl}
              /> :
              <img src={item.mediaUrl} loading='lazy' alt={ `Slide ${index + 1}`} className="object-cover h-full w-full" />
            }
          </a>
        ))}
      </div>
      <button
        onClick={() => carouselInstanceRef.current?.prev()}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 size-9.5 bg-base-100 flex items-center justify-center rounded-full shadow-base-300/20 shadow-sm"
      >
        <span className="icon-[tabler--chevron-left] size-5"></span>
        <span className="sr-only">Previous</span>
      </button>
      <button
        onClick={() => carouselInstanceRef.current?.next()}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 size-9.5 bg-base-100 flex items-center justify-center rounded-full shadow-base-300/20 shadow-sm"
      >
        <span className="icon-[tabler--chevron-right] size-5"></span>
        <span className="sr-only">Previous</span>
      </button>
      <div className="flex justify-center mt-4 gap-2">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => carouselInstanceRef.current?.moveToIdx(index)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? 'bg-primary' : 'bg-base-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}