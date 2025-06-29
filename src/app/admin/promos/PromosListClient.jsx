'use client'

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { convertToLocalDateTime, overlay } from "@/components/Utils";

import ConfirmationModal from "@/components/ConfirmationModal";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";

export default function PromosListClient () {
    const [data, setData] = useState([])
    const [meta, setMeta] = useState({})
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [errors, setErrors] = useState([]);
    const [id, setId] = useState('');
    const [mode, setMode] = useState(0);    // 0 for create, 1 for edit
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const start = (meta.page - 1) * meta.pageSize + 1;
    const end = Math.min(meta.page * meta.pageSize, meta.total);
    const pages = Array.from({ length: meta.totalPages }, (_, i) => i + 1);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    
    const getPromosList = () => {
        const input = {
            page,
            pageSize,
            search,
            sortBy,
            sortOrder
        }

        axiosInstance.post('/api/v1/promos', input)
            .then(response => {
                setData(response.data.data.data)
                setMeta(response.data.data.meta)
                toast.success(response.data.message)
            })
            .catch(error => {
                console.error(error);
                toast.error(error.response.data.message)
            })
    }

    const deletePromo = (e) => {
        const toastId = toast.loading("Deleting promo...");

        axiosInstance.delete(`/api/v1/promos/${id}`)
            .then(response => {
                toast.success(response.data.message, {
                    id: toastId
                })
                setId('');
                getPromosList();
                window.HSOverlay.close('#deletePromoModal');
            })
            .catch(error => {
                toast.error(error.response.data.message, {
                    id: toastId
                })
            })
    }

    const handleParams = (newParams) => {
        const current = new URLSearchParams(window.location.search);

        Object.entries(newParams).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") {
            current.delete(key);
            } else {
            current.set(key, value);
            }
        });

        const search = current.toString();
        const query = search ? `?${search}` : "";

        router.push(`${window.location.pathname}${query}`);
    };

    const openModal = (id, modalId) => {
        setId(id); 
        window.HSOverlay.open(modalId);
    }

    const clearInput = () => {
        setName('');
        setSlug('');
        setErrors([]);
    }

    const fillInput = (id, name, slug) => {
        setId(id);
        setName(name);
        setSlug(slug);
        setMode(1);
    }

    useEffect(()=> {
        getPromosList();
    }, [searchParams])

    useEffect(() => {
        import('flyonui/dist/index.js').then((module) => {
            if (window.HSStaticMethods?.autoInit) {
            window.HSStaticMethods.autoInit();
            }
        });
    }, []);

    return (
        <div className="m-2 sm:m-5">
            <div className="w-full">
                <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-2">
                        <form className="input max-w-xs" onSubmit={(e) => {
                            e.preventDefault();
                            handleParams({search})
                        }}>
                            <span className="icon-[tabler--search] text-base-content/80 my-auto me-3 size-5 shrink-0"></span>
                            <input type="search" className="grow" placeholder="Search" id="leadingIconDefault" value={search} onChange={(e) => setSearch(e.target.value)}/>
                        </form>
                        <select className="select w-fit appearance-none" aria-label="select" value={sortBy} onChange={(e) => handleParams({ sortBy: e.target.value })}>
                            <option value={'createdAt'}>Created At</option>
                            <option value={'endDate'}>EndDate</option>
                            <option value={'name'}>Name</option>
                            <option value={'slug'}>Slug</option>
                            <option value={'startDate'}>StartDate</option>
                        </select>
                        <label className="swap swap-rotate">
                            <input 
                                type="checkbox" 
                                checked={sortOrder === "desc"}
                                onChange={() => handleParams({ sortOrder: sortOrder === "desc" ? "asc" : "desc" })}
                            />
                            <span className="swap-on icon-[tabler--sort-ascending] size-6 text-base-300"></span>
                            <span className="swap-off icon-[tabler--sort-descending] size-6 text-base-300"></span>
                        </label>
                    </div>
                    <button type="button" className="btn btn-primary"><Link href={'/admin/promos/create'}>Create</Link></button>
                </div>

                <div className="mt-8 overflow-x-auto">
                    <table className="table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Cars</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.length > 0 ? data.map((item, index) => (
                                <tr key={item.id}>
                                    <th> {(meta.page - 1) * 10 + index + 1} </th>
                                    <td>{item.name}</td>
                                    <td>{item.slug}</td>
                                    <td>{convertToLocalDateTime(item.startDate)}</td>
                                    <td>{convertToLocalDateTime(item.endDate)}</td>
                                    <td className="flex gap-1">
                                        {
                                            !item?.isGlobal ?
                                            (
                                                item?.cars?.map(car => (
                                                    <span key={index + "_" + car.id} className="badge badge-outline badge-primary rounded-full">{car.name}</span>
                                                ))
                                            )
                                            : <span className="badge badge-outline badge-primary rounded-full">All Cars</span>
                                        }
                                    </td>
                                    <td>{convertToLocalDateTime(item.createdAt)}</td>
                                    <td>
                                        <Link className="btn btn-circle btn-text btn-sm" aria-label="Action button" href={`/admin/promos/edit/${item.id}`}><span className="icon-[tabler--pencil] size-5"></span></Link>
                                        <button className="btn btn-circle btn-text btn-sm" aria-label="Action button" onClick={()=>{openModal(item.id, '#deletePromoModal')}}><span className="icon-[tabler--trash] size-5"></span></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} className="text-center py-4 text-base-content/70">
                                        No data found.
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 py-4 pt-6">
                    <div className="me-2 max-w-sm text-sm text-base-content/80 sm:mb-0 flex gap-1">
                        Showing
                        <span className="font-semibold text-base-content/80">{start}</span>
                        to
                        <span className="font-semibold text-base-content/80">{end}</span>
                        of
                        <span className="font-semibold">{meta.total}</span>
                        tags
                    </div>

                    <nav className="join">
                        <button
                            type="button"
                            className="btn btn-soft btn-square join-item"
                            aria-label="previous button"
                            disabled={meta.page === 1}
                            onClick={() => handleParams({page: meta.page - 1})}
                        >
                        <span className="icon-[tabler--chevron-left] size-5 rtl:rotate-180"></span>
                        </button>

                        {pages.map((p) => (
                            <button
                                key={p}
                                type="button"
                                className={`btn btn-soft join-item btn-square ${
                                p === meta.page ? "btn-active" : ""
                                }`}
                                aria-current={p === meta.page ? "page" : undefined}
                                onClick={() => handleParams({page: p})}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            type="button"
                            className="btn btn-soft btn-square join-item"
                            aria-label="next button"
                            disabled={meta.page === meta.totalPages}
                            onClick={() => handleParams({page: meta.page + 1})}
                        >
                        <span className="icon-[tabler--chevron-right] size-5 rtl:rotate-180"></span>
                        </button>
                    </nav>
                    <select className="select w-fit appearance-none" aria-label="select" value={pageSize} onChange={(e) => handleParams({pageSize: e.target.value})}>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={'all'}>All</option>
                    </select>
                </div>
            </div>
            <ConfirmationModal 
                id={'deletePromoModal'}
                title={'Delete Promo'}
                description={'Are you sure want to delete this promo?'}
                onConfirm={deletePromo}
                btnType={'btn-primary'}
                btnText={'Delete'}
            />
        </div>
    )
}