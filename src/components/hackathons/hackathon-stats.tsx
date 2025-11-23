'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Clock, Calendar, TrendingUp } from 'lucide-react';
import type { HackathonWithRelations } from '@/modules/hackathons/types';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';

interface HackathonStatsProps {
  hackathon: HackathonWithRelations;
}

export function HackathonStats({ hackathon }: HackathonStatsProps) {
  const stats = [
    {
      label: 'Participantes',
      value: hackathon._count?.participations ?? 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      description: 'Registrados',
    },
    {
      label: 'Equipos',
      value: hackathon._count?.teams ?? 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      description: 'Formados',
    },
    {
      label: 'Proyectos',
      value: hackathon._count?.submissions ?? 0,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      description: 'Enviados',
    },
    {
      label: 'Criterios',
      value: hackathon.criteria?.length ?? 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      description: 'De evaluación',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'secondary';
      case 'UPCOMING':
        return 'default';
      case 'REGISTRATION':
        return 'default';
      case 'IN_PROGRESS':
        return 'default';
      case 'JUDGING':
        return 'default';
      case 'COMPLETED':
        return 'default';
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'Borrador';
      case 'UPCOMING':
        return 'Próximo';
      case 'REGISTRATION':
        return 'Inscripción Abierta';
      case 'IN_PROGRESS':
        return 'En Progreso';
      case 'JUDGING':
        return 'En Evaluación';
      case 'COMPLETED':
        return 'Finalizado';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">Estado Actual</h3>
                <Badge variant={getStatusColor(hackathon.status)}>
                  {getStatusLabel(hackathon.status)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Creado {formatDistanceToNow(new Date(hackathon.createdAt), { addSuffix: true, locale: es })}
              </p>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Inicia: {format(new Date(hackathon.startsAt), 'PPP', { locale: es })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Finaliza: {format(new Date(hackathon.endsAt), 'PPP', { locale: es })}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Timeline Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Línea de Tiempo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <TimelineItem
              label="Inscripción Abre"
              date={hackathon.registrationOpensAt}
              isPast={new Date() > new Date(hackathon.registrationOpensAt)}
            />
            <TimelineItem
              label="Inscripción Cierra"
              date={hackathon.registrationClosesAt}
              isPast={new Date() > new Date(hackathon.registrationClosesAt)}
            />
            <TimelineItem
              label="Hackathon Inicia"
              date={hackathon.startsAt}
              isPast={new Date() > new Date(hackathon.startsAt)}
            />
            <TimelineItem
              label="Hackathon Finaliza"
              date={hackathon.endsAt}
              isPast={new Date() > new Date(hackathon.endsAt)}
            />
            <TimelineItem
              label="Evaluación Inicia"
              date={hackathon.judgingStartsAt}
              isPast={new Date() > new Date(hackathon.judgingStartsAt)}
            />
            <TimelineItem
              label="Evaluación Finaliza"
              date={hackathon.judgingEndsAt}
              isPast={new Date() > new Date(hackathon.judgingEndsAt)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface TimelineItemProps {
  label: string;
  date: Date;
  isPast: boolean;
}

function TimelineItem({ label, date, isPast }: TimelineItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
          isPast
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-muted-foreground/30 bg-background'
        }`}
      >
        {isPast ? '✓' : '○'}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${isPast ? 'text-foreground' : 'text-muted-foreground'}`}>
          {label}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(date), 'PPpp', { locale: es })}
        </p>
      </div>
      {!isPast && (
        <Badge variant="outline" className="text-xs">
          {formatDistanceToNow(new Date(date), { addSuffix: true, locale: es })}
        </Badge>
      )}
    </div>
  );
}
