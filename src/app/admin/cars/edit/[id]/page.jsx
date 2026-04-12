import CarEditor from '@/components/CarEditor';
import {requestServer} from '@/lib/axiosLocalInstance'
import { cookies } from 'next/headers';

export default async function EditCarPage({params}) {
    const id = (await params).id
    const token = (await cookies()).get('token')?.value;

    const carData = await requestServer('get', `/api/v1/cars/${id}`, token)
    const tagData = await requestServer('get', `/api/v1/tags`, token);

    return <CarEditor id={id} carData={carData} tagData={tagData}/>;
}