'use client'

import { toRupiah } from "@/components/Utils";
import Link from "next/link";
import { useState } from "react";

export default function ClientCarList({ cars, tags }) {
    const [tag, setTag] = useState("All");
    const [search, setSearch] = useState('');
    
    const filteredCars = cars.filter((car) => {
        const matchesTag = tag === "All" || car.tags.some(item => item.id === tag);
        const matchesSearch = car.name.toLowerCase().includes(search.toLowerCase());
        return matchesTag && matchesSearch;
    });

    return (
        <>
            <div className='grid grid-flow-row md:grid-flow-col gap-2 md:justify-between items-center mb-2 my-10 mx-5 lg:mx-10'>
                <div className="drop-shadow gap-2 hidden md:flex">
                    <input className="btn btn-soft" type="radio" name="radio-15" aria-label="All" checked={tag === "All"} onChange={() => setTag("All")}/>
                    {
                    tags.map(item => (
                        <input key={item.id} className="btn btn-soft" type="radio" name="radio-15" aria-label={item.name} checked={tag === item.id} onChange={() => setTag(item.id)}/>
                    ))
                    }
                </div>
                <div className="select-floating w-full block md:hidden">
                    <select
                    className="select w-full"
                    aria-label="Select category"
                    id="selectFloating"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    >
                    <option value={'All'}>All</option>
                    {
                        tags.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                        ))
                    }
                    </select>
                    <label className="select-floating-label" htmlFor="selectFloating">Tipe Mobil</label>
                </div>
                <div className="input input-md w-full flex md:max-w-sm space-x-4">
                    <span className="icon-[tabler--search] text-base-content/80 my-auto size-6 shrink-0"></span>
                    <input type="search" className="grow w-full" placeholder="Search" id="kbdInput" value={search} onChange={(e)=>setSearch(e.target.value)}/>
                    <label className="sr-only" htmlFor="kbdInput">Search</label>
                    <span className="my-auto flex gap-2">
                    <kbd className="kbd kbd-sm">Enter</kbd>
                    </span>
                </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-10 mx-5 lg:mx-10">
                {filteredCars.map((car) => (
                    <div key={car.id} className="card sm:max-w-sm">
                    <figure><img loading='lazy' className='rounded-2xl' src={car.mediaFiles[0].url} alt="Car" /></figure>
                        <div className="card-body p-4">
                        <h5 className="card-title">{car.name}</h5>
                        <div className='flex flex-wrap gap-2'>
                            {
                            car.tags.map((tag) => (
                                <span key={tag.id} className="badge badge-sm badge-outline badge-primary">{tag.name}</span>
                            ))
                            }
                        </div>
                        <p className="mb-2">Harga mulai {toRupiah(car.minPrice)}</p>
                        <div className="card-actions">
                            <Link href={"/mobil/" + car.slug} className="btn btn-primary" >Detail</Link>
                        </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}