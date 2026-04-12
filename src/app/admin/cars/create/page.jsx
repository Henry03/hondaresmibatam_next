import CarEditor from '@/components/CarEditor';
import { requestServer } from '@/lib/axiosLocalInstance';
import { cookies } from 'next/headers';

export default async function CreateCarPage() {
    const token = (await cookies()).get('token')?.value;
    const tagData = await requestServer('get', `/api/v1/tags`, token);
    
    return <CarEditor tagData={tagData}/>;
}