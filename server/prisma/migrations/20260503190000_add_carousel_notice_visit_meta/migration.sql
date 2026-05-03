-- visits gain referrer + visitorId (idempotent)
ALTER TABLE "visits" ADD COLUMN IF NOT EXISTS "referrer" TEXT;
ALTER TABLE "visits" ADD COLUMN IF NOT EXISTS "visitorId" TEXT;
CREATE INDEX IF NOT EXISTS "visits_visitorId_createdAt_idx" ON "visits" ("visitorId", "createdAt");

-- Enums
DO $$ BEGIN
    CREATE TYPE "CarouselTransition" AS ENUM ('FADE', 'SLIDE');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "SlideKind" AS ENUM ('IMAGE', 'VIDEO');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Carousel
CREATE TABLE IF NOT EXISTS "carousels" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'default',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "autoplay" BOOLEAN NOT NULL DEFAULT true,
    "loop" BOOLEAN NOT NULL DEFAULT true,
    "swipe" BOOLEAN NOT NULL DEFAULT true,
    "showArrows" BOOLEAN NOT NULL DEFAULT true,
    "showDots" BOOLEAN NOT NULL DEFAULT true,
    "transition" "CarouselTransition" NOT NULL DEFAULT 'SLIDE',
    "defaultDurationMs" INTEGER NOT NULL DEFAULT 5000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "carousels_name_key" ON "carousels" ("name");

CREATE TABLE IF NOT EXISTS "carousel_slides" (
    "id" TEXT PRIMARY KEY,
    "carouselId" TEXT NOT NULL,
    "kind" "SlideKind" NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "durationMs" INTEGER,
    "headline" TEXT,
    "sub" TEXT,
    "ctaLabel" TEXT,
    "ctaHref" TEXT,
    "textColor" TEXT,
    "overlayOpacity" INTEGER NOT NULL DEFAULT 40,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "carousel_slides_carouselId_fkey" FOREIGN KEY ("carouselId") REFERENCES "carousels"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "carousel_slides_carouselId_order_idx" ON "carousel_slides" ("carouselId", "order");

-- Notice (singleton)
CREATE TABLE IF NOT EXISTS "notices" (
    "id" TEXT PRIMARY KEY,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL DEFAULT 'Notice',
    "body" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT,
    "redirectUrl" TEXT,
    "bgColor" TEXT NOT NULL DEFAULT '#ffffff',
    "titleColor" TEXT NOT NULL DEFAULT '#0f172a',
    "bodyColor" TEXT NOT NULL DEFAULT '#334155',
    "titleSize" INTEGER NOT NULL DEFAULT 20,
    "bodySize" INTEGER NOT NULL DEFAULT 14,
    "imageWidth" INTEGER NOT NULL DEFAULT 480,
    "imageHeight" INTEGER NOT NULL DEFAULT 0,
    "dismissible" BOOLEAN NOT NULL DEFAULT true,
    "showFrequency" TEXT NOT NULL DEFAULT 'once-per-session',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
