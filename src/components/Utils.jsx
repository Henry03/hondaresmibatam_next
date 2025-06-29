'use client'

import Head from "next/head";
import Script from 'next/script';

export const convertToLocalDateTime = (isoTimestamp) => {
  const date = new Date(isoTimestamp);

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  //   timeZoneName: 'short'
  };

  return date.toLocaleString(undefined, options); 
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

export const formatDateWithTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta'
  });
};

export const toDatetimeLocal = (dateString) => {
  const date = new Date(dateString);

  const pad = (n) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Month is 0-based
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const overlay = async(selector) => {
  const element = document.querySelector(selector);

  if (!element) {
    console.warn(`Overlay with selector "${selector}" not found.`);
    return {
      open: () => {},
      close: () => {},
    };
  }

  const {default: HSOverlay} = await import('@preline/overlay');

  const instance = new HSOverlay(element);

  return {
    open: () => instance.open(),
    close: () => instance.close(),
  };
};

export const toRupiah = (value, withPrefix = true) => {
  const number = typeof value === 'string' ? parseFloat(value) : value;

  if (typeof number !== 'number' || isNaN(number)) return withPrefix ? 'Rp0' : '0';

  return `${withPrefix ? 'Rp ' : ''}${number
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

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

export const SeoHead = ({
  title = 'Honda Resmi Batam',
  description = 'Website resmi penjualan mobil Honda di Batam. Dapatkan promo dan layanan terbaik dari sales Honda terpercaya.',
  url = 'https://hondabatamresmi.com',
  image = 'https://hondabatamresmi.com/Honda_Logo.jpg',
  robots = 'index, follow',
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
    </Head>
  )
}

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
    <Script
      id="breadcrumb-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
    />
  )
}