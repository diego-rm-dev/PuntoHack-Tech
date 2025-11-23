'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from './input';
import { Button } from './button';
import { Badge } from './badge';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { debounce } from '@/lib/utils/debounce';

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({
  placeholder = 'Search...',
  defaultValue = '',
  onSearch,
  autoFocus = false,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultValue || searchParams.get('q') || '');

  // Debounced search - updates URL after 300ms of no typing
  const handleSearch = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    router.push(`?${params.toString()}`);
    onSearch?.(value);
  }, [searchParams, router, onSearch]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(handleSearch, 300),
    [handleSearch]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus={autoFocus}
        className="pl-9 pr-9"
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterBadgesProps {
  options: FilterOption[];
  selected?: string;
  paramName?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function FilterBadges({
  options,
  selected,
  paramName = 'filter',
  onChange,
  className,
}: FilterBadgesProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = selected || searchParams.get(paramName) || options[0]?.value;

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== options[0]?.value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }
    router.push(`?${params.toString()}`);
    onChange?.(value);
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const isSelected = currentFilter === option.value;
        return (
          <Badge
            key={option.value}
            variant={isSelected ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer transition-all hover:scale-105',
              isSelected && 'shadow-sm'
            )}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
            {option.count !== undefined && (
              <span className="ml-1 opacity-70">({option.count})</span>
            )}
          </Badge>
        );
      })}
    </div>
  );
}

interface AdvancedFiltersProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function AdvancedFilters({
  children,
  title = 'Filters',
  className,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('space-y-2', className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <SlidersHorizontal className="h-4 w-4" />
        {title}
      </Button>

      {isOpen && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          {children}
        </div>
      )}
    </div>
  );
}

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  options: SortOption[];
  selected?: string;
  paramName?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SortSelect({
  options,
  selected,
  paramName = 'sort',
  onChange,
  className,
}: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = selected || searchParams.get(paramName) || options[0]?.value;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value !== options[0]?.value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }
    router.push(`?${params.toString()}`);
    onChange?.(value);
  };

  return (
    <select
      value={currentSort}
      onChange={handleChange}
      className={cn(
        'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm',
        'ring-offset-white focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-slate-950 focus-visible:ring-offset-2',
        className
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

/**
 * Active filters display with clear all
 */
interface ActiveFiltersProps {
  filters: Array<{ key: string; label: string; value: string }>;
  onClear?: (key: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function ActiveFilters({
  filters,
  onClear,
  onClearAll,
  className,
}: ActiveFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClear = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`?${params.toString()}`);
    onClear?.(key);
  };

  const handleClearAll = () => {
    router.push(window.location.pathname);
    onClearAll?.();
  };

  if (filters.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-sm text-slate-600">Active filters:</span>
      {filters.map((filter) => (
        <Badge key={filter.key} variant="secondary" className="gap-1">
          {filter.label}: {filter.value}
          <X
            className="h-3 w-3 cursor-pointer hover:text-red-600"
            onClick={() => handleClear(filter.key)}
          />
        </Badge>
      ))}
      {filters.length > 1 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          className="h-6 text-xs"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
