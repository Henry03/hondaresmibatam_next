'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import hondaLogo from "@/../public/honda_logo.png";

export default function AuthNavbar () {
    useEffect(() => {
        import('flyonui/dist/index.js').then(() => {
            if (window.HSStaticMethods?.autoInit) {
                window.HSStaticMethods.autoInit();
            }
        });
    }, []);

    return (
        <nav className="navbar fixed z-50">
            <div className="w-full md:flex md:items-center xl:max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="navbar-start items-center justify-between w-full">
                <div className="flex gap-2 items-center">
                    <Image src={hondaLogo} className="h-7 w-auto" alt="Honda Logo" />
                    <div className="divider md:divider-horizontal"></div>
                    <span className="link text-base-content link-neutral text-xl font-bold no-underline whitespace-nowrap hidden md:block">
                    Honda Batam Sri Heryanti
                    </span>
                </div>
                <div className="block md:hidden">
                    <button
                    type="button"
                    className="collapse-toggle btn btn-outline btn-secondary btn-sm btn-square"
                    data-collapse="#dropdown-navbar-collapse"
                    aria-controls="dropdown-navbar-collapse"
                    aria-label="Toggle navigation"
                    >
                    <span className="icon-[tabler--menu-2] collapse-open:hidden size-4"></span>
                    <span className="icon-[tabler--x] collapse-open:block hidden size-4"></span>
                    </button>
                </div>
                </div>
            </div>
            <div
                id="dropdown-navbar-collapse"
                className="md:navbar-end collapse hidden grow basis-full overflow-hidden transition-[height] duration-300 max-md:w-full"
            >
                <ul className="menu md:menu-horizontal gap-2 p-0 text-base max-md:mt-2">
                <li className="text-xl font-semibold block md:hidden mt-2 mx-4 md:mt-2">
                    Honda Batam Sri Heryanti
                </li>
                <li className="divider md:hidden"></li>
                <li>
                    <Link href="/auth/login">Login</Link>
                </li>
                <li>
                    <Link href="/auth/register">Register</Link>
                </li>
                </ul>
            </div>
            </div>
        </nav>
    )
}