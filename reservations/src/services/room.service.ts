import { RoomRepo } from "@repos/room.repo";
import { db } from "@vois/db/drizzle";

export class RoomService {
  private readonly roomRepo = new RoomRepo(db);

  async getAllRooms() {
    return this.roomRepo.getAllRooms();
  }
}
