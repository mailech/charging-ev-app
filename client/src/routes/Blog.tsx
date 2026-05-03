import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowRight, Sparkles } from 'lucide-react';
import { listPublicPosts, mediaUrl } from '@/lib/blogApi';

export function Blog() {
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
        <section className="relative min-h-screen overflow-hidden bg-background pt-32 pb-20">
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />

            <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
                <header className="mb-12 space-y-4">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-secondary/50 px-3 py-1.5 backdrop-blur-md">
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                        <span className="text-xs font-sans uppercase tracking-widest text-textPrimary/80">
                            Insights
                        </span>
                    </span>
                    <h1 className="font-heading text-4xl font-bold leading-tight text-textPrimary md:text-5xl">
                        Stories from the{' '}
                        <span className="bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                            EV frontier.
                        </span>
                    </h1>
                </header>

                {query.isLoading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="aspect-[4/3] animate-pulse rounded-2xl bg-secondary/40"
                            />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <p className="rounded-2xl border border-white/10 bg-secondary/40 p-12 text-center text-textPrimary/60">
                        No posts published yet. Check back soon.
                    </p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {items.map((p) => (
                            <Link
                                key={p.id}
                                to={`/blog/${p.slug}`}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-secondary/40 transition hover:border-accent/40"
                            >
                                <div className="aspect-[4/3] overflow-hidden bg-secondary">
                                    {p.coverMedia ? (
                                        <img
                                            src={mediaUrl(p.coverMedia.url)}
                                            alt={p.coverMedia.alt ?? p.title}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="grid h-full place-items-center bg-gradient-to-br from-accent/10 to-secondary text-accent/40">
                                            <Sparkles className="h-12 w-12" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col gap-3 p-5">
                                    <div className="flex items-center gap-2 text-xs text-textPrimary/50">
                                        {p.category && (
                                            <>
                                                <span className="text-accent">
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
                                    <h2 className="font-heading text-xl font-semibold leading-snug text-textPrimary group-hover:text-accent">
                                        {p.title}
                                    </h2>
                                    {p.excerpt && (
                                        <p className="line-clamp-2 text-sm text-textPrimary/60">
                                            {p.excerpt}
                                        </p>
                                    )}
                                    <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-accent">
                                        Read post
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-textPrimary/80 transition hover:bg-secondary/60 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <span className="text-xs text-textPrimary/50">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-textPrimary/80 transition hover:bg-secondary/60 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
