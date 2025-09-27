import { Db } from '@vois/db/drizzle';
import { users } from '@vois/db/schemas/user';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export class UserRepo {
  constructor(private readonly db: Db) {}

  async getCurrentUser() {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await this.db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId));

    if (!user[0]) {
      throw NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return user[0];
  }
}
