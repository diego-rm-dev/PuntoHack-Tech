import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { getOrCreateProfile, getCurrentUser } from '@/core/auth';

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
    <div className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      <nav className="bg-white shadow-sm" style={{ borderBottomColor: '#e2e4e9', borderBottomWidth: '1px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold" style={{ color: '#0b0d0e' }}>PuntoHack</h1>
              <span className="text-sm" style={{ color: '#5c5f6e' }}>Dashboard</span>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6" style={{ borderColor: '#e2e4e9', borderWidth: '1px' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#0b0d0e' }}>¡Bienvenido! 👋</h2>
          <div className="space-y-2">
            <p><strong style={{ color: '#0b0d0e' }}>Nombre:</strong> <span style={{ color: '#5c5f6e' }}>{profile.name}</span></p>
            <p><strong style={{ color: '#0b0d0e' }}>Email:</strong> <span style={{ color: '#5c5f6e' }}>{profile.email}</span></p>
            <p><strong style={{ color: '#0b0d0e' }}>Rol:</strong> <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#ececfe', color: '#1a284e' }}>{profile.role}</span></p>
            {profile.bio && <p><strong style={{ color: '#0b0d0e' }}>Bio:</strong> <span style={{ color: '#5c5f6e' }}>{profile.bio}</span></p>}
            {profile.techStack && profile.techStack.length > 0 && (
              <div>
                <strong style={{ color: '#0b0d0e' }}>Tech Stack:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.techStack.map((tech) => (
                    <span key={tech} className="px-2 py-1 rounded text-sm" style={{ backgroundColor: '#ebe8e0', color: '#0b0d0e' }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6" style={{ borderColor: '#e2e4e9', borderWidth: '1px' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#0b0d0e' }}>Datos del Perfil (Debug)</h2>
          <pre className="p-4 rounded overflow-auto text-sm" style={{ backgroundColor: '#f9f7f0', color: '#0b0d0e' }}>
            {JSON.stringify(profile, null, 2)}
          </pre>
          <p className="text-xs mt-2" style={{ color: '#838696' }}>
            ℹ️ Perfil cacheado por 5 minutos para mejor rendimiento
          </p>
        </div>
      </main>
    </div>
  );
}
