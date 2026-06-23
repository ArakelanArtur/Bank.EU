const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const p = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./dev.db' }) });
p.adminUser.findMany().then(u => {
  console.log(JSON.stringify(u, null, 2));
  if (u.length === 0) {
    console.log('No admin users found — seeding needed');
  }
  p.$disconnect();
});
