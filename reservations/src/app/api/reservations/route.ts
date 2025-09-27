import { ReservationService } from '@services/reservation.service';
import { trial } from '@utils/http';
import { createReservationValidator } from '@validators/reservation.validator';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/reservations - Get all reservations
export async function GET(request: NextRequest) {
  return trial(request, async () => {
    const reservationService = new ReservationService();
    return NextResponse.json(await reservationService.getUserReservations());
  });
}

// POST /api/reservations - Create a new reservation
export async function POST(request: NextRequest) {
  return trial(
    request,
    async ({ body }) => {
      const reservationService = new ReservationService();
      return NextResponse.json(
        await reservationService.createReservation(body)
      );
    },
    { bodySchema: createReservationValidator }
  );
}
