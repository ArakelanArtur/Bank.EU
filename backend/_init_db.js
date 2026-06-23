// Create SQLite database with the correct schema for the app
const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Push schema (create all tables)
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT NOT NULL UNIQUE,
    "email" TEXT,
    "passwordHash" TEXT,
    "fullName" TEXT,
    "userType" TEXT NOT NULL DEFAULT 'INDIVIDUAL',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`);

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "BusinessProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "companyName" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "businessType" TEXT,
    "contactPerson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`);

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "login" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`);

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "LoanApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationNumber" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "applicantType" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "termDays" INTEGER NOT NULL,
    "dailyRate" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "source" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "fullName" TEXT,
    "companyName" TEXT,
    "registrationNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`);

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "ApplicationNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationId" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("applicationId") REFERENCES "LoanApplication"("id") ON DELETE CASCADE,
    FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE CASCADE
  )`);

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Loan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loanNumber" TEXT NOT NULL UNIQUE,
    "applicationId" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "principalAmount" REAL NOT NULL,
    "termDays" INTEGER NOT NULL,
    "dailyRate" REAL NOT NULL,
    "annuityPayment" REAL NOT NULL,
    "totalRepayment" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_SIGNATURE',
    "signedAt" DATETIME,
    "signedIp" TEXT,
    "signedUserAgent" TEXT,
    "issuedAt" DATETIME,
    "closedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("applicationId") REFERENCES "LoanApplication"("id") ON DELETE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`);

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "PaymentScheduleItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loanId" TEXT NOT NULL,
    "installmentNumber" INTEGER NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "amountDue" REAL NOT NULL,
    "principalPart" REAL NOT NULL,
    "interestPart" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE CASCADE
  )`);

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "PaymentRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loanId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "reference" TEXT NOT NULL,
    "details" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" DATETIME,
    "reviewedByAdminId" TEXT,
    FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    FOREIGN KEY ("reviewedByAdminId") REFERENCES "AdminUser"("id") ON DELETE SET NULL
  )`);

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loanId" TEXT NOT NULL,
    "paymentRequestId" TEXT,
    "amount" REAL NOT NULL,
    "reference" TEXT NOT NULL,
    "effectiveDate" DATETIME NOT NULL,
    "recordedByAdminId" TEXT NOT NULL,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE CASCADE,
    FOREIGN KEY ("paymentRequestId") REFERENCES "PaymentRequest"("id") ON DELETE SET NULL,
    FOREIGN KEY ("recordedByAdminId") REFERENCES "AdminUser"("id") ON DELETE CASCADE
  )`);

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`);

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "OtpSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "verifiedAt" DATETIME,
    "relatedUserId" TEXT,
    "relatedLoanId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("relatedUserId") REFERENCES "User"("id") ON DELETE SET NULL,
    FOREIGN KEY ("relatedLoanId") REFERENCES "Loan"("id") ON DELETE SET NULL
  )`);

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "ContactRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "attachmentName" TEXT,
    "consentAccepted" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);

  // Add unique indexes
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "PaymentScheduleItem_loanId_installmentNumber_key" ON "PaymentScheduleItem"("loanId", "installmentNumber")`);

  // Seed admin user
  const bcrypt = require('bcrypt');
  const existingAdmin = await prisma.adminUser.findUnique({ where: { login: 'admin@lumenbridge.example' } });
  if (!existingAdmin) {
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.adminUser.create({
      data: {
        login: 'admin@lumenbridge.example',
        passwordHash: hash,
        role: 'ADMIN',
        name: 'Admin',
        isActive: true,
      },
    });
    console.log('Admin user seeded');
  }

  console.log('Database created successfully');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
