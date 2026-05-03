import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8001',
    withCredentials: true,
    timeout: 15_000,
});

const CSRF_COOKIE = 'csrf_token';
const MUTATING_METHODS = new Set(['post', 'put', 'patch', 'delete']);

function readCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]!) : null;
}

// Token kept in memory so cross-origin CSRF works even when document.cookie can't
// read csrf_token (cookie is set on the API origin, page is on admin origin).
let csrfToken: string | null = null;

async function ensureCsrf(): Promise<void> {
    if (csrfToken) return;
    const fromCookie = readCookie(CSRF_COOKIE);
    if (fromCookie) {
        csrfToken = fromCookie;
        return;
    }
    try {
        const res = await axios.get(`${api.defaults.baseURL}/api/auth/csrf`, {
            withCredentials: true,
        });
        const data = res.data as { token?: string } | undefined;
        csrfToken = data?.token ?? readCookie(CSRF_COOKIE) ?? null;
    } catch {
        csrfToken = null;
    }
}

export function clearCsrfToken() {
    csrfToken = null;
}

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const method = (config.method ?? 'get').toLowerCase();
    if (MUTATING_METHODS.has(method)) {
        await ensureCsrf();
        if (csrfToken) {
            config.headers.set('x-csrf-token', csrfToken);
        }
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            csrfToken = null;
            const path = window.location.pathname;
            if (path !== '/login') {
                window.location.assign('/login');
            }
        }
        return Promise.reject(error);
    },
);
