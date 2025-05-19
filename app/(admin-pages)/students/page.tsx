'use client';
import { useState, useEffect, useCallback } from "react";
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { GenericTable } from "@/rails/view/table/GenericTable";
import { GenericTableProps } from "@/rails/view/table/GenericTable";
import { ControllerBar } from "@/rails/controller/ControllerBar";
import { SortOption } from "@/rails/types";
import { dbTableDictionary } from "@/rails/typesDictionary";

interface FilterValue {
  field: string;
  value: string | number;
}

export default function StudentsPage() {
  const { tables } = useAdminContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [allData, setAllData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterValue[]>([]);
  const [activeSort, setActiveSort] = useState<SortOption | undefined>(undefined);
  
  const fields = tables.students?.fields || [];
  const filterOptions = tables.students?.filterBy || dbTableDictionary.students.filterBy || [];
  const sortOptions = tables.students?.sortBy || dbTableDictionary.students.sortBy || [];

  // Initialize data when tables load
  useEffect(() => {
    if (tables.students?.data) {
      setAllData(tables.students.data);
      setFilteredData(tables.students.data);
    }
  }, [tables.students?.data]);

  // Apply all filters and sorting
  const applyFiltersAndSort = useCallback(() => {
    let result = [...allData];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(student => {
        return (
          (student.name && student.name.toLowerCase().includes(searchTermLower)) ||
          (student.first_name && student.first_name.toLowerCase().includes(searchTermLower)) ||
          (student.last_name && student.last_name.toLowerCase().includes(searchTermLower))
        );
      });
    }

    // Apply additional filters
    if (activeFilters.length > 0) {
      activeFilters.forEach(filter => {
        if (filter.field === 'age') {
          // Special handling for age groups
          const [min, max] = String(filter.value).split('-');
          if (max) {
            result = result.filter(item => item.age >= Number(min) && item.age <= Number(max));
          } else {
            result = result.filter(item => item.age >= Number(min.replace('+', '')));
          }
        } else if (filter.field === 'languages') {
          // Handle array fields
          result = result.filter(item => 
            Array.isArray(item.languages) && item.languages.includes(filter.value)
          );
        } else {
          // Default filter
          result = result.filter(item => item[filter.field] === filter.value);
        }
      });
    }

    // Apply sorting
    if (activeSort) {
      result.sort((a, b) => {
        const aValue = a[activeSort.field];
        const bValue = b[activeSort.field];
        
        // Handle string comparison
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return activeSort.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        // Handle number comparison
        return activeSort.direction === 'asc' 
          ? (aValue - bValue) 
          : (bValue - aValue);
      });
    }

    setFilteredData(result);
  }, [allData, searchTerm, activeFilters, activeSort]);

  // Apply filters and sort when any dependency changes
  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm, activeFilters, activeSort, applyFiltersAndSort]);

  // Handle filter changes
  const handleFilterChange = (filter: FilterValue) => {
    setActiveFilters(prev => {
      // Check if this field is already filtered
      const existingIndex = prev.findIndex(f => f.field === filter.field);
      
      if (existingIndex >= 0) {
        // Replace existing filter
        const newFilters = [...prev];
        newFilters[existingIndex] = filter;
        return newFilters;
      } else {
        // Add new filter
        return [...prev, filter];
      }
    });
  };

  // Handle sort changes
  const handleSortChange = (sort: SortOption) => {
    setActiveSort(sort);
  };

  // Handle adding a new student
  const handleAddNew = () => {
    console.log("Add new student");
    // Implement navigation to add form or modal
  };

  const tableProps: GenericTableProps = {
    fields: fields,
    data: filteredData
  };

  return (
    <div className="space-y-6">
      <ControllerBar
        title="Students"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search students..."
        filterOptions={filterOptions}
        sortOptions={sortOptions}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        activeFilters={activeFilters}
        activeSort={activeSort}
        totalItems={filteredData.length}
        onAddNew={handleAddNew}
        showAddButton={true}
        addButtonText="Add Student"
      />
      
      <GenericTable table={tableProps} />
    </div>
  );
}