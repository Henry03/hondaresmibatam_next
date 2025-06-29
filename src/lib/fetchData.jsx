import { notFound } from "next/navigation";

export async function safeFetch(fetchFunc, fallback = null) {
    try {
        const res = await fetchFunc();

        return res.data.data;
    } catch (err) {
        console.error("Fetch failed: ", err);
        return fallback;
    }
}