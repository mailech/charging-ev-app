import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
    siteSettingSchema,
    type SiteSetting,
    type SiteSettingUpdateInput,
    socialLinkSchema,
} from '@trio/shared/settings';
import { z } from 'zod';

const select = {
    id: true,
    registeredAddress: true,
    officeAddress: true,
    phone: true,
    email: true,
    contactCtaUrl: true,
    socials: true,
    autoReplyEnabled: true,
    autoReplySubject: true,
    autoReplyBody: true,
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.SiteSettingSelect;

async function ensureRow() {
    const existing = await prisma.siteSetting.findFirst({ select: { id: true } });
    if (existing) return existing.id;
    const created = await prisma.siteSetting.create({ data: {}, select: { id: true } });
    return created.id;
}

const socialsArraySchema = z.array(socialLinkSchema);

function normalize(row: { socials: Prisma.JsonValue } & Record<string, unknown>): SiteSetting {
    const parsed = socialsArraySchema.safeParse(row.socials);
    return siteSettingSchema.parse({
        ...row,
        socials: parsed.success ? parsed.data : [],
    });
}

export async function get(): Promise<SiteSetting> {
    const id = await ensureRow();
    const row = await prisma.siteSetting.findUniqueOrThrow({ where: { id }, select });
    return normalize(row);
}

export async function update(input: SiteSettingUpdateInput): Promise<SiteSetting> {
    const id = await ensureRow();
    const data: Prisma.SiteSettingUpdateInput = { ...input };
    if (input.socials !== undefined) {
        data.socials = input.socials as unknown as Prisma.InputJsonValue;
    }
    const row = await prisma.siteSetting.update({ where: { id }, data, select });
    return normalize(row);
}

export async function getAutoReply(): Promise<{
    enabled: boolean;
    subject: string;
    body: string;
}> {
    const id = await ensureRow();
    const row = await prisma.siteSetting.findUniqueOrThrow({
        where: { id },
        select: { autoReplyEnabled: true, autoReplySubject: true, autoReplyBody: true },
    });
    return {
        enabled: row.autoReplyEnabled,
        subject: row.autoReplySubject,
        body: row.autoReplyBody,
    };
}
