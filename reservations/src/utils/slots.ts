import { addMinutes, isBefore, isAfter } from 'date-fns';
export function generateSlots(open: Date, close: Date, intervalMinutes: number) {
  const slots: { start: Date; end: Date }[] = [];

  let start = open;
  const end = close;

  while (isBefore(start, end)) {
    const slotEnd = addMinutes(start, intervalMinutes);

    if (isAfter(start, new Date())) {
      slots.push({ start, end: slotEnd });
    }

    start = slotEnd;
  }

  return slots;
}
