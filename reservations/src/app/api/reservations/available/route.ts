import { ReservationService } from '@services/reservation.service';
import { trial } from '@utils/http';
import { availableSlotsValidator } from '@validators/reservation.validator';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return trial(
    request,
    async ({ query }) => {
      const reservationService = new ReservationService();
      return NextResponse.json(await reservationService.getRoomAvailableSlots(query));
    },
    { querySchema: availableSlotsValidator },
  );
}
