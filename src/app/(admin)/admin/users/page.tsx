import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/core/auth';
import { hasRole } from '@/core/rbac';
import { createClient } from '@/core/supabase/server';
import { UserRoleManager } from './user-role-manager';

export default async function AdminUsersPage() {
  const user = await getCurrentUser();

  // Only ADMIN or ORGANIZER can access this page
  if (!hasRole(user, ['ADMIN', 'ORGANIZER'])) {
    redirect('/dashboard');
  }

  const supabase = await createClient();

  // Fetch all profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, userId, name, email, role, createdAt')
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error);
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: '#fafafa' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6" style={{ color: '#0b0d0e' }}>
            User Management
          </h1>
          <p className="text-red-500">Error loading users. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#fafafa' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#0b0d0e' }}>
            User Management
          </h1>
          <p className="text-base" style={{ color: '#5c5f6e' }}>
            Manage user roles and permissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border" style={{ borderColor: '#e2e4e9' }}>
            <p className="text-sm font-medium mb-1" style={{ color: '#5c5f6e' }}>
              Total Users
            </p>
            <p className="text-2xl font-bold" style={{ color: '#0b0d0e' }}>
              {profiles?.length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border" style={{ borderColor: '#e2e4e9' }}>
            <p className="text-sm font-medium mb-1" style={{ color: '#5c5f6e' }}>
              Participants
            </p>
            <p className="text-2xl font-bold" style={{ color: '#0b0d0e' }}>
              {profiles?.filter((p) => p.role === 'PARTICIPANT').length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border" style={{ borderColor: '#e2e4e9' }}>
            <p className="text-sm font-medium mb-1" style={{ color: '#5c5f6e' }}>
              Judges
            </p>
            <p className="text-2xl font-bold" style={{ color: '#0b0d0e' }}>
              {profiles?.filter((p) => p.role === 'JUDGE').length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border" style={{ borderColor: '#e2e4e9' }}>
            <p className="text-sm font-medium mb-1" style={{ color: '#5c5f6e' }}>
              Organizers
            </p>
            <p className="text-2xl font-bold" style={{ color: '#0b0d0e' }}>
              {profiles?.filter((p) => p.role === 'ORGANIZER').length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border" style={{ borderColor: '#e2e4e9' }}>
            <p className="text-sm font-medium mb-1" style={{ color: '#5c5f6e' }}>
              Sponsors
            </p>
            <p className="text-2xl font-bold" style={{ color: '#0b0d0e' }}>
              {profiles?.filter((p) => p.role === 'SPONSOR').length || 0}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: '#e2e4e9' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#f9f7f0' }}>
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: '#0b0d0e' }}>
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: '#0b0d0e' }}>
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: '#0b0d0e' }}>
                    Role
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: '#0b0d0e' }}>
                    Joined
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: '#0b0d0e' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {profiles?.map((profile) => (
                  <tr
                    key={profile.id}
                    className="border-t"
                    style={{ borderColor: '#e2e4e9' }}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium" style={{ color: '#0b0d0e' }}>
                        {profile.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm" style={{ color: '#5c5f6e' }}>
                        {profile.email || 'No email'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <UserRoleManager
                        profileId={profile.id}
                        currentRole={profile.role}
                        isCurrentUser={profile.userId === user?.userId}
                        currentUserRole={user?.profile?.role || 'PARTICIPANT'}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm" style={{ color: '#5c5f6e' }}>
                        {new Date(profile.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`/profiles/${profile.id}`}
                        className="text-sm font-medium hover:underline"
                        style={{ color: '#606fe5' }}
                      >
                        View Profile
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {profiles?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: '#5c5f6e' }}>
              No users found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
