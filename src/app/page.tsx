import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui/button-link';
import { CardLink } from '@/components/ui/card-link';

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      <nav className="border-b bg-white/80 backdrop-blur-sm" style={{ borderColor: '#e2e4e9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold" style={{ color: '#606fe5' }}>
              PuntoHack
            </h1>
            <div className="flex gap-4">
              {user ? (
                <ButtonLink href="/dashboard" variant="primary" size="sm">
                  Dashboard
                </ButtonLink>
              ) : (
                <>
                  <ButtonLink href="/sign-in" variant="secondary" size="sm">
                    Iniciar Sesión
                  </ButtonLink>
                  <ButtonLink href="/sign-up" variant="primary" size="sm">
                    Registrarse
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h2 className="text-5xl font-bold" style={{ color: '#0b0d0e' }}>
            Plataforma Profesional de
            <span className="block" style={{ color: '#606fe5' }}>
              Hackathons
            </span>
          </h2>
          
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#5c5f6e' }}>
            Organiza, participa y evalúa hackathons de forma profesional. 
            Conecta con equipos, patrocinadores y jueces en un solo lugar.
          </p>

          <div className="flex gap-4 justify-center pt-8">
            {user ? (
              <ButtonLink href="/dashboard" variant="primary" size="lg">
                Ir al Dashboard
              </ButtonLink>
            ) : (
              <>
                <ButtonLink href="/sign-up" variant="primary" size="lg">
                  Comenzar Gratis
                </ButtonLink>
                <ButtonLink href="/test-db" variant="secondary" size="lg">
                  Ver Demo
                </ButtonLink>
              </>
            )}
          </div>

          <div className="pt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: '#e2e4e9', borderWidth: '1px' }}>
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#0b0d0e' }}>Organizadores</h3>
              <p className="text-sm" style={{ color: '#5c5f6e' }}>Gestiona hackathons completos con herramientas profesionales</p>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: '#e2e4e9', borderWidth: '1px' }}>
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#0b0d0e' }}>Participantes</h3>
              <p className="text-sm" style={{ color: '#5c5f6e' }}>Forma equipos, envía proyectos y compite por premios</p>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: '#e2e4e9', borderWidth: '1px' }}>
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#0b0d0e' }}>Jueces</h3>
              <p className="text-sm" style={{ color: '#5c5f6e' }}>Evalúa proyectos con criterios personalizados</p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: '#e2e4e9', borderWidth: '1px' }}>
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#0b0d0e' }}>Patrocinadores</h3>
              <p className="text-sm" style={{ color: '#5c5f6e' }}>Crea desafíos y descubre talento innovador</p>
            </div>
          </div>

          {user && (
            <div className="pt-16">
              <div className="bg-white rounded-xl shadow-lg p-8" style={{ borderColor: '#e2e4e9', borderWidth: '1px' }}>
                <h3 className="text-2xl font-bold mb-6" style={{ color: '#0b0d0e' }}>Acceso Rápido</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <CardLink href="/dashboard" hoverColor="#606fe5" hoverBg="#ececfe">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="font-semibold" style={{ color: '#0b0d0e' }}>Dashboard</div>
                    <div className="text-sm" style={{ color: '#5c5f6e' }}>Panel principal</div>
                  </CardLink>
                  <CardLink href="/admin" hoverColor="#606fe5" hoverBg="#ececfe">
                    <div className="text-2xl mb-2">🎮</div>
                    <div className="font-semibold" style={{ color: '#0b0d0e' }}>Admin</div>
                    <div className="text-sm" style={{ color: '#5c5f6e' }}>Gestión de eventos</div>
                  </CardLink>
                  <CardLink href="/judge" hoverColor="#606fe5" hoverBg="#ececfe">
                    <div className="text-2xl mb-2">⚖️</div>
                    <div className="font-semibold" style={{ color: '#0b0d0e' }}>Juez</div>
                    <div className="text-sm" style={{ color: '#5c5f6e' }}>Evaluación</div>
                  </CardLink>
                  <CardLink href="/sponsor" hoverColor="#ffc20e" hoverBg="#fffcf7">
                    <div className="text-2xl mb-2">🏢</div>
                    <div className="font-semibold" style={{ color: '#0b0d0e' }}>Sponsor</div>
                    <div className="text-sm" style={{ color: '#5c5f6e' }}>Patrocinador</div>
                  </CardLink>
                </div>
                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#ececfe', borderColor: '#606fe5', borderWidth: '1px' }}>
                  <p className="text-sm" style={{ color: '#1a284e' }}>
                    ✨ <strong>RBAC Implementado:</strong> Las páginas verifican tu rol automáticamente. 
                    Si no tienes permisos, serás redirigido al dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
