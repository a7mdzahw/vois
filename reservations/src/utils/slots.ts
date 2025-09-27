export function generateSlots(
  open: string,
  close: string,
  intervalMinutes: number
) {
  const slots: { start: Date; end: Date }[] = [];
  let start = new Date(open);
  const end = new Date(close);

  while (start < end) {
    const slotEnd = new Date(start.getTime() + intervalMinutes * 60000);
    if (slotEnd <= end) {
      slots.push({ start: new Date(start), end: slotEnd });
    }
    start = slotEnd;
  }
  return slots;
}
