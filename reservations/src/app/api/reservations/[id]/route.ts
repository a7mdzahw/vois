import { NextRequest, NextResponse } from 'next/server';
import { db } from '@vois/db/drizzle';
import { reservations } from '@vois/db/schemas/reservation';
import { users } from '@vois/db/schemas/user';
import { eq, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

// GET /api/reservations/[id] - Get a reservation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const reservationId = (await params).id;

  try {
    const reservation = await db
      .select()
      .from(reservations)
      .where(eq(reservations.id, reservationId));

    if (!reservation[0]) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(reservation[0]);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservation' },
      { status: 500 }
    );
  }
}

// PUT /api/reservations/[id] - Update a reservation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await db.select().from(users).where(eq(users.clerkId, clerkId));

  if (!user[0]) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { roomId, date, status, purpose } = body;
    const reservationId = (await params).id;

    // Validate required fields
    if (!roomId || !date || !status || !purpose) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the reservation exists and belongs to the user
    const existingReservation = await db
      .select()
      .from(reservations)
      .where(
        and(
          eq(reservations.id, reservationId),
          eq(reservations.user, user[0].id)
        )
      );

    if (!existingReservation[0]) {
      return NextResponse.json(
        { error: 'Reservation not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update the reservation
    const updatedReservation = await db
      .update(reservations)
      .set({
        roomId,
        date: new Date(date),
        status,
        purpose,
      })
      .where(eq(reservations.id, reservationId))
      .returning();

    return NextResponse.json(updatedReservation[0]);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation' },
      { status: 500 }
    );
  }
}

// DELETE /api/reservations/[id] - Delete a reservation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await db.select().from(users).where(eq(users.clerkId, clerkId));

  if (!user[0]) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const reservationId = (await params).id;

    // Check if the reservation exists and belongs to the user
    const existingReservation = await db
      .select()
      .from(reservations)
      .where(
        and(
          eq(reservations.id, reservationId),
          eq(reservations.user, user[0].id)
        )
      );

    if (!existingReservation[0]) {
      return NextResponse.json(
        { error: 'Reservation not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete the reservation
    await db.delete(reservations).where(eq(reservations.id, reservationId));

    return NextResponse.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return NextResponse.json(
      { error: 'Failed to delete reservation' },
      { status: 500 }
    );
  }
}
