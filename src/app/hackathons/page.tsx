import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { HackathonCard } from '@/components/hackathons/hackathon-card';
import { listHackathonsQuery } from '@/modules/hackathons';
import { getCurrentUser } from '@/core/auth';
import { canManageHackathon } from '@/core/rbac';

export const metadata = {
  title: 'Hackathons | PuntoHack',
  description: 'Explora y participa en hackathons increíbles',
};

export default async function HackathonsPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string };
}) {
  const user = await getCurrentUser();
  const canCreate = user ? canManageHackathon(user) : false;

  // Fetch hackathons with filters
  const filters: any = {
    limit: 20,
    offset: 0,
  };

  if (searchParams.search) {
    filters.search = searchParams.search;
  }

  if (searchParams.status && searchParams.status !== 'all') {
    filters.status = searchParams.status;
  }

  const { hackathons, total } = await listHackathonsQuery(filters);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                Hackathons
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Descubre y participa en hackathons increíbles
              </p>
            </div>

            {canCreate && (
              <Link href="/hackathons/create">
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Crear Hackathon
                </Button>
              </Link>
            )}
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Buscar hackathons..."
                defaultValue={searchParams.search}
                className="pl-10"
                name="search"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <Link href="/hackathons">
                <Badge
                  variant={!searchParams.status || searchParams.status === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer whitespace-nowrap"
                >
                  Todos
                </Badge>
              </Link>
              <Link href="/hackathons?status=REGISTRATION">
                <Badge
                  variant={searchParams.status === 'REGISTRATION' ? 'success' : 'outline'}
                  className="cursor-pointer whitespace-nowrap"
                >
                  Inscripción Abierta
                </Badge>
              </Link>
              <Link href="/hackathons?status=RUNNING">
                <Badge
                  variant={searchParams.status === 'RUNNING' ? 'info' : 'outline'}
                  className="cursor-pointer whitespace-nowrap"
                >
                  En Curso
                </Badge>
              </Link>
              <Link href="/hackathons?status=JUDGING">
                <Badge
                  variant={searchParams.status === 'JUDGING' ? 'warning' : 'outline'}
                  className="cursor-pointer whitespace-nowrap"
                >
                  Evaluación
                </Badge>
              </Link>
              <Link href="/hackathons?status=FINISHED">
                <Badge
                  variant={searchParams.status === 'FINISHED' ? 'default' : 'outline'}
                  className="cursor-pointer whitespace-nowrap"
                >
                  Finalizados
                </Badge>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {hackathons.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
              No se encontraron hackathons
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              {searchParams.search
                ? 'Intenta con otros términos de búsqueda'
                : 'Aún no hay hackathons disponibles. ¡Sé el primero en crear uno!'}
            </p>
            {canCreate && (
              <Link href="/hackathons/create">
                <Button size="lg" className="mt-6 gap-2">
                  <Plus className="h-5 w-5" />
                  Crear Hackathon
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {total} hackathon{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hackathons.map((hackathon) => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
