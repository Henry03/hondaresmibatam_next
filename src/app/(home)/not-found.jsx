import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-base-100 text-base-content">
      <h1 className="text-6xl font-bold text-error">404</h1>
      <p className="text-xl mt-2">Oops! Page not found.</p>
      <p className="mt-1 text-base-content/70">The page you're looking for doesn't exist or has been moved.</p>
      <Link href={"/"} className="btn btn-primary mt-6">
        Go to Homepage
      </Link>
    </div>
  );
}
