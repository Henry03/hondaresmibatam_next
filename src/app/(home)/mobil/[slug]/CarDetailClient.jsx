'use client'

import Carousel from "@/components/Carousel";
import { formatDate } from "@/lib/ServerUtils";
import { useKeenSlider } from "keen-slider/react";
import { useEffect, useState } from "react";
import "keen-slider/keen-slider.min.css"

export default function CarDetailClient ({carData, lowestPrice}) {
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [headings, setHeadings] = useState([])
    const [currentSlide, setCurrentSlide] = useState(0);

    const [sliderRef, instanceRef] = useKeenSlider({
        loop: false,
        slides: {
        perView: 1,
        spacing: 16
        },
        renderMode: "performance"
    })

    const [commentSliderRef, commentInstanceRef] = useKeenSlider({
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

    useEffect(() => {
        if(carData.page){
        const parser = new DOMParser();
        const doc = parser.parseFromString(carData.page, 'text/html');
        const elements = Array.from(doc.body.querySelectorAll('h2, h3'));
    
        const structuredHeadings = [];
        let currentH2 = null;
    
        elements.forEach(el => {
            if (el.tagName === 'H2') {
            currentH2 = {
                title: el.textContent.trim(),
                children: []
            };
            structuredHeadings.push(currentH2);
            } else if (el.tagName === 'H3' && currentH2) {
            currentH2.children.push(el.textContent.trim());
            }
        });
    
        setHeadings(structuredHeadings);
        }
    }, [carData]);

    useEffect(() => {
        import('flyonui/dist/index.js').then(() => {
            if (window.HSStaticMethods?.autoInit) {
                window.HSStaticMethods.autoInit();
            }
        });
    }, []);

    return (
        <div className='mt-2 mb-5 my-10 mx-5 lg:mx-10'>
            <div className="grid md:grid-cols-2 gap-6">
            <div className="md:sticky md:top-20 md:self-start w-full overflow-hidden">
                <div ref={sliderRef} className="keen-slider w-full overflow-hidden rounded-xl ">
                {
                    carData.mediaFiles?.map(item => (
                    <div key={"carousel_" + item.id} className="keen-slider__slide rounded-xl ">
                        {
                        item.type == 'IMAGE' ?
                        <img
                            loading='lazy'
                            src={item.url}
                            alt="Slide 3"
                            className="w-full h-96 object-cover"
                        />
                        :
                        <video
                            className="w-full h-full object-cover"
                            controls
                            src={item.url}
                        />
                        }
                    </div>
                    ))
                }
                </div>

                <div className="flex gap-3 mt-3 overflow-x-auto">
                {
                    carData.mediaFiles?.map((item, index) => (
                    <button
                        key={"carouselNav_" + item.id}
                        className="w-20 h-14 border rounded hover:border-primary"
                        onClick={() => instanceRef.current?.moveToIdx(index)}
                    >
                        {
                        item.type == 'IMAGE' ? 
                        <img
                            src={item.url}
                            loading='lazy'
                            className="w-full h-full object-cover"
                            alt='Car Image'
                        />:
                        <video className="w-full h-full object-cover" muted>
                            <source src={item.url} />
                        </video>
                        }
                    </button>
                    ))
                }
                </div>
            </div>

            <div className="flex flex-col justify-between">
                <div className='flex flex-col gap-2'>
                <h1 className="text-xl md:text-2xl font-semibold">{carData.name}</h1>
                <div className='flex flex-wrap gap-2'>
                    {
                    carData.tags?.map((tag, index)=> (
                        <span key={tag.id} className="badge badge-sm badge-outline badge-primary">{tag.name}</span>
                    ))
                    }
                </div>
                <h3><span>Mulai dari </span><br/><span className='text-primary font-bold text-lg md:text-xl'>Rp {lowestPrice.toLocaleString("id-ID")}</span></h3>
                <p className="mt-1 text-sm text-base-content/70">
                    {carData.description ?? "Deskripsi singkat mobil..."}
                </p>
                </div>

                {carData.variants?.length > 0 && (
                <div className="mt-5">
                    <h2 className="text-lg font-semibold mb-2">Pilih Varian</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                    {carData.variants.map((variant) => (
                        <label
                        key={variant.id}
                        className={`cursor-pointer border rounded-xl p-4 transition-all ${
                            selectedVariant?.id === variant.id
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-base-300 hover:border-primary"
                        }`}
                        >
                        <input
                            type="radio"
                            name="car-variant"
                            className="hidden"
                            value={variant.id}
                            checked={selectedVariant?.id === variant.id}
                            onChange={() => setSelectedVariant(variant)}
                        />
                        <div className="font-semibold text-base">{variant.name}</div>
                        <div className="text-sm text-base-content/70 mt-1">
                            Rp {variant.price.toLocaleString("id-ID")}
                        </div>
                        </label>
                    ))}
                    </div>
                </div>
                )}
                <a 
                target="_blank"
                rel="noopener noreferrer"
                href={`http://wa.me/6285211451178?text=Halo kak, saya mau bertanya terkait mobil ${selectedVariant?.name}`} 
                className="w-full">
                <button className={`btn btn-primary w-full mt-3 ${selectedVariant ?? 'btn-disabled'}`}>Hubungi Sales</button>
                </a>
            </div>
            </div>
            <div className="divider divider-neutral my-3"></div>
            <div>
            <div className='flex justify-between items-center mb-5'>
                <h3 className='text-2xl font-medium'>Promo</h3>
            </div>
            <Carousel>
                {
                carData.carPromos?.map((item, index) =>(
                    <div
                        className="snap-center shrink-0 w-80 sm:w-96 flex flex-col items-center"
                        key={item.id}
                    >
                    <span className="self-center text-lg w-full select-none">
                        <figure>
                        <img
                            className="rounded-2xl max-h-96 w-full object-cover pointer-events-none"
                            src={item.mediaUrl}
                            loading='lazy'
                            alt="Promo"
                        />
                        </figure>
                        <div className="card-body p-4">
                        <h5 className="card-title text-lg md:text-xl">{item.name}</h5>
                        <div className="mb-2 flex items-center text-md gap-2">
                            <span className="icon-[tabler--calendar-event] size-5 md:size-7"></span>
                            <p className='text-base md:text-lg'>{formatDate(item.startDate)} - {formatDate(item.endDate)}</p>
                        </div>
                        <div className="card-actions">
                            <a href={`/promo/` + item.slug} className="btn btn-sm md:btn-md btn-primary">Detail</a>
                        </div>
                        </div>
                    </span>
                    </div>
                ))
                }
            </Carousel>
            </div>
            <div className="divider divider-neutral my-3"></div>
            <div className='flex flex-col md:flex-row'>
            <div className="px-2 pt-4 w-md hidden md:block md:sticky top-16 self-start">
                <div className='mb-2'>Navigation</div>
                <div className="divider"></div>
                <ul className="menu space-y-0.5 p-0">
                {
                    headings.map((heading, index) =>
                    (
                        <li className="space-y-0.5" key={"heading_" + index}>
                        <div className="collapse-toggle collapse-open:bg-base-content/10" id={`menu-app-toggle-${index}`} data-collapse={`#menu-app-collapse-${index}`}>
                            <span></span>
                            <span>{heading.title}</span>
                            {
                            heading.children?.length > 0 && (
                                <span className="icon-[tabler--chevron-down] collapse-open:rotate-180 size-4 transition-all duration-300"></span>
                            )
                            }
                        </div>
                        {
                            heading.children?.length > 0 && (
                                <ul id={`menu-app-collapse-${index}`} className="collapse hidden w-auto space-y-0.5 overflow-hidden transition-[height] duration-300" aria-labelledby={`menu-app-toggle-${index}`}>
                                    {
                                    heading.children.map((child, childIdx) =>
                                        (
                                        <li key={"child_" + childIdx}>
                                            <a href={`#${index+1}-${childIdx+1}`}>
                                            {child}
                                            </a>
                                        </li>
                                        ))
                                    }
                                </ul>
                            )
                        }
                        </li>
                    )
                    )
                }
                </ul>
            </div>

            <div className="sticky top-12 z-20 block md:hidden bg-base-100 pt-2 w-full">
                <button type="button" className="collapse-toggle btn btn-outline btn-primary w-full justify-between" data-collapse="#navbar-collapse" aria-controls="navbar-collapse" aria-label="Toggle navigation" >
                Navigation
                <span className="icon-[tabler--chevron-down] collapse-open:hidden size-4"></span>
                <span className="icon-[tabler--chevron-up] collapse-open:block hidden size-4"></span>
                </button>
                <div id="navbar-collapse" className="md:navbar-end collapse hidden grow basis-full overflow-hidden transition-[height] duration-300 max-md:w-full" >
                <ul className="menu md:menu-horizontal gap-2 p-0 text-base max-md:mt-2">
                    {
                    headings.map((heading, index) =>
                        (
                        <li className="space-y-0.5" key={"navHead_" + index}>
                            <a className="collapse-toggle collapse-open:bg-base-content/10" id={`menu-app-toggle-responsive-${index}`} data-collapse={`#menu-app-collapse-responsive-${index}`}>
                            <span></span>
                            <span>{heading.title}</span>
                            {
                                heading.children?.length > 0 && (
                                <span className="icon-[tabler--chevron-down] collapse-open:rotate-180 size-4 transition-all duration-300"></span>
                                )
                            }
                            </a>
                            {
                            heading.children?.length > 0 && (
                                <ul id={`menu-app-collapse-responsive-${index}`} className="collapse hidden w-auto space-y-0.5 overflow-hidden transition-[height] duration-300" aria-labelledby={`menu-app-toggle-${index}`}>
                                {
                                    heading.children.map((child, childIdx) =>
                                    (
                                        <li key={"navChild_" + childIdx}>
                                        <a href={`#${index+1}-${childIdx+1}`}>
                                            {child}
                                        </a>
                                        </li>
                                    ))
                                }
                                </ul>
                            )
                            }
                        </li>
                        )
                    )
                    }
                </ul>
                </div>
            </div>
            <div className="divider divider-horizontal divider-neutral mx-5"></div>
            <div
                className="w-full text-editor"
                dangerouslySetInnerHTML={{ __html: carData.page }}
            />
            </div>
            <div className="divider divider-neutral my-3"></div>
            <div className='my-10 mx-5 lg:mx-10'>
            <div className='flex flex-col justify-center mb-3'>
                <h2 className='text-primary text-2xl font-medium mx-auto'>Apa Yang Pembeli Katakan?</h2>
            </div>
            <div ref={commentSliderRef} className="keen-slider">
                {carData?.testimonis?.map((item) => (
                <div key={item.id} className="keen-slider__slide px-2">
                    <div className="rounded-xl w-full h-full">
                    <figure className='rounded-xl w-full'>
                        <img loading='lazy' className='w-full h-96 rounded-xl object-cover' src={item.imageUrl} alt="testimoni" />
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

            <div key={carData?.testimonis?.length} className="flex justify-center mt-4 gap-2">
                {carData?.testimonis?.map((item, idx) => (
                    <button
                        key={"navComment_" + item.id}
                        onClick={() => commentInstanceRef.current?.moveToIdx(idx)}
                        className={`w-3 h-3 rounded-full ${
                        currentSlide === idx ? "bg-primary" : "bg-base-300"
                        }`}
                    />
                ))}
            </div>
            </div>
        </div>
    )
}