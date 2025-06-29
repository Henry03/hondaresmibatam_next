import '@/app/globals.css'
import logo from '@/../public/icon.ico'
import Script from 'next/script'
import Image from 'next/image'
import RootNavbar from '@/components/RootLayout'

export default function RootLayout({ children }) {
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-KFD4EBD1WN"></Script>
      <Script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments)}
          gtag('js', new Date());
  
          gtag('config', 'G-KFD4EBD1WN');
        `}
      </Script>
      
      <RootNavbar />
      <div className="h-14 md:h-20" />

      <div className="mx-auto w-full xl:max-w-7xl">{children}</div>

      <div className="bg-base-200/60 p-5 xl:px:10">
        <footer className="footer xl:max-w-7xl mx-auto justify-items-center md:justify-items-normal">
          <aside className="gap-6 lg:px-24">
            <div className="flex items-center gap-2 text-xl font-bold text-base-content">
              <Image alt="Honda Logo" src={logo} />
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
              Info Promo Terbaik, Pemesanan, dan Test Drive Hubungi :
            </h6>
            <a
              href="https://wa.me/6285211451178"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover flex items-center gap-2"
            >
              <span className="icon-[tabler--brand-whatsapp] size-6"></span>
              +62852 1145 1178
            </a>
            <a
              href="https://www.instagram.com/hondabatam.sriheryanti"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover flex items-center gap-2"
            >
              <span className="icon-[tabler--brand-instagram] size-6"></span>
              hondabatam.sriheryanti
            </a>
            <a
              href="https://www.facebook.com/yang.aizhen.5"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover flex items-center gap-2"
            >
              <span className="icon-[tabler--brand-facebook] size-6"></span>
              Sri Heryanti Honda Batam
            </a>
          </nav>
          <div>
            <iframe title="Honda Taman Kota Map" className="border-0 w-full h-60 xl:w-xl xl:h-96" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1677.1903833643826!2d104.0048331632487!3d1.121902310588285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d98994c4c52841%3A0x219e35be0116994c!2sHonda%20Taman%20Kota!5e0!3m2!1sen!2sid!4v1750873088217!5m2!1sen!2sid" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </footer>
      </div>

      <footer className="footer bg-base-200/60 px-6 py-4">
        <div className="flex w-full items-center justify-start md:justify-center xl:max-w-7xl mx-auto">
          <aside className="grid-flow-col items-center">
            <p>
              ©2025{' '}
              <a className="link link-hover font-medium" href="https://hondabatamresmi.com">
                Honda Batam Sri Heryanti
              </a>
            </p>
          </aside>
        </div>
      </footer>
    </>
  )
}
