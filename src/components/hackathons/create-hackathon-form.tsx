'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Info, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { ImageUrlInput } from '@/components/ui/image-upload';
import { createHackathon } from '@/modules/hackathons';

interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  maxScore: number;
}

export function CreateHackathonForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: '1', name: 'Innovación', description: 'Originalidad de la idea', weight: 3, maxScore: 10 },
    { id: '2', name: 'Impacto', description: 'Impacto potencial de la solución', weight: 3, maxScore: 10 },
    { id: '3', name: 'Ejecución', description: 'Calidad de la implementación', weight: 2, maxScore: 10 },
    { id: '4', name: 'Presentación', description: 'Claridad de la presentación', weight: 2, maxScore: 10 },
  ]);

  const addCriterion = () => {
    setCriteria([
      ...criteria,
      {
        id: Date.now().toString(),
        name: '',
        description: '',
        weight: 1,
        maxScore: 10,
      },
    ]);
  };

  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter((c) => c.id !== id));
  };

  const updateCriterion = (id: string, field: keyof Criterion, value: string | number) => {
    setCriteria(
      criteria.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // Add criteria as JSON
    formData.set('criteria', JSON.stringify(criteria.filter(c => c.name.trim())));

    const result = await createHackathon(formData);

    if (result.success && result.data) {
      router.push(`/hackathons/${result.data.slug}`);
    } else {
      setError(result.error || 'Error al crear el hackathon');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
          <CardDescription>
            Proporciona los detalles principales del hackathon
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Hackathon *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ej: AI Hackathon 2025"
              required
              onChange={(e) => {
                const slugInput = document.getElementById('slug') as HTMLInputElement;
                if (slugInput && !slugInput.dataset.modified) {
                  slugInput.value = generateSlug(e.target.value);
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL (Slug) *</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">/hackathons/</span>
              <Input
                id="slug"
                name="slug"
                placeholder="ai-hackathon-2025"
                required
                pattern="[a-z0-9-]+"
                onChange={(e) => {
                  e.target.dataset.modified = 'true';
                }}
              />
            </div>
            <p className="text-xs text-slate-500">Solo letras minúsculas, números y guiones</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <RichTextEditor
              content={description}
              onChange={setDescription}
              placeholder="Describe tu hackathon, los objetivos, y qué esperas que los participantes construyan..."
              minHeight="200px"
            />
            <input type="hidden" name="description" value={description} required />
            <p className="text-xs text-slate-500">Usa el editor para formatear tu descripción</p>
          </div>

          <ImageUrlInput
            name="bannerUrl"
            label="Imagen del Banner (opcional)"
            value={bannerUrl}
            onChange={setBannerUrl}
            helperText="URL de la imagen principal del hackathon (16:9 ratio recomendado)"
          />
        </CardContent>
      </Card>

      {/* Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Fechas y Horarios
          </CardTitle>
          <CardDescription>
            Define las fechas importantes del evento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DateTimePicker
              name="registrationOpensAt"
              label="Apertura de Inscripciones"
              required
              helperText="Cuándo pueden empezar a registrarse"
            />

            <DateTimePicker
              name="registrationClosesAt"
              label="Cierre de Inscripciones"
              required
              helperText="Hasta cuándo pueden registrarse"
            />

            <DateTimePicker
              name="startsAt"
              label="Inicio del Hackathon"
              required
              helperText="Fecha y hora de inicio del evento"
            />

            <DateTimePicker
              name="endsAt"
              label="Fin del Hackathon"
              required
              helperText="Fecha y hora de finalización"
            />

            <DateTimePicker
              name="judgingStartsAt"
              label="Inicio de Evaluación"
              required
              helperText="Cuándo empieza la evaluación"
            />

            <DateTimePicker
              name="judgingEndsAt"
              label="Fin de Evaluación"
              required
              helperText="Cuándo termina la evaluación"
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Equipos</CardTitle>
          <CardDescription>
            Define el tamaño de los equipos participantes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="minTeamSize">Tamaño Mínimo *</Label>
              <Input
                id="minTeamSize"
                name="minTeamSize"
                type="number"
                min="1"
                max="10"
                defaultValue="1"
                required
              />
              <p className="text-xs text-slate-500">Mínimo de personas por equipo</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTeamSize">Tamaño Máximo *</Label>
              <Input
                id="maxTeamSize"
                name="maxTeamSize"
                type="number"
                min="1"
                max="10"
                defaultValue="5"
                required
              />
              <p className="text-xs text-slate-500">Máximo de personas por equipo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Criteria */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Criterios de Evaluación</CardTitle>
              <CardDescription>
                Define cómo se evaluarán los proyectos
              </CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addCriterion}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {criteria.map((criterion, index) => (
            <div key={criterion.id}>
              {index > 0 && <Separator className="my-4" />}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Criterio {index + 1}</Badge>
                  {criteria.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCriterion(criterion.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre *</Label>
                    <Input
                      value={criterion.name}
                      onChange={(e) => updateCriterion(criterion.id, 'name', e.target.value)}
                      placeholder="Ej: Innovación"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Input
                      value={criterion.description}
                      onChange={(e) => updateCriterion(criterion.id, 'description', e.target.value)}
                      placeholder="Ej: Originalidad de la idea"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Peso (1-10) *</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={criterion.weight}
                      onChange={(e) => updateCriterion(criterion.id, 'weight', parseInt(e.target.value))}
                      required
                    />
                    <p className="text-xs text-slate-500">Importancia relativa</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Puntaje Máximo *</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={criterion.maxScore}
                      onChange={(e) => updateCriterion(criterion.id, 'maxScore', parseInt(e.target.value))}
                      required
                    />
                    <p className="text-xs text-slate-500">Escala de calificación</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg mt-4">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <p className="font-medium mb-1">Sobre los criterios de evaluación</p>
              <p className="text-blue-700 dark:text-blue-300">
                El puntaje final se calcula multiplicando cada calificación por su peso y normalizando el resultado.
                Por ejemplo, un criterio con peso 3 tiene 3 veces más impacto que uno con peso 1.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <p className="text-sm text-red-900 dark:text-red-100">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <Link href="/hackathons">
          <Button type="button" variant="ghost" disabled={isSubmitting}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </Link>

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear Hackathon'}
        </Button>
      </div>
    </form>
  );
}
