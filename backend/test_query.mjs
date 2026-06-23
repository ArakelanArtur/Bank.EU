import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
try {
  const r = await p.paymentRequest.findMany({
    take: 5,
    include: {
      user: { select: { id: true, phone: true, fullName: true } },
      loan: { select: { loanNumber: true } },
    },
  });
  console.log('OK rows:', r.length);
  if (r.length > 0) console.log('First:', JSON.stringify(r[0], null, 2));
} catch (e) {
  console.log('ERROR:', e.message);
  console.log(e.stack);
} finally {
  await p.$disconnect();
}
