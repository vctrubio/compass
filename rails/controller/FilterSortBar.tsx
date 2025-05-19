import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, SortDesc, ChevronDown, X, Check } from 'lucide-react';
import { FilterOption, SortOption } from '@/rails/types';

interface FilterValueType {
  field: string;
  value: string | number | Array<string | number>;
  isMultiSelect?: boolean;
}

interface FilterSortBarProps {
  filterOptions?: FilterOption[];
  sortOptions?: SortOption[];
  onFilterChange?: (filter: FilterValueType) => void;
  onSortChange?: (sort: SortOption) => void;
  onFilterRemove?: (field: string) => void;
  activeFilters?: FilterValueType[];
  activeSort?: SortOption;
}

export function FilterSortBar({
  filterOptions = [],
  sortOptions = [],
  onFilterChange,
  onSortChange,
  onFilterRemove,
  activeFilters = [],
  activeSort
}: FilterSortBarProps) {
  
  // Handle filter selection
  const handleFilterSelect = (field: string, value: string | number, multiSelect?: boolean) => {
    if (!onFilterChange) return;
    
    const existingFilter = activeFilters.find(f => f.field === field);
    
    if (multiSelect) {
      // Handle multi-select case
      if (existingFilter) {
        const currentValues = Array.isArray(existingFilter.value) 
          ? existingFilter.value 
          : [existingFilter.value];
        
        if (currentValues.includes(value)) {
          // Remove the value if already selected
          const newValues = currentValues.filter(v => v !== value);
          if (newValues.length === 0) {
            // If no values left, remove the entire filter
            onFilterRemove && onFilterRemove(field);
          } else {
            // Otherwise update with remaining values
            onFilterChange({ field, value: newValues, isMultiSelect: true });
          }
        } else {
          // Add the value to existing selections
          onFilterChange({ 
            field, 
            value: [...currentValues, value],
            isMultiSelect: true 
          });
        }
      } else {
        // Create new multi-select filter
        onFilterChange({ field, value: [value], isMultiSelect: true });
      }
    } else {
      // Single select - replace any existing filter for this field
      onFilterChange({ field, value });
    }
  };
  
  // Handle sort selection
  const handleSortSelect = (sortOption: SortOption) => {
    if (onSortChange) {
      onSortChange(sortOption);
    }
  };
  
  // Handle filter removal
  const handleFilterRemove = (field: string) => {
    if (onFilterRemove) {
      onFilterRemove(field);
    }
  };
  
  // Check if a specific value is selected in a multi-select filter
  const isValueSelected = (field: string, value: string | number): boolean => {
    const filter = activeFilters.find(f => f.field === field);
    
    if (!filter) return false;
    
    if (Array.isArray(filter.value)) {
      return filter.value.includes(value);
    }
    
    return filter.value === value;
  };
  
  // Helper to get the label for a filter value
  const getFilterLabel = (field: string, value: string | number | Array<string | number>): string => {
    const filterOption = filterOptions.find(opt => opt.field === field);
    if (!filterOption) return Array.isArray(value) ? value.join(', ') : `${value}`;
    
    if (Array.isArray(value)) {
      return value.map(v => {
        const option = filterOption.options?.find(opt => opt.value === v);
        return option ? option.label : `${v}`;
      }).join(', ');
    }
    
    const option = filterOption.options?.find(opt => opt.value === value);
    return option ? option.label : `${value}`;
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center mr-2">
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1 py-1 px-3">
              {filterOptions.find(fo => fo.field === filter.field)?.label}:&nbsp;
              {getFilterLabel(filter.field, filter.value)}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive ml-1" 
                onClick={() => handleFilterRemove(filter.field)}
              />
            </Badge>
          ))}
        </div>
      )}
      
      {/* Active sort display */}
      {activeSort && (
        <Badge variant="secondary" className="flex items-center gap-1 py-1 px-3">
          <SortDesc className="h-3 w-3" />
          {activeSort.label}
        </Badge>
      )}
      
      {/* Filter dropdown */}
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
                    filterOption.multiSelect ? (
                      <DropdownMenuCheckboxItem 
                        key={optionIndex}
                        checked={isValueSelected(filterOption.field, option.value)}
                        onSelect={(e) => {
                          e.preventDefault();
                          handleFilterSelect(filterOption.field, option.value, true);
                        }}
                      >
                        {option.label}
                      </DropdownMenuCheckboxItem>
                    ) : (
                      <DropdownMenuItem 
                        key={optionIndex} 
                        onClick={() => handleFilterSelect(filterOption.field, option.value)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    )
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      {/* Sort dropdown */}
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