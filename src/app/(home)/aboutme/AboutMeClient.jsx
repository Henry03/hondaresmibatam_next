'use client'

import { useRef } from "react";
import { motion, useScroll, useTransform } from 'framer-motion';
import profileImg from '@/../public/profile2.png'
import Image from "next/image";

export default function AboutMeClient ({certificates}) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
    const y = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

    return (
        <div ref={containerRef} className="relative">
            <motion.div
                style={{ opacity, scale, y }}
                className="sticky top-20 z-0 text-center"
            >
                <div className="text-xl sm:text-2xl md:text-3xl font-medium">~ Hello ~</div>
                <div className="text-4xl sm:text-5xl md:text-7xl">
                    I'm <span className="text-primary underline">Sri Heryanti</span>
                </div>
                <span className="badge badge-primary rounded-full mt-5">Sales Consultant</span>
            </motion.div>

            <div className="mt-10 relative z-10 flex justify-center">
                <Image
                    src={profileImg}
                    alt="profile"
                    className="w-1/2 rounded-full shadow-xl"
                />
            </div>
            <div className="my-10 p-10 grid gap-5">
                <div className="card p-5 md:p-10 gap-3">
                    <p>Selamat datang di website resmi kami.😃</p>
                    <p>Saya, Sri Heryanti, siap membantu Anda dalam menemukan kendaraan Honda yang tepat sesuai dengan kebutuhan dan gaya hidup Anda. Dengan pelayanan yang ramah, informatif, dan profesional, saya berkomitmen memberikan pengalaman terbaik mulai dari konsultasi hingga proses pembelian.</p>
                    <p>Hubungi saya untuk informasi terbaru, promo menarik, dan penawaran terbaik dari Honda.</p>
                </div>
                <div className='card p-5 md:p-10 grid gap-3'>
                    <h3 className='text-lg md:text-xl text-primary font-semibold'>My Achievement : </h3>
                    <div className='grid gap-3 md:grid-cols-2'>
                        {
                        certificates.map((item, index) => (
                            item.type === 'IMAGE' ? (
                                <Image width={300} height={300}  key={index} src={item.url} alt="Preview" className="w-full object-cover" />
                            ) : (
                                <video key={index} src={item.url} controls className="w-full object-cover" />
                            )
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}