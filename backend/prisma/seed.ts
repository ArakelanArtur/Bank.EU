import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not configured');
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const operatorPassword = await bcrypt.hash('operator123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await prisma.adminUser.upsert({
    where: { login: 'admin@lumenbridge.example' },
    update: {},
    create: {
      login: 'admin@lumenbridge.example',
      passwordHash: adminPassword,
      role: 'ADMIN',
      name: 'Admin User',
      isActive: true,
    },
  });

  await prisma.adminUser.upsert({
    where: { login: 'operator@lumenbridge.example' },
    update: {},
    create: {
      login: 'operator@lumenbridge.example',
      passwordHash: operatorPassword,
      role: 'OPERATOR',
      name: 'Operator User',
      isActive: true,
    },
  });

  await prisma.adminUser.upsert({
    where: { login: 'admin' },
    update: {},
    create: {
      login: 'admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
      name: 'Admin',
      isActive: true,
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { phone: '+79999999999' },
    update: {},
    create: {
      phone: '+79999999999',
      fullName: 'Демо Пользователь',
      email: 'demo@example.com',
      passwordHash: userPassword,
      userType: 'INDIVIDUAL',
      isVerified: true,
    },
  });

  const existingApps = await prisma.loanApplication.findMany({
    where: { userId: demoUser.id },
    take: 1,
  });

  if (existingApps.length === 0) {
    const app = await prisma.loanApplication.create({
      data: {
        applicationNumber: `APP-DEMO-${Date.now().toString(36).toUpperCase()}`,
        userId: demoUser.id,
        applicantType: 'INDIVIDUAL',
        amount: 25000,
        termDays: 30,
        dailyRate: 0.008,
        status: 'APPROVED',
        source: 'CABINET',
        phone: '+79999999999',
        email: 'demo@example.com',
        fullName: 'Демо Пользователь',
      },
    });

    const calc = (principal: number, termDays: number, dailyRate: number) => {
      const growthFactor = Math.pow(1 + dailyRate, termDays);
      const annuityPayment = principal * ((dailyRate * growthFactor) / (growthFactor - 1));
      const totalRepayment = annuityPayment * termDays;
      return {
        annuityPayment: Math.round((annuityPayment + Number.EPSILON) * 100) / 100,
        totalRepayment: Math.round((totalRepayment + Number.EPSILON) * 100) / 100,
      };
    };

    const loanCalc = calc(25000, 30, 0.008);
    const loanNumber = `LN-DEMO-${Date.now().toString(36).toUpperCase()}`;

    const loan = await prisma.loan.create({
      data: {
        loanNumber,
        applicationId: app.id,
        userId: demoUser.id,
        principalAmount: 25000,
        termDays: 30,
        dailyRate: 0.008,
        annuityPayment: loanCalc.annuityPayment,
        totalRepayment: loanCalc.totalRepayment,
        status: 'PENDING_SIGNATURE',
      },
    });

    const items: any[] = [];
    let outstandingBalance = 25000;

    for (let i = 1; i <= 30; i++) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + i);

      const interestPart = Math.round(outstandingBalance * 0.008 * 100) / 100;
      let principalPart = Math.round((loanCalc.annuityPayment - interestPart) * 100) / 100;
      if (principalPart > outstandingBalance) {
        principalPart = Math.round(outstandingBalance * 100) / 100;
      }
      outstandingBalance = Math.round((outstandingBalance - principalPart) * 100) / 100;

      items.push({
        loanId: loan.id,
        installmentNumber: i,
        dueDate,
        amountDue: principalPart + interestPart,
        principalPart,
        interestPart,
        status: 'PENDING',
      });
    }

    if (items.length > 0) {
      await prisma.paymentScheduleItem.createMany({ data: items });
    }

    await prisma.notification.create({
      data: {
        userId: demoUser.id,
        type: 'LOAN_APPROVED',
        title: 'Демо-займ одобрен',
        message: `Займ ${loanNumber} на 25 000₽ одобрен. Подпишите его для получения средств.`,
      },
    });
  }

  console.log('Seed completed successfully');
  console.log('  Admin:     admin@lumenbridge.example / admin123');
  console.log('  Operator:  operator@lumenbridge.example / operator123');
  console.log('  Demo user: +79999999999 / user123 (or OTP 0000)');
  console.log('  Demo loan: 25 000₽, 30 days, 0.8% daily, PENDING_SIGNATURE');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
