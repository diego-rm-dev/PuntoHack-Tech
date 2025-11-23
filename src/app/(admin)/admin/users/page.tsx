import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/core/auth';
import { hasRole } from '@/core/rbac';
import { createClient } from '@/core/supabase/server';
import { UserRoleManager } from './user-role-manager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
      <div className="min-h-screen p-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">User Management</h1>
          <p className="text-red-500">Error loading users. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-base text-slate-600">Manage user roles and permissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-slate-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold">{profiles?.length || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-slate-600 mb-1">Participants</p>
              <p className="text-2xl font-bold">{profiles?.filter((p) => p.role === 'PARTICIPANT').length || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-slate-600 mb-1">Judges</p>
              <p className="text-2xl font-bold">{profiles?.filter((p) => p.role === 'JUDGE').length || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-slate-600 mb-1">Organizers</p>
              <p className="text-2xl font-bold">{profiles?.filter((p) => p.role === 'ORGANIZER').length || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-slate-600 mb-1">Sponsors</p>
              <p className="text-2xl font-bold">{profiles?.filter((p) => p.role === 'SPONSOR').length || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Role
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Joined
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {profiles?.map((profile) => (
                  <tr key={profile.id} className="border-t hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-medium">{profile.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{profile.email || 'No email'}</p>
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
                      <p className="text-sm text-slate-600">
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
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        View Profile
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {profiles?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
