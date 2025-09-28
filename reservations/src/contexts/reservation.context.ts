import { z } from 'zod';

import { ISOString } from './shared.context';
import { createReservationValidator, availableSlotsValidator } from '@validators/reservation.validator';

export enum ReservationStatus {
  CONFIRMED = 'confirmed',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

export interface Reservation {
  id: string;
  date: ISOString;
  status: ReservationStatus;
  purpose: string;
  roomId: string;
  roomName: string;
  roomIcon: string;
}

export type CreateReservationDto = z.infer<typeof createReservationValidator>;
export type AvailableSlotsDto = z.infer<typeof availableSlotsValidator>;

export interface TimeSlot {
  id: string;
  start: ISOString;
  end: ISOString;
  available: boolean;
}
