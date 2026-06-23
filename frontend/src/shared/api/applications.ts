import { api } from './client';

export type CreateApplicationDto = {
  phone: string;
  fullName?: string;
  email?: string;
  amount: number;
  termDays: number;
  applicantType: 'INDIVIDUAL' | 'BUSINESS';
  source: 'PUBLIC_SITE' | 'CABINET';
  companyName?: string;
  registrationNumber?: string;
};

export type Application = {
  id: string;
  applicationNumber: string;
  amount: number;
  termDays: number;
  status: 'NEW' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  phone: string;
  fullName: string | null;
  loan?: {
    id: string;
    loanNumber: string;
    status: string;
    principalAmount: number;
    annuityPayment: number;
    totalRepayment: number;
  } | null;
};

export function createApplication(dto: CreateApplicationDto) {
  return api.post<Application>('/applications', dto);
}

export function getMyApplications() {
  return api.get<Application[]>('/applications');
}

export function getApplication(id: string) {
  return api.get<Application>(`/applications/${id}`);
}
