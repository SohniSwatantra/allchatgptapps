import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken, NeonAuthUser } from './verify';

export interface AuthenticatedUser {
  id: number;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  neonAuthId: string;
}

export const getAuthUser = async ({
  request,
}: {
  request: NextRequest;
}): Promise<AuthenticatedUser | null> => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const tokenPayload = await verifyToken({ token });

  if (!tokenPayload || !tokenPayload.sub) {
    return null;
  }

  // Find or create user in database
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.neonAuthId, tokenPayload.sub))
    .limit(1);

  if (existingUsers.length > 0) {
    const user = existingUsers[0];
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      neonAuthId: user.neonAuthId!,
    };
  }

  // Create new user if doesn't exist
  if (tokenPayload.email) {
    const [newUser] = await db
      .insert(users)
      .values({
        email: tokenPayload.email,
        name: tokenPayload.name || null,
        avatarUrl: tokenPayload.picture || null,
        neonAuthId: tokenPayload.sub,
      })
      .returning();

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      avatarUrl: newUser.avatarUrl,
      neonAuthId: newUser.neonAuthId!,
    };
  }

  return null;
};

export const requireAuth = async ({
  request,
}: {
  request: NextRequest;
}): Promise<AuthenticatedUser> => {
  const user = await getAuthUser({ request });

  if (!user) {
    throw new Error('UNAUTHORIZED');
  }

  return user;
};
