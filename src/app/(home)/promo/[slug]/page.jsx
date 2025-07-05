import { BreadcrumbSchema, fetchItem, formatDate } from "@/lib/ServerUtils";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
    const slug = (await params).slug

    const promoData = await fetchItem('get', '/api/v1/promos/detail/' + slug);
    if (!promoData) return notFound();

    return {
        title: `${promoData.name} | Mobil Honda Batam`,
        description: `Dapatkan penawaran spesial ${promoData.name} hanya di Honda Batam. Promo terbatas, segera hubungi sales resmi kami untuk detail dan cara mendapatkan promo ini.`,
        openGraph: {
        title: `${promoData.name} | Mobil Honda Batam`,
        description: `Promo eksklusif untuk Anda: ${promoData.name}. Nikmati harga spesial dan bonus menarik. Hubungi kami sekarang untuk info lebih lengkap.`,
        url: `https://hondabatamresmi.com/promo/${slug}`,
        images: [
            {
            url: `${promoData.mediaUrl}`,
            width: 800,
            height: 600,
            alt: promoData.name,
            },
        ],
        type: "article",
        },
        robots: "index, follow",
    };
}

export const revalidate = 60;

export default async function PromoDetail ({params}){
    const slug = (await params).slug;

    const promoData = await fetchItem('get', '/api/v1/promos/detail/' + slug);

    if(!promoData){
        return notFound();
    }
    
    return (
        <>
            <BreadcrumbSchema
                items={[
                { name: 'Beranda', url: 'https://hondabatamresmi.com' },
                { name: 'Promo', url: 'https://hondabatamresmi.com/promo' },
                { name: promoData.name, url: `https://hondabatamresmi.com/promo/${promoData.slug}` }
                ]}
            />
            <div className='mt-2 mb-5 my-10 mx-5 lg:mx-10'>
                <div className="grid md:grid-cols-2 gap-6">
                <div className="md:sticky md:top-20 md:self-start w-full overflow-hidden">
                    {
                    promoData.mediaType == 'IMAGE' ?
                    <Image width={1000} height={1000} 
                        loading='lazy'
                        src={promoData.mediaUrl}
                        alt="Promo"
                        className="w-full h-full object-cover"
                    />
                    :
                    <video
                        className="w-full h-full object-cover"
                        controls
                        src={promoData.mediaUrl}
                    />
                    }
                </div>
    
                <div className="flex flex-col gap-2">
                    <div className='flex flex-col gap-2'>
                    <h1 className="text-3xl font-semibold">{promoData.name}</h1>
                    <div className='flex gap-2 items-center'>
                        <span className="icon-[tabler--calendar-event-filled] size-5"></span>
                        <h3>{formatDate(promoData.startDate)} - {formatDate(promoData.endDate)}</h3>
                    </div>
                    </div>
                    <a 
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`http://wa.me/6285211451178?text=Halo kak, saya mau bertanya terkait promo "${promoData.name}"`} 
                    className="w-full">
                    <button className={`btn btn-primary w-full mt-3`}>Hubungi Sales</button>
                    </a>
                    <div className="divider divide-base-200"></div>
                    <div
                    className="w-full text-editor"
                    dangerouslySetInnerHTML={{ __html: promoData.page }}
                    />
                    </div>
                </div>
            </div>
        </>
    )
}