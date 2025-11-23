import type { Metadata } from "next";
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { requireAuth } from '@/core/auth';
import { hasRole } from '@/core/rbac';
import { NavLink } from '@/components/common';

export const metadata: Metadata = {
  title: "Admin - PuntoHack",
  description: "Panel de administración de PuntoHack",
};

/**
 * Layout para rutas de administración
 * Requiere permisos de ADMIN u ORGANIZER
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar permisos
  const user = await requireAuth();
  if (!hasRole(user, ['ADMIN', 'ORGANIZER'])) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      {/* Admin Navbar */}
      <nav className="bg-white shadow-sm" style={{ borderBottomColor: '#e2e4e9', borderBottomWidth: '1px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold" style={{ color: '#0b0d0e' }}>
                🛡️ Admin Panel
              </h1>
              <div className="hidden md:flex gap-4">
                <NavLink href="/admin">Dashboard</NavLink>
                <NavLink href="/admin/users">Usuarios</NavLink>
                <NavLink href="/admin/hackathons">Hackathons</NavLink>
                <NavLink href="/dashboard">← Volver</NavLink>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: '#ececfe', color: '#606fe5' }}>
                {user.profile.role}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
