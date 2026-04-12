import PromoEditor from '@/components/PromoEditor';
import { requestServer } from '@/lib/axiosLocalInstance';
import { cookies } from 'next/headers';

export default async function CreatePromoPage() {
    const token = (await cookies()).get('token')?.value;
    const carData = await requestServer('get', `/api/v1/cars`, token);
    
    return <PromoEditor carData={carData}/>;
}