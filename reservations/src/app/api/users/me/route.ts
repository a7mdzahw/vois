import { db } from '@vois/db/drizzle';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { users } from '@vois/db/schemas/user';
import { eq } from 'drizzle-orm';

export async function GET() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId ?? ''));

  if (!user[0]) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user[0]);
}
