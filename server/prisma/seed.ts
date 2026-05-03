import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    const name = process.env.SEED_ADMIN_NAME ?? 'Admin';

    if (!email || !password) {
        console.warn(
            '[seed] SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set — skipping admin seed.',
        );
        return;
    }

    if (password.length < 12) {
        throw new Error('[seed] SEED_ADMIN_PASSWORD must be at least 12 characters');
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: { role: 'ADMIN', password: hashed, name },
        create: { email, password: hashed, name, role: 'ADMIN' },
        select: { id: true, email: true, role: true },
    });

    console.log(`[seed] admin upserted: ${user.email} (${user.id})`);
}

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
