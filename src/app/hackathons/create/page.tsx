import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/core/auth';
import { canManageHackathon } from '@/core/rbac';
import { CreateHackathonForm } from '@/components/hackathons/create-hackathon-form';

export const metadata = {
  title: 'Crear Hackathon | PuntoHack',
  description: 'Crea un nuevo hackathon',
};

export default async function CreateHackathonPage() {
  const user = await getCurrentUser();

  if (!user || !canManageHackathon(user)) {
    redirect('/hackathons');
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
            Crear Nuevo Hackathon
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Completa la información para crear un hackathon increíble
          </p>
        </div>

        <CreateHackathonForm />
      </div>
    </div>
  );
}
