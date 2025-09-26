import { and, eq, sql } from 'drizzle-orm';
import { db } from '@vois/db/drizzle'; // your drizzle instance
import { reservations } from '@vois/db/schemas/reservation';
import { isEqual } from 'date-fns';

function generateSlots(open: string, close: string, intervalMinutes: number) {
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

export async function getSlotsWithAvailability(roomId: string, date: string) {
  // Example working hours 10:00 → 22:00
  const open = `${date}T09:00:00`;
  const close = `${date}T18:00:00`;

  const slots = generateSlots(open, close, 30); // 30 minute slots


  const existing = await db
    .select()
    .from(reservations)
    .where(
      and(
        eq(reservations.roomId, roomId),
        eq(reservations.status, 'confirmed'),
        sql`${reservations.date}::date = ${date}::date`
      )
    );

    console.log({existing});
    console.log({slots});


  return slots.map((slot) => {

    const overlap = existing.some((r) => isEqual(slot.start, r.date));

    return {
      id: slot.start.toISOString(),
      start: slot.start,
      end: slot.end,
      available: !overlap,
    };
  });
}
