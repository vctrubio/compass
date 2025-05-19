import React from 'react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchInput({ 
  placeholder = "Search...", 
  value, 
  onChange,
  className 
}: SearchInputProps) {
  return (
    <div className="relative w-full">
      <Input 
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`pl-10 ${className || ''}`}
      />
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
      </svg>
    </div>
  );
}
