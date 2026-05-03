import React from 'react';

interface Mark {
    type: string;
    attrs?: Record<string, unknown>;
}

interface JsonNode {
    type: string;
    attrs?: Record<string, unknown>;
    content?: JsonNode[];
    marks?: Mark[];
    text?: string;
}

const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

function applyMarks(text: string, marks: Mark[] | undefined, key: number): React.ReactNode {
    if (!marks || marks.length === 0) return text;
    return marks.reduce<React.ReactNode>((acc, mark, i) => {
        switch (mark.type) {
            case 'bold':
                return React.createElement('strong', { key: `b${i}` }, acc);
            case 'italic':
                return React.createElement('em', { key: `i${i}` }, acc);
            case 'underline':
                return React.createElement('u', { key: `u${i}` }, acc);
            case 'strike':
                return React.createElement('s', { key: `s${i}` }, acc);
            case 'code':
                return React.createElement(
                    'code',
                    {
                        key: `c${i}`,
                        className: 'rounded bg-slate-800/60 px-1.5 py-0.5 text-[0.92em]',
                    },
                    acc,
                );
            case 'highlight':
                return React.createElement(
                    'mark',
                    { key: `h${i}`, className: 'rounded bg-yellow-200/80 px-0.5 text-slate-900' },
                    acc,
                );
            case 'link': {
                const href = String(mark.attrs?.href ?? '#');
                return React.createElement(
                    'a',
                    {
                        key: `l${i}`,
                        href,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        className: 'text-emerald-400 underline-offset-4 hover:underline',
                    },
                    acc,
                );
            }
            default:
                return acc;
        }
    }, React.createElement(React.Fragment, { key }, text));
}

function alignStyle(attrs?: Record<string, unknown>): React.CSSProperties | undefined {
    const a = attrs?.textAlign;
    if (typeof a !== 'string' || a === 'left') return undefined;
    return { textAlign: a as React.CSSProperties['textAlign'] };
}

function renderNode(node: JsonNode, key: number): React.ReactNode {
    switch (node.type) {
        case 'doc':
            return React.createElement(React.Fragment, { key }, renderChildren(node.content));
        case 'paragraph':
            return React.createElement(
                'p',
                { key, className: 'leading-relaxed', style: alignStyle(node.attrs) },
                renderChildren(node.content),
            );
        case 'heading': {
            const level = Math.max(1, Math.min(6, Number(node.attrs?.level ?? 2))) as
                | 1
                | 2
                | 3
                | 4
                | 5
                | 6;
            return React.createElement(
                HEADING_TAGS[level - 1]!,
                {
                    key,
                    style: alignStyle(node.attrs),
                    className:
                        level === 1
                            ? 'mt-10 text-3xl font-semibold tracking-tight'
                            : level === 2
                                ? 'mt-8 text-2xl font-semibold tracking-tight'
                                : 'mt-6 text-xl font-semibold tracking-tight',
                },
                renderChildren(node.content),
            );
        }
        case 'bulletList':
            return React.createElement(
                'ul',
                { key, className: 'list-disc space-y-1.5 pl-6' },
                renderChildren(node.content),
            );
        case 'orderedList':
            return React.createElement(
                'ol',
                { key, className: 'list-decimal space-y-1.5 pl-6' },
                renderChildren(node.content),
            );
        case 'listItem':
            return React.createElement('li', { key }, renderChildren(node.content));
        case 'taskList':
            return React.createElement(
                'ul',
                { key, className: 'space-y-1.5 list-none pl-0' },
                renderChildren(node.content),
            );
        case 'taskItem': {
            const checked = Boolean(node.attrs?.checked);
            return React.createElement(
                'li',
                { key, className: 'flex items-start gap-2' },
                React.createElement('input', {
                    type: 'checkbox',
                    checked,
                    readOnly: true,
                    className: 'mt-1.5 h-3.5 w-3.5 rounded border-slate-400 accent-emerald-500',
                }),
                React.createElement('div', null, renderChildren(node.content)),
            );
        }
        case 'blockquote':
            return React.createElement(
                'blockquote',
                { key, className: 'border-l-4 border-emerald-400 pl-4 italic' },
                renderChildren(node.content),
            );
        case 'codeBlock':
            return React.createElement(
                'pre',
                {
                    key,
                    className: 'overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100',
                },
                React.createElement('code', null, plainText(node)),
            );
        case 'horizontalRule':
            return React.createElement('hr', { key, className: 'my-8 border-white/10' });
        case 'hardBreak':
            return React.createElement('br', { key });
        case 'image': {
            const src = String(node.attrs?.src ?? '');
            const alt = String(node.attrs?.alt ?? '');
            const caption = node.attrs?.title ? String(node.attrs.title) : null;
            return React.createElement(
                'figure',
                { key, className: 'my-6' },
                React.createElement('img', {
                    src,
                    alt,
                    loading: 'lazy',
                    className: 'mx-auto rounded-xl',
                }),
                caption
                    ? React.createElement(
                        'figcaption',
                        { className: 'mt-2 text-center text-xs opacity-60' },
                        caption,
                    )
                    : null,
            );
        }
        case 'youtube': {
            const src = String(node.attrs?.src ?? '');
            return React.createElement(
                'div',
                { key, className: 'my-6 aspect-video overflow-hidden rounded-xl' },
                React.createElement('iframe', {
                    src: toYouTubeEmbed(src),
                    title: 'YouTube video',
                    allow:
                        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
                    allowFullScreen: true,
                    loading: 'lazy',
                    className: 'h-full w-full',
                }),
            );
        }
        case 'text':
            return applyMarks(node.text ?? '', node.marks, key);
        default:
            return null;
    }
}

function renderChildren(content: JsonNode[] | undefined): React.ReactNode[] {
    if (!content) return [];
    return content.map((c, i) => renderNode(c, i));
}

function plainText(node: JsonNode): string {
    if (node.type === 'text') return node.text ?? '';
    return (node.content ?? []).map(plainText).join('');
}

function toYouTubeEmbed(url: string): string {
    if (!url) return '';
    const watchMatch = url.match(/[?&]v=([\w-]{6,})/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    const shortMatch = url.match(/youtu\.be\/([\w-]{6,})/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    if (url.includes('/embed/')) return url;
    return url;
}

export function renderTiptap(content: unknown): React.ReactNode {
    if (!content || typeof content !== 'object') return null;
    return renderNode(content as JsonNode, 0);
}
