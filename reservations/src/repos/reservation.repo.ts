import { Db } from '@vois/db/drizzle';
import { reservations } from '@vois/db/schemas/reservation';
import { rooms } from '@vois/db/schemas/room';
import { and, asc, eq, sql } from 'drizzle-orm';
import {
  AvailableSlotsDto,
  CreateReservationDto,
} from '@contexts/reservation.context';
import { formatDate } from '@utils/date';
import { parseISO } from 'date-fns';

export class ReservationRepo {
  constructor(private db: Db) {}

  async getUserReservation(userId: string) {
    const allReservations = await this.db
      .select({
        id: reservations.id,
        date: reservations.date,
        status: reservations.status,
        purpose: reservations.purpose,
        roomId: reservations.roomId,
        roomName: rooms.name,
        roomIcon: rooms.icon,
      })
      .from(reservations)
      .leftJoin(rooms, eq(reservations.roomId, rooms.id))
      .where(eq(reservations.userId, userId))
      .orderBy(asc(reservations.date));

    return allReservations;
  }

  async getReservationById(id: string) {
    const reservation = await this.db
      .select({
        id: reservations.id,
        roomId: reservations.roomId,
        roomName: rooms.name,
        roomIcon: rooms.icon,
        userId: reservations.userId,
        date: reservations.date,
        status: reservations.status,
        purpose: reservations.purpose,
      })
      .from(reservations)
      .leftJoin(rooms, eq(reservations.roomId, rooms.id))
      .where(eq(reservations.id, id));

    return reservation[0];
  }

  async getRoomReservationsByDate({ roomId, date }: AvailableSlotsDto) {
    const existing = await this.db
      .select()
      .from(reservations)
      .where(
        and(
          eq(reservations.roomId, roomId),
          eq(reservations.status, 'confirmed'),
          sql`${reservations.date}::date = ${date}::date`
        )
      );

    return existing;
  }

  async createReservation(userId: string, reservation: CreateReservationDto) {
    const newReservation = await this.db
      .insert(reservations)
      .values({
        roomId: reservation.roomId,
        userId: userId,
        date: parseISO(reservation.date),
        status: reservation.status,
        purpose: reservation.purpose,
      })
      .returning();

    return newReservation;
  }

  async updateReservation(id: string, reservation: CreateReservationDto) {
    const updatedReservation = await this.db
      .update(reservations)
      .set({
        ...reservation,
        date: parseISO(reservation.date),
      })
      .where(eq(reservations.id, id))
      .returning();
    return updatedReservation;
  }

  async deleteReservation(id: string) {
    const deletedReservation = await this.db
      .delete(reservations)
      .where(eq(reservations.id, id))
      .returning();
    return deletedReservation;
  }

  async cancelReservation(id: string) {
    const cancelledReservation = await this.db
      .update(reservations)
      .set({ status: 'cancelled' })
      .where(eq(reservations.id, id))
      .returning();
    return cancelledReservation;
  }
}
