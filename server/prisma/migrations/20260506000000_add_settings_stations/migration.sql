-- Site settings (singleton)
CREATE TABLE IF NOT EXISTS "site_settings" (
    "id" TEXT PRIMARY KEY,
    "registeredAddress" TEXT NOT NULL DEFAULT '',
    "officeAddress" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "contactCtaUrl" TEXT NOT NULL DEFAULT '/contact',
    "socials" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Stations
CREATE TABLE IF NOT EXISTS "stations" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX IF NOT EXISTS "stations_enabled_order_idx" ON "stations" ("enabled", "order");
