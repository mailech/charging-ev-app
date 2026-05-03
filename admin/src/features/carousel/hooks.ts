import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
    CarouselUpdateInput,
    SlideReorderInput,
    SlideUpsertInput,
} from '@trio/shared/carousel';
import * as api from './api';

export const carouselKeys = {
    all: () => ['carousel'] as const,
};

export function useCarouselQuery() {
    return useQuery({ queryKey: carouselKeys.all(), queryFn: api.getCarousel });
}

export function useUpdateCarouselMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: CarouselUpdateInput) => api.updateCarousel(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: carouselKeys.all() }),
    });
}

export function useAddSlideMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: SlideUpsertInput) => api.addSlide(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: carouselKeys.all() }),
    });
}

export function useUpdateSlideMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: SlideUpsertInput }) =>
            api.updateSlide(id, input),
        onSuccess: () => qc.invalidateQueries({ queryKey: carouselKeys.all() }),
    });
}

export function useDeleteSlideMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.deleteSlide(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: carouselKeys.all() }),
    });
}

export function useToggleSlideMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
            api.toggleSlide(id, enabled),
        onSuccess: () => qc.invalidateQueries({ queryKey: carouselKeys.all() }),
    });
}

export function useReorderSlidesMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: SlideReorderInput) => api.reorderSlides(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: carouselKeys.all() }),
    });
}
