-- AutoReplyTemplate
CREATE TABLE IF NOT EXISTS "auto_reply_templates" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX IF NOT EXISTS "auto_reply_templates_active_idx" ON "auto_reply_templates" ("active");

-- Backfill: if no templates exist, seed one from existing site_settings.auto_reply_* fields
INSERT INTO "auto_reply_templates" ("id", "name", "subject", "body", "active", "createdAt", "updatedAt")
SELECT
    md5(random()::text || clock_timestamp()::text),
    'Default',
    s."autoReplySubject",
    s."autoReplyBody",
    true,
    NOW(),
    NOW()
FROM "site_settings" s
WHERE NOT EXISTS (SELECT 1 FROM "auto_reply_templates")
LIMIT 1;

-- Notice imageAlign
ALTER TABLE "notices"
    ADD COLUMN IF NOT EXISTS "imageAlign" TEXT NOT NULL DEFAULT 'center';
