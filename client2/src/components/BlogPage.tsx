import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { renderTiptap } from '@trio/shared/blog-render';
import { listPublicPosts, getPublicPost } from '../lib/blogApi';
import { mediaUrl } from '../lib/mediaUrl';

const ACCENT = '#00FF88';
const ACCENT_SOFT = '#00CC77';
const BG = '#0B0F0D';
const SURFACE = '#111715';
const CARD = '#151B18';
const BORDER = 'rgba(0,255,136,0.08)';
const BORDER_STRONG = 'rgba(0,255,136,0.18)';
const TEXT = '#F5F7F6';
const TEXT_DIM = '#8C948F';

export function BlogPage() {
    const [slug, setSlug] = useState<string | null>(null);

    if (slug) {
        return <BlogDetail slug={slug} onBack={() => setSlug(null)} />;
    }
    return <BlogList onOpen={(s) => setSlug(s)} />;
}

function BlogList({ onOpen }: { onOpen: (slug: string) => void }) {
    const [page, setPage] = useState(1);
    const query = useQuery({
        queryKey: ['blog', 'public', page],
        queryFn: () => listPublicPosts({ page }),
    });

    const items = query.data?.items ?? [];
    const total = query.data?.total ?? 0;
    const limit = query.data?.limit ?? 12;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return (
        <section style={{ background: BG, paddingTop: 120, paddingBottom: 100, minHeight: '80vh' }}>
            <div
                style={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    width: 500,
                    height: 500,
                    transform: 'translateX(-50%)',
                    borderRadius: '50%',
                    background: `${ACCENT_SOFT}22`,
                    filter: 'blur(140px)',
                }}
            />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
                <header style={{ marginBottom: 48 }}>
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '6px 12px',
                            background: 'rgba(0,255,136,0.08)',
                            border: `1px solid ${BORDER_STRONG}`,
                            borderRadius: 99,
                            marginBottom: 20,
                        }}
                    >
                        <span
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: ACCENT,
                                boxShadow: `0 0 10px ${ACCENT}`,
                            }}
                        />
                        <span
                            style={{
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                color: ACCENT,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                            }}
                        >
                            Insights
                        </span>
                    </div>
                    <h1
                        style={{
                            fontSize: 'clamp(2.4rem, 4.4vw, 3.6rem)',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            color: TEXT,
                            margin: 0,
                        }}
                    >
                        Stories from the <span style={{ color: ACCENT }}>EV frontier.</span>
                    </h1>
                </header>

                {query.isLoading ? (
                    <div
                        style={{
                            display: 'grid',
                            gap: 24,
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        }}
                    >
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    aspectRatio: '4 / 3',
                                    borderRadius: 16,
                                    background: SURFACE,
                                    opacity: 0.5,
                                }}
                            />
                        ))}
                    </div>
                ) : query.isError ? (
                    <div
                        style={{
                            border: `1px solid ${BORDER}`,
                            background: SURFACE,
                            borderRadius: 16,
                            padding: 48,
                            textAlign: 'center',
                            color: TEXT_DIM,
                        }}
                    >
                        Could not load posts. Please try again later.
                    </div>
                ) : items.length === 0 ? (
                    <div
                        style={{
                            border: `1px solid ${BORDER}`,
                            background: SURFACE,
                            borderRadius: 16,
                            padding: 48,
                            textAlign: 'center',
                            color: TEXT_DIM,
                        }}
                    >
                        No posts published yet. Check back soon.
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gap: 24,
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        }}
                    >
                        {items.map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => onOpen(p.slug)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden',
                                    borderRadius: 16,
                                    border: `1px solid ${BORDER}`,
                                    background: CARD,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    padding: 0,
                                    color: TEXT,
                                    transition: 'border-color 200ms, transform 200ms',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = BORDER_STRONG;
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = BORDER;
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div
                                    style={{
                                        aspectRatio: '4 / 3',
                                        overflow: 'hidden',
                                        background: SURFACE,
                                    }}
                                >
                                    {p.coverMedia ? (
                                        <img
                                            src={mediaUrl(p.coverMedia.url)}
                                            alt={p.coverMedia.alt ?? p.title}
                                            loading="lazy"
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                height: '100%',
                                                display: 'grid',
                                                placeItems: 'center',
                                                color: ACCENT,
                                                opacity: 0.4,
                                                fontSize: 32,
                                            }}
                                        >
                                            ⚡
                                        </div>
                                    )}
                                </div>
                                <div
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 12,
                                        padding: 20,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            fontSize: 11,
                                            color: TEXT_DIM,
                                        }}
                                    >
                                        {p.category && (
                                            <>
                                                <span style={{ color: ACCENT }}>
                                                    {p.category.name}
                                                </span>
                                                <span>·</span>
                                            </>
                                        )}
                                        {p.publishedAt && (
                                            <span>
                                                {format(new Date(p.publishedAt), 'd MMM yyyy')}
                                            </span>
                                        )}
                                        <span>·</span>
                                        <span>{p.readingMinutes} min read</span>
                                    </div>
                                    <h2
                                        style={{
                                            fontSize: '1.25rem',
                                            fontWeight: 600,
                                            lineHeight: 1.3,
                                            color: TEXT,
                                            margin: 0,
                                        }}
                                    >
                                        {p.title}
                                    </h2>
                                    {p.excerpt && (
                                        <p
                                            style={{
                                                fontSize: 14,
                                                color: TEXT_DIM,
                                                lineHeight: 1.5,
                                                margin: 0,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {p.excerpt}
                                        </p>
                                    )}
                                    <span
                                        style={{
                                            marginTop: 'auto',
                                            color: ACCENT,
                                            fontSize: 14,
                                            fontWeight: 500,
                                        }}
                                    >
                                        Read post →
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 12,
                            marginTop: 48,
                        }}
                    >
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            style={pagerBtnStyle(page <= 1)}
                        >
                            Previous
                        </button>
                        <span style={{ color: TEXT_DIM, fontSize: 13 }}>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            style={pagerBtnStyle(page >= totalPages)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

function pagerBtnStyle(disabled: boolean): React.CSSProperties {
    return {
        padding: '8px 18px',
        borderRadius: 999,
        border: `1px solid ${BORDER_STRONG}`,
        background: 'transparent',
        color: TEXT,
        fontSize: 12,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'background 150ms',
    };
}

function BlogDetail({ slug, onBack }: { slug: string; onBack: () => void }) {
    const query = useQuery({
        queryKey: ['blog', 'public', 'post', slug],
        queryFn: () => getPublicPost(slug),
        retry: false,
    });

    if (query.isLoading) {
        return (
            <section style={{ background: BG, paddingTop: 120, minHeight: '80vh', color: TEXT }}>
                <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 40px' }}>
                    <div
                        style={{
                            height: 32,
                            width: '60%',
                            background: SURFACE,
                            borderRadius: 6,
                            opacity: 0.5,
                        }}
                    />
                    <div
                        style={{
                            height: 18,
                            width: '30%',
                            marginTop: 16,
                            background: SURFACE,
                            borderRadius: 6,
                            opacity: 0.5,
                        }}
                    />
                </div>
            </section>
        );
    }

    if (query.isError || !query.data) {
        return (
            <section
                style={{
                    background: BG,
                    paddingTop: 120,
                    paddingBottom: 100,
                    minHeight: '80vh',
                    color: TEXT,
                    textAlign: 'center',
                }}
            >
                <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 40px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 24 }}>
                        Post not found.
                    </h1>
                    <button
                        type="button"
                        onClick={onBack}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: ACCENT,
                            fontSize: 14,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                        }}
                    >
                        ← Back to blog
                    </button>
                </div>
            </section>
        );
    }

    const p = query.data;

    return (
        <article
            style={{
                background: BG,
                paddingTop: 120,
                paddingBottom: 100,
                minHeight: '80vh',
                color: TEXT,
                position: 'relative',
            }}
        >
            <div
                style={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    width: 500,
                    height: 500,
                    transform: 'translateX(-50%)',
                    borderRadius: '50%',
                    background: `${ACCENT_SOFT}22`,
                    filter: 'blur(140px)',
                }}
            />

            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    maxWidth: 800,
                    margin: '0 auto',
                    padding: '0 40px',
                }}
            >
                <button
                    type="button"
                    onClick={onBack}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: TEXT_DIM,
                        fontSize: 13,
                        cursor: 'pointer',
                        padding: 0,
                        marginBottom: 24,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = TEXT_DIM)}
                >
                    ← All posts
                </button>

                <header style={{ marginBottom: 32 }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            fontSize: 12,
                            color: TEXT_DIM,
                            marginBottom: 16,
                        }}
                    >
                        {p.category && (
                            <>
                                <span style={{ color: ACCENT }}>{p.category.name}</span>
                                <span>·</span>
                            </>
                        )}
                        {p.publishedAt && (
                            <span>{format(new Date(p.publishedAt), 'd MMMM yyyy')}</span>
                        )}
                        <span>·</span>
                        <span>{p.readingMinutes} min read</span>
                    </div>
                    <h1
                        style={{
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            fontWeight: 800,
                            lineHeight: 1.15,
                            margin: 0,
                            marginBottom: 16,
                        }}
                    >
                        {p.title}
                    </h1>
                    {p.excerpt && (
                        <p style={{ fontSize: '1.1rem', color: TEXT_DIM, lineHeight: 1.6, margin: 0 }}>
                            {p.excerpt}
                        </p>
                    )}
                </header>

                {p.coverMedia && (
                    <img
                        src={mediaUrl(p.coverMedia.url)}
                        alt={p.coverMedia.alt ?? p.title}
                        style={{
                            display: 'block',
                            width: '100%',
                            aspectRatio: '16 / 9',
                            objectFit: 'cover',
                            borderRadius: 16,
                            marginBottom: 32,
                        }}
                    />
                )}

                <div className="blog-content" style={{ fontSize: '1rem', lineHeight: 1.7, color: TEXT }}>
                    {renderTiptap(p.content)}
                </div>

                {p.tags.length > 0 && (
                    <div
                        style={{
                            marginTop: 40,
                            paddingTop: 24,
                            borderTop: `1px solid ${BORDER}`,
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 8,
                        }}
                    >
                        {p.tags.map((t) => (
                            <span
                                key={t.id}
                                style={{
                                    padding: '4px 12px',
                                    borderRadius: 999,
                                    border: `1px solid ${BORDER}`,
                                    background: SURFACE,
                                    fontSize: 12,
                                    color: TEXT_DIM,
                                }}
                            >
                                #{t.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
}
