'use client';

import { Input } from './input';
import { Label } from './label';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface DateTimePickerProps {
  id?: string;
  name: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helperText?: string;
  error?: string;
}

/**
 * Professional DateTimePicker using native datetime-local input
 * Formats: YYYY-MM-DDTHH:mm (ISO 8601)
 * Example: 2025-12-01T09:00
 */
export function DateTimePicker({
  id,
  name,
  label,
  value,
  onChange,
  min,
  max,
  required = false,
  disabled = false,
  className,
  helperText,
  error,
}: DateTimePickerProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id || name} className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-500" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <Input
        id={id || name}
        name={name}
        type="datetime-local"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        min={min}
        max={max}
        required={required}
        disabled={disabled}
        className={cn(
          error && 'border-red-500 focus-visible:ring-red-500'
        )}
      />

      {helperText && !error && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}

      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}

/**
 * Utility functions for datetime-local format conversion
 */

// Convert Date to datetime-local format (YYYY-MM-DDTHH:mm)
export function dateToDateTimeLocal(date: Date | null): string {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Convert datetime-local format to Date
export function dateTimeLocalToDate(dateTimeLocal: string): Date | null {
  if (!dateTimeLocal || dateTimeLocal.trim() === '') return null;
  const date = new Date(dateTimeLocal);
  return isNaN(date.getTime()) ? null : date;
}

// Get current datetime in datetime-local format
export function getCurrentDateTimeLocal(): string {
  return dateToDateTimeLocal(new Date());
}

// Format datetime-local for display
export function formatDateTimeLocal(date: Date | string | null, locale: string = 'en-US'): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? dateTimeLocalToDate(date) : date;
  if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) return '';
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
