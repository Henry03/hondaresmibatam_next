import PromoEditor from '@/components/PromoEditor';
import { requestServer } from '@/lib/axiosLocalInstance';
import { cookies } from 'next/headers';

export default async function EditPromoPage({params}) {
    const id = (await params).id
    const token = (await cookies()).get('token')?.value;

    const promoData = await requestServer('get', `/api/v1/Promos/${id}`, token)
    const carData = await requestServer('get', `/api/v1/cars`, token);

    return <PromoEditor id={id} promoData={promoData} carData={carData}/>;
}