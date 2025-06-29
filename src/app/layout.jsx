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
            <head>
              <link rel="icon" href="/icon.ico" sizes="any" />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
