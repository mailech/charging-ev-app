import { api } from './axios';

let lastSent: { path: string; at: number } | null = null;
const DEDUPE_MS = 1500;

export function trackPageView(path: string) {
    const now = Date.now();
    if (lastSent && lastSent.path === path && now - lastSent.at < DEDUPE_MS) return;
    lastSent = { path, at: now };
    api.post(
        '/api/track',
        { path, referrer: document.referrer || null },
        { withCredentials: false },
    ).catch(() => {
        /* fire-and-forget */
    });
}
