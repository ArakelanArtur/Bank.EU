import { api } from './client';

export type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export function getMyNotifications() {
  return api.get<Notification[]>('/notifications');
}

export function markNotificationRead(id: string) {
  return api.patch<Notification>(`/notifications/${id}/read`, {});
}
