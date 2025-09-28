import { z } from 'zod';
import { ReservationStatus } from '@contexts/reservation.context';

export const createReservationValidator = z.object({
  roomId: z.string().uuid(),
  date: z.string().datetime(),
  status: z.nativeEnum(ReservationStatus),
  purpose: z.string(),
  day: z.string().datetime(),
});

export const cancelReservationValidator = z.object({
  reservationId: z.string(),
});

export const availableSlotsValidator = z.object({
  roomId: z.string(),
  date: z.string(),
});
