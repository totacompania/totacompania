import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', options || {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function decodeHtmlEntities(text: string): string {
  if (!text) return '';

  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&apos;': "'",
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"',
    '&ndash;': '–',
    '&mdash;': '—',
    '&hellip;': '…',
    '&nbsp;': ' ',
  };

  let result = text;
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replace(new RegExp(entity, 'g'), char);
  }

  result = result.replace(/&#(\d+);/g, (_, code) => {
    return String.fromCharCode(parseInt(code, 10));
  });

  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => {
    return String.fromCharCode(parseInt(code, 16));
  });

  return result;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return "https://www.youtube-nocookie.com/embed/" + match[1];
    }
  }
  return null;
}

/**
 * Get the full URL for an image, using CDN if configured
 * @param path - The image path (e.g., '/uploads/2024/08/image.png')
 * @returns The full URL with CDN prefix if available
 */
export function getImageUrl(path: string): string {
  if (!path) return '';
  
  // If it's already an absolute URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "https://cdn.totacompania.fr";
  
  // If CDN is configured and path starts with /uploads, use CDN
  if (cdnUrl && path.startsWith('/uploads/')) {
    // Remove /uploads prefix as CDN root is the uploads folder
    const relativePath = path.replace('/uploads/', '/');
    return cdnUrl + relativePath;
  }
  
  return path;
}
