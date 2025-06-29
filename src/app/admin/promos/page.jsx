import { cookies } from "next/headers";
import PromosListClient from "./PromosListClient";
import { fetchItem } from "@/lib/ServerUtils";

export default async function PromoList ({params}) {
    // const searchParams = await params;
    // const page = parseInt(searchParams.page) || 1;   
    // const pageSize = searchParams.pageSize || 10;
    // const sortBy = searchParams.sortBy || "name";
    // const sortOrder = searchParams.ortOrder || "asc";
    // const search = searchParams.search || "";

    // const token = (await cookies()).get('token')?.value;
    // const payload = {
    //     page,
    //     pageSize,
    //     search,
    //     sortBy,
    //     sortOrder
    // }

    // const promoData = await fetchItem('post', '/api/v1/promos', token, payload)
        
    return <PromosListClient/>
}