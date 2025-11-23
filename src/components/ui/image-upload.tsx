'use client';

import { useState } from 'react';
import { useUploadThing } from '@/lib/uploadthing';
import { Button } from './button';
import { Label } from './label';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  id?: string;
  name: string;
  label?: string;
  value?: string;
  onChange?: (url: string) => void;
  endpoint?: 'hackathonImage' | 'avatarImage' | 'organizationLogo' | 'submissionAttachment';
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helperText?: string;
  error?: string;
}

export function ImageUpload({
  id,
  name,
  label,
  value,
  onChange,
  endpoint = 'hackathonImage',
  required = false,
  disabled = false,
  className,
  helperText,
  error,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(value);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload, isUploading: uploadThingLoading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.url;
      if (url) {
        setPreview(url);
        onChange?.(url);
      }
      setIsUploading(false);
    },
    onUploadError: (error: Error) => {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
      setIsUploading(false);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Start upload
    await startUpload([file]);
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange?.('');
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id || name} className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-slate-500" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <div className="space-y-3">
        {/* Preview */}
        {preview && (
          <div className="relative w-full max-w-md">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200">
              <Image
                src={preview}
                alt="Upload preview"
                fill
                className="object-cover"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2"
              onClick={handleRemove}
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Upload Button */}
        {!preview && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={disabled || isUploading || uploadThingLoading}
              onClick={() => document.getElementById(`${id || name}-file-input`)?.click()}
            >
              {isUploading || uploadThingLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </>
              )}
            </Button>

            <input
              id={`${id || name}-file-input`}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={disabled || isUploading}
            />
          </div>
        )}

        {/* Hidden input for form submission */}
        <input type="hidden" name={name} value={preview || ''} />

        {helperText && !error && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}

        {error && (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Simple URL input fallback for MVP without Uploadthing setup
 */
interface ImageUrlInputProps {
  id?: string;
  name: string;
  label?: string;
  value?: string;
  onChange?: (url: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helperText?: string;
  error?: string;
}

export function ImageUrlInput({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  className,
  helperText,
  error,
}: ImageUrlInputProps) {
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreview(url);
    onChange?.(url);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id || name} className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-slate-500" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <input
        id={id || name}
        name={name}
        type="url"
        value={value}
        onChange={handleChange}
        placeholder="https://example.com/image.jpg"
        required={required}
        disabled={disabled}
        className={cn(
          'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm',
          'ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-slate-950 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus-visible:ring-red-500'
        )}
      />

      {preview && (
        <div className="relative w-full max-w-md mt-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200">
            <Image
              src={preview}
              alt="Image preview"
              fill
              className="object-cover"
              onError={() => setPreview(undefined)}
            />
          </div>
        </div>
      )}

      {helperText && !error && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}

      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
