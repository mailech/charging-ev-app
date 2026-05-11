import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { notFound, badRequest } from '@/utils/http-error';
import { sendMail, isMailerConfigured } from '@/lib/mailer';
import { logger } from '@/lib/logger';
import type {
    InquiryListQuery,
    InquiryNoteCreateInput,
    InquiryReplyCreateInput,
    InquiryUpdateInput,
    PublicInquirySubmitInput,
} from './inquiry.schema.js';

const inquirySelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    subject: true,
    message: true,
    status: true,
    source: true,
    assignedToId: true,
    assignedTo: { select: { id: true, name: true, email: true } },
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.InquirySelect;

const noteSelect = {
    id: true,
    body: true,
    authorId: true,
    author: { select: { id: true, name: true, email: true } },
    createdAt: true,
} satisfies Prisma.InquiryNoteSelect;

const replySelect = {
    id: true,
    subject: true,
    body: true,
    authorId: true,
    author: { select: { id: true, name: true, email: true } },
    sentAt: true,
} satisfies Prisma.InquiryReplySelect;

export async function submitPublic(input: PublicInquirySubmitInput, source?: string) {
    return prisma.inquiry.create({
        data: {
            name: input.name,
            email: input.email,
            phone: input.phone || null,
            subject: input.subject,
            message: input.message,
            source: source ?? 'web',
        },
        select: { id: true, createdAt: true },
    });
}

export async function list(query: InquiryListQuery) {
    const { status, q, assignedToId, page, limit } = query;

    const where: Prisma.InquiryWhereInput = {
        ...(status && { status }),
        ...(assignedToId && { assignedToId }),
        ...(q && {
            OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
                { subject: { contains: q, mode: 'insensitive' } },
                { message: { contains: q, mode: 'insensitive' } },
            ],
        }),
    };

    const [items, total] = await Promise.all([
        prisma.inquiry.findMany({
            where,
            select: inquirySelect,
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.inquiry.count({ where }),
    ]);

    return { items, total, page, limit };
}

export async function getById(id: string) {
    const inquiry = await prisma.inquiry.findUnique({
        where: { id },
        select: {
            ...inquirySelect,
            notes: { select: noteSelect, orderBy: { createdAt: 'asc' } },
            replies: { select: replySelect, orderBy: { sentAt: 'asc' } },
        },
    });
    if (!inquiry) throw notFound('Inquiry not found');
    return inquiry;
}

export async function update(id: string, input: InquiryUpdateInput) {
    await getById(id);
    return prisma.inquiry.update({
        where: { id },
        data: input,
        select: inquirySelect,
    });
}

export async function bulkUpdateStatus(ids: string[], status: InquiryListQuery['status']) {
    const result = await prisma.inquiry.updateMany({
        where: { id: { in: ids } },
        data: { status },
    });
    return { count: result.count };
}

export async function bulkDelete(ids: string[]) {
    const result = await prisma.inquiry.deleteMany({
        where: { id: { in: ids } },
    });
    return { count: result.count };
}

export async function addNote(inquiryId: string, authorId: string, input: InquiryNoteCreateInput) {
    await getById(inquiryId);
    return prisma.inquiryNote.create({
        data: { inquiryId, authorId, body: input.body },
        select: noteSelect,
    });
}

export async function sendReply(
    inquiryId: string,
    authorId: string,
    input: InquiryReplyCreateInput,
) {
    const inquiry = await prisma.inquiry.findUnique({
        where: { id: inquiryId },
        select: { id: true, email: true, status: true },
    });
    if (!inquiry) throw notFound('Inquiry not found');

    if (!isMailerConfigured()) {
        logger.warn(
            { inquiryId, to: inquiry.email, subject: input.subject },
            'SMTP not configured — reply not sent',
        );
        throw badRequest('Email is not configured on the server');
    }

    await sendMail({
        to: inquiry.email,
        subject: input.subject,
        text: input.body,
    });

    const [reply] = await prisma.$transaction([
        prisma.inquiryReply.create({
            data: {
                inquiryId,
                authorId,
                subject: input.subject,
                body: input.body,
            },
            select: replySelect,
        }),
        prisma.inquiry.update({
            where: { id: inquiryId },
            data:
                inquiry.status === 'NEW' || inquiry.status === 'IN_REVIEW'
                    ? { status: 'RESPONDED' }
                    : {},
        }),
    ]);

    return reply;
}

export async function getCounts() {
    const grouped = await prisma.inquiry.groupBy({
        by: ['status'],
        _count: { _all: true },
    });
    const counts = { ALL: 0, NEW: 0, IN_REVIEW: 0, RESPONDED: 0, CLOSED: 0 };
    for (const g of grouped) {
        counts[g.status] = g._count._all;
        counts.ALL += g._count._all;
    }
    return counts;
}

const DAY = 24 * 60 * 60 * 1000;

function pctDelta(curr: number, prev: number): number | null {
    if (prev === 0) return curr === 0 ? 0 : null;
    return Math.round(((curr - prev) / prev) * 1000) / 10;
}

export async function getStats() {
    const now = new Date();
    const start30 = new Date(now.getTime() - 30 * DAY);
    const start60 = new Date(now.getTime() - 60 * DAY);

    const [
        total,
        prevTotal,
        newCount,
        prevNew,
        respondedCurr,
        allCurr,
        respondedPrev,
        allPrev,
        respondedDocs,
        respondedDocsPrev,
    ] = await Promise.all([
        prisma.inquiry.count({ where: { createdAt: { gte: start30 } } }),
        prisma.inquiry.count({
            where: { createdAt: { gte: start60, lt: start30 } },
        }),
        prisma.inquiry.count({
            where: { status: 'NEW', createdAt: { gte: start30 } },
        }),
        prisma.inquiry.count({
            where: { status: 'NEW', createdAt: { gte: start60, lt: start30 } },
        }),
        prisma.inquiry.count({
            where: {
                createdAt: { gte: start30 },
                status: { in: ['RESPONDED', 'CLOSED'] },
            },
        }),
        prisma.inquiry.count({ where: { createdAt: { gte: start30 } } }),
        prisma.inquiry.count({
            where: {
                createdAt: { gte: start60, lt: start30 },
                status: { in: ['RESPONDED', 'CLOSED'] },
            },
        }),
        prisma.inquiry.count({
            where: { createdAt: { gte: start60, lt: start30 } },
        }),
        prisma.inquiry.findMany({
            where: { createdAt: { gte: start30 }, status: { in: ['RESPONDED', 'CLOSED'] } },
            select: { createdAt: true, updatedAt: true },
        }),
        prisma.inquiry.findMany({
            where: {
                createdAt: { gte: start60, lt: start30 },
                status: { in: ['RESPONDED', 'CLOSED'] },
            },
            select: { createdAt: true, updatedAt: true },
        }),
    ]);

    const responseRatePct = allCurr === 0 ? 0 : Math.round((respondedCurr / allCurr) * 1000) / 10;
    const prevResponseRatePct =
        allPrev === 0 ? 0 : Math.round((respondedPrev / allPrev) * 1000) / 10;

    const avgHours = (docs: { createdAt: Date; updatedAt: Date }[]) => {
        if (docs.length === 0) return null;
        const sumMs = docs.reduce(
            (acc, d) => acc + (d.updatedAt.getTime() - d.createdAt.getTime()),
            0,
        );
        return Math.round((sumMs / docs.length / (60 * 60 * 1000)) * 10) / 10;
    };
    const avgResponseHours = avgHours(respondedDocs);
    const prevAvgResponseHours = avgHours(respondedDocsPrev);

    return {
        total,
        totalDeltaPct: pctDelta(total, prevTotal),
        newCount,
        newDeltaPct: pctDelta(newCount, prevNew),
        responseRatePct,
        responseRateDeltaPct:
            prevResponseRatePct === 0
                ? null
                : Math.round((responseRatePct - prevResponseRatePct) * 10) / 10,
        avgResponseHours,
        avgResponseDeltaPct:
            prevAvgResponseHours == null || avgResponseHours == null
                ? null
                : pctDelta(avgResponseHours, prevAvgResponseHours),
    };
}

export async function exportCsv(query: Pick<InquiryListQuery, 'status' | 'q' | 'assignedToId'>) {
    const where: Prisma.InquiryWhereInput = {
        ...(query.status && { status: query.status }),
        ...(query.assignedToId && { assignedToId: query.assignedToId }),
        ...(query.q && {
            OR: [
                { name: { contains: query.q, mode: 'insensitive' } },
                { email: { contains: query.q, mode: 'insensitive' } },
                { subject: { contains: query.q, mode: 'insensitive' } },
            ],
        }),
    };

    const rows = await prisma.inquiry.findMany({
        where,
        select: {
            id: true,
            createdAt: true,
            name: true,
            email: true,
            phone: true,
            subject: true,
            message: true,
            status: true,
            source: true,
            assignedTo: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5000,
    });

    const escape = (v: unknown) => {
        if (v == null) return '';
        const s = String(v).replace(/"/g, '""');
        return /[",\n]/.test(s) ? `"${s}"` : s;
    };

    const header = [
        'id',
        'createdAt',
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'status',
        'source',
        'assignedTo',
    ];
    const lines = [
        header.join(','),
        ...rows.map((r) =>
            [
                r.id,
                r.createdAt.toISOString(),
                r.name,
                r.email,
                r.phone ?? '',
                r.subject,
                r.message,
                r.status,
                r.source ?? '',
                r.assignedTo?.name ?? r.assignedTo?.email ?? '',
            ]
                .map(escape)
                .join(','),
        ),
    ];

    return lines.join('\n');
}
