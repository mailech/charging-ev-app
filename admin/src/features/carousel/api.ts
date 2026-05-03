import type {
    Carousel,
    CarouselSlide,
    CarouselUpdateInput,
    SlideReorderInput,
    SlideUpsertInput,
} from '@trio/shared/carousel';
import { api } from '@/lib/axios';

export async function getCarousel(): Promise<Carousel> {
    const { data } = await api.get('/api/admin/carousel');
    return data;
}

export async function updateCarousel(input: CarouselUpdateInput): Promise<Carousel> {
    const { data } = await api.patch('/api/admin/carousel', input);
    return data;
}

export async function addSlide(input: SlideUpsertInput): Promise<CarouselSlide> {
    const { data } = await api.post('/api/admin/carousel/slides', input);
    return data;
}

export async function updateSlide(id: string, input: SlideUpsertInput): Promise<CarouselSlide> {
    const { data } = await api.patch(`/api/admin/carousel/slides/${id}`, input);
    return data;
}

export async function deleteSlide(id: string): Promise<void> {
    await api.delete(`/api/admin/carousel/slides/${id}`);
}

export async function toggleSlide(id: string, enabled: boolean): Promise<CarouselSlide> {
    const { data } = await api.patch(`/api/admin/carousel/slides/${id}/toggle`, { enabled });
    return data;
}

export async function reorderSlides(input: SlideReorderInput): Promise<Carousel> {
    const { data } = await api.post('/api/admin/carousel/slides/reorder', input);
    return data;
}

export async function uploadVideoFile(
    file: File,
    onProgress?: (pct: number) => void,
): Promise<{ url: string }> {
    const fd = new FormData();
    fd.append('file', file);
    const { data } = await api.post('/api/admin/media/upload', fd, {
        timeout: 5 * 60 * 1000,
        onUploadProgress: (evt) => {
            if (!onProgress || !evt.total) return;
            onProgress(Math.round((evt.loaded / evt.total) * 100));
        },
    });
    return { url: data.url as string };
}
