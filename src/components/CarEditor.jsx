'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import MediaUploader from './MediaUploader';
import toast from 'react-hot-toast';
import { redirect, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import axiosInstance from '@/lib/axiosInstance';
const TextEditor = dynamic(() => import('./TextEditor'), { ssr: false });

export default function CarEditor({ id, carData, tagData }) {
  const router = useRouter();

  const [headings, setHeadings] = useState([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState('');
  const [page, setPage] = useState('');
  const [variants, setVariants] = useState([{ id: '', name: '', price: 0 }]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [errors, setErrors] = useState([]);

  const mode = id ? 1 : 0;

    const getCarDetail = () => {
        axiosInstance.get(`/api/v1/cars/${id}`)
        .then(response => {
            setName(response.data.data.name)
            setDescription(response.data.data.description)
            setPage(response.data.data.page)
            setVariants(response.data.data.variants)
            setTags(response.data.data.tags)
            setSlug(response.data.data.slug);
            setMediaFiles(response.data.data.mediaFiles)
            const select = window.HSSelect.getInstance('#tagSelect');
            select.setValue(response.data.data.tags.map(t => t.id))
        })
        .catch(error => {
            console.error(error);
        })
    }

  const createCar = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('page', page);
    formData.append('slug', slug);
    tags.forEach((tag) => {
      formData.append('tags[]', tag.id);
    });
    variants.forEach((variant, index) => {
      formData.append(`variants[${index}][name]`, variant.name);
      formData.append(`variants[${index}][price]`, variant.price);
    });
    mediaFiles.forEach((item, index) => {
      formData.append('media', item.file);
      formData.append(`mediaIsCover[]`, item.isCover)
      formData.append(`mediaOrder[]`, index + 1)
    });

    const toastId = toast.loading('Creating new car...');

    axiosInstance.post('/api/v1/cars/create', formData)
      .then((response) => {
        toast.success(response.data.message, { id: toastId });
        router.push('/admin/cars');
      })
      .catch((error) => {
        setErrors(error.response?.data?.errors || {});
        toast.error(error.response?.data?.message || 'Error', { id: toastId });
      });
  };

  const updateCar = () => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('page', page);
    formData.append('slug', slug);
    tags.forEach((tag) => {
      formData.append('tags[]', tag.id);
    });
    variants.forEach((variant, index) => {
      if (variant.id) formData.append(`variants[${index}][id]`, variant.id);
      formData.append(`variants[${index}][name]`, variant.name);
      formData.append(`variants[${index}][price]`, variant.price);
    });
    mediaFiles.forEach((item, index) => {
      if (item.id) {
        formData.append(`mediaFiles[]`, item.id);
        formData.append(`mediaFilesIsCover[]`, item.isCover)
        formData.append(`mediaFilesOrder[]`, index + 1)
      } else {
        formData.append(`media`, item.file);
        formData.append(`mediaIsCover[]`, item.isCover)
        formData.append(`mediaOrder[]`, index + 1)
      }
    });

    const toastId = toast.loading('Updating car...');
    setErrors([]);

    axiosInstance.put('/api/v1/cars', formData)
      .then((response) => {
        toast.success(response.data.message, { id: toastId });
        getCarDetail();
      })
      .catch((error) => {
        setErrors(error.response?.data?.errors || {});
        toast.error(error.response?.data?.message || 'Error', { id: toastId });
      });
  };

  const handleVariantChange = (index, key, value) => {
    const updated = [...variants];
    updated[index][key] = key === 'price' ? Number(value) : value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([...variants, { name: '', price: 0 }]);
  };

  const deleteVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleTagChange = (e) => {
    const options = Array.from(e.target.selectedOptions);
    const values = options.map((option) => ({
      id: option.value,
    }));
    setTags(values);
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
  }, [headings]);

    useEffect(() => {
        import('flyonui/dist/index.js').then((module) => {
            if (window.HSStaticMethods?.autoInit) {
            window.HSStaticMethods.autoInit();
            }
        });
    }, []);

    useEffect(() => {
        if(carData){
            setName(carData.name);
            setSlug(carData.slug);
            setDescription(carData.description);
            setPage(carData.page);
            setVariants(carData.variants);
            setTags(carData.tags);
            setMediaFiles(carData.mediaFiles);
        }
    }, [carData]);

    useEffect(() => {
        if (!tagData) return;

        import('flyonui/dist/index.js').then(() => {
            if (window.HSSelect) {
            const select = window.HSSelect.getInstance('#tagSelect');

            if (select) {

                const options = tagData.map((item) => ({
                title: item.name,
                val: String(item.id),
                }));

                select.addOption(options);

                if (carData?.tags?.length) {
                    select?.setValue(carData.tags.map(t => t.id));
                }
            }
            }
        });
    }, [tagData, carData]);

    useEffect(() => {
        import('flyonui/dist/index.js');
    }, []);

  return (
    <div className='m-2 sm:m-5'>
        <div className='flex justify-between'>
            <div className='text-2xl font-semibold mb-3'>
            {
                mode == 0 ? 
                "Add Car"
                : "Edit Car"
            }
            </div>
            <div className='flex gap-3'>
            <button className="btn btn-text" onClick={() => redirect('/admin/cars')}>Back</button>
            <button className="btn btn-primary" onClick={mode == 0 ? createCar : updateCar}>Save</button>
            </div>
        </div>
        <div className="divider divider-neutral"></div>
            <div className='flex'>
            <div className="px-2 pt-4 w-md">
                <div className='mb-2'>Navigation</div>
                <div className="divider"></div>
                <ul className="menu space-y-0.5 p-0">
                {
                    headings.map((heading, index) =>
                    (
                        <li className="space-y-0.5" key={index}>
                        <div className="collapse-toggle collapse-open:bg-base-content/10" id={`menu-app-toggle-${index}`} data-collapse={`#menu-app-collapse-${index}`}>
                            <span></span>
                            <span>{heading.title}</span>
                            {
                            heading.children?.length > 0 && (
                                <span className="icon-[tabler--chevron-down] collapse-open:rotate-180 size-4 transition-all duration-300"></span>
                            )
                            }
                        </div>
                        {
                            heading.children?.length > 0 && (
                            <ul id={`menu-app-collapse-${index}`} className="collapse hidden w-auto space-y-0.5 overflow-hidden transition-[height] duration-300" aria-labelledby={`menu-app-toggle-${index}`}>
                                {
                                heading.children.map((child, childIdx) =>
                                    (
                                    <li key={childIdx}>
                                        <a href={`#${index+1}-${childIdx+1}`}>
                                        {child}
                                        </a>
                                    </li>
                                    ))
                                }
                            </ul>
                            )
                        }
                        </li>
                    )
                    )
                }
                </ul>
            </div>
            <div className="divider divider-horizontal divider-neutral mx-5"></div>
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
                <label className="label-text" htmlFor="slugInput">Slug</label>
                <input type="text" placeholder="Honda" className={`input ${errors?.slug && "is-invalid"}`} id="slugInput" value={slug} onChange={(e)=>setSlug(e.target.value)}/>
                {
                    errors?.slug &&
                    <span className="helper-text">{errors.slug[0]}</span>
                }
                </div>
                <div className="mb-2">
                <label className="label-text" htmlFor="tagSelect">Tags</label>
                <select
                    id='tagSelect'
                    onChange={handleTagChange}
                    multiple
                    value={tags.map(t => t.id)}
                    data-select='{
                    "placeholder": "Select option...",
                    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                    "toggleClasses": "advance-select-toggle select-disabled:pointer-events-none select-disabled:opacity-40",
                    "dropdownClasses": "advance-select-menu max-h-48 -ms-1 overflow-y-auto",
                    "optionClasses": "advance-select-option selected:select-active",
                    "mode": "tags",
                    "wrapperClasses": "advance-select-tag flex items-center space-x-2",
                    "tagsItemTemplate": " <div class=\"flex flex-nowrap items-center relative z-10 bg-base-100 border border-base-content/25 rounded-full ps-2 pe-1 px-5 m-1\"><div class=\"whitespace-nowrap text-base-content\" data-title></div> <div class=\"btn btn-sm min-h-0 size-5 btn-circle btn-soft btn-secondary ms-2 \" data-remove><span class=\"icon-[tabler--x] shrink-0 size-3.5\"></span></div> </div>",
                    "tagsInputClasses": "py-2.5 px-2 rounded-lg order-1 text-sm outline-none",
                    "optionTemplate": "<div class=\"flex items-center\"> <div class=\"size-8 me-2\" data-icon></div><div><div class=\"text-sm font-semibold text-base-content\" data-title></div> <div class=\"text-xs text-base-content/80\" data-description></div></div><div class=\"flex justify-between items-center flex-1\"><span data-title></span><span class=\"icon-[tabler--check] shrink-0 size-4 text-primary hidden selected:block \"></span></div> </div>",
                    "extraMarkup": "<span class=\"icon-[tabler--caret-up-down] shrink-0 size-4 text-base-content absolute top-1/2 end-3 -translate-y-1/2 \"></span>"
                    }'
                    className={`${errors?.tags && "is-invalid"}`}
                    aria-label="Advance select"
                >
                    <option value="">Choose</option>
                </select>
                {
                    errors?.tags &&
                    <span className="helper-text">{errors.tags[0]}</span>
                }
                </div>
                <div className="">
                <label className="label-text" htmlFor="descriptionInput"> Description </label>
                <textarea className={`textarea ${errors?.name && "is-invalid"}`} rows={6} placeholder="Hello!!!" id="descriptionInput" value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>
                {
                    errors?.description &&
                    <span className="helper-text">{errors.description[0]}</span>
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
            <div className="divider divider-neutral mx-5"></div>
            <div className='mt-3'>
              <label className="label-text" htmlFor="mediaField"> Media (Image/Video) </label>
              <div className={`textarea ${errors?.media && "is-invalid"}`} id='mediaField'>
                  <MediaUploader files={mediaFiles} setFiles={setMediaFiles} cover={true}/>
              </div>
              {
                  errors?.media &&
                  <span className="helper-text">{errors.media[0]}</span>
              }
            </div>
            <div className='mt-3'>
            <label className="label-text" htmlFor="variantField"> Variant </label>
            <div className={`textarea p-4 grid grid-cols-3 gap-2 ${errors && errors[`variants`] ? 'is-invalid' : ''}`} id='variantField'>
                {
                variants.map((variant, index) => (
                    <div key={index} className='rounded-lg w-full p-3 flex flex-col gap-2 relative textarea'>
                    {
                        variants.length > 1 && (
                        <button
                            type="button"
                            onClick={() => deleteVariant(index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            title="Delete Variant"
                        >
                            Delete
                        </button>
                        )
                    }
                    <div className="w-full">
                        <label className="label-text" htmlFor={`type-${index}`}>Type</label>
                        <input 
                        type="text" 
                        placeholder="HRV" 
                        className={`input ${errors && errors[`variants[${index}].name`] ? 'is-invalid' : ''}`}
                        id={`type-${index}`}
                        value={variant.name} 
                        onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                        />
                        {
                        errors && errors[`variants[${index}].name`] &&
                        <span className="helper-text">{errors && errors[`variants[${index}].name`][0]}</span>
                        }
                    </div>
                    <div className='w-full'>
                        <label className="label-text" htmlFor={`price-${index}`}>Price</label>
                        <div 
                        className={`input space-x-3 ${errors && errors[`variants[${index}].type`] ? 'is-invalid' : ''}`}
                        >
                        <span className="label-text my-auto">Rp</span>
                        <input 
                            type="number" 
                            className={`grow ${errors && errors[`variants[${index}].price`] ? 'is-invalid' : ''}`}
                            placeholder="0" 
                            id={`price-${index}`} 
                            value={variant.price}
                            onChange={(e) => handleVariantChange(index, 'price', e.target.value)}/>
                        <span className="label-text my-auto">IDR</span>
                        </div>
                        {
                        errors && errors[`variants[${index}].price`] &&
                        <span className="helper-text">{errors && errors[`variants[${index}].price`][0]}</span>
                        }
                    </div>
                    </div>
                ))
                }
                <button
                type="button"
                onClick={addVariant}
                className="border border-base-200 rounded-lg w-full p-3 flex flex-col gap-2 items-center justify-center hover:bg-base-100"
                >
                <span className="icon-[tabler--plus] size-10 text-neutral-400"></span>
                </button>
            </div>
            {
                errors && errors[`variants`] &&
                <span className="helper-text">{errors && errors[`variants`][0]}</span>
            }
            </div>
        </div>
    );
}