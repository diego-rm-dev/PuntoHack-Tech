'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowRight, PlayCircle, PauseCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { updateHackathonStatus } from '@/modules/hackathons/actions';
import type { HackathonWithRelations } from '@/modules/hackathons/types';
import { HackathonStatus } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface StateTransitionProps {
  hackathon: HackathonWithRelations;
}

const STATUS_CONFIG: Record<HackathonStatus, {
  label: string;
  description: string;
  color: string;
  icon: typeof PlayCircle;
}> = {
  DRAFT: {
    label: 'Borrador',
    description: 'El hackathon está en preparación',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    icon: PauseCircle,
  },
  REGISTRATION: {
    label: 'Inscripción Abierta',
    description: 'Los participantes pueden registrarse',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: PlayCircle,
  },
  RUNNING: {
    label: 'En Progreso',
    description: 'El hackathon está activo',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    icon: PlayCircle,
  },
  JUDGING: {
    label: 'En Evaluación',
    description: 'Los jueces están evaluando los proyectos',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    icon: CheckCircle,
  },
  FINISHED: {
    label: 'Finalizado',
    description: 'El hackathon ha concluido',
    color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    icon: CheckCircle,
  },
};

const STATUS_FLOW: Record<HackathonStatus, HackathonStatus[]> = {
  DRAFT: ['REGISTRATION'],
  REGISTRATION: ['RUNNING'],
  RUNNING: ['JUDGING'],
  JUDGING: ['FINISHED'],
  FINISHED: [],
};

export function StateTransition({ hackathon }: StateTransitionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [targetStatus, setTargetStatus] = useState<HackathonStatus | null>(null);

  const currentStatus = hackathon.status as HackathonStatus;
  const availableTransitions = STATUS_FLOW[currentStatus] || [];

  const handleStatusChange = async (newStatus: HackathonStatus) => {
    setTargetStatus(newStatus);
    setShowDialog(true);
  };

  const confirmStatusChange = async () => {
    if (!targetStatus) return;

    try {
      setLoading(true);
      const result = await updateHackathonStatus(hackathon.id, targetStatus);
      
      if (result.success) {
        toast.success(`Estado cambiado a: ${STATUS_CONFIG[targetStatus].label}`);
        router.refresh();
      } else {
        toast.error(result.error || 'Error al cambiar el estado');
      }
    } catch {
      toast.error('Error al cambiar el estado');
    } finally {
      setLoading(false);
      setShowDialog(false);
      setTargetStatus(null);
    }
  };

  if (availableTransitions.length === 0) {
    const config = STATUS_CONFIG[currentStatus];
    const Icon = config.icon;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            Estado del Hackathon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <Badge className={config.color}>{config.label}</Badge>
              <p className="text-sm text-muted-foreground mt-2">{config.description}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentStatus === HackathonStatus.FINISHED ? 'Hackathon finalizado' : 'No hay transiciones disponibles'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CurrentIcon = STATUS_CONFIG[currentStatus].icon;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CurrentIcon className="h-5 w-5" />
            Gestión de Estado
          </CardTitle>
          <CardDescription>
            Controla la fase actual del hackathon y las transiciones disponibles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Estado Actual</p>
              <Badge className={STATUS_CONFIG[currentStatus].color}>
                {STATUS_CONFIG[currentStatus].label}
              </Badge>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Transiciones Disponibles</p>
              <div className="flex gap-2">
                {availableTransitions.map((status) => {
                  const config = STATUS_CONFIG[status];
                  const Icon = config.icon;
                  
                  return (
                    <Button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      variant="outline"
                      size="sm"
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {config.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Status Flow Visualization */}
          <div className="p-4 border rounded-lg">
            <p className="text-sm font-medium mb-3">Flujo de Estados</p>
            <div className="flex items-center gap-2 flex-wrap">
              {Object.keys(STATUS_CONFIG).map((status, index) => {
                const config = STATUS_CONFIG[status as HackathonStatus];
                const isCurrent = status === currentStatus;
                const isPast = Object.keys(STATUS_CONFIG).indexOf(currentStatus) > index;

                return (
                  <div key={status} className="flex items-center gap-2">
                    <div
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        isCurrent
                          ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                          : isPast
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-background text-muted-foreground border'
                      }`}
                    >
                      {config.label}
                    </div>
                    {index < Object.keys(STATUS_CONFIG).length - 2 && (
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Cambio de Estado</AlertDialogTitle>
            <AlertDialogDescription>
              {targetStatus && (
                <>
                  ¿Estás seguro de cambiar el estado del hackathon de{' '}
                  <strong>{STATUS_CONFIG[currentStatus].label}</strong> a{' '}
                  <strong>{STATUS_CONFIG[targetStatus].label}</strong>?
                  <br />
                  <br />
                  Esta acción afectará la visibilidad y funcionalidades disponibles del hackathon.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange} disabled={loading}>
              {loading ? 'Cambiando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
