import { Db } from '@vois/db/drizzle';
import { users } from '@vois/db/schemas/user';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { Unauthorized, NotFound } from 'http-errors';

export class UserRepo {
  constructor(private readonly db: Db) {}

  async getCurrentUser() {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      throw new Unauthorized('Unauthorized');
    }

    const user = await this.db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId));

    if (!user[0]) {
      throw new NotFound('User not found');
    }

    return user[0];
  }
}
