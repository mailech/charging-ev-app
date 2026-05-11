-- Auto-reply columns on site_settings (idempotent)
ALTER TABLE "site_settings"
    ADD COLUMN IF NOT EXISTS "autoReplyEnabled" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "site_settings"
    ADD COLUMN IF NOT EXISTS "autoReplySubject" TEXT NOT NULL DEFAULT 'Thanks for reaching out';

ALTER TABLE "site_settings"
    ADD COLUMN IF NOT EXISTS "autoReplyBody" TEXT NOT NULL DEFAULT E'Hi {{name}},\n\nThanks for getting in touch about "{{subject}}". We''ve received your message and our team will get back to you shortly.\n\n— Trio Charging';
