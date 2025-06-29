'use client'

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { convertToLocalDateTime, overlay } from "@/components/Utils";
import ConfirmationModal from "@/components/ConfirmationModal";
import MediaUploader from "@/components/MediaUploader";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

export default function CommentListClient () {
    const [data, setData] = useState([])
    const [meta, setMeta] = useState({})
    const [name, setName] = useState('');
    const [carId, setCarId] = useState('');
    const [message, setMessage] = useState('');
    const [carData, setCarData] = useState([]);

    const [errors, setErrors] = useState([]);
    const [id, setId] = useState('');
    const [mode, setMode] = useState(0);    // 1 for create, 2 for edit
    const searchParams = useSearchParams();
    const router = useRouter();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [mediaFiles, setMediaFiles] = useState([]);
    const start = (meta.page - 1) * meta.pageSize + 1;
    const end = Math.min(meta.page * meta.pageSize, meta.total);
    const pages = Array.from({ length: meta.totalPages }, (_, i) => i + 1);

    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = searchParams.get("pageSize") || 10;
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    
    const getCommentsList = () => {
        const input = {
            page,
            pageSize,
            search,
            sortBy,
            sortOrder
        }

        axiosInstance.post('/api/v1/comments', input)
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

    const getAllCars = () => {
        axiosInstance.get('/api/v1/cars')
        .then(response => {
            setCarData(response.data.data);
        })
        .catch(error => {
            console.error(error);
        })
    }

    const createComment = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('name', name);
        formData.append('carId', carId);
        formData.append('message', message);

        mediaFiles.forEach((item) => {
            formData.append('media', item.file);
        });

        const toastId = toast.loading("Creating new comment...");

        axiosInstance.post('/api/v1/comments/create', formData)
            .then(response => {
                toast.success(response.data.message, {
                    id: toastId
                })
                clearInput();
                getCommentsList();
                new HSOverlay(document.querySelector('#commentModal')).close();
            })
            .catch(error => {
                setErrors(error.response.data.errors);
                toast.error(error.response.data.message, {
                    id: toastId
                })
            })
    }

    const updateComment = () => {
        const formData = new FormData();

        formData.append('id', id);
        formData.append('name', name);
        formData.append('carId', carId);
        formData.append('message', message);

        mediaFiles.forEach((item) => {
            if(item.id){
                formData.append('mediaFiles[]', item.id);
            } else {
                formData.append('media', item.file);
            }
        });

        const toastId = toast.loading("Updating tag...");

        axiosInstance.put(`/api/v1/comments`, formData)
            .then(response => {
                toast.success(response.data.message, {
                    id: toastId
                })
                clearInput();
                getCommentsList();
                HSOverlay.close('#commentModal');
            })
            .catch(error => {
                setErrors(error.response.data.errors);
                toast.error(error.response.data.message, {
                    id: toastId
                })
            })
        
    }

    const deleteComment = (e) => {
        const toastId = toast.loading("Deleting comment...");

        axiosInstance.delete(`/api/v1/comments/${id}`)
            .then(response => {
                toast.success(response.data.message, {
                    id: toastId
                })
                setId('');
                getCommentsList();
                window.HSOverlay.close('#deleteCommentModal');
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

    const clearInput = () => {
        setName('');
        setMessage('');
        setCarId('')
        setMediaFiles([])
        setErrors([]);
    }

    const fillInput = (id, name, message, carId, imageUrl) => {

        setId(id);
        setName(name);
        setMessage(message);
        setCarId(carId);
        setMediaFiles([
            {
                id: id,
                url: imageUrl,
                type: 'IMAGE',
            }
        ])
        setMode(2);
    }

    const openModal = (modalId) => {
        window.HSOverlay.open(modalId);
    }

    const handleOpenModal = () => {
        setMode(1); 
        clearInput(); 
        HSOverlay.open('#commentModal')
    }

    useEffect(()=> {
        getCommentsList();
    }, [searchParams])

    useEffect(() => {
        getAllCars();
    }, [mode])

    useEffect(() => {
        import('flyonui/dist/index.js').then(() => {
            if (window.HSOverlay?.autoInit) {
            window.HSOverlay.autoInit();
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
                            <option value={'name'}>Name</option>
                            <option value={'car'}>Car</option>
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
                    <button type="button" className="btn btn-primary" onClick={()=> handleOpenModal()}>Create</button>
                </div>

                <div className="mt-8 overflow-x-auto">
                    <table className="table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Car</th>
                            <th>Comment</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item, index) => (
                                <tr key={item.id}>
                                    <th> {(meta.page - 1) * 10 + index + 1} </th>
                                    <td><img loading='lazy' src={item.imageUrl} className="object-cover h-40" /></td>
                                    <td>{item.name}</td>
                                    <td><span className="badge badge-outline badge-primary rounded-full">{item.car.name}</span></td>
                                    <td>
                                        <div className="max-h-24 overflow-auto whitespace-pre-wrap">
                                            {item.message}
                                        </div>
                                    </td>
                                    <td>{convertToLocalDateTime(item.createdAt)}</td>
                                    <td>
                                        <button className="btn btn-circle btn-text btn-sm" aria-label="Action button" onClick={()=>{fillInput(item.id, item.name, item.message, item.car.id, item.imageUrl); openModal('#commentModal')}}><span className="icon-[tabler--pencil] size-5"></span></button>
                                        <button className="btn btn-circle btn-text btn-sm" aria-label="Action button" onClick={()=>{setId(item.id), openModal('#deleteCommentModal')}}><span className="icon-[tabler--trash] size-5"></span></button>
                                    </td>
                                </tr>
                            ))
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
            <div id="commentModal" className="overlay modal modal-middle overlay-open:opacity-100 hidden" role="dialog" tabIndex="-1">
                <div className="modal-dialog overlay-open:opacity-100">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title">
                        {
                            mode === 1 ? "Add Comment" : "Update Comment"
                        }
                        </h3>
                        <button type="button" className="btn btn-text btn-circle btn-sm absolute end-3 top-3" aria-label="Close" data-overlay="#commentModal"><span className="icon-[tabler--x] size-4" onClick={clearInput}></span></button>
                    </div>
                    <form onSubmit={
                        (e) =>{
                              e.preventDefault();
                            if (mode === 1) {
                                createComment(e);
                            } else {
                                updateComment();
                            }
                        }
                    }>
                        <div className="modal-body pt-0">
                            <div className="">
                                <label className="label-text" htmlFor="tagNameField">Name</label>
                                <input type="text" placeholder="Electric" className={`input ${errors?.name && "is-invalid"}`} id="tagNameField" value={name} onChange={(e) => setName(e.target.value)} />
                                {
                                    errors?.name &&
                                    <span className="helper-text">{errors.name[0]}</span>
                                }
                            </div>
                            <div className="">
                                <label className="label-text" htmlFor="carSelect"> Cars </label>
                                <select className={`input ${errors?.carId && "is-invalid"}`} id="carSelect" value={carId} onChange={(e) => setCarId(e.target.value)}>
                                    <option selected disabled value={''}>Select Cars</option>
                                    {
                                        carData.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))
                                    }
                                </select>
                                {
                                    errors?.carId &&
                                    <span className="helper-text">{errors.carId[0]}</span>
                                }
                            </div>
                            <div className="">
                                <label className="label-text" htmlFor="tagSlugField">Message</label>
                                <textarea type="text" placeholder="electric" className={`textarea ${errors?.message && "is-invalid"}`} id="tagSlugField" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                                {
                                    errors?.message &&
                                    <span className="helper-text">{errors.message[0]}</span>
                                }
                            </div>
                            <div className=''>
                                <label className="label-text" htmlFor="mediaField"> Media (Image/Video) </label>
                                <div className={`textarea ${errors?.media && "is-invalid"}`} id='mediaField'>
                                <MediaUploader files={mediaFiles} setFiles={setMediaFiles} multiple={false}/>
                                </div>
                                {
                                    errors?.media &&
                                    <span className="helper-text">{errors.media[0]}</span>
                                }
                            </div>
                        </div>
                        <div className="modal-footer">
                        <button type="button" className="btn btn-soft btn-secondary" data-overlay="#commentModal" onClick={clearInput}>Close</button>
                        <button type="submit" className="btn btn-primary">{mode === 0 ? "Create" : "Save changes"}</button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
            <ConfirmationModal 
                id={'deleteCommentModal'}
                title={'Delete comment'}
                description={'Are you sure want to delete this comment?'}
                onConfirm={deleteComment}
                btnType={'btn-primary'}
                btnText={'Delete'}
            />
        </div>
    )
}