import { api } from './client';

export type CreateContactRequestDto = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  attachmentName?: string;
  consentAccepted: boolean;
};

export function createContactRequest(dto: CreateContactRequestDto) {
  return api.post('/contact-requests', dto);
}
