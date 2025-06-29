import { Link, Outlet, useLocation } from "react-router";
import { useEffect } from 'react';
import logo from '../assets/icon.ico'
import 'flyonui/dist/index.js';
import hondaLogo from '@/../../assets/honda_logo.png'

function Layout() {
    const location = useLocation();

    useEffect(() => {
        const loadFlyonui = async () => {
          await import('flyonui/flyonui');
          window.HSStaticMethods.autoInit();
        };
        loadFlyonui();
      }, [location.pathname]);

    return (
        <>
            <nav className="navbar fixed z-50">
                <div className="w-full md:flex md:items-center xl:max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="navbar-start items-center justify-between w-full">
                            <Link to={'/'} className="flex gap-2 items-center">
                                <img src={hondaLogo} className="h-7" alt="Honda Logo"/>
                                <div className="divider md:divider-horizontal"></div>
                                <div className="text-base-content text-xl font-bold no-underline whitespace-nowrap hidden md:block">Honda Batam Sri Heryanti</div>
                            </Link>
                            <div className="block md:hidden">
                                <button type="button" className="collapse-toggle btn btn-outline btn-secondary btn-sm btn-square" data-collapse="#dropdown-navbar-collapse" aria-controls="dropdown-navbar-collapse" aria-label="Toggle navigation" >
                                    <span className="icon-[tabler--menu-2] collapse-open:hidden size-4"></span>
                                    <span className="icon-[tabler--x] collapse-open:block hidden size-4"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="dropdown-navbar-collapse" className="md:navbar-end collapse hidden grow basis-full overflow-hidden transition-[height] duration-300 max-md:w-full" >
                        <ul className="menu md:menu-horizontal gap-2 p-0 text-base max-md:mt-2">
                            <li className="text-xl font-semibold block md:hidden mt-2 mx-4 md:mt-2">Honda Batam Sri Heryanti</li>
                            <li className="divider md:hidden"></li>
                            <li><Link to={"/"}>Home</Link></li>
                            <li><Link to={"/mobil"}>Mobil</Link></li>
                            <li><Link to={"/aboutme"}>Tentang Saya</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="h-20">

            </div>
            <div className="mx-auto w-full xl:max-w-7xl">
                <Outlet />
            </div>
            <div className="bg-base-200/60 p-5 xl: px:10">
                <footer className="footer xl:max-w-7xl mx-auto justify-items-center md:justify-items-normal">
                    <aside className="gap-6 lg:px-24">
                        <div className="flex items-center gap-2 text-xl font-bold text-base-content">
                        <img alt="Honda Logo" src={logo}/>
                        <span>Dealer Honda Batam</span>
                        </div>
                        <p className="text-base-content text-sm">
                            PT Pionika Automobil
                            <br/>Jl. Gajah Mada, Taman Kota
                            <br/>Batam
                        </p>
                    </aside>
                    <nav className="text-base-content">
                        <h6 className="footer-title">Info Promo Terbaik, Pemesanan, dan Test Drive Hubungi : </h6>
                        <a
                            href="https://wa.me/6285211451178"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link link-hover flex items-center gap-2"
                        >
                        <span className="icon-[tabler--brand-whatsapp] size-6"></span>+62852 1145 1178
                        </a>

                        <a
                            href="https://www.instagram.com/hondabatam.sriheryanti"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link link-hover flex items-center gap-2"
                        >
                        <span className="icon-[tabler--brand-instagram] size-6"></span>hondabatam.sriheryanti
                        </a>

                        <a
                            href="https://www.facebook.com/yang.aizhen.5"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link link-hover flex items-center gap-2"
                        >
                        <span className="icon-[tabler--brand-facebook] size-6"></span>Sri Heryanti Honda Batam
                        </a>

                    </nav>
                </footer>
            </div>
            <footer className="footer bg-base-200/60 px-6 py-4">
                <div className="flex w-full items-center justify-between xl:max-w-7xl mx-auto">
                    <aside className="grid-flow-col items-center">
                        <p>©2025 <a className="link link-hover font-medium" href="#">Honda Batam Sri Heryanti</a></p>
                    </aside>
                </div>
            </footer>
        </>
    )
}

export default Layout;