import { db } from '@vois/db/drizzle';
import { reservations } from '@vois/db/schemas/reservation';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // change the status of the reservation to cancelled
  const { reservationId } = await request.json();
  const reservation = await db
    .select()
    .from(reservations)
    .where(eq(reservations.id, reservationId));
  if (!reservation) {
    return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
  }
  await db
    .update(reservations)
    .set({ status: 'cancelled' })
    .where(eq(reservations.id, reservationId));
  return NextResponse.json({ message: 'Reservation cancelled' }, { status: 200 });
}
