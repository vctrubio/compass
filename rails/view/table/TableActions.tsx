import React from 'react';
import { SearchInput } from '@/components/ui/search-input';

interface TableActionsProps {
  onSearch: (term: string) => void;
  searchTerm: string;
  searchPlaceholder?: string;
}

export function TableActions({ 
  onSearch, 
  searchTerm,
  searchPlaceholder = "Search..."  
}: TableActionsProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="w-full max-w-md">
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={onSearch}
        />
      </div>
    </div>
  );
}
