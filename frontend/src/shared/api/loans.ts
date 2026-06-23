import { api } from './client';

export type PaymentScheduleItem = {
  id: string;
  installmentNumber: number;
  dueDate: string;
  amountDue: number;
  principalPart: number;
  interestPart: number;
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE';
  paidAt: string | null;
};

export type Loan = {
  id: string;
  loanNumber: string;
  principalAmount: number;
  termDays: number;
  dailyRate: number;
  annuityPayment: number;
  totalRepayment: number;
  status: 'PENDING_SIGNATURE' | 'ACTIVE' | 'OVERDUE' | 'CLOSED' | 'REJECTED';
  signedAt: string | null;
  issuedAt: string | null;
  closedAt: string | null;
  createdAt: string;
  paymentSchedule: PaymentScheduleItem[];
};

export type PaymentRequest = {
  id: string;
  loanId: string;
  amount: number;
  reference: string;
  details: string | null;
  receiptFileName: string | null;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  createdAt: string;
};

export function getMyLoans() {
  return api.get<Loan[]>('/loans');
}

export function getLoan(id: string) {
  return api.get<Loan>(`/loans/${id}`);
}

export function requestSignOtp(loanId: string) {
  return api.post<{ message: string }>(`/loans/${loanId}/request-sign-otp`, {});
}

export function signLoan(loanId: string, code: string) {
  return api.post<{ message: string }>(`/loans/${loanId}/sign`, { otpCode: code });
}

export function createPaymentRequest(loanId: string, amount: number, details?: string, receiptFile?: File) {
  const formData = new FormData();
  formData.append('loanId', loanId);
  formData.append('amount', String(amount));
  if (details) formData.append('details', details);
  if (receiptFile) formData.append('receipt', receiptFile);
  return api.post<PaymentRequest>('/payment-requests', formData);
}

export function getMyPaymentRequests() {
  return api.get<PaymentRequest[]>('/payment-requests');
}
