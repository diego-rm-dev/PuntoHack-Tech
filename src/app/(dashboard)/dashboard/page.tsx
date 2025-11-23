import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { getOrCreateProfile, getCurrentUser } from '@/core/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function DashboardPage() {
  // Usar el nuevo sistema de autenticación con caché
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  // Si no hay perfil, crearlo automáticamente
  if (!user.profile) {
    await getOrCreateProfile();
    // Recargar la página para obtener el perfil con caché
    redirect('/dashboard');
  }

  const { profile } = user;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">PuntoHack</h1>
              <span className="text-sm text-slate-600">Dashboard</span>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">¡Bienvenido! 👋</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Nombre:</strong> <span className="text-slate-600">{profile.name}</span></p>
            <p><strong>Email:</strong> <span className="text-slate-600">{profile.email}</span></p>
            <p><strong>Rol:</strong> <Badge>{profile.role}</Badge></p>
            {profile.bio && <p><strong>Bio:</strong> <span className="text-slate-600">{profile.bio}</span></p>}
            {profile.techStack && profile.techStack.length > 0 && (
              <div>
                <strong>Tech Stack:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary">{tech}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Datos del Perfil (Debug)</CardTitle>
            <CardDescription>
              ℹ️ Perfil cacheado por 5 minutos para mejor rendimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-slate-50 rounded overflow-auto text-sm">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
