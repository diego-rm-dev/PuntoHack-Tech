import { redirect } from 'next/navigation';
import { requireAuth } from '@/core/auth';
import { assertRole } from '@/core/rbac';
import { UserButton } from '@clerk/nextjs';
import { NavLink } from '@/components/ui/nav-link';

export default async function JudgePage() {
  const user = await requireAuth();
  
  try {
    assertRole(user, ['JUDGE', 'ADMIN']);
  } catch (error) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      <nav className="bg-white shadow-sm" style={{ borderBottomColor: '#e2e4e9', borderBottomWidth: '1px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold" style={{ color: '#0b0d0e' }}>⚖️ Panel de Juez</h1>
            </div>
            <div className="flex items-center gap-4">
              <NavLink href="/dashboard">Dashboard</NavLink>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold" style={{ color: '#0b0d0e' }}>Panel de Evaluación</h2>
          <p className="mt-2" style={{ color: '#5c5f6e' }}>
            Bienvenido, {user.profile.name}. Aquí podrás evaluar proyectos.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6" style={{ borderColor: '#e2e4e9', borderWidth: '1px' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#0b0d0e' }}>Hackathons Asignados</h3>
          <p className="mb-4" style={{ color: '#5c5f6e' }}>
            Los hackathons donde estás asignado como juez aparecerán aquí.
          </p>
          <div className="text-center py-12" style={{ color: '#838696' }}>
            <span className="text-4xl block mb-2">📋</span>
            <p>No hay hackathons asignados aún</p>
            <p className="text-sm mt-2">(Esta funcionalidad se implementará en Phase 5)</p>
          </div>
        </div>

        <div className="mt-8 rounded-lg p-4" style={{ backgroundColor: '#ececfe', borderColor: '#606fe5', borderWidth: '1px' }}>
          <p className="text-sm" style={{ color: '#1a284e' }}>
            ℹ️ <strong>RBAC Activo:</strong> Solo usuarios con rol JUDGE o ADMIN pueden acceder a esta página.
          </p>
        </div>
      </main>
    </div>
  );
}
