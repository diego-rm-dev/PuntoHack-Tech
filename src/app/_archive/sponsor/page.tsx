import { redirect } from 'next/navigation';
import { requireAuth } from '@/core/auth';
import { assertRole } from '@/core/rbac';
import { UserButton } from '@clerk/nextjs';
import { NavLink } from '@/components/common';
import { InteractiveButton } from '@/components/ui';

export default async function SponsorPage() {
  const user = await requireAuth();
  
  try {
    assertRole(user, ['SPONSOR', 'ADMIN']);
  } catch (error) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      <nav className="bg-white shadow-sm" style={{ borderBottomColor: '#e2e4e9', borderBottomWidth: '1px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold" style={{ color: '#0b0d0e' }}>🏢 Portal de Patrocinador</h1>
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
          <h2 className="text-3xl font-bold" style={{ color: '#0b0d0e' }}>Portal de Patrocinador</h2>
          <p className="mt-2" style={{ color: '#5c5f6e' }}>
            Bienvenido, {user.profile.name}. Gestiona tus patrocinios y desafíos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hackathons Patrocinados */}
          <div className="bg-white rounded-lg shadow p-6" style={{ borderColor: '#e2e4e9', borderWidth: '1px' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ececfe' }}>
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg" style={{ color: '#0b0d0e' }}>Hackathons Patrocinados</h3>
                <p className="text-sm" style={{ color: '#838696' }}>Eventos activos</p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: '#5c5f6e' }}>
              Visualiza los hackathons donde tu organización es patrocinador
            </p>
            <div className="text-center py-8" style={{ color: '#838696' }}>
              <span className="text-3xl block mb-2">📋</span>
              <p className="text-sm">Sin patrocinios activos</p>
            </div>
          </div>

          {/* Desafíos */}
          <div className="bg-white rounded-lg shadow p-6" style={{ borderColor: '#e2e4e9', borderWidth: '1px' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fffcf7' }}>
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg" style={{ color: '#0b0d0e' }}>Desafíos</h3>
                <p className="text-sm" style={{ color: '#838696' }}>Challenges</p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: '#5c5f6e' }}>
              Crea y gestiona desafíos específicos para participantes
            </p>
            <InteractiveButton variant="warning">
              Crear Desafío
            </InteractiveButton>
          </div>

          {/* Proyectos */}
          <div className="bg-white rounded-lg shadow p-6" style={{ borderColor: '#e2e4e9', borderWidth: '1px' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e6f7ed' }}>
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg" style={{ color: '#0b0d0e' }}>Proyectos</h3>
                <p className="text-sm" style={{ color: '#838696' }}>Submissions</p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: '#5c5f6e' }}>
              Explora proyectos que abordan tus desafíos
            </p>
            <InteractiveButton variant="success">
              Ver Proyectos
            </InteractiveButton>
          </div>

          {/* Shortlist */}
          <div className="bg-white rounded-lg shadow p-6" style={{ borderColor: '#e2e4e9', borderWidth: '1px' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fffcf7' }}>
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg" style={{ color: '#0b0d0e' }}>Favoritos</h3>
                <p className="text-sm" style={{ color: '#838696' }}>Shortlist</p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: '#5c5f6e' }}>
              Tus proyectos favoritos guardados
            </p>
            <InteractiveButton variant="warning">
              Ver Favoritos
            </InteractiveButton>
          </div>
        </div>

        <div className="mt-8 rounded-lg p-4" style={{ backgroundColor: '#fffcf7', borderColor: '#ffc20e', borderWidth: '1px' }}>
          <p className="text-sm" style={{ color: '#2b3945' }}>
            ℹ️ <strong>RBAC Activo:</strong> Solo usuarios con rol SPONSOR o ADMIN pueden acceder a esta página.
          </p>
        </div>

        <div className="mt-4 rounded-lg p-4" style={{ backgroundColor: '#f9f7f0', borderColor: '#e2e4e9', borderWidth: '1px' }}>
          <p className="text-sm" style={{ color: '#5c5f6e' }}>
            📌 <strong>Nota:</strong> Las funcionalidades completas de patrocinador se implementarán en Phase 6.
          </p>
        </div>
      </main>
    </div>
  );
}
