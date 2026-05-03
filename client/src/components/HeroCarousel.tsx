import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Carousel, CarouselSlide } from '@trio/shared/carousel';
import { api } from '../lib/axios';
import { mediaUrl } from '../lib/mediaUrl';
import { HeroSection } from './HeroSection';

async function fetchCarousel(): Promise<Carousel | null> {
    try {
        const { data } = await api.get('/api/carousel');
        return data as Carousel;
    } catch {
        return null;
    }
}

export function HeroCarousel() {
    const { data, isLoading } = useQuery({
        queryKey: ['carousel'],
        queryFn: fetchCarousel,
        staleTime: 60_000,
    });

    if (isLoading) {
        return <div className="h-screen w-full bg-black" />;
    }

    const visibleSlides = data?.slides.filter((s) => s.enabled) ?? [];

    if (!data || !data.enabled || visibleSlides.length === 0) {
        return <HeroSection />;
    }

    return <CarouselView carousel={{ ...data, slides: visibleSlides }} />;
}

function CarouselView({ carousel }: { carousel: Carousel }) {
    const slides = carousel.slides;
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const dragState = useRef<{ startX: number; dx: number } | null>(null);
    const [dragOffset, setDragOffset] = useState(0);

    const goTo = (next: number) => {
        if (slides.length === 0) return;
        const wrapped = ((next % slides.length) + slides.length) % slides.length;
        setIndex(wrapped);
    };

    const next = () => {
        if (!carousel.loop && index === slides.length - 1) return;
        goTo(index + 1);
    };
    const prev = () => {
        if (!carousel.loop && index === 0) return;
        goTo(index - 1);
    };

    useEffect(() => {
        if (!carousel.autoplay || paused || slides.length < 2) return;
        const slide = slides[index]!;
        const dur = slide.durationMs ?? carousel.defaultDurationMs;
        const t = setTimeout(() => next(), dur);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, paused, carousel.autoplay, carousel.defaultDurationMs, slides.length]);

    const onPointerDown = (e: React.PointerEvent) => {
        if (!carousel.swipe) return;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        dragState.current = { startX: e.clientX, dx: 0 };
        setPaused(true);
    };
    const onPointerMove = (e: React.PointerEvent) => {
        if (!dragState.current) return;
        const dx = e.clientX - dragState.current.startX;
        dragState.current.dx = dx;
        setDragOffset(dx);
    };
    const onPointerUp = () => {
        if (!dragState.current) return;
        const { dx } = dragState.current;
        dragState.current = null;
        setDragOffset(0);
        setPaused(false);
        if (Math.abs(dx) > 80) {
            if (dx < 0) next();
            else prev();
        }
    };

    const slide = slides[index]!;

    return (
        <section
            className="relative h-screen w-full select-none overflow-hidden bg-black"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <AnimatePresence mode={carousel.transition === 'FADE' ? 'wait' : 'sync'} initial={false}>
                <motion.div
                    key={slide.id}
                    initial={
                        carousel.transition === 'FADE' ? { opacity: 0 } : { opacity: 0, x: 60 }
                    }
                    animate={{
                        opacity: 1,
                        x: dragOffset,
                    }}
                    exit={
                        carousel.transition === 'FADE' ? { opacity: 0 } : { opacity: 0, x: -60 }
                    }
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                >
                    <SlideMedia slide={slide} />
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(to top, rgba(0,0,0,${slide.overlayOpacity / 100}) 0%, rgba(0,0,0,${slide.overlayOpacity / 200}) 60%, transparent 100%)`,
                        }}
                    />
                    <SlideContent slide={slide} />
                </motion.div>
            </AnimatePresence>

            {carousel.showArrows && slides.length > 1 && (
                <>
                    <button
                        type="button"
                        aria-label="Previous slide"
                        onClick={prev}
                        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-md transition hover:bg-black/60"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        type="button"
                        aria-label="Next slide"
                        onClick={next}
                        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-md transition hover:bg-black/60"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </>
            )}

            {carousel.showDots && slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                    {slides.map((s, i) => (
                        <button
                            key={s.id}
                            type="button"
                            aria-label={`Go to slide ${i + 1}`}
                            onClick={() => goTo(i)}
                            className={
                                i === index
                                    ? 'h-2 w-8 rounded-full bg-white transition'
                                    : 'h-2 w-2 rounded-full bg-white/50 transition hover:bg-white/80'
                            }
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

function SlideMedia({ slide }: { slide: CarouselSlide }) {
    const url = mediaUrl(slide.mediaUrl);
    if (slide.kind === 'VIDEO') {
        return (
            <video
                src={url}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
            />
        );
    }
    return <img src={url} alt={slide.headline ?? ''} className="h-full w-full object-cover" />;
}

function SlideContent({ slide }: { slide: CarouselSlide }) {
    if (!slide.headline && !slide.sub && !slide.ctaLabel) return null;
    const color = slide.textColor ?? '#ffffff';
    return (
        <div className="absolute inset-0 z-[1] flex items-center px-8 md:px-16 lg:px-24">
            <div className="max-w-2xl space-y-4" style={{ color }}>
                {slide.headline && (
                    <h2 className="font-heading text-4xl font-bold uppercase tracking-tight md:text-6xl lg:text-7xl">
                        {slide.headline}
                    </h2>
                )}
                {slide.sub && <p className="text-lg md:text-xl opacity-90">{slide.sub}</p>}
                {slide.ctaLabel && slide.ctaHref && (
                    <a
                        href={slide.ctaHref}
                        className="inline-block rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/90"
                    >
                        {slide.ctaLabel}
                    </a>
                )}
            </div>
        </div>
    );
}
