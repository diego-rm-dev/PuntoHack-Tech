import { redirect } from 'next/navigation';
import { requireAuth } from '@/core/auth';
import { assertRole } from '@/core/rbac';
import { UserButton } from '@clerk/nextjs';
import { NavLink } from '@/components/ui/nav-link';
import { InteractiveButton } from '@/components/ui/interactive-button';

export default async function AdminPage() {
  // Requiere autenticación
  const user = await requireAuth();
  
  // Verifica que el usuario tenga rol ADMIN u ORGANIZER
  try {
    assertRole(user, ['ADMIN', 'ORGANIZER']);
  } catch (error) {
    // Si no tiene permisos, redirigir al dashboard
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      <nav className="bg-white shadow-sm" style={{ borderBottomColor: '#e2e4e9', borderBottomWidth: '1px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold" style={{ color: '#0b0d0e' }}>🎮 Admin Panel</h1>
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
          <h2 className="text-3xl font-bold" style={{ color: '#0b0d0e' }}>Panel de Administración</h2>
          <p className="mt-2" style={{ color: '#5c5f6e' }}>
            Bienvenido, {user.profile.name}. Tu rol es <strong style={{ color: '#0b0d0e' }}>{user.profile.role}</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Hackathons */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow" style={{ borderColor: '#e2e4e9', borderWidth: '1px' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ececfe' }}>
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg" style={{ color: '#0b0d0e' }}>Hackathons</h3>
                <p className="text-sm" style={{ color: '#838696' }}>Gestionar eventos</p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: '#5c5f6e' }}>
              Crear, editar y administrar hackathons
            </p>
            <InteractiveButton variant="primary">
              Ver Hackathons
            </InteractiveButton>
          </div>

          {/* Criterios */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow" style={{ borderColor: '#e2e4e9', borderWidth: '1px' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ececfe' }}>
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg" style={{ color: '#0b0d0e' }}>Criterios</h3>
                <p className="text-sm" style={{ color: '#838696' }}>Evaluación</p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: '#5c5f6e' }}>
              Configurar criterios de evaluación
            </p>
            <InteractiveButton variant="primary">
              Gestionar Criterios
            </InteractiveButton>
          </div>

          {/* Jueces */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow" style={{ borderColor: '#e2e4e9', borderWidth: '1px' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e6f7ed' }}>
                <span className="text-2xl">⚖️</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg" style={{ color: '#0b0d0e' }}>Jueces</h3>
                <p className="text-sm" style={{ color: '#838696' }}>Asignación</p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: '#5c5f6e' }}>
              Asignar jueces a hackathons
            </p>
            <InteractiveButton variant="success">
              Gestionar Jueces
            </InteractiveButton>
          </div>

          {/* Patrocinadores */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow" style={{ borderColor: '#e2e4e9', borderWidth: '1px' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fffcf7' }}>
                <span className="text-2xl">🏢</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg" style={{ color: '#0b0d0e' }}>Patrocinadores</h3>
                <p className="text-sm" style={{ color: '#838696' }}>Sponsors</p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: '#5c5f6e' }}>
              Gestionar organizaciones y patrocinios
            </p>
            <InteractiveButton variant="warning">
              Ver Patrocinadores
            </InteractiveButton>
          </div>

          {/* Equipos */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow" style={{ borderColor: '#e2e4e9', borderWidth: '1px' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ececfe' }}>
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg" style={{ color: '#0b0d0e' }}>Equipos</h3>
                <p className="text-sm" style={{ color: '#838696' }}>Participantes</p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: '#5c5f6e' }}>
              Ver equipos y participantes registrados
            </p>
            <InteractiveButton variant="primary">
              Ver Equipos
            </InteractiveButton>
          </div>

          {/* Resultados */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow" style={{ borderColor: '#e2e4e9', borderWidth: '1px' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fffcf7' }}>
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg" style={{ color: '#0b0d0e' }}>Resultados</h3>
                <p className="text-sm" style={{ color: '#838696' }}>Leaderboard</p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: '#5c5f6e' }}>
              Ver rankings y estadísticas
            </p>
            <InteractiveButton variant="warning">
              Ver Resultados
            </InteractiveButton>
          </div>
        </div>

        <div className="mt-8 rounded-lg p-4" style={{ backgroundColor: '#ececfe', borderColor: '#606fe5', borderWidth: '1px' }}>
          <p className="text-sm" style={{ color: '#1a284e' }}>
            ℹ️ <strong>RBAC Activo:</strong> Esta página solo es accesible para usuarios con rol ADMIN u ORGANIZER.
          </p>
        </div>
      </main>
    </div>
  );
}
