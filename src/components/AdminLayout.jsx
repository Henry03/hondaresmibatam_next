import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from 'react';
import 'flyonui/dist/index.js';
import { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { getInitials, getProfileBackground } from "./Utils";

function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [name, setName] = useState('');

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/auth/login');
    }

    useEffect(() => {
        const loadFlyonui = async () => {
          await import('flyonui/flyonui');
          window.HSStaticMethods.autoInit();
        };
        loadFlyonui();
      }, [location.pathname]);

    // useEffect(() => {
    //     const initFlyonUI = async () => {
    //       await loadFlyonUI();
    //     };
    
    //     initFlyonUI();
    // }, []);
    
    // useEffect(() => {
    //     setTimeout(() => {
    //       if (
    //         window.HSStaticMethods &&
    //         typeof window.HSStaticMethods.autoInit === 'function'
    //       ) {
    //         window.HSStaticMethods.autoInit();
    //       }
    //     }, 100);
    // }, [location.pathname]);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            const decoded = jwtDecode(token)
            setName(decoded.name);
        } else {
            navigate('/auth/login');
        }
    }, [])

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
                        {/* <button id="dropdown-scrollable" type="button" className="dropdown-toggle btn btn-text btn-circle dropdown-open:bg-base-content/10 size-10" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                            <div className="indicator">
                                <span className="indicator-item bg-error size-2 rounded-full"></span>
                                <span className="icon-[tabler--bell] text-base-content size-5.5"></span>
                            </div>
                        </button> */}
                        {/* <div className="dropdown-menu dropdown-open:opacity-100 hidden" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-scrollable">
                            <div className="dropdown-header justify-center">
                            <h6 className="text-base-content text-base">Notifications</h6>
                            </div>
                            <div className="overflow-y-auto overflow-x-auto text-base-content/80 max-h-56 overflow-auto max-md:max-w-60">
                                <div className="dropdown-item">
                                    <div className="avatar avatar-away-bottom">
                                    <div className="w-10 rounded-full">
                                        <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png" alt="avatar 1" />
                                    </div>
                                    </div>
                                    <div className="w-60">
                                    <h6 className="truncate text-base">Charles Franklin</h6>
                                    <small className="text-base-content/50 truncate">Accepted your connection</small>
                                    </div>
                                </div>
                                <div className="dropdown-item">
                                    <div className="avatar">
                                    <div className="w-10 rounded-full">
                                        <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-2.png" alt="avatar 2" />
                                    </div>
                                    </div>
                                    <div className="w-60">
                                    <h6 className="truncate text-base">Martian added moved Charts & Maps task to the done board.</h6>
                                    <small className="text-base-content/50 truncate">Today 10:00 AM</small>
                                    </div>
                                </div>
                                <div className="dropdown-item">
                                    <div className="avatar avatar-online-bottom">
                                    <div className="w-10 rounded-full">
                                        <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-8.png" alt="avatar 8" />
                                    </div>
                                    </div>
                                    <div className="w-60">
                                    <h6 className="truncate text-base">New Message</h6>
                                    <small className="text-base-content/50 truncate">You have new message from Natalie</small>
                                    </div>
                                </div>
                                <div className="dropdown-item">
                                    <div className="avatar avatar-placeholder">
                                    <div className="bg-neutral text-neutral-content w-10 rounded-full p-2">
                                        <span className="icon-[tabler--user] size-full"></span>
                                    </div>
                                    </div>
                                    <div className="w-60">
                                    <h6 className="truncate text-base">Application has been approved 🚀</h6>
                                    <small className="text-base-content/50 text-wrap">Your ABC project application has been approved.</small>
                                    </div>
                                </div>
                                <div className="dropdown-item">
                                    <div className="avatar">
                                    <div className="w-10 rounded-full">
                                        <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-10.png" alt="avatar 10" />
                                    </div>
                                    </div>
                                    <div className="w-60">
                                    <h6 className="truncate text-base">New message from Jane</h6>
                                    <small className="text-base-content/50 text-wrap">Your have new message from Jane</small>
                                    </div>
                                </div>
                                <div className="dropdown-item">
                                    <div className="avatar">
                                    <div className="w-10 rounded-full">
                                        <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-3.png" alt="avatar 3" />
                                    </div>
                                    </div>
                                    <div className="w-60">
                                    <h6 className="truncate text-base">Barry Commented on App review task.</h6>
                                    <small className="text-base-content/50 truncate">Today 8:32 AM</small>
                                    </div>
                                </div>
                            </div>
                            <a href="#" className="dropdown-footer justify-center gap-1">
                            <span className="icon-[tabler--eye] size-4"></span>
                            View all
                            </a>
                        </div> */}
                    </div>
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
                            {/* <li>
                            <a className="dropdown-item" href="#">
                                <span className="icon-[tabler--user]"></span>
                                My Profile
                            </a>
                            </li>
                            <li>
                            <a className="dropdown-item" href="#">
                                <span className="icon-[tabler--settings]"></span>
                                Settings
                            </a>
                            </li>
                            <li>
                            <a className="dropdown-item" href="#">
                                <span className="icon-[tabler--receipt-rupee]"></span>
                                Billing
                            </a>
                            </li>
                            <li>
                            <a className="dropdown-item" href="#">
                                <span className="icon-[tabler--help-triangle]"></span>
                                FAQs
                            </a>
                            </li> */}
                            <li className="dropdown-footer gap-2">
                                <div className="btn btn-error btn-soft btn-block" onClick={logout}>
                                    <span className="icon-[tabler--logout]"></span>
                                    Sign out
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <aside id="with-navbar-sidebar" className="overlay [--auto-close:sm] sm:shadow-none overlay-open:translate-x-0 drawer drawer-start hidden max-w-64 sm:absolute sm:z-0 sm:flex sm:translate-x-0 pt-16 border-e border-base-200" role="dialog" tabIndex="-1" >
                <div className="drawer-body px-2 pt-4">
                    <ul className="menu p-0">
                        {/* <li>
                            <a href="#">
                            <span className="icon-[tabler--home] size-5"></span>
                            Home
                            </a>
                        </li> */}
                        <li>
                            <Link to={'/admin/cars'}>
                                <span className="icon-[tabler--car] size-5"></span>
                                Car
                            </Link>
                        </li>
                        <li>
                            <Link to={'/admin/tags'}>
                                <span className="icon-[tabler--tag] size-5"></span>
                                Tag
                            </Link>
                        </li>
                        <li>
                            <Link to={'/admin/promos'}>
                                <span className="icon-[tabler--rosette-discount] size-5"></span>
                                Promo
                            </Link>
                        </li>
                        <li>
                            <Link to={'/admin/comments'}>
                                <span className="icon-[tabler--message] size-5"></span>
                                Comment
                            </Link>
                        </li>
                        <li>
                            <Link to={'/admin/certificates'}>
                                <span className="icon-[tabler--certificate] size-5"></span>
                                Certificate
                            </Link>
                        </li>
                        <li>
                            <Link to={'/admin/carousels'}>
                                <span className="icon-[tabler--carousel-horizontal] size-5"></span>
                                Carousel
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
            <main className="sm:ml-64 h-[calc(100dvh-4rem)] overflow-y-scroll">
                <Outlet/>
            </main>
            <Toaster 
                containerStyle={{}}
                position="top-right"
                reverseOrder={false}
            />
        </>
    )
}

export default AdminLayout;