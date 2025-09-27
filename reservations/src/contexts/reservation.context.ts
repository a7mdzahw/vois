export enum ReservationStatus {
  CONFIRMED = 'confirmed',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

export interface CreateReservationDto {
  roomId: string;
  date: string;
  status: ReservationStatus;
  purpose: string;
}


export interface Reservation {
  id: string;
  date: string;
  status: ReservationStatus;
  purpose: string;
  roomId: string | null;
  roomName: string | null;
  roomIcon: string | null;
  userName: string | null;
  userEmail: string | null;
}
