import { ReservationService } from '@services/reservation.service';
import { trial } from '@utils/http';
import { cancelReservationValidator } from '@validators/reservation.validator';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // change the status of the reservation to cancelled
  return trial(
    request,
    async ({ body }) => {
      const reservationService = new ReservationService();
      return NextResponse.json(
        await reservationService.cancelReservation(body.reservationId)
      );
    },
    { bodySchema: cancelReservationValidator }
  );
}
