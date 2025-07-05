import axiosInstance from "@/lib/axiosInstance"
import { safeFetch } from "@/lib/fetchData"
import { BreadcrumbSchema } from "@/lib/ServerUtils";
import AboutMeClient from "./AboutMeClient";

export const metadata = {
  title: "Sri Heryanti | Sales Resmi Honda Batam",
  description:
    "Halo! Saya Sri Heryanti, sales resmi Honda Batam. Siap membantu Anda menemukan mobil Honda yang sesuai dengan kebutuhan dan gaya hidup Anda dengan pelayanan ramah, informatif, dan profesional.",
  openGraph: {
    title: "Sri Heryanti | Sales Resmi Honda Batam",
    description:
      "Selamat datang di website resmi saya. Saya Sri Heryanti, siap membantu Anda dalam menemukan kendaraan Honda terbaik. Hubungi saya untuk konsultasi, promo menarik, dan penawaran spesial.",
    url: "https://hondabatamresmi.com/aboutme",
    images: [
      {
        url: "https://hondabatamresmi.com/profile2.png",
        width: 800,
        height: 600,
        alt: "Foto Profile",
      },
    ],
    type: "profile",
  },
  robots: "index, follow",
};

export const revalidate = 60;

export default async function AboutMe() {
    const certificateData = await safeFetch(() => axiosInstance.get('/api/v1/certificates'));

    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Beranda', url: 'https://hondabatamresmi.com' },
                    { name: 'Tentang Saya', url: 'https://hondabatamresmi.com/aboutme' }
                ]}
            />
            <AboutMeClient certificates={certificateData}/>
        </>
    )
}