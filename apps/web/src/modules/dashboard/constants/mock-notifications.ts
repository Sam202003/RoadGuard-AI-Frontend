export interface MockNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: '1',
    title: 'Provider assigned',
    message: 'A provider has been assigned to your breakdown request.',
    time: '2 min ago',
    read: false,
    type: 'success',
  },
  {
    id: '2',
    title: 'Request update',
    message: 'Your request status changed to Searching Provider.',
    time: '15 min ago',
    read: false,
    type: 'info',
  },
  {
    id: '3',
    title: 'Welcome to Road Guard',
    message: 'Your account is ready. Add a vehicle to get started.',
    time: '1 day ago',
    read: true,
    type: 'info',
  },
];
