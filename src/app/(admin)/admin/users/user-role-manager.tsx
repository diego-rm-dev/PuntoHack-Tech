'use client';

import { useState } from 'react';
import { updateUserRoleAction } from './actions';
import { Badge } from '@/components/ui/badge';

interface UserRoleManagerProps {
  profileId: string;
  currentRole: string;
  isCurrentUser: boolean;
  currentUserRole: string; // Role of the logged-in user
}

const roleColors: Record<string, { bg: string; text: string }> = {
  ADMIN: { bg: '#e43157', text: '#ffffff' },
  ORGANIZER: { bg: '#606fe5', text: '#ffffff' },
  JUDGE: { bg: '#009ee3', text: '#ffffff' },
  SPONSOR: { bg: '#ffc20e', text: '#0b0d0e' },
  PARTICIPANT: { bg: '#19a44b', text: '#ffffff' },
};

export function UserRoleManager({
  profileId,
  currentRole,
  isCurrentUser,
  currentUserRole,
}: UserRoleManagerProps) {
  const [role, setRole] = useState(currentRole);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  async function handleRoleChange(newRole: string) {
    if (newRole === role) return;

    setIsUpdating(true);
    setMessage('');

    try {
      const result = await updateUserRoleAction(profileId, newRole);

      if (result.success) {
        setRole(newRole);
        setMessage('✓ Updated');
        setTimeout(() => setMessage(''), 2000);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch {
      setMessage('Error updating role');
    } finally {
      setIsUpdating(false);
    }
  }

  const colors = roleColors[role] || { bg: '#e2e4e9', text: '#0b0d0e' };

  if (isCurrentUser) {
    // Can't change your own role
    return (
      <div className="flex items-center gap-2">
        <Badge>{role}</Badge>
        <span className="text-xs text-slate-500">(You)</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        onChange={(e) => handleRoleChange(e.target.value)}
        disabled={isUpdating}
        className="px-3 py-1 rounded-lg border-2 text-sm font-medium transition-all focus:outline-none focus:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
      >
        <option value="PARTICIPANT">Participant</option>
        <option value="JUDGE">Judge</option>
        <option value="ORGANIZER">Organizer</option>
        <option value="SPONSOR">Sponsor</option>
        {/* Only ADMIN can assign ADMIN role */}
        {currentUserRole === 'ADMIN' && (
          <option value="ADMIN">Admin</option>
        )}
      </select>

      {message && (
        <span className={`text-xs font-medium ${
          message.startsWith('✓') ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </span>
      )}
    </div>
  );
}
