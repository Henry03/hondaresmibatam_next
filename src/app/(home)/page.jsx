import "keen-slider/keen-slider.min.css";
import { safeFetch } from '@/lib/fetchData';
import PromoSection from '@/components/PromoSection';
import CommentSection from '@/components/CommentSection';
import CarSection from '@/components/CarSection';
import CarouselSection from '@/components/CarouselSection';
import { BreadcrumbSchema } from '@/components/Utils';
import Link from 'next/link';
import axiosLocalInstance from '@/lib/axiosLocalInstance';

export const metadata = {
  title: "Honda Resmi Batam | Promo Mobil Honda & Layanan Personal",
  description:
    "Jelajahi mobil Honda terbaru, dapatkan promo eksklusif, dan nikmati layanan personal dari sales resmi Honda di Batam. Cek ketersediaan unit & test drive sekarang!",
  openGraph: {
    title: "Honda Resmi Batam | Promo Mobil Honda & Layanan Personal",
    description:
      "Jelajahi mobil Honda terbaru, dapatkan promo eksklusif, dan nikmati layanan personal dari sales resmi Honda di Batam.",
    url: "https://hondabatamresmi.com",
    images: [
      {
        url: "https://hondabatamresmi.com/Honda_Logo.jpg",
        width: 800,
        height: 600,
        alt: "Logo Honda Resmi Batam",
      },
    ],
    type: "website",
  },
  robots: "index, follow"
};

export const revalidate = 60;

export default async function Home() {
  const carData = await safeFetch(() => axiosLocalInstance.get('/api/v1/cars/getHomeList'));
  const carouselData = await safeFetch(() => axiosLocalInstance.get('/api/v1/carousels/getHomeList'));
  const promoData = await safeFetch(() => axiosLocalInstance.get('/api/v1/promos/getHomeList'));
  const commentData = await safeFetch(() => axiosLocalInstance.get('/api/v1/comments/getHomeList'));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Beranda', url: 'https://hondabatamresmi.com' }
        ]}
      />
      <div>
        <CarouselSection data={carouselData}/>
        <div className='my-10 mx-5 lg:mx-10'>
          <div className='flex justify-between items-center mb-5'>
            <h3 className='text-2xl font-medium'>Daftar Mobil</h3>
            <Link href={'/mobil'} className="btn btn-text btn-primary">Lihat semua</Link>
          </div>
          <CarSection data={carData}/>
        </div>
        <div className='my-10 mx-5 lg:mx-10'>
          <div className='flex justify-between items-center mb-5'>
            <h3 className='text-2xl font-medium'>Promo</h3>
          </div>
          <PromoSection data={promoData}/>
        </div>
        <div className='my-10 mx-5 lg:mx-10'>
          <div className='flex flex-col justify-center mb-3'>
            <h2 className='text-primary text-2xl font-medium mx-auto'>Apa Yang Pembeli Katakan?</h2>
          </div>
          <CommentSection data={commentData}/>
        </div>
        
      </div>
    </>
  )
}