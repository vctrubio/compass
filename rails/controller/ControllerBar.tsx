import React from 'react';
import { SearchBar } from './SearchBar';
import { FilterSortBar } from './FilterSortBar';
import { FilterOption, SortOption } from '@/rails/types';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterValueType {
    field: string;
    value: string | number;
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
    activeFilters = [],
    activeSort,
    totalItems,
    onAddNew,
    showAddButton = true,
    addButtonText = "Add New"
}: ControllerBarProps) {
    return (
        <div className="space-y-6">
            {/* First row - Title, Search and Status */}
            <div className="flex items-center gap-4">
                <div className="flex-grow">
                    <SearchBar
                        value={searchTerm}
                        onChange={onSearchChange}
                        placeholder={searchPlaceholder}
                    />
                </div>

                <div className="flex gap-3">
                    {totalItems !== undefined && (
                        <div className="border border-muted/30 bg-secondary/10 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center whitespace-nowrap shadow-sm">
                            {totalItems} items
                        </div>
                    )}
                </div>
            </div>

            {/* Second row - Filters, Sort, Add */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <FilterSortBar
                    filterOptions={filterOptions}
                    sortOptions={sortOptions}
                    onFilterChange={onFilterChange}
                    onSortChange={onSortChange}
                    activeFilters={activeFilters}
                    activeSort={activeSort}
                />

                {showAddButton && (
                    <div className="ml-auto">
                        <Button className="h-10 px-4 gap-2" onClick={onAddNew}>
                            <Plus className="h-4 w-4" />
                            <span>{addButtonText}</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}