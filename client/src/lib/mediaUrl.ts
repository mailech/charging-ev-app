export function mediaUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (/^https?:/.test(url) || url.startsWith('data:')) return url;
    const base = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
    return `${base}${url.startsWith('/') ? url : `/${url}`}`;
}
