import { redirect } from 'next/navigation';
import { requireAuth } from '@/core/auth';
import { assertRole } from '@/core/rbac';
import { UserButton } from '@clerk/nextjs';
import { NavLink } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

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
          <h2 className="text-3xl font-bold">Panel de Administración</h2>
          <p className="mt-2 text-slate-600">
            Bienvenido, {user.profile.name}. Tu rol es <Badge>{user.profile.role}</Badge>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Users - NEW */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <CardTitle>Users</CardTitle>
                  <CardDescription>Gestión de roles</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Administrar usuarios y cambiar roles
              </p>
              <Link href="/admin/users">
                <Button className="w-full">Gestionar Usuarios</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Hackathons */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <CardTitle>Hackathons</CardTitle>
                  <CardDescription>Gestionar eventos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Crear, editar y administrar hackathons
              </p>
              <Link href="/hackathons">
                <Button className="w-full">Ver Hackathons</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Criterios */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <CardTitle>Criterios</CardTitle>
                  <CardDescription>Evaluación</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Configurar criterios de evaluación
              </p>
              <Button className="w-full" disabled>Gestionar Criterios</Button>
            </CardContent>
          </Card>

          {/* Jueces */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                  <span className="text-2xl">⚖️</span>
                </div>
                <div>
                  <CardTitle>Jueces</CardTitle>
                  <CardDescription>Asignación</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Asignar jueces a hackathons
              </p>
              <Button className="w-full" variant="outline" disabled>Gestionar Jueces</Button>
            </CardContent>
          </Card>

          {/* Patrocinadores */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center">
                  <span className="text-2xl">🏢</span>
                </div>
                <div>
                  <CardTitle>Patrocinadores</CardTitle>
                  <CardDescription>Sponsors</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Gestionar organizaciones y patrocinios
              </p>
              <Button className="w-full" variant="outline" disabled>Ver Patrocinadores</Button>
            </CardContent>
          </Card>

          {/* Equipos */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <CardTitle>Equipos</CardTitle>
                  <CardDescription>Participantes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Ver equipos y participantes registrados
              </p>
              <Button className="w-full" disabled>Ver Equipos</Button>
            </CardContent>
          </Card>

          {/* Resultados */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <div>
                  <CardTitle>Resultados</CardTitle>
                  <CardDescription>Leaderboard</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Ver rankings y estadísticas
              </p>
              <Button className="w-full" variant="outline" disabled>Ver Resultados</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-900">
              ℹ️ <strong>RBAC Activo:</strong> Esta página solo es accesible para usuarios con rol ADMIN u ORGANIZER.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
