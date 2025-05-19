import React from 'react';
import { SearchBar } from './SearchBar';
import { FilterSortBar } from './FilterSortBar';
import { FilterOption, SortOption } from '@/rails/types';
import { Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";

interface FilterValueType {
    field: string;
    value: string | number | boolean | Array<string | number | boolean>;
    isMultiSelect?: boolean;
}

interface ControllerBarProps {
    title?: string;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    filterOptions?: FilterOption[];
    sortOptions?: SortOption[];
    onFilterChange?: (filter: FilterValueType) => void;
    onSortChange?: (sort: SortOption) => void;
    onFilterRemove?: (field: string) => void;
    onResetFilters?: () => void;
    activeFilters?: FilterValueType[];
    activeSort?: SortOption;
    totalItems?: number;
    onAddNew?: () => void;
    showAddButton?: boolean;
    addButtonText?: string;
}

export function ControllerBar({
    title,
    searchTerm,
    onSearchChange,
    searchPlaceholder = "Search...",
    filterOptions = [],
    sortOptions = [],
    onFilterChange,
    onSortChange,
    onFilterRemove,
    onResetFilters,
    activeFilters = [],
    activeSort,
    totalItems,
    onAddNew,
    showAddButton = true,
    addButtonText = "Add New"
}: ControllerBarProps) {
    // Check if any filters or sorts are active
    const hasActiveFiltersOrSort = activeFilters.length > 0 || activeSort !== undefined;
    
    // Get filter labels for displaying active filters
    const getFilterOptionLabel = (field: string, value: string | number): string => {
        const filterOption = filterOptions.find(opt => opt.field === field);
        if (!filterOption) return `${field}: ${value}`;
        
        const option = filterOption.options?.find(opt => opt.value === value);
        return option ? `${filterOption.label}: ${option.label}` : `${filterOption.label}: ${value}`;
    };
    return (
        <div className="space-y-4">
            {/* First row - Search and Status */}
            <div className="flex items-center gap-4">
                <div className="flex-grow">
                    <SearchBar
                        value={searchTerm}
                        onChange={onSearchChange}
                        placeholder={searchPlaceholder}
                    />
                </div>

                {totalItems !== undefined && (
                    <div className="border border-muted/30 bg-secondary/10 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center whitespace-nowrap shadow-sm">
                        {totalItems} items
                    </div>
                )}
            </div>

            {/* Second row - Filters, Sort, Add */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                {/* Left side - Filter and Sort */}
                <div className="flex flex-wrap items-center gap-3">
                    <FilterSortBar
                        filterOptions={filterOptions}
                        sortOptions={sortOptions}
                        onFilterChange={onFilterChange}
                        onSortChange={onSortChange}
                        onFilterRemove={onFilterRemove}
                        activeFilters={activeFilters}
                        activeSort={activeSort}
                    />
                </div>

                {/* Right side - Reset and Add */}
                <div className="flex items-center gap-2 ml-auto">
                    {hasActiveFiltersOrSort && onResetFilters && (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-10 border-muted/30" 
                            onClick={onResetFilters}
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            <span>Reset</span>
                        </Button>
                    )}
                    
                    {showAddButton && (
                        <Button className="h-10 px-4 gap-2" onClick={onAddNew}>
                            <Plus className="h-4 w-4" />
                            <span>{addButtonText}</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}