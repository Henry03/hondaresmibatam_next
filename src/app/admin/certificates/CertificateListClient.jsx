'use client'

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MediaUploader from "@/components/MediaUploader";
import axiosInstance from "@/lib/axiosInstance";

export default function CertificateListClient () {
    const [errors, setErrors] = useState([]);
    const [mediaFiles, setMediaFiles] = useState([]);
    const getCertificatesList = () => {

        axiosInstance.get('/api/v1/certificates')
            .then(response => {
                setMediaFiles(response.data.data)
                toast.success(response.data.message)
            })
            .catch(error => {
                console.error(error);
                toast.error(error.response.data.message)
            })
    }

    const updateCertificates = () => {
        const formData = new FormData();

        mediaFiles.forEach((item) => {
            if(item.id){
                formData.append('mediaFiles[]', item.id);
            } else {
                formData.append('media', item.file);
            }
        });

        const toastId = toast.loading("Updating certificate...");

        axiosInstance.put(`/api/v1/certificates`, formData)
            .then(response => {
                toast.success(response.data.message, {
                    id: toastId
                })
                getCertificatesList();
            })
            .catch(error => {
                setErrors(error.response.data.errors);
                toast.error(error.response.data.message, {
                    id: toastId
                })
            })
        
    }

    useEffect(()=> {
        getCertificatesList();
    }, [])

    return (
        <div className="m-2 sm:m-5">
            <div className="flex justify-end">
                <button type="button" className="btn btn-primary" onClick={()=>updateCertificates()}>save</button>
            </div>
            <div className='mt-3'>
                <label className="label-text" htmlFor="mediaField"> Media (Image/Video) </label>
                <div className={`textarea ${errors?.media && "is-invalid"}`} id='mediaField'>
                    <MediaUploader files={mediaFiles} setFiles={setMediaFiles}/>
                </div>
                {
                    errors?.media &&
                    <span className="helper-text">{errors.media[0]}</span>
                }
            </div>
        </div>
    )
}