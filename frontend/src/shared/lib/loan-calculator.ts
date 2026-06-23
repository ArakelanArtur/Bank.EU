import { LOAN_LIMITS } from '../config/company';

export type LoanCalculationResult = {
  annuityPayment: number;
  totalRepayment: number;
};

export function calculateLoanTerms(
  principal: number,
  termDays: number,
  dailyRate = LOAN_LIMITS.dailyRate,
): LoanCalculationResult {
  if (principal <= 0 || termDays <= 0 || dailyRate <= 0) {
    return {
      annuityPayment: 0,
      totalRepayment: 0,
    };
  }

  const growthFactor = Math.pow(1 + dailyRate, termDays);
  const annuityPayment =
    principal * ((dailyRate * growthFactor) / (growthFactor - 1));
  const totalRepayment = annuityPayment * termDays;

  return {
    annuityPayment: roundCurrency(annuityPayment),
    totalRepayment: roundCurrency(totalRepayment),
  };
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(value);
}
