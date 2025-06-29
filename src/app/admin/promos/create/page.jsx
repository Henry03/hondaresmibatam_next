import PromoEditor from '@/components/PromoEditor';
import { fetchItem } from '@/lib/ServerUtils';
import { cookies } from 'next/headers';

export default async function CreatePromoPage() {
    const token = (await cookies()).get('token')?.value;
    const carData = await fetchItem('get', `/api/v1/cars`, token);
    
    return <PromoEditor carData={carData}/>;
}