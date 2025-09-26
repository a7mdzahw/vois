import { getSlotsWithAvailability } from '@utils/time-slots';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const roomId = searchParams.get('roomId');
    const date = searchParams.get('date');

    if (!roomId || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const timeSlots = await getSlotsWithAvailability(roomId, date);
    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time slots' },
      { status: 500 }
    );
  }
}
