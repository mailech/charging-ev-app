import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { renderTiptap } from '@trio/shared/blog-render';
import { getPublicPost, mediaUrl } from '@/lib/blogApi';

export function BlogPost() {
    const { slug } = useParams();
    const query = useQuery({
        queryKey: ['blog', 'public', 'post', slug],
        queryFn: () => getPublicPost(slug!),
        enabled: Boolean(slug),
        retry: false,
    });

    if (query.isLoading) {
        return (
            <section className="min-h-screen bg-background pt-32 text-textPrimary">
                <div className="mx-auto max-w-3xl px-6">
                    <div className="h-8 w-2/3 animate-pulse rounded bg-secondary/60" />
                    <div className="mt-4 h-4 w-1/3 animate-pulse rounded bg-secondary/60" />
                </div>
            </section>
        );
    }

    if (query.isError || !query.data) {
        return (
            <section className="grid min-h-screen place-items-center bg-background text-center text-textPrimary">
                <div className="space-y-4">
                    <p className="font-heading text-3xl font-bold">Post not found.</p>
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-accent hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to blog
                    </Link>
                </div>
            </section>
        );
    }

    const p = query.data;

    return (
        <article className="relative min-h-screen overflow-hidden bg-background pt-32 pb-24 text-textPrimary">
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />

            <div className="relative z-10 mx-auto max-w-3xl px-6">
                <Link
                    to="/blog"
                    className="inline-flex items-center gap-1.5 text-sm text-textPrimary/60 hover:text-accent"
                >
                    <ArrowLeft className="h-4 w-4" />
                    All posts
                </Link>

                <header className="mt-6 space-y-4">
                    <div className="flex items-center gap-3 text-xs text-textPrimary/60">
                        {p.category && (
                            <>
                                <span className="text-accent">{p.category.name}</span>
                                <span>·</span>
                            </>
                        )}
                        {p.publishedAt && (
                            <span>{format(new Date(p.publishedAt), 'd MMMM yyyy')}</span>
                        )}
                        <span>·</span>
                        <span>{p.readingMinutes} min read</span>
                    </div>
                    <h1 className="font-heading text-4xl font-bold leading-tight md:text-5xl">
                        {p.title}
                    </h1>
                    {p.excerpt && (
                        <p className="text-lg text-textPrimary/70">{p.excerpt}</p>
                    )}
                </header>

                {p.coverMedia && (
                    <img
                        src={mediaUrl(p.coverMedia.url)}
                        alt={p.coverMedia.alt ?? p.title}
                        className="mt-8 aspect-video w-full rounded-2xl object-cover"
                    />
                )}

                <div className="mt-10 space-y-5 text-base text-textPrimary/80 [&_a]:text-accent [&_blockquote]:text-textPrimary [&_h1]:text-textPrimary [&_h2]:text-textPrimary [&_h3]:text-textPrimary [&_strong]:text-textPrimary [&_code]:bg-secondary [&_code]:text-accent [&_pre]:bg-secondary/60">
                    {renderTiptap(p.content)}
                </div>

                {p.tags.length > 0 && (
                    <div className="mt-10 flex flex-wrap gap-2 border-t border-white/10 pt-6">
                        {p.tags.map((t) => (
                            <span
                                key={t.id}
                                className="rounded-full border border-white/10 bg-secondary/50 px-3 py-1 text-xs text-textPrimary/70"
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
