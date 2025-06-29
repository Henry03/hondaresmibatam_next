import Link from "next/link";
import Image from "next/image";
import logo from "@/../public/icon.ico";
import hondaLogo from "@/../public/honda_logo.png";
import '@/app/globals.css'

export const metadata = {
  title: 'Honda Resmi Batam',
  description:
    'Website resmi penjualan mobil Honda di Batam. Dapatkan promo terbaru, harga mobil Honda terbaik, dan layanan personal dari sales Honda terpercaya.',
  icons: {
    icon: '/icon.ico',
  },
};

export default function RootLayout({ children }) {
    return (
        <html lang="id" data-theme="maintheme">
            <body>
                {children}
            </body>
        </html>
    );
}
