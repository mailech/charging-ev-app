import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma.js';

const DAY = 24 * 60 * 60 * 1000;

function pctDelta(curr: number, prev: number): number | null {
    if (prev === 0) return curr === 0 ? 0 : null;
    return Math.round(((curr - prev) / prev) * 1000) / 10;
}

const MONTH_LABELS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

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

let cache: { at: number; payload: unknown } | null = null;
const CACHE_TTL = 60_000;

export async function getOverview() {
    if (cache && Date.now() - cache.at < CACHE_TTL) {
        return cache.payload as Awaited<ReturnType<typeof computeOverview>>;
    }
    const payload = await computeOverview();
    cache = { at: Date.now(), payload };
    return payload;
}

async function computeOverview() {
    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startTwelveMonths = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const start24h = new Date(now.getTime() - DAY);
    const start48h = new Date(now.getTime() - 2 * DAY);
    const start30d = new Date(now.getTime() - 30 * DAY);
    const start60d = new Date(now.getTime() - 60 * DAY);

    const [
        totalInquiries,
        prevTotal,
        responded,
        prevResponded,
        dailyVisits,
        prevDailyVisits,
        monthlyVisits,
        prevMonthlyVisits,
        byStatusGroup,
        monthlyRows,
        sourcesGroup,
        recentInquiries,
        uniqueDailyRows,
        uniqueDailyPrevRows,
        uniqueLast30Rows,
        referrerGroup,
    ] = await Promise.all([
        prisma.inquiry.count(),
        prisma.inquiry.count({ where: { createdAt: { lt: start30d } } }),
        prisma.inquiry.count({
            where: { status: 'RESPONDED', updatedAt: { gte: startMonth } },
        }),
        prisma.inquiry.count({
            where: { status: 'RESPONDED', updatedAt: { gte: startPrevMonth, lt: startMonth } },
        }),
        prisma.visit.count({ where: { createdAt: { gte: start24h } } }),
        prisma.visit.count({ where: { createdAt: { gte: start48h, lt: start24h } } }),
        prisma.visit.count({ where: { createdAt: { gte: start30d } } }),
        prisma.visit.count({ where: { createdAt: { gte: start60d, lt: start30d } } }),
        prisma.inquiry.groupBy({
            by: ['status'],
            _count: { _all: true },
        }),
        prisma.inquiry.findMany({
            where: { createdAt: { gte: startTwelveMonths } },
            select: { createdAt: true },
        }),
        prisma.inquiry.groupBy({
            by: ['source'],
            _count: { _all: true },
            orderBy: { _count: { id: 'desc' } },
            take: 5,
        }),
        prisma.inquiry.findMany({
            select: inquirySelect,
            orderBy: { createdAt: 'desc' },
            take: 5,
        }),
        prisma.visit.findMany({
            where: { createdAt: { gte: start24h }, visitorId: { not: null } },
            select: { visitorId: true },
            distinct: ['visitorId'],
        }),
        prisma.visit.findMany({
            where: {
                createdAt: { gte: start48h, lt: start24h },
                visitorId: { not: null },
            },
            select: { visitorId: true },
            distinct: ['visitorId'],
        }),
        prisma.visit.findMany({
            where: { createdAt: { gte: start30d } },
            select: { visitorId: true, createdAt: true },
        }),
        prisma.visit.groupBy({
            by: ['referrer'],
            where: { createdAt: { gte: start30d }, referrer: { not: null } },
            _count: { _all: true },
            orderBy: { _count: { id: 'desc' } },
            take: 6,
        }),
    ]);

    const byStatus = (['NEW', 'IN_REVIEW', 'RESPONDED', 'CLOSED'] as const).map((status) => ({
        status,
        count: byStatusGroup.find((g) => g.status === status)?._count._all ?? 0,
    }));

    const monthly: { key: string; label: string; count: number }[] = [];
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthly.push({ key, label: MONTH_LABELS[d.getMonth()]!, count: 0 });
    }
    for (const row of monthlyRows) {
        const d = row.createdAt;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const slot = monthly.find((m) => m.key === key);
        if (slot) slot.count += 1;
    }

    const topSources = sourcesGroup.map((g) => ({
        source: g.source ?? 'unknown',
        count: g._count._all,
    }));

    const topReferrers = referrerGroup.map((g) => ({
        referrer: domainOf(g.referrer ?? 'direct'),
        count: g._count._all,
    }));

    const dailyVisitorBuckets: { key: string; label: string; ids: Set<string> }[] = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * DAY);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const label = `${MONTH_LABELS[d.getMonth()]} ${d.getDate()}`;
        dailyVisitorBuckets.push({ key, label, ids: new Set<string>() });
    }
    for (const row of uniqueLast30Rows) {
        if (!row.visitorId) continue;
        const d = row.createdAt;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const slot = dailyVisitorBuckets.find((b) => b.key === key);
        if (slot) slot.ids.add(row.visitorId);
    }
    const dailyVisitors = dailyVisitorBuckets.map((b) => ({
        day: b.key,
        label: b.label,
        count: b.ids.size,
    }));

    const uniqueVisitors = uniqueDailyRows.length;
    const prevUnique = uniqueDailyPrevRows.length;

    return {
        kpis: {
            totalInquiries,
            totalDeltaPct: pctDelta(totalInquiries, prevTotal),
            dailyVisits,
            dailyVisitsDeltaPct: pctDelta(dailyVisits, prevDailyVisits),
            monthlyVisits,
            monthlyVisitsDeltaPct: pctDelta(monthlyVisits, prevMonthlyVisits),
            uniqueVisitors,
            uniqueVisitorsDeltaPct: pctDelta(uniqueVisitors, prevUnique),
            responded,
            respondedDeltaPct: pctDelta(responded, prevResponded),
        },
        byStatus,
        monthlyInquiries: monthly.map((m) => ({ month: m.key, label: m.label, count: m.count })),
        topSources,
        topReferrers,
        dailyVisitors,
        recentInquiries,
    };
}

function domainOf(input: string): string {
    if (!input) return 'direct';
    try {
        const u = new URL(input);
        return u.hostname.replace(/^www\./, '');
    } catch {
        return input.slice(0, 80);
    }
}
