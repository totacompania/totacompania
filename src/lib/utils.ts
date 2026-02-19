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
    '&rsquo;': "\u2019",
    '&lsquo;': "\u2018",
    '&rdquo;': "\u201D",
    '&ldquo;': "\u201C",
    '&ndash;': '\u2013',
    '&mdash;': '\u2014',
    '&hellip;': '\u2026',
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
 * Check if a string looks like a MongoDB ObjectId (24-char hex)
 */
function isObjectId(str: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(str);
}

/**
 * Get the full URL for an image.
 * Handles: ObjectIds (media proxy), absolute URLs, relative upload paths.
 */
export function getImageUrl(path: string): string {
  if (!path) return '';

  // If it's a MongoDB ObjectId, use the media proxy route
  if (isObjectId(path)) {
    return '/media/' + path;
  }

  // If it's already an absolute URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Use CDN URL for uploads (OVH CDN hosts the actual files)
  const cdnUrl = 'https://tota.boris-henne.fr';

  // If path starts with /uploads, use CDN URL
  if (path.startsWith('/uploads/')) {
    return cdnUrl + path;
  }

  return path;
}
