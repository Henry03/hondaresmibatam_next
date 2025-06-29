'use client'

import Cookies from "js-cookie"
import { getInitials, getProfileBackground } from "./Utils"
import { useRouter } from "next/navigation"
import { useEffect } from "react";
import Link from "next/link";

export default function AdminNavbar ({name}) {
    const router = useRouter();

    const logout = () => {
        Cookies.remove('token')
        router.push('/auth/login')
    }

    useEffect(() => {
        import('flyonui/dist/index.js').then(() => {
            if (window.HSStaticMethods?.autoInit) {
            window.HSStaticMethods.autoInit();
            }
        });
    }, []);

    return (
        <>
            <nav className="navbar bg-base-100 max-sm:rounded-box max-sm:shadow-sm sm:border-b border-base-content/25 sm:z-1 relative h-16">
                <button type="button" className="btn btn-text max-sm:btn-square sm:hidden me-2" aria-haspopup="dialog" aria-expanded="false" aria-controls="with-navbar-sidebar" data-overlay="#with-navbar-sidebar" >
                    <span className="icon-[tabler--menu-2] size-5"></span>
                </button>
                <div className="flex flex-1 items-center">
                    <a className="link text-base-content link-neutral text-xl font-semibold no-underline" href="#">
                        Honda Resmi Batam
                    </a>
                </div>
                <div className="navbar-end flex items-center gap-4">
                    <div className="dropdown relative inline-flex [--auto-close:inside] [--offset:8] [--placement:bottom-end]">
                        <button id="dropdown-scrollable" type="button" className="dropdown-toggle flex items-center" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                            <div className="">
                                <div className={`w-10 h-10 rounded-full flex justify-center items-center`} style={{backgroundColor: getProfileBackground(name)}}>
                                    <span className="text-white">{getInitials(name)}</span>
                                </div>
                            </div>
                        </button>
                        <ul className="dropdown-menu dropdown-open:opacity-100 hidden min-w-60" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-avatar">
                            <li className="dropdown-header gap-2">
                                <div className="">
                                    <div className={`w-10 h-10 rounded-full flex justify-center items-center`} style={{backgroundColor: getProfileBackground(name)}}>
                                        <span className="text-white">{getInitials(name)}</span>
                                    </div>
                                </div>
                                <div>
                                    <h6 className="text-base-content text-base font-semibold">{name}</h6>
                                    <small className="text-base-content/50">Admin</small>
                                </div>
                            </li>
                            <li className="dropdown-footer gap-2">
                                <button
                                    className="btn btn-error w-full"
                                    onClick={() => { logout()}}
                                    >
                                    Sign out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <aside id="with-navbar-sidebar" className="overlay [--auto-close:sm] sm:shadow-none overlay-open:translate-x-0 drawer drawer-start hidden max-w-64 sm:absolute sm:z-0 sm:flex sm:translate-x-0 pt-16 border-e border-base-200" role="dialog" tabIndex="-1" >
                <div className="drawer-body px-2 pt-4">
                    <ul className="menu p-0">
                        <li>
                            <Link href={'/admin/cars'}>
                                <span className="icon-[tabler--car] size-5"></span>
                                Car
                            </Link>
                        </li>
                        <li>
                            <Link href={'/admin/tags'}>
                                <span className="icon-[tabler--tag] size-5"></span>
                                Tag
                            </Link>
                        </li>
                        <li>
                            <Link href={'/admin/promos'}>
                                <span className="icon-[tabler--rosette-discount] size-5"></span>
                                Promo
                            </Link>
                        </li>
                        <li>
                            <Link href={'/admin/comments'}>
                                <span className="icon-[tabler--message] size-5"></span>
                                Comment
                            </Link>
                        </li>
                        <li>
                            <Link href={'/admin/certificates'}>
                                <span className="icon-[tabler--certificate] size-5"></span>
                                Certificate
                            </Link>
                        </li>
                        <li>
                            <Link href={'/admin/carousels'}>
                                <span className="icon-[tabler--carousel-horizontal] size-5"></span>
                                Carousel
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    )
}