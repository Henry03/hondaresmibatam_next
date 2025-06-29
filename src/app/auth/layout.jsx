import Image from "next/image";
import logo from "@/../public/icon.ico";
import '@/app/globals.css'
import AuthNavbar from "@/components/AuthNavbar";

export const metadata = {
  title: 'Honda Resmi Batam',
  description:
    'Website resmi penjualan mobil Honda di Batam. Dapatkan promo terbaru, harga mobil Honda terbaik, dan layanan personal dari sales Honda terpercaya.',
  icons: {
    icon: '/icon.ico',
  },
};

export default function AuthLayout({ children }) {
    return (
        <>
            <AuthNavbar/>

            <div className="h-16"></div>

            <div className="mx-auto w-full xl:max-w-7xl">{children}</div>

            <div className="bg-base-200/60 p-5 xl:px:10">
                <footer className="footer xl:max-w-7xl mx-auto justify-items-center md:justify-items-normal">
                <aside className="gap-6 lg:px-24">
                    <div className="flex items-center gap-2 text-xl font-bold text-base-content">
                    <Image src={logo} alt="Dealer Honda Batam" />
                    <span>Dealer Honda Batam</span>
                    </div>
                    <p className="text-base-content text-sm">
                    PT Pionika Automobil
                    <br />
                    Jl. Gajah Mada, Taman Kota
                    <br />
                    Batam
                    </p>
                </aside>
                <nav className="text-base-content">
                    <h6 className="footer-title">
                    Info Promo Terbaik, Pemesanan, dan Test Drive Hubungi:
                    </h6>
                    <a
                    href="#"
                    className="link link-hover flex items-center gap-2"
                    >
                    <span className="icon-[tabler--brand-whatsapp] size-6"></span>
                    +62852 1145 1178
                    </a>
                    <a
                    href="#"
                    className="link link-hover flex items-center gap-2"
                    >
                    <span className="icon-[tabler--brand-instagram] size-6"></span>
                    hondabatam.sriheryanti
                    </a>
                    <a
                    href="#"
                    className="link link-hover flex items-center gap-2"
                    >
                    <span className="icon-[tabler--brand-facebook] size-6"></span>
                    Sri Heryanti Honda Batam
                    </a>
                </nav>
                </footer>
            </div>

            <footer className="footer bg-base-200/60 px-6 py-4">
                <div className="flex w-full items-center justify-between xl:max-w-7xl mx-auto">
                <aside className="grid-flow-col items-center">
                    <p>
                    ©2025{" "}
                    <a className="link link-hover font-medium" href="#">
                        Honda Batam Sri Heryanti
                    </a>
                    </p>
                </aside>
                </div>
            </footer>
        </>
    );
}
