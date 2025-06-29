'use client';

import { useEffect, useLayoutEffect, useState } from 'react'
import TextEditor from '@/components/TextEditor';
import axios from 'axios';
import MediaUploader from '@/components/MediaUploader';
import toast from 'react-hot-toast';
import { toDatetimeLocal } from '@/components/Utils';
import { redirect, useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';

export default function PromoEditor({ id, promoData, carData}) {
  const [headings, setHeadings] = useState([])
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [cars, setCars] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [allCars, setAllCars] = useState(false);

  const router = useRouter();

  const [errors, setErrors] = useState([]);

  const [mode, setMode] = useState(id ? 1 : 0); // 0 = create, 1 = update

  const getPromoDetail = () => {
    axiosInstance.get(`/api/v1/promos/${id}`)
      .then(response => {
        setName(response.data.data.name)
        setStartDate(toDatetimeLocal(response.data.data.startDate))
        setEndDate(toDatetimeLocal(response.data.data.endDate))
        setPage(response.data.data.page)
        setCars(response.data.data.cars)
        setSlug(response.data.data.slug);
        setAllCars(response.data.data.isGlobal)
        setMediaFiles([
          {
            id: response.data.data.id,
            url: response.data.data.mediaUrl,
            type: response.data.data.mediaType,
          }
        ])
        const select = window.HSSelect.getInstance('#carSelect');
        select?.setValue(response.data.data.cars.map(t => t.id))
      })
      .catch(error => {
        console.error(error);
      })
  }

  const createPromo = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('isGlobal', allCars);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('page', page);
    formData.append('slug', slug);

    cars.forEach((car) => {
      formData.append('cars[]', car.id);
    });

    mediaFiles.forEach((item) => {
      formData.append('media', item.file);
    });

    const toastId = toast.loading("Creating new promo page...");

    axiosInstance.post('/api/v1/promos/create', formData)
      .then(response => {
        toast.success(response.data.message, {
          id: toastId,
        })
        router.push('/admin/promos');
      })
      .catch(error => {
        setErrors(error.response.data.errors)
        toast.error(error.response.data.message, {
          id: toastId
        })
      })
  }

  const updatePromo = () => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('isGlobal', allCars);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('page', page);
    formData.append('slug', slug);

    cars.forEach((car) => {
      formData.append('cars[]', car.id);
    });

    mediaFiles.forEach((item) => {
      if(item.id){
        formData.append('mediaFiles[]', item.id);
      } else {
        formData.append('media', item.file);
      }
    });

    const toastId = toast.loading("Updating promo page...");
    setErrors([])

    axiosInstance.put('/api/v1/promos', formData)
      .then(response => {
        getPromoDetail();
        toast.success(response.data.message, {
          id: toastId,
        })
      })
      .catch(error => {
        setErrors(error.response.data.errors)
        toast.error(error.response.data.message, {
          id: toastId
        })
      })
  }

  const handleCarChange = (e) => {
    const options = Array.from(e.target.selectedOptions);
    const values = options.map((option) => ({
      id: option.value,
    }));
    setCars(values);
  };

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(page, 'text/html');
    const elements = Array.from(doc.body.querySelectorAll('h2, h3'));

    const structuredHeadings = [];
    let currentH2 = null;

    elements.forEach(el => {
      if (el.tagName === 'H2') {
        currentH2 = {
          title: el.textContent.trim(),
          children: []
        };
        structuredHeadings.push(currentH2);
      } else if (el.tagName === 'H3' && currentH2) {
        currentH2.children.push(el.textContent.trim());
      }
    });

    setHeadings(structuredHeadings);
  }, [page]);

  useLayoutEffect(() => {
    if (headings.length === 0) return;

    const timeout = setTimeout(() => {
      if (window.HSStaticMethods?.autoInit) {
        window.HSStaticMethods.autoInit();
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [headings, carData]);

  useEffect(() => {
    import('flyonui/dist/index.js').then((module) => {
        if (window.HSStaticMethods?.autoInit) {
        window.HSStaticMethods.autoInit();
        }
    });
  }, []);

  useEffect(() => {
    if(promoData){
      setName(promoData.name)
      setStartDate(toDatetimeLocal(promoData.startDate))
      setEndDate(toDatetimeLocal(promoData.endDate))
      setPage(promoData.page)
      setCars(promoData.cars)
      setSlug(promoData.slug);
      setAllCars(promoData.isGlobal)
      setMediaFiles([
        {
            id: promoData.id,
            url: promoData.mediaUrl,
            type: promoData.mediaType,
        }
      ])
    }
  }, [promoData]);
  
  useEffect(() => {
    if(!carData) return;
    
    import('flyonui/dist/index.js').then(() => {
      if (window.HSSelect) {
        const select = window.HSSelect.getInstance('#carSelect');
        
        if (select) {
          const options = carData.map(item => ({
            title: item.name,
            val: String(item.id)
          }))
          select.addOption(options)

          if(promoData?.cars?.length > 0){
            select.setValue(promoData.cars.map(t => t.id))
          }
        }
      }
    });
  }, [carData, promoData])

  return (
    <div className='m-2 sm:m-5'>
      <div className='flex justify-between'>
        <div className='text-2xl font-semibold mb-3'>
          {
            mode == 0 ? 'Add Promo' : 'Edit Promo'
          }
        </div>
        <div className='flex gap-3'>
          <button className="btn btn-text" onClick={() => redirect('/admin/promos')}>Back</button>
          <button className="btn btn-primary" onClick={mode == 0 ? createPromo : updatePromo}>Save</button>
        </div>
      </div>
      <div className="divider divider-neutral"></div>
        <div className='flex'>
          <div className='w-full mb-3'>
            <div className="mb-2">
              <label className="label-text" htmlFor="nameInput">Name</label>
              <input type="text" placeholder="Honda" className={`input ${errors?.name && "is-invalid"}`} id="nameInput" value={name} onChange={(e)=>setName(e.target.value)}/>
              
              {
                errors?.name &&
                <span className="helper-text">{errors.name[0]}</span>
              }
            </div>
            <div className="mb-2">
              <div className='w-full'>
                <label className="label-text" htmlFor="carSelect">Cars</label>
                <div className='flex gap-2 w-full'>
                  <div className='flex-1'>
                    <div className='flex gap-4'>
                      <select
                        id='carSelect'
                        onChange={handleCarChange}
                        multiple
                        value={cars.map(t => t.id)}
                        data-select='{
                        "disabled": true,
                        "placeholder": "Select option...",
                        "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                        "toggleClasses": "advance-select-toggle select-disabled:pointer-events-none select-disabled:opacity-40",
                        "dropdownClasses": "advance-select-menu max-h-48 -ms-1 overflow-y-auto",
                        "optionClasses": "advance-select-option selected:select-active",
                        "mode": "tags",
                        "wrapperClasses": "advance-select-tag flex flex-wrap items-center space-x-2",
                        "tagsItemTemplate": " <div class=\"flex flex-nowrap items-center relative z-10 bg-base-100 border border-base-content/25 rounded-full ps-2 pe-1 px-5 m-1\"><div class=\"whitespace-nowrap text-base-content\" data-title></div> <div class=\"btn btn-sm min-h-0 size-5 btn-circle btn-soft btn-secondary ms-2 \" data-remove><span class=\"icon-[tabler--x] shrink-0 size-3.5\"></span></div> </div>",
                        "tagsInputClasses": "py-2.5 px-2 rounded-lg order-1 text-sm outline-none",
                        "optionTemplate": "<div class=\"flex items-center\"> <div class=\"size-8 me-2\" data-icon></div><div><div class=\"text-sm font-semibold text-base-content\" data-title></div> <div class=\"text-xs text-base-content/80\" data-description></div></div><div class=\"flex justify-between items-center flex-1\"><span data-title></span><span class=\"icon-[tabler--check] shrink-0 size-4 text-primary hidden selected:block \"></span></div> </div>",
                        "extraMarkup": "<span class=\"icon-[tabler--caret-up-down] shrink-0 size-4 text-base-content absolute top-1/2 end-3 -translate-y-1/2 \"></span>"
                        }'
                        className={`w-full ${errors?.cars && "is-invalid"}`}
                        aria-label="Advance select"
                        
                      >
                        <option value="">Choose</option>
                      </select>
                      <div className="flex items-center gap-1">
                        <input type="checkbox" className="switch switch-outline switch-primary" id="allCarsSwitch"  checked={allCars} onChange={(e)=>setAllCars(e.target.checked)}/>
                        <label className="label-text text-base whitespace-nowrap" htmlFor="allCarsSwitch"> All cars </label>
                      </div>
                    </div>
                    {
                      errors?.cars &&
                      <span className="helper-text">{errors.cars[0]}</span>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-2">
              <label className="label-text" htmlFor="slugInput">Slug</label>
              <input type="text" placeholder="Honda" className={`input ${errors?.slug && "is-invalid"}`} id="slugInput" value={slug} onChange={(e)=>setSlug(e.target.value)}/>
              {
                errors?.slug &&
                <span className="helper-text">{errors.slug[0]}</span>
              }
            </div>
            <div className='grid grid-cols-2 gap-2 w-full'>
              <div className="w-full">
                <label className="label-text" htmlFor="startDateInput"> Start Date </label>
                <input type="datetime-local" className={`input ${errors?.startDate && "is-invalid"}`} placeholder="YYYY-MM-DD HH:MM" id="startDateInput" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                {
                  errors?.startDate &&
                  <span className="helper-text">{errors.startDate[0]}</span>
                }
              </div>
              <div className="w-full">
                <label className="label-text" htmlFor="endDateInput"> End Date </label>
                <input type="datetime-local" className={`input ${errors?.endDate && "is-invalid"}`} placeholder="YYYY-MM-DD HH:MM" id="endDateInput" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                {
                  errors?.endDate &&
                  <span className="helper-text">{errors.endDate[0]}</span>
                }
              </div>
            </div>
            <div className='mt-3'>
              <label className="label-text" htmlFor="mediaField"> Media (Image/Video) </label>
              <div className={`textarea ${errors?.media && "is-invalid"}`} id='mediaField'>
                <MediaUploader files={mediaFiles} setFiles={setMediaFiles} multiple={false}/>
              </div>
              {
                errors?.media &&
                <span className="helper-text">{errors.media[0]}</span>
              }
            </div>
            <div className=''>
              <label className="label-text" htmlFor="pageInput"> Page </label>
              <div className={`textarea ${errors?.page && "is-invalid"}`} id='pageInput'>
                <TextEditor setHtml={setPage} html={page}/>
              </div>
              {
                errors?.page &&
                <span className="helper-text">{errors.page[0]}</span>
              }
            </div>
          </div>
        </div>
      <script src='/node_modules/lodash/lodash.js'></script>
    </div>
  )
}
