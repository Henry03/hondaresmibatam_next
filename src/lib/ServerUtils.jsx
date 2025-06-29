import Head from "next/head";
import { safeFetch } from "./fetchData";
import axiosInstance from "./axiosInstance";

export const toRupiah = (value, withPrefix = true) => {
  const number = typeof value === 'string' ? parseFloat(value) : value;

  if (typeof number !== 'number' || isNaN(number)) return withPrefix ? 'Rp0' : '0';

  return `${withPrefix ? 'Rp ' : ''}${number
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

export const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta'
  });
};

export const BreadcrumbSchema = ({ items = [] }) => {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </Head>
  )
}

export const fetchItem = async (method, url, token = null, data = null) => {
  return await safeFetch(() =>
    axiosInstance({
      method,
      url,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      ...(data && { data })
    })
  );
};

export const getInitials = (name) => {
  if (!name) return '';

  const words = name.trim().split(/\s+/); 

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  return (words[0][0] + words[1][0]).toUpperCase();
}

export const getProfileBackground = (name) => {
  if (!name) return '#cccccc';

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const color = ((hash >> 0) & 0xFFFFFF).toString(16).padStart(6, '0');
  return `#${color}`;
}