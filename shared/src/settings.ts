import { z } from 'zod';

export const socialPlatformSchema = z.enum([
    'instagram',
    'facebook',
    'linkedin',
    'twitter',
    'youtube',
    'whatsapp',
    'tiktok',
    'pinterest',
    'website',
    'other',
]);
export type SocialPlatform = z.infer<typeof socialPlatformSchema>;

export const socialLinkSchema = z.object({
    platform: socialPlatformSchema,
    url: z.string().min(1).max(2048),
    enabled: z.boolean().default(true),
    label: z.string().max(80).nullable().optional(),
});
export type SocialLink = z.infer<typeof socialLinkSchema>;

export const siteSettingSchema = z.object({
    id: z.string(),
    registeredAddress: z.string(),
    officeAddress: z.string(),
    phone: z.string(),
    email: z.string(),
    contactCtaUrl: z.string(),
    socials: z.array(socialLinkSchema),
    autoReplyEnabled: z.boolean(),
    autoReplySubject: z.string(),
    autoReplyBody: z.string(),
});
export type SiteSetting = z.infer<typeof siteSettingSchema>;

export const siteSettingUpdateSchema = z.object({
    registeredAddress: z.string().max(500).optional(),
    officeAddress: z.string().max(500).optional(),
    phone: z.string().max(80).optional(),
    email: z.string().max(200).optional(),
    contactCtaUrl: z.string().max(2048).optional(),
    socials: z.array(socialLinkSchema).max(20).optional(),
    autoReplyEnabled: z.boolean().optional(),
    autoReplySubject: z.string().min(1).max(200).optional(),
    autoReplyBody: z.string().min(1).max(20000).optional(),
});
export type SiteSettingUpdateInput = z.infer<typeof siteSettingUpdateSchema>;

export const SITE_SETTING_DEFAULT: Omit<SiteSetting, 'id'> = {
    registeredAddress: '',
    officeAddress: '',
    phone: '',
    email: '',
    contactCtaUrl: '/contact',
    socials: [],
    autoReplyEnabled: false,
    autoReplySubject: 'Thanks for reaching out',
    autoReplyBody:
        'Hi {{name}},\n\nThanks for getting in touch about "{{subject}}". We\'ve received your message and our team will get back to you shortly.\n\n— Trio',
};
