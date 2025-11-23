'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Download, Users, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { getParticipantsByHackathonIdAction } from '@/modules/hackathons/actions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ParticipantProfile } from '@/modules/hackathons/types';

interface ParticipantsListProps {
  hackathonId: string;
}

export function ParticipantsList({ hackathonId }: ParticipantsListProps) {
  const [participants, setParticipants] = useState<ParticipantProfile[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<ParticipantProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadParticipants();
  }, [hackathonId]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredParticipants(participants);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredParticipants(
        participants.filter(
          (p) =>
            p.name?.toLowerCase().includes(query) ||
            p.email?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, participants]);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const result = await getParticipantsByHackathonIdAction(hackathonId);
      if (result.success && result.data) {
        setParticipants(result.data);
        setFilteredParticipants(result.data);
      }
    } catch {
      toast.error('Error al cargar participantes');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (participants.length === 0) {
      toast.error('No hay participantes para exportar');
      return;
    }

    const headers = ['Nombre', 'Email', 'Rol', 'Fecha de Registro'];
    const rows = participants.map((p) => [
      p.name || 'N/A',
      p.email || 'N/A',
      p.role,
      format(new Date(p.createdAt), 'PPpp', { locale: es }),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `participantes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Archivo CSV descargado');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted animate-pulse rounded" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o equipo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{filteredParticipants.length}</span>
          <span className="text-muted-foreground">participantes</span>
        </div>
      </div>

      {/* Table */}
      {filteredParticipants.length === 0 ? (
        <div className="border rounded-lg p-12 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium">
            {searchQuery ? 'No se encontraron participantes' : 'Aún no hay participantes'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery
              ? 'Intenta con otro término de búsqueda'
              : 'Los participantes aparecerán aquí cuando se registren'}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participante</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Registro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={participant.avatarUrl || undefined} />
                        <AvatarFallback>
                          {participant.name
                            ? participant.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2)
                            : participant.email?.slice(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{participant.name || 'Sin nombre'}</p>
                        <p className="text-sm text-muted-foreground">{participant.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{participant.email || 'Sin email'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">Sin equipo</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        participant.role === 'ADMIN'
                          ? 'destructive'
                          : participant.role === 'ORGANIZER'
                            ? 'default'
                            : 'secondary'
                      }
                    >
                      {participant.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(participant.createdAt), 'PP', { locale: es })}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
