import { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { redirect} from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { getInitials, getProfileBackground } from "@/lib/ServerUtils";
import LogoutButton from "@/components/LogoutButton";
import AdminNavbar from "@/components/AdminNavbar";

export default async function AdminLayout({children}) {
    let decoded;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if(!token) {
        redirect('/auth/login');
    }

    try {
        decoded = jwtDecode(token)
    } catch (err) {
        redirect('/auth/login');
    }

    const name = decoded?.name ?? 'Unknown'

    return (
        <>
            <AdminNavbar name={name}/>
            <main className="sm:ml-64 h-[calc(100dvh-4rem)] overflow-y-scroll">
                {children}
            </main>
            <Toaster 
                containerStyle={{}}
                position="top-right"
                reverseOrder={false}
            />
        </>
    )
}