'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { ImageUrlInput } from '@/components/ui/image-upload';
import { toast } from 'sonner';
import { updateHackathonSimple, deleteHackathon } from '@/modules/hackathons/actions';
import type { HackathonWithRelations } from '@/modules/hackathons/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Save } from 'lucide-react';

interface EditHackathonFormProps {
  hackathon: HackathonWithRelations;
}

export function EditHackathonForm({ hackathon }: EditHackathonFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Helper to convert Date to datetime-local format
  const dateToDateTimeLocal = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    name: hackathon.name,
    description: hackathon.description || '',
    imageUrl: hackathon.imageUrl || '',
    registrationOpensAt: dateToDateTimeLocal(hackathon.registrationOpensAt),
    registrationClosesAt: dateToDateTimeLocal(hackathon.registrationClosesAt),
    startsAt: dateToDateTimeLocal(hackathon.startsAt),
    endsAt: dateToDateTimeLocal(hackathon.endsAt),
    judgingStartsAt: dateToDateTimeLocal(hackathon.judgingStartsAt),
    judgingEndsAt: dateToDateTimeLocal(hackathon.judgingEndsAt),
    minTeamSize: hackathon.minTeamSize,
    maxTeamSize: hackathon.maxTeamSize,
    maxTeams: hackathon.maxTeams || undefined,
    prizes: hackathon.prizes || '',
    rules: hackathon.rules || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // Convert string dates back to Date objects for the action
      const submitData = {
        ...formData,
        registrationOpensAt: new Date(formData.registrationOpensAt),
        registrationClosesAt: new Date(formData.registrationClosesAt),
        startsAt: new Date(formData.startsAt),
        endsAt: new Date(formData.endsAt),
        judgingStartsAt: new Date(formData.judgingStartsAt),
        judgingEndsAt: new Date(formData.judgingEndsAt),
      };
      const result = await updateHackathonSimple(hackathon.id, submitData);
      
      if (result.success) {
        toast.success('Hackathon actualizado exitosamente');
        router.refresh();
      } else {
        toast.error(result.error || 'Error al actualizar hackathon');
      }
    } catch {
      toast.error('Error al actualizar hackathon');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const result = await deleteHackathon(hackathon.id);
      
      if (result.success) {
        toast.success('Hackathon eliminado');
        router.push('/hackathons');
      } else {
        toast.error(result.error || 'Error al eliminar hackathon');
      }
    } catch {
      toast.error('Error al eliminar hackathon');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Información Básica</h3>
        
        <div>
          <Label htmlFor="name">Nombre del Hackathon*</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            minLength={5}
            maxLength={100}
          />
        </div>

        <div>
          <Label htmlFor="description">Descripción*</Label>
          <RichTextEditor
            content={formData.description}
            onChange={(content) => setFormData({ ...formData, description: content })}
            placeholder="Describe tu hackathon..."
          />
        </div>

        <div>
          <Label htmlFor="imageUrl">Imagen de Portada</Label>
          <ImageUrlInput
            name="imageUrl"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          />
        </div>
      </div>

      {/* Dates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Fechas y Horarios</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="registrationOpensAt">Inscripción Abre*</Label>
            <DateTimePicker
              name="registrationOpensAt"
              value={formData.registrationOpensAt}
              onChange={(date) => setFormData({ ...formData, registrationOpensAt: date })}
            />
          </div>

          <div>
            <Label htmlFor="registrationClosesAt">Inscripción Cierra*</Label>
            <DateTimePicker
              name="registrationClosesAt"
              value={formData.registrationClosesAt}
              onChange={(date) => setFormData({ ...formData, registrationClosesAt: date })}
            />
          </div>

          <div>
            <Label htmlFor="startsAt">Hackathon Inicia*</Label>
            <DateTimePicker
              name="startsAt"
              value={formData.startsAt}
              onChange={(date) => setFormData({ ...formData, startsAt: date })}
            />
          </div>

          <div>
            <Label htmlFor="endsAt">Hackathon Finaliza*</Label>
            <DateTimePicker
              name="endsAt"
              value={formData.endsAt}
              onChange={(date) => setFormData({ ...formData, endsAt: date })}
            />
          </div>

          <div>
            <Label htmlFor="judgingStartsAt">Evaluación Inicia*</Label>
            <DateTimePicker
              name="judgingStartsAt"
              value={formData.judgingStartsAt}
              onChange={(date) => setFormData({ ...formData, judgingStartsAt: date })}
            />
          </div>

          <div>
            <Label htmlFor="judgingEndsAt">Evaluación Finaliza*</Label>
            <DateTimePicker
              name="judgingEndsAt"
              value={formData.judgingEndsAt}
              onChange={(date) => setFormData({ ...formData, judgingEndsAt: date })}
            />
          </div>
        </div>
      </div>

      {/* Team Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Configuración de Equipos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="minTeamSize">Tamaño Mínimo*</Label>
            <Input
              id="minTeamSize"
              type="number"
              min={1}
              max={20}
              value={formData.minTeamSize}
              onChange={(e) => setFormData({ ...formData, minTeamSize: parseInt(e.target.value) })}
              required
            />
          </div>

          <div>
            <Label htmlFor="maxTeamSize">Tamaño Máximo*</Label>
            <Input
              id="maxTeamSize"
              type="number"
              min={1}
              max={20}
              value={formData.maxTeamSize}
              onChange={(e) => setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) })}
              required
            />
          </div>

          <div>
            <Label htmlFor="maxTeams">Equipos Máximos (Opcional)</Label>
            <Input
              id="maxTeams"
              type="number"
              min={1}
              value={formData.maxTeams || ''}
              onChange={(e) => setFormData({ ...formData, maxTeams: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="Ilimitado"
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Información Adicional</h3>
        
        <div>
          <Label htmlFor="prizes">Premios</Label>
          <RichTextEditor
            content={formData.prizes}
            onChange={(content) => setFormData({ ...formData, prizes: content })}
            placeholder="Describe los premios del hackathon..."
          />
        </div>

        <div>
          <Label htmlFor="rules">Reglas</Label>
          <RichTextEditor
            content={formData.rules}
            onChange={(content) => setFormData({ ...formData, rules: content })}
            placeholder="Define las reglas del hackathon..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="destructive" disabled={deleteLoading}>
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar Hackathon
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente el hackathon
                <strong> &quot;{hackathon.name}&quot;</strong> y todos sus datos asociados (participantes,
                equipos, proyectos, evaluaciones).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sí, eliminar hackathon
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/hackathons/${hackathon.slug}`)}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </form>
  );
}
