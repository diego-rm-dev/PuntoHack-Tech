import Link from 'next/link';
import { Calendar, Users, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { HackathonWithStats } from '@/modules/hackathons/types';
import type { HackathonStatus } from '@prisma/client';

interface HackathonCardProps {
  hackathon: HackathonWithStats;
}

const statusConfig: Record<
  HackathonStatus,
  { variant: 'default' | 'secondary' | 'success' | 'warning' | 'info'; label: string }
> = {
  DRAFT: { variant: 'secondary', label: 'Borrador' },
  REGISTRATION: { variant: 'success', label: 'Inscripción Abierta' },
  RUNNING: { variant: 'info', label: 'En Curso' },
  JUDGING: { variant: 'warning', label: 'Evaluación' },
  FINISHED: { variant: 'default', label: 'Finalizado' },
};

export function HackathonCard({ hackathon }: HackathonCardProps) {
  const statusInfo = statusConfig[hackathon.status];
  const startDate = new Date(hackathon.startsAt);
  const endDate = new Date(hackathon.endsAt);

  return (
    <Link href={`/hackathons/${hackathon.slug}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{hackathon.name}</CardTitle>
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            </div>
            <Trophy className="h-6 w-6 text-slate-400" />
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-2 mb-4 min-h-[2.5rem]">
            {hackathon.description || 'Sin descripción disponible'}
          </CardDescription>

          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {startDate.toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}{' '}
                -{' '}
                {endDate.toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {hackathon._count.participations} participante
                {hackathon._count.participations !== 1 ? 's' : ''}
              </span>
            </div>

            {hackathon._count.teams > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs">
                  {hackathon._count.teams} equipo{hackathon._count.teams !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Equipos: {hackathon.minTeamSize}-{hackathon.maxTeamSize} personas
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
