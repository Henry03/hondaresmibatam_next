'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import ConfirmationModal from '@/components/ConfirmationModal'
import { convertToLocalDateTime, overlay, toRupiah } from '@/components/Utils'
import axiosInstance from '@/lib/axiosInstance'

export default function CarsListClient({
  initialData,
  initialMeta,
  initialParams
}) {
  const [data, setData] = useState(initialData)
  const [meta, setMeta] = useState(initialMeta)
  const [search, setSearch] = useState(initialParams.search)
  const [page, setPage] = useState(initialParams.page)
  const [pageSize, setPageSize] = useState(initialParams.pageSize)
  const [sortBy, setSortBy] = useState(initialParams.sortBy)
  const [sortOrder, setSortOrder] = useState(initialParams.sortOrder)

  const router = useRouter()

  // Re-fetch if params change
  useEffect(() => {
    getCarsList()
  }, [page, pageSize, search, sortBy, sortOrder])

  const getCarsList = async () => {
    try {
      const res = await axiosInstance.post('/api/v1/cars', {
        page,
        pageSize,
        search,
        sortBy,
        sortOrder
      })
      setData(res.data.data.data)
      setMeta(res.data.data.meta)
    } catch (e) {
      console.error(e)
      toast.error('Error loading data')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    getCarsList()
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className="p-4">
      {/* Render your table and controls here */}
      <h1 className="text-xl font-semibold mb-4">Cars</h1>
      <form onSubmit={handleSearch}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="input input-bordered"
        />
        <button type="submit" className="btn btn-primary ml-2">
          Search
        </button>
      </form>

      {/* Table */}
      <table className="table mt-4">
        <thead>
          <tr>
            <th>No.</th>
            <th onClick={() => handleSort('name')}>Name</th>
            <th>Slug</th>
            <th>Variants</th>
            <th>Price Range</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((car, i) => (
            <tr key={car.id}>
              <td>{(meta.page - 1) * meta.pageSize + i + 1}</td>
              <td>{car.name}</td>
              <td>{car.slug}</td>
              <td>{car.totalVariants}</td>
              <td>{toRupiah(car.minPrice)} - {toRupiah(car.maxPrice)}</td>
              <td>{convertToLocalDateTime(car.createdAt)}</td>
              <td>
                <Link href={`/admin/cars/edit/${car.id}`}>
                  <button className="btn btn-sm btn-primary">Edit</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
