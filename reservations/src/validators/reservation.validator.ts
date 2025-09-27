import { z } from 'zod';
import { ReservationStatus } from '@contexts/reservation.context';

export const createReservationValidator = z.object({
  roomId: z.string(),
  date: z.string(),
  status: z.nativeEnum(ReservationStatus),
  purpose: z.string(),
});

export const cancelReservationValidator = z.object({
  reservationId: z.string(),
});

export const availableSlotsValidator = z.object({
  roomId: z.string(),
  date: z.string(),
});

// Types
export type CreateReservationValidator = z.infer<
  typeof createReservationValidator
>;

export type CancelReservationValidator = z.infer<
  typeof cancelReservationValidator
>;

export type AvailableSlotsValidator = z.infer<typeof availableSlotsValidator>;
