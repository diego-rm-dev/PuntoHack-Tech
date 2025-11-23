import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autenticación - PuntoHack",
  description: "Inicia sesión o regístrate en PuntoHack",
};

/**
 * Layout para rutas de autenticación
 * No incluye navegación para una experiencia limpia
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
