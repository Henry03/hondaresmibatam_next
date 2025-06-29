'use client'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  return (
    <button
      className="btn btn-error"
      onClick={() => {
        Cookies.remove('token')
        router.push('/auth/login')
      }}
    >
      Sign out
    </button>
  )
}