import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter, SortDesc, ChevronDown } from 'lucide-react';
import { FilterOption, SortOption } from '@/rails/types';

interface FilterValueType {
  field: string;
  value: string | number;
}

interface FilterSortBarProps {
  filterOptions?: FilterOption[];
  sortOptions?: SortOption[];
  onFilterChange?: (filter: FilterValueType) => void;
  onSortChange?: (sort: SortOption) => void;
  activeFilters?: FilterValueType[];
  activeSort?: SortOption;
}

export function FilterSortBar({
  filterOptions = [],
  sortOptions = [],
  onFilterChange,
  onSortChange,
  activeFilters = [],
  activeSort
}: FilterSortBarProps) {
  
  // Handle filter selection
  const handleFilterSelect = (field: string, value: string | number) => {
    if (onFilterChange) {
      onFilterChange({ field, value });
    }
  };
  
  // Handle sort selection
  const handleSortSelect = (sortOption: SortOption) => {
    if (onSortChange) {
      onSortChange(sortOption);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {filterOptions && filterOptions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 border-muted/30 px-4 gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Filter By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterOptions.map((filterOption, filterIndex) => (
              <DropdownMenu key={filterIndex}>
                <DropdownMenuTrigger asChild className="w-full">
                  <Button variant="ghost" className="justify-between w-full px-2">
                    {filterOption.label}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right">
                  {filterOption.options?.map((option, optionIndex) => (
                    <DropdownMenuItem 
                      key={optionIndex} 
                      onClick={() => handleFilterSelect(filterOption.field, option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      {sortOptions && sortOptions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 border-muted/30 px-4 gap-2">
              <SortDesc className="h-4 w-4" />
              <span>Sort</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map((sortOption, index) => (
              <DropdownMenuItem 
                key={index} 
                onClick={() => handleSortSelect(sortOption)}
                className={activeSort?.field === sortOption.field && activeSort?.direction === sortOption.direction ? "bg-muted/20" : ""}
              >
                {sortOption.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}