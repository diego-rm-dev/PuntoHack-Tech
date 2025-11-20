import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from './db';
import type { Role } from '@prisma/client';

export interface CurrentUser {
  userId: string;
  profile: {
    id: string;
    name: string;
    email: string | null;
    role: Role;
    avatarUrl: string | null;
  } | null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
    },
  });

  return {
    userId,
    profile,
  };
}

export async function getOrCreateProfile() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) {
    throw new Error('Unauthorized');
  }

  let profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        userId,
        name: clerkUser.fullName || clerkUser.username || 'User',
        email: clerkUser.emailAddresses[0]?.emailAddress,
        avatarUrl: clerkUser.imageUrl,
      },
    });
  }

  return profile;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user?.profile) {
    throw new Error('Unauthorized');
  }
  return user;
}
