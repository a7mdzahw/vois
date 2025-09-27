import { Db } from "@vois/db/drizzle";
import { rooms } from "@vois/db/schemas/room";

export class RoomRepo {
  constructor(private readonly db: Db) {}

  async getAllRooms() {
    return this.db.select().from(rooms);
  }
}
