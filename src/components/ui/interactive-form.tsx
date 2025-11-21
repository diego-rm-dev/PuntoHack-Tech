'use client';

import { useState } from 'react';

interface InteractiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

export function InteractiveInput({ label, required, ...props }: InteractiveInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={props.id} className="block text-sm font-semibold" style={{ color: '#0b0d0e' }}>
        {label} {required && <span style={{ color: '#e43157' }}>*</span>}
      </label>
      <input
        {...props}
        required={required}
        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all"
        style={{
          borderColor: isFocused ? '#606fe5' : '#e2e4e9',
          backgroundColor: isFocused ? '#ffffff' : '#fafafa',
          color: '#0b0d0e',
        }}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
      />
    </div>
  );
}

interface InteractiveTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
}

export function InteractiveTextarea({ label, helperText, ...props }: InteractiveTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={props.id} className="block text-sm font-semibold" style={{ color: '#0b0d0e' }}>
        {label}
      </label>
      <textarea
        {...props}
        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none resize-none transition-all"
        style={{
          borderColor: isFocused ? '#606fe5' : '#e2e4e9',
          backgroundColor: isFocused ? '#ffffff' : '#fafafa',
          color: '#0b0d0e',
        }}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
      />
      {helperText && (
        <p className="text-sm" style={{ color: '#838696' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}

interface InteractiveSubmitButtonProps {
  children: React.ReactNode;
}

export function InteractiveSubmitButton({ children }: InteractiveSubmitButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="submit"
      className="px-6 py-3 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
      style={{
        backgroundColor: isHovered ? '#5f6ee3' : '#606fe5',
        color: '#ffffff',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
}
