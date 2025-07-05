import { BreadcrumbSchema, fetchItem } from "@/lib/ServerUtils";
import { notFound } from "next/navigation";
import CarDetailClient from "./CarDetailClient";

export async function generateMetadata({ params }) {
  const slug = (await params).slug;

  const carData = await fetchItem('get', '/api/v1/cars/detail/' + slug);
  if (!carData) return notFound();

  const imageUrl =
    carData.mediaFiles?.find((m) => m.type === "IMAGE")?.url ??
    "/default-car.jpg";

  const lowestPrice = carData.variants?.length
    ? Math.min(...carData.variants.map((v) => v.price))
    : 0;

  const formatPriceToJutaan = (price) => {
    if (!price) return null;
    const jutaan = Math.floor(price / 1_000_000);
    return `${jutaan} jutaan`;
  };

  const formattedPrice = lowestPrice
    ? formatPriceToJutaan(lowestPrice)
    : "harga spesial";

  return {
    title: `${carData.name} - Promo, Harga ${formattedPrice} & Spesifikasi | Honda Batam`,
    description: `Raih kesempatan memiliki ${carData.name} dengan harga mulai ${formattedPrice}! Tersedia promo menarik, cicilan ringan, dan layanan aftersales terpercaya. Dapatkan penawaran terbaik hanya di dealer resmi Honda Batam.`,
    openGraph: {
      title: `${carData.name} - Penawaran Terbaik & Harga ${formattedPrice} | Honda Batam`,
      description: `Temukan ${carData.name} dengan fitur unggulan dan harga mulai ${formattedPrice}. Segera hubungi tim sales kami untuk info promo eksklusif & test drive gratis.`,
      url: `https://hondabatamresmi.com/mobil/${slug}`,
      images: [
        {
          url: `${imageUrl}`,
          width: 1200,
          height: 630,
          alt: `${carData.name} Honda Batam`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${carData.name} - Harga Mulai ${formattedPrice}`,
      description: `Dapatkan ${carData.name} dengan promo terbatas & cicilan ringan mulai ${formattedPrice}. Booking sekarang di Honda Batam!`,
      images: [`${imageUrl}`],
    },
    robots: "index, follow",
  };
}

export const revalidate = 60;

export default async function CarDetail ({ params }) {
    const slug = (await params).slug

    const carData = await fetchItem('get', '/api/v1/cars/detail/' + slug);
    if(!carData){
        return notFound();
    }

    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Beranda', url: 'https://hondabatamresmi.com' },
                    { name: 'Mobil', url: 'https://hondabatamresmi.com/mobil' },
                    { name: carData.name, url: `https://hondabatamresmi.com/mobil/${carData.slug}` }
                ]}
            />
            <CarDetailClient
                carData={carData}
                    lowestPrice={carData.variants?.length
                    ? Math.min(...carData.variants.map((v) => v.price))
                    : 0}
            />
        </>
    )
}