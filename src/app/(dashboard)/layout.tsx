import type { Metadata } from "next";
import { UserButton } from '@clerk/nextjs';
import { NavLink } from '@/components/common';

export const metadata: Metadata = {
  title: "Dashboard - PuntoHack",
  description: "Tu espacio personal en PuntoHack",
};

/**
 * Layout para rutas de dashboard
 * Incluye navegación compartida
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      {/* Navbar */}
      <nav className="bg-white shadow-sm" style={{ borderBottomColor: '#e2e4e9', borderBottomWidth: '1px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold" style={{ color: '#0b0d0e' }}>
                🎮 PuntoHack
              </h1>
              <div className="hidden md:flex gap-4">
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/hackathons">Hackathons</NavLink>
                <NavLink href="/teams">Equipos</NavLink>
              </div>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
