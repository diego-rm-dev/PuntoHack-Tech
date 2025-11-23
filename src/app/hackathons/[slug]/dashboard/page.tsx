import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/core/auth';
import { getHackathonBySlug } from '@/modules/hackathons/queries';
import { HackathonStats } from '@/components/hackathons/hackathon-stats';
import { CriterionManager } from '@/components/hackathons/criterion-manager';
import { ParticipantsList } from '@/components/hackathons/participants-list';
import { StateTransition } from '@/components/hackathons/state-transition';
import { EditHackathonForm } from '@/components/hackathons/edit-hackathon-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Users, BarChart3, ListChecks } from 'lucide-react';
import Link from 'next/link';

interface DashboardPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: DashboardPageProps): Promise<Metadata> {
  const hackathon = await getHackathonBySlug(params.slug);

  if (!hackathon) {
    return {
      title: 'Hackathon Not Found',
    };
  }

  return {
    title: `Dashboard - ${hackathon.name} | PuntoHack`,
    description: `Manage your hackathon: ${hackathon.name}`,
  };
}

export default async function HackathonDashboardPage({ params }: DashboardPageProps) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.profile) {
    redirect('/auth/signin?callbackUrl=/hackathons/' + params.slug + '/dashboard');
  }

  const hackathon = await getHackathonBySlug(params.slug);

  if (!hackathon) {
    notFound();
  }

  // Check if user is the organizer (admin only for now since organizerId is not in HackathonWithRelations)
  // TODO: Add organizerId to query or check through participations
  if (currentUser.profile.role !== 'ADMIN' && currentUser.profile.role !== 'ORGANIZER') {
    redirect('/hackathons/' + params.slug);
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/hackathons" className="hover:text-foreground transition-colors">
              Hackathons
            </Link>
            <span>/</span>
            <Link
              href={`/hackathons/${hackathon.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {hackathon.name}
            </Link>
            <span>/</span>
            <span className="text-foreground">Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard del Organizador</h1>
          <p className="text-muted-foreground">
            Gestiona todos los aspectos de tu hackathon desde un solo lugar
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/hackathons/${hackathon.slug}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Ver Hackathon
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <HackathonStats hackathon={hackathon} />

      {/* State Transition Controls */}
      <StateTransition hackathon={hackathon} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="participants" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="participants" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Participantes
          </TabsTrigger>
          <TabsTrigger value="criteria" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Criterios
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuración
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analíticas
          </TabsTrigger>
        </TabsList>

        {/* Participants Tab */}
        <TabsContent value="participants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Participantes</CardTitle>
              <CardDescription>
                Gestiona los participantes registrados en tu hackathon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ParticipantsList hackathonId={hackathon.id} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Criteria Tab */}
        <TabsContent value="criteria" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Criterios de Evaluación</CardTitle>
              <CardDescription>
                Define y gestiona los criterios que se usarán para evaluar los proyectos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CriterionManager hackathonId={hackathon.id} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Hackathon</CardTitle>
              <CardDescription>
                Actualiza la información y configuración de tu hackathon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditHackathonForm hackathon={hackathon} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analíticas y Reportes</CardTitle>
              <CardDescription>
                Visualiza estadísticas y métricas de tu hackathon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Analíticas Avanzadas</p>
                <p className="text-sm">
                  Las analíticas detalladas estarán disponibles en la siguiente fase
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
