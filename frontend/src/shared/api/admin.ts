import { ApiError } from './client';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('lbf_admin_auth');
    if (!raw) return null;
    return JSON.parse(raw).token;
  } catch { return null; }
}

async function adminRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAdminToken();
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers as Record<string, string>),
    },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message || `Request failed (${res.status})`);
  }
  return res.json();
}

export const adminApi = {
  get: <T>(path: string) => adminRequest<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: unknown) => adminRequest<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => adminRequest<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => adminRequest<T>(path, { method: 'DELETE' }),
};

export type AdminUser = {
  id: string;
  login: string;
  role: 'ADMIN' | 'OPERATOR';
  name: string;
};

export type AdminLoginResponse = {
  token: string;
  admin: AdminUser;
};

export type ApplicationStatus = 'NEW' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
export type LoanStatus = 'PENDING_SIGNATURE' | 'ACTIVE' | 'OVERDUE' | 'CLOSED' | 'REJECTED';
export type PaymentRequestStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
export type NotificationType = 'APPLICATION_STATUS_CHANGED' | 'LOAN_APPROVED' | 'LOAN_SIGN_REQUIRED' | 'PAYMENT_REQUEST_UPDATED' | 'PAYMENT_CONFIRMED' | 'LOAN_CLOSED';
export type AdminRole = 'ADMIN' | 'OPERATOR';

export type ApplicationUser = { id: string; phone: string; fullName: string; email?: string };

export type ApplicationNote = {
  id: string;
  applicationId: string;
  adminUserId: string;
  content: string;
  createdAt: string;
  adminUser?: { name: string };
};

export type AdminApplication = {
  id: string;
  applicationNumber: string;
  userId: string;
  applicantType: string;
  amount: number;
  termDays: number;
  dailyRate: number;
  status: ApplicationStatus;
  source: string;
  phone: string;
  email?: string | null;
  fullName?: string | null;
  companyName?: string | null;
  registrationNumber?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: ApplicationUser;
  notes?: ApplicationNote[];
  loan?: unknown;
};

export type AdminUserType = {
  id: string;
  phone: string;
  fullName?: string | null;
  email?: string | null;
  userType: string;
  isVerified: boolean;
  createdAt: string;
  businessProfile?: { companyName?: string; registrationNumber?: string } | null;
};

export type PaymentScheduleItem = {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: string;
  amountDue: number;
  principalPart: number;
  interestPart: number;
  status: string;
  paidAt?: string | null;
};

export type AdminPaymentRequest = {
  id: string;
  loanId: string;
  userId: string;
  amount: number;
  reference: string;
  details?: string | null;
  status: PaymentRequestStatus;
  createdAt: string;
  reviewedAt?: string | null;
  reviewedByAdminId?: string | null;
  user?: ApplicationUser;
  loan?: { loanNumber: string };
};

export type AdminPayment = {
  id: string;
  loanId: string;
  paymentRequestId?: string | null;
  amount: number;
  reference: string;
  effectiveDate: string;
  recordedByAdminId: string;
  recordedAt: string;
};

export type AdminLoan = {
  id: string;
  loanNumber: string;
  applicationId: string;
  userId: string;
  principalAmount: number;
  termDays: number;
  dailyRate: number;
  annuityPayment: number;
  totalRepayment: number;
  status: LoanStatus;
  signedAt?: string | null;
  issuedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: ApplicationUser;
  paymentSchedule?: PaymentScheduleItem[];
  paymentRequests?: AdminPaymentRequest[];
  payments?: AdminPayment[];
};

export type AdminNotification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type AdminContactRequest = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  attachmentName?: string | null;
  consentAccepted: boolean;
  createdAt: string;
};

export function adminLogin(login: string, password: string) {
  return adminApi.post<AdminLoginResponse>('/admin/auth/login', { login, password });
}

export function adminGetMe() {
  return adminApi.get<AdminUser>('/admin/auth/me');
}

export function adminGetApplications(status?: ApplicationStatus) {
  const params = status ? `?status=${status}` : '';
  return adminApi.get<AdminApplication[]>(`/admin/applications${params}`);
}

export function adminGetApplication(id: string) {
  return adminApi.get<AdminApplication>(`/admin/applications/${id}`);
}

export function adminUpdateApplicationStatus(id: string, data: { status: ApplicationStatus; note?: string }) {
  return adminApi.patch<AdminApplication>(`/admin/applications/${id}/status`, data);
}

export function adminAddApplicationNote(id: string, content: string) {
  return adminApi.post<ApplicationNote>(`/admin/applications/${id}/notes`, { content });
}

export function adminGetUsers(search?: string) {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  return adminApi.get<AdminUserType[]>(`/admin/users${params}`);
}

export function adminDeleteUser(id: string) {
  return adminApi.delete<{ deleted: boolean }>('/admin/users/' + id);
}

export function adminGetUser(id: string) {
  return adminApi.get<AdminUserType & {
    applications: AdminApplication[];
    loans: AdminLoan[];
    paymentRequests: AdminPaymentRequest[];
    notifications: AdminNotification[];
    businessProfile?: { companyName?: string; registrationNumber?: string } | null;
  }>(`/admin/users/${id}`);
}

export function adminGetLoans(status?: LoanStatus) {
  const params = status ? `?status=${status}` : '';
  return adminApi.get<AdminLoan[]>(`/admin/loans${params}`);
}

export function adminGetLoan(id: string) {
  return adminApi.get<AdminLoan>(`/admin/loans/${id}`);
}

export function adminUpdateLoanStatus(id: string, status: LoanStatus) {
  return adminApi.patch<AdminLoan>(`/admin/loans/${id}/status`, { status });
}

export function adminGetPaymentRequests(status?: PaymentRequestStatus) {
  const params = status ? `?status=${status}` : '';
  return adminApi.get<AdminPaymentRequest[]>(`/admin/payment-requests${params}`);
}

export function adminReviewPaymentRequest(id: string, status: PaymentRequestStatus) {
  return adminApi.patch<AdminPaymentRequest>(`/admin/payment-requests/${id}/review`, { status });
}

export function adminRecordPayment(data: { loanId: string; amount: number; reference: string; effectiveDate: string; paymentRequestId?: string }) {
  return adminApi.post<AdminPayment>('/admin/payments', data);
}

export function adminGetContactRequests() {
  return adminApi.get<AdminContactRequest[]>('/admin/contact-requests');
}

export function adminGetNotifications() {
  return adminApi.get<(AdminNotification & { user?: ApplicationUser })[]>('/admin/notifications');
}

export function adminCreateNotification(data: { userId: string; type: NotificationType; title: string; message: string }) {
  return adminApi.post<AdminNotification>('/admin/notifications', data);
}

export type AdminOperator = {
  id: string;
  login: string;
  name: string;
  role: 'OPERATOR';
  isActive: boolean;
  createdAt: string;
};

export function adminListOperators() {
  return adminApi.get<AdminOperator[]>('/admin/admin-users');
}

export function adminCreateOperator(data: { login: string; password: string; name: string }) {
  return adminApi.post<AdminOperator>('/admin/admin-users', data);
}

export function adminDeleteOperator(id: string) {
  return adminApi.delete<{ deleted: boolean }>('/admin/admin-users/' + id);
}
