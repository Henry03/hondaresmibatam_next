import CarEditor from '@/components/CarEditor';
import { fetchItem } from '@/lib/ServerUtils';
import { cookies } from 'next/headers';

export default async function EditCarPage({params}) {
    const id = (await params).id
    const token = (await cookies()).get('token')?.value;

    const carData = await fetchItem('get', `/api/v1/cars/${id}`, token)
    const tagData = await fetchItem('get', `/api/v1/tags`, token);

    return <CarEditor id={id} carData={carData} tagData={tagData}/>;
}