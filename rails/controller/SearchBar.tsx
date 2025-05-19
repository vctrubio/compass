import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = ""
}: SearchBarProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-12 py-6 text-base rounded-lg shadow-sm border-muted/30 focus-visible:ring-primary/20 focus-visible:ring-offset-0"
      />
    </div>
  );
}