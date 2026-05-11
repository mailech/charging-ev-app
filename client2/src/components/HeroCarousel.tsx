import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import type { Carousel, CarouselSlide } from '@trio/shared/carousel';
import { api } from '../lib/axios';
import { mediaUrl } from '../lib/mediaUrl';

async function fetchCarousel(): Promise<Carousel | null> {
    try {
        const { data } = await api.get('/api/carousel');
        return data as Carousel;
    } catch {
        return null;
    }
}

interface HeroCarouselProps {
    fallback: React.ReactNode;
}

export function HeroCarousel({ fallback }: HeroCarouselProps) {
    const { data, isLoading } = useQuery({
        queryKey: ['carousel'],
        queryFn: fetchCarousel,
        staleTime: 60_000,
    });

    if (isLoading) {
        return <>{fallback}</>;
    }

    const visibleSlides = data?.slides.filter((s) => s.enabled) ?? [];

    if (!data || !data.enabled || visibleSlides.length === 0) {
        return <>{fallback}</>;
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
            className="hero-carousel"
            style={{
                position: 'relative',
                width: '100%',
                minHeight: '100vh',
                userSelect: 'none',
                overflow: 'hidden',
                background: '#000',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <style>{`
                @media (max-width: 768px) {
                    .hero-carousel { min-height: 88vh !important; }
                    .hero-carousel-arrow { width: 36px !important; height: 36px !important; font-size: 22px !important; }
                    .hero-carousel-arrow-left { left: 8px !important; }
                    .hero-carousel-arrow-right { right: 8px !important; }
                    .hero-carousel-content { padding: 0 20px !important; }
                    .hero-carousel-content h2 { font-size: 2rem !important; line-height: 1.1 !important; }
                    .hero-carousel-content p { font-size: 0.98rem !important; margin-bottom: 18px !important; }
                    .hero-carousel-content a { padding: 12px 22px !important; font-size: 0.9rem !important; }
                    .hero-carousel-dots { bottom: 18px !important; }
                }
            `}</style>
            <AnimatePresence mode={carousel.transition === 'FADE' ? 'wait' : 'sync'} initial={false}>
                <motion.div
                    key={slide.id}
                    initial={
                        carousel.transition === 'FADE' ? { opacity: 0 } : { opacity: 0, x: 60 }
                    }
                    animate={{ opacity: 1, x: dragOffset }}
                    exit={
                        carousel.transition === 'FADE' ? { opacity: 0 } : { opacity: 0, x: -60 }
                    }
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: 'absolute', inset: 0 }}
                >
                    <SlideMedia slide={slide} />
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
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
                        className="hero-carousel-arrow hero-carousel-arrow-left"
                        style={arrowStyle('left')}
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        aria-label="Next slide"
                        onClick={next}
                        className="hero-carousel-arrow hero-carousel-arrow-right"
                        style={arrowStyle('right')}
                    >
                        ›
                    </button>
                </>
            )}

            {carousel.showDots && slides.length > 1 && (
                <div
                    className="hero-carousel-dots"
                    style={{
                        position: 'absolute',
                        bottom: 28,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: 8,
                        zIndex: 10,
                    }}
                >
                    {slides.map((s, i) => (
                        <button
                            key={s.id}
                            type="button"
                            aria-label={`Go to slide ${i + 1}`}
                            onClick={() => goTo(i)}
                            style={{
                                height: 8,
                                width: i === index ? 32 : 8,
                                borderRadius: 4,
                                border: 'none',
                                background:
                                    i === index ? '#ffffff' : 'rgba(255,255,255,0.5)',
                                cursor: 'pointer',
                                transition: 'all 200ms ease',
                                padding: 0,
                            }}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

function arrowStyle(side: 'left' | 'right'): React.CSSProperties {
    return {
        position: 'absolute',
        top: '50%',
        [side]: 16,
        transform: 'translateY(-50%)',
        zIndex: 10,
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.4)',
        border: 'none',
        color: '#ffffff',
        fontSize: 28,
        lineHeight: 1,
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
    };
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
                style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
        );
    }
    return (
        <img
            src={url}
            alt={slide.headline ?? ''}
            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
        />
    );
}

function SlideContent({ slide }: { slide: CarouselSlide }) {
    if (!slide.headline && !slide.sub && !slide.ctaLabel) return null;
    const color = slide.textColor ?? '#ffffff';
    return (
        <div
            className="hero-carousel-content"
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                padding: '0 clamp(32px, 6vw, 96px)',
            }}
        >
            <div style={{ maxWidth: 640, color }}>
                {slide.headline && (
                    <h2
                        style={{
                            fontSize: 'clamp(2.4rem, 5vw, 4.8rem)',
                            fontWeight: 700,
                            letterSpacing: '-0.03em',
                            textTransform: 'uppercase',
                            lineHeight: 1.05,
                            margin: 0,
                            marginBottom: 16,
                        }}
                    >
                        {slide.headline}
                    </h2>
                )}
                {slide.sub && (
                    <p
                        style={{
                            fontSize: '1.15rem',
                            opacity: 0.92,
                            lineHeight: 1.5,
                            margin: 0,
                            marginBottom: 24,
                            color,
                        }}
                    >
                        {slide.sub}
                    </p>
                )}
                {slide.ctaLabel && slide.ctaHref && (
                    <a
                        href={slide.ctaHref}
                        style={{
                            display: 'inline-block',
                            padding: '14px 28px',
                            borderRadius: 999,
                            background: '#ffffff',
                            color: '#000',
                            fontWeight: 600,
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            transition: 'background 200ms ease',
                        }}
                    >
                        {slide.ctaLabel}
                    </a>
                )}
            </div>
        </div>
    );
}
