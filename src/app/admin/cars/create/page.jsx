import CarEditor from '@/components/CarEditor';
import { fetchItem } from '@/lib/ServerUtils';
import { cookies } from 'next/headers';

export default async function CreateCarPage() {
    const token = (await cookies()).get('token')?.value;
    const tagData = await fetchItem('get', `/api/v1/tags`, token);
    
    return <CarEditor tagData={tagData}/>;
}