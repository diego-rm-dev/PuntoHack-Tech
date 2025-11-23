'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, Check, X, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import {
  createCriterion,
  updateCriterionSimple,
  deleteCriterion,
  getCriteriaByHackathonId,
} from '@/modules/hackathons/actions';
import type { Criterion } from '@prisma/client';

interface CriterionManagerProps {
  hackathonId: string;
}

export function CriterionManager({ hackathonId }: CriterionManagerProps) {
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    weight: 1,
    maxScore: 10,
  });

  useEffect(() => {
    loadCriteria();
  }, [hackathonId]);

  const loadCriteria = async () => {
    try {
      setLoading(true);
      const result = await getCriteriaByHackathonId(hackathonId);
      if (result.success && result.data) {
        setCriteria(result.data);
      }
    } catch {
      toast.error('Error al cargar criterios');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createCriterion(hackathonId, formData);
      if (result.success) {
        toast.success('Criterio creado exitosamente');
        setFormData({ name: '', description: '', weight: 1, maxScore: 10 });
        setShowAddForm(false);
        loadCriteria();
      } else {
        toast.error(result.error || 'Error al crear criterio');
      }
    } catch {
      toast.error('Error al crear criterio');
    }
  };

  const handleUpdate = async (id: string, data: Partial<Criterion>) => {
    try {
      // Convert null to undefined for description
      const updateData = {
        ...data,
        description: data.description === null ? undefined : data.description,
      };
      const result = await updateCriterionSimple(id, updateData);
      if (result.success) {
        toast.success('Criterio actualizado');
        setEditingId(null);
        loadCriteria();
      } else {
        toast.error(result.error || 'Error al actualizar');
      }
    } catch {
      toast.error('Error al actualizar criterio');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este criterio?')) return;

    try {
      const result = await deleteCriterion(id);
      if (result.success) {
        toast.success('Criterio eliminado');
        loadCriteria();
      } else {
        toast.error(result.error || 'Error al eliminar');
      }
    } catch {
      toast.error('Error al eliminar criterio');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Button */}
      {!showAddForm && (
        <Button onClick={() => setShowAddForm(true)} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Criterio
        </Button>
      )}

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del Criterio*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej. Innovación, Diseño, Funcionalidad"
                  required
                  minLength={3}
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe qué se evaluará en este criterio..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Peso (1-10)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min={1}
                    max={10}
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Importancia relativa del criterio
                  </p>
                </div>

                <div>
                  <Label htmlFor="maxScore">Puntuación Máxima</Label>
                  <Input
                    id="maxScore"
                    type="number"
                    min={1}
                    max={100}
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Máximo puntaje otorgable
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Check className="mr-2 h-4 w-4" />
                  Crear Criterio
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ name: '', description: '', weight: 1, maxScore: 10 });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Criteria List */}
      {criteria.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">
              No hay criterios definidos. Agrega al menos uno para poder evaluar proyectos.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {criteria.map((criterion) => (
            <CriterionItem
              key={criterion.id}
              criterion={criterion}
              isEditing={editingId === criterion.id}
              onEdit={() => setEditingId(criterion.id)}
              onCancelEdit={() => setEditingId(null)}
              onUpdate={(data) => handleUpdate(criterion.id, data)}
              onDelete={() => handleDelete(criterion.id)}
            />
          ))}
        </div>
      )}

      {/* Summary */}
      {criteria.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total de Criterios</p>
                <p className="text-2xl font-bold">{criteria.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Peso Total</p>
                <p className="text-2xl font-bold">
                  {criteria.reduce((sum, c) => sum + c.weight, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Puntuación Máxima Total</p>
                <p className="text-2xl font-bold">
                  {criteria.reduce((sum, c) => sum + c.maxScore * c.weight, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface CriterionItemProps {
  criterion: Criterion;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (data: Partial<Criterion>) => void;
  onDelete: () => void;
}

function CriterionItem({
  criterion,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}: CriterionItemProps) {
  const [editData, setEditData] = useState(criterion);

  if (isEditing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Input
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              placeholder="Nombre"
            />
            <Textarea
              value={editData.description || ''}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Descripción"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                min={1}
                max={10}
                value={editData.weight}
                onChange={(e) => setEditData({ ...editData, weight: parseInt(e.target.value) })}
              />
              <Input
                type="number"
                min={1}
                max={100}
                value={editData.maxScore}
                onChange={(e) => setEditData({ ...editData, maxScore: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => onUpdate(editData)} className="flex-1">
                <Check className="mr-2 h-4 w-4" />
                Guardar
              </Button>
              <Button variant="outline" onClick={onCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="cursor-grab p-2 hover:bg-muted rounded">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{criterion.name}</h4>
                {criterion.description && (
                  <p className="text-sm text-muted-foreground mt-1">{criterion.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Badge variant="secondary">Peso: {criterion.weight}</Badge>
              <Badge variant="outline">Máximo: {criterion.maxScore} pts</Badge>
              <Badge>Total ponderado: {criterion.weight * criterion.maxScore} pts</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
