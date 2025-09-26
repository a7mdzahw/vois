import { NextRequest, NextResponse } from 'next/server';
import { db } from '@vois/db/drizzle';
import { reservations, rooms } from '@vois/db/schemas/reservation';
import { users } from '@vois/db/schemas/user';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

// GET /api/reservations - Get all reservations
export async function GET() {
  try {
    const allReservations = await db
      .select({
        id: reservations.id,
        date: reservations.date,
        status: reservations.status,
        purpose: reservations.purpose,
        roomId: reservations.roomId,
        userId: reservations.user,
        roomName: rooms.name,
        userName: users.name,
        userEmail: users.email,
      })
      .from(reservations)
      .leftJoin(rooms, eq(reservations.roomId, rooms.id))
      .leftJoin(users, eq(reservations.user, users.id));

    return NextResponse.json(allReservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

// POST /api/reservations - Create a new reservation
export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!roomId || !date || !status || !purpose) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the reservation
    const newReservation = await db
      .insert(reservations)
      .values({
        roomId,
        user: user[0].id,
        date,
        status,
        purpose,
      })
      .returning();

    return NextResponse.json(newReservation[0], { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}
