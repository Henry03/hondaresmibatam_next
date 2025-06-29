import { BreadcrumbSchema } from '@/components/Utils';
import axiosInstance from '@/lib/axiosInstance';
import { safeFetch } from '@/lib/fetchData';
import ClientCarList from './ClientCarList';

export const metadata = {
  title: "Daftar Mobil Honda | Pilihan Lengkap di Honda Batam",
  description:
    "Jelajahi semua tipe mobil Honda — dari City Car hingga SUV. Lihat spesifikasi, harga, dan promo terbaru hanya di Honda Resmi Batam.",
  openGraph: {
    title: "Daftar Mobil Honda | Pilihan Lengkap di Honda Batam",
    description:
      "Jelajahi semua tipe mobil Honda — dari City Car hingga SUV. Lihat spesifikasi, harga, dan promo terbaru hanya di Honda Resmi Batam.",
    url: "https://hondabatamresmi.com/mobil",
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

export default async function Mobil() {
  const carData = await safeFetch(() => axiosInstance.get('/api/v1/cars/list'));
  const tagData = await safeFetch(() => axiosInstance.get('/api/v1/tags'));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Beranda', url: 'https://hondabatamresmi.com' },
          { name: 'Mobil', url: 'https://hondabatamresmi.com/mobil' }
        ]}
      />
      <div className='mt-2 mb-5'>
        <ClientCarList cars={carData} tags={tagData} />
      </div>
    </>
  )
}