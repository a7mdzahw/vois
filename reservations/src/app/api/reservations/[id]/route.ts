import { ReservationService } from '@services/reservation.service';
import { trial } from '@utils/http';
import { createReservationValidator } from '@validators/reservation.validator';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/reservations/[id] - Get a reservation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const reservationId = (await params).id;

  return trial(request, async () => {
    const reservationService = new ReservationService();
    return NextResponse.json(
      await reservationService.getReservationById(reservationId),
    );
  });
}

// PUT /api/reservations/[id] - Update a reservation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const reservationId = (await params).id;

  return trial(
    request,
    async ({ body }) => {
      const reservationService = new ReservationService();
      return NextResponse.json(
        await reservationService.updateReservation(reservationId, body),
      );
    },
    { bodySchema: createReservationValidator },
  );
}

// DELETE /api/reservations/[id] - Delete a reservation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const reservationId = (await params).id;

  return trial(request, async () => {
    const reservationService = new ReservationService();
    return NextResponse.json(
      await reservationService.deleteReservation(reservationId),
    );
  });
}
