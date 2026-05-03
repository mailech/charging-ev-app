import slugify from 'slugify';

export function makeSlug(input: string): string {
    return slugify(input, { lower: true, strict: true, trim: true }).slice(0, 80) || 'untitled';
}

export function calcReadingMinutes(content: unknown): number {
    const text = JSON.stringify(content ?? '');
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 220));
}
