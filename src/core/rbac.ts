import type { Role, HackathonStatus } from '@prisma/client';
import type { CurrentUser } from './auth';

export class ForbiddenError extends Error {
  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

// Role checks
export function hasRole(user: CurrentUser | null, roles: Role[]): boolean {
  return !!user?.profile && roles.includes(user.profile.role);
}

export function assertRole(user: CurrentUser | null, roles: Role[]) {
  if (!hasRole(user, roles)) {
    throw new ForbiddenError('Insufficient permissions');
  }
}

// Hackathon permissions
export function canManageHackathon(user: CurrentUser | null): boolean {
  return hasRole(user, ['ADMIN', 'ORGANIZER']);
}

export function canJudgeHackathon(user: CurrentUser | null): boolean {
  return hasRole(user, ['JUDGE', 'ADMIN']);
}

export function canParticipate(user: CurrentUser | null): boolean {
  return hasRole(user, ['PARTICIPANT', 'ADMIN']);
}

// Hackathon state checks
export function canRegister(status: HackathonStatus): boolean {
  return status === 'REGISTRATION';
}

export function canSubmit(status: HackathonStatus): boolean {
  return status === 'RUNNING';
}

export function canJudge(status: HackathonStatus): boolean {
  return status === 'JUDGING';
}

// Team permissions
export function canManageTeam(
  user: CurrentUser | null,
  teamMemberIds: string[]
): boolean {
  return !!user?.profile && teamMemberIds.includes(user.profile.id);
}

// Sponsor permissions
export function canManageSponsor(user: CurrentUser | null): boolean {
  return hasRole(user, ['SPONSOR', 'ADMIN']);
}

export type OrgMemberRole = 'OWNER' | 'MANAGER' | 'VIEWER';

export function canManageOrganization(memberRole?: OrgMemberRole): boolean {
  return memberRole === 'OWNER' || memberRole === 'MANAGER';
}
