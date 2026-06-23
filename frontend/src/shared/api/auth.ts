import { api } from './client';

export type OtpRequestDto = {
  phone: string;
};

export type OtpVerifyDto = {
  phone: string;
  code: string;
};

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    phone: string;
    fullName: string | null;
    email: string | null;
    userType: 'INDIVIDUAL' | 'BUSINESS';
    isVerified: boolean;
  };
};

export function requestOtp(dto: OtpRequestDto) {
  return api.post<{ message: string }>('/otp/request', dto);
}

export function verifyOtp(dto: OtpVerifyDto) {
  return api.post<AuthResponse>('/otp/verify', dto);
}

export function getMe() {
  return api.get<AuthResponse['user']>('/users/me');
}

export type RegisterDto = {
  phone: string;
  fullName: string;
  password: string;
  email?: string;
  userType?: 'INDIVIDUAL' | 'BUSINESS';
  companyName?: string;
  inn?: string;
  contactPerson?: string;
};

export function registerUser(dto: RegisterDto) {
  return api.post<{ message: string; user: { id: string; phone: string; fullName: string } }>('/auth/register', dto);
}

export function loginUser(dto: { phone: string; password: string }) {
  return api.post<AuthResponse>('/auth/login', dto);
}
