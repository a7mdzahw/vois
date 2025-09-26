import { format } from 'date-fns';


export function formatDate(date: Date | string) {
  return format(date, 'yyyy-MM-dd');
}

export function formatDateTime(date: Date | string) {
  return format(date, 'yyyy-MM-dd / hh:mm a');
}

export function formatTime(date: Date | string) {
  return format(date, 'hh:mm a');
}
