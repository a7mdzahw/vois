import { CreateReservationDto } from '@contexts/reservation.context';
import { ReservationRepo } from '@repos/reservation.repo';
import { UserRepo } from '@repos/user.repo';
import { db } from '@vois/db/drizzle';
import { isEqual } from 'date-fns';
import { generateSlots } from '@utils/slots';
import { NotFound, Unauthorized } from 'http-errors';

export class ReservationService {
  private async isReservationOwner(id: string) {
    const userRepo = new UserRepo(db);
    const user = await userRepo.getCurrentUser();
    const reservationRepo = new ReservationRepo(db);
    const reservation = await reservationRepo.getReservationById(id);
    return reservation.userId === user.id;
  }

  async getUserReservations() {
    const userRepo = new UserRepo(db);
    const reservationRepo = new ReservationRepo(db);
    const user = await userRepo.getCurrentUser();
    const reservations = await reservationRepo.getUserReservation(user.id);
    return reservations;
  }

  async getReservationById(id: string) {
    const reservationRepo = new ReservationRepo(db);
    const reservation = await reservationRepo.getReservationById(id);

    if (!reservation) {
      throw new NotFound('Reservation not found');
    }

    if (!this.isReservationOwner(id)) {
      throw new Unauthorized('Unauthorized');
    }

    return reservation;
  }

  async createReservation(reservation: CreateReservationDto) {
    const userRepo = new UserRepo(db);
    const reservationRepo = new ReservationRepo(db);
    const user = await userRepo.getCurrentUser();
    const newReservation = await reservationRepo.createReservation(
      user.id,
      reservation,
    );
    return newReservation;
  }

  async updateReservation(id: string, reservation: CreateReservationDto) {
    if (!this.isReservationOwner(id)) {
      throw new Unauthorized('Unauthorized');
    }
    const reservationRepo = new ReservationRepo(db);
    const updatedReservation = await reservationRepo.updateReservation(
      id,
      reservation,
    );

    if (!updatedReservation[0]) {
      throw new NotFound('Reservation not found');
    }

    return updatedReservation;
  }

  async deleteReservation(id: string) {
    if (!this.isReservationOwner(id)) {
      throw new Unauthorized('Unauthorized');
    }
    const reservationRepo = new ReservationRepo(db);
    const deletedReservation = await reservationRepo.deleteReservation(id);
    return deletedReservation;
  }

  async cancelReservation(id: string) {
    if (!this.isReservationOwner(id)) {
      throw new Unauthorized('Unauthorized');
    }
    const reservationRepo = new ReservationRepo(db);
    const cancelledReservation = await reservationRepo.cancelReservation(id);
    return cancelledReservation;
  }

  async getRoomAvailableSlots(roomId: string, date: string) {
    // TODO: Make this dynamic based on the room's working hours
    const open = `${date}T09:00:00`;
    const close = `${date}T18:00:00`;

    const reservationRepo = new ReservationRepo(db);
    const reservedSlots = await reservationRepo.getRoomReservationsByDate(
      roomId,
      date,
    );

    const slots = generateSlots(open, close, 30); // 30 minute slots

    return slots.map((slot) => {
      const isReserved = reservedSlots.some((r) => isEqual(slot.start, r.date));
      return {
        id: slot.start.toISOString(),
        start: slot.start,
        end: slot.end,
        available: !isReserved,
      };
    });
  }
}
