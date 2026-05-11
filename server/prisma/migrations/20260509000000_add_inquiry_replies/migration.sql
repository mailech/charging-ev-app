-- InquiryReply
CREATE TABLE IF NOT EXISTS "inquiry_replies" (
    "id" TEXT PRIMARY KEY,
    "inquiryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'inquiry_replies_inquiryId_fkey'
    ) THEN
        ALTER TABLE "inquiry_replies"
            ADD CONSTRAINT "inquiry_replies_inquiryId_fkey"
            FOREIGN KEY ("inquiryId") REFERENCES "inquiries"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'inquiry_replies_authorId_fkey'
    ) THEN
        ALTER TABLE "inquiry_replies"
            ADD CONSTRAINT "inquiry_replies_authorId_fkey"
            FOREIGN KEY ("authorId") REFERENCES "users"("id")
            ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END$$;

CREATE INDEX IF NOT EXISTS "inquiry_replies_inquiryId_sentAt_idx"
    ON "inquiry_replies" ("inquiryId", "sentAt");
