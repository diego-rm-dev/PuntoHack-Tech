import { notFound, redirect } from 'next/navigation';
import { Calendar, Users, Trophy, Clock, MapPin, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getHackathonBySlug, isParticipantRegistered } from '@/modules/hackathons';
import { getCurrentUser } from '@/core/auth';
import { canManageHackathon } from '@/core/rbac';
import { RegisterButton } from '@/components/hackathons/register-button';
import type { HackathonStatus } from '@prisma/client';

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

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const hackathon = await getHackathonBySlug(params.slug);

  if (!hackathon) {
    return {
      title: 'Hackathon no encontrado | PuntoHack',
    };
  }

  return {
    title: `${hackathon.name} | PuntoHack`,
    description: hackathon.description || 'Hackathon en PuntoHack',
  };
}

export default async function HackathonDetailPage({ params }: { params: { slug: string } }) {
  const hackathon = await getHackathonBySlug(params.slug);

  if (!hackathon) {
    notFound();
  }

  const user = await getCurrentUser();
  const canManage = user ? canManageHackathon(user) : false;
  
  let isRegistered = false;
  if (user && user.profile) {
    isRegistered = await isParticipantRegistered(hackathon.id, user.profile.id);
  }

  const statusInfo = statusConfig[hackathon.status];
  const startDate = new Date(hackathon.startsAt);
  const endDate = new Date(hackathon.endsAt);
  const regOpenDate = new Date(hackathon.registrationOpensAt);
  const regCloseDate = new Date(hackathon.registrationClosesAt);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-950 dark:to-slate-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant={statusInfo.variant} className="text-base px-3 py-1">
                {statusInfo.label}
              </Badge>
              {canManage && (
                <Link href={`/hackathons/${hackathon.slug}/dashboard`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{hackathon.name}</h1>

            <div className="flex flex-wrap gap-6 text-slate-200">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {startDate.toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>
                  {hackathon._count.participations} participante
                  {hackathon._count.participations !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <span>
                  {hackathon._count.teams} equipo{hackathon._count.teams !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Acerca del Hackathon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {hackathon.description || 'Sin descripción disponible'}
                </p>
              </CardContent>
            </Card>

            {/* Evaluation Criteria */}
            {hackathon.criteria.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Criterios de Evaluación
                  </CardTitle>
                  <CardDescription>
                    Los proyectos serán evaluados según estos criterios
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {hackathon.criteria.map((criterion, index) => (
                      <div key={criterion.id}>
                        {index > 0 && <Separator className="my-4" />}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-50">
                              {criterion.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Peso: {criterion.weight}</Badge>
                              <Badge variant="outline">Max: {criterion.maxScore}</Badge>
                            </div>
                          </div>
                          {criterion.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {criterion.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Participants */}
            {hackathon.participations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Participantes
                  </CardTitle>
                  <CardDescription>
                    {hackathon._count.participations} persona{hackathon._count.participations !== 1 ? 's' : ''} registrada{hackathon._count.participations !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {hackathon.participations.slice(0, 20).map((participation) => (
                      <div
                        key={participation.profile.id}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                          {participation.profile.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">
                          {participation.profile.name}
                        </span>
                      </div>
                    ))}
                    {hackathon.participations.length > 20 && (
                      <div className="flex items-center px-3 py-2 text-sm text-slate-500">
                        +{hackathon.participations.length - 20} más
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration CTA */}
            {!isRegistered && hackathon.status === 'REGISTRATION' && user && (
              <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
                <CardHeader>
                  <CardTitle className="text-green-900 dark:text-green-100">
                    ¡Inscríbete Ahora!
                  </CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-300">
                    Las inscripciones están abiertas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RegisterButton hackathonId={hackathon.id} />
                </CardContent>
              </Card>
            )}

            {isRegistered && (
              <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
                <CardContent className="pt-6">
                  <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
                    ✓ Estás registrado en este hackathon
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Important Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Fechas Importantes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Inscripciones
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {regOpenDate.toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    -{' '}
                    {regCloseDate.toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Hackathon
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
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
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Team Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Equipos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Tamaño mínimo
                  </span>
                  <span className="font-semibold">{hackathon.minTeamSize}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Tamaño máximo
                  </span>
                  <span className="font-semibold">{hackathon.maxTeamSize}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
