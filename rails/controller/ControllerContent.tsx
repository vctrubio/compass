'use client';
import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { ControllerBar } from "./ControllerBar";
import { GenericTable } from "@/rails/view/table/GenericTable";
import { TableField, FilterOption, SortOption, TableEntity } from "@/rails/types";
import { dbTableDictionary } from "@/rails/typesDictionary";
import { GenericTableProps } from "@/rails/view/table/GenericTable";
import { Checkbox } from "@/components/ui/checkbox"; 

export interface FilterValue {
  field: string;
  value: string | number | Array<string | number>;
  isMultiSelect?: boolean;
}

interface FormProps {
  onSubmit: (data: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

export interface ControllerContentProps {
  title: string;
  tableName: string;
  tableData?: TableEntity;
  searchFields?: string[];
  showAddButton?: boolean;
  children?: ReactNode;
  onAdd?: () => void;
  addForm?: React.ComponentType<FormProps>;
}

export function ControllerContent({ 
  title, 
  tableName, 
  tableData, 
  searchFields = ['name', 'first_name', 'last_name'],
  showAddButton = true,
  children,
  onAdd,
  addForm
}: ControllerContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [allData, setAllData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterValue[]>([]);
  const [activeSort, setActiveSort] = useState<SortOption | undefined>(undefined);
  const [showAddForm, setShowAddForm] = useState(false);
  const [keepFormOpen, setKeepFormOpen] = useState(false);
  
  // Get fields and options from the table data or fallback to dictionary
  const fields = tableData?.fields || dbTableDictionary[tableName]?.fields || [];
  const filterOptions = tableData?.filterBy || dbTableDictionary[tableName]?.filterBy || [];
  const sortOptions = tableData?.sortBy || dbTableDictionary[tableName]?.sortBy || [];

  // Format title for display
  const displayTitle = title;

  // Initialize data when table data loads
  useEffect(() => {
    if (tableData?.data) {
      setAllData(tableData.data);
      setFilteredData(tableData.data);
    }
  }, [tableData?.data]);

  // Apply all filters and sorting
  const applyFiltersAndSort = useCallback(() => {
    if (!allData.length) return [];
    
    let result = [...allData];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(item => {
        // Search across all specified search fields
        return searchFields.some(field => {
          if (item[field]) {
            return String(item[field]).toLowerCase().includes(searchTermLower);
          }
          return false;
        });
      });
    }

    // Apply additional filters
    if (activeFilters.length > 0) {
      activeFilters.forEach(filter => {
        if (filter.field === 'age') {
          // Special handling for age groups
          if (Array.isArray(filter.value)) {
            // Handle multiple age groups
            result = result.filter(item => {
              return (filter.value as Array<string | number>).some((rangeValue: string | number) => {
                const [min, max] = String(rangeValue).split('-');
                if (max) {
                  return item.age >= Number(min) && item.age <= Number(max);
                } else {
                  return item.age >= Number(String(rangeValue).replace('+', ''));
                }
              });
            });
          } else {
            // Handle single age group
            const [min, max] = String(filter.value).split('-');
            if (max) {
              result = result.filter(item => item.age >= Number(min) && item.age <= Number(max));
            } else {
              result = result.filter(item => item.age >= Number(String(filter.value).replace('+', '')));
            }
          }
        } else {
          result = result.filter(item => {
            // Handle array fields (languages, tags, etc.)
            if (Array.isArray(item[filter.field])) {
              if (Array.isArray(filter.value)) {
                // Multiple value selection (OR logic)
                return (filter.value as Array<string | number>).some(val => 
                  item[filter.field].includes(val)
                );
              } else {
                // Single value selection
                return item[filter.field].includes(filter.value);
              }
            } else {
              // Default filter - handle both array and single value
              if (Array.isArray(filter.value)) {
                return (filter.value as Array<string | number>).includes(item[filter.field]);
              } else {
                return item[filter.field] === filter.value;
              }
            }
          });
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
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return activeSort.direction === 'asc' 
            ? (aValue - bValue) 
            : (bValue - aValue);
        }
        
        // Handle undefined or null values
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;
        
        // Default fallback
        return 0;
      });
    }

    return result;
  }, [allData, searchTerm, activeFilters, activeSort, searchFields]);

  // Apply filters and sort when any dependency changes
  useEffect(() => {
    const result = applyFiltersAndSort();
    setFilteredData(result);
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

  // Handle filter removal
  const handleFilterRemove = (field: string) => {
    setActiveFilters(prev => prev.filter(f => f.field !== field));
  };

  // Handle sort changes
  const handleSortChange = (sort: SortOption) => {
    setActiveSort(sort);
  };

  // Reset all filters and sort
  const handleResetFilters = () => {
    setActiveFilters([]);
    setActiveSort(undefined);
    setSearchTerm("");
  };

  // Handle adding a new record
  const handleAddNew = () => {
    if (onAdd) {
      onAdd();
      return;
    }
    
    if (addForm) {
      setShowAddForm(!showAddForm);
    } else {
      console.log(`Add new ${title}`);
      // Default implementation could be added here
    }
  };

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'j') {
        event.preventDefault();
        handleAddNew();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showAddForm]); // Re-run when showAddForm changes

  const tableProps: GenericTableProps = {
    fields,
    data: filteredData
  };

  // Handle form submission
  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data);
    // Here you would typically add the new record to your data
    if (tableData?.api.put) {
      tableData.api.put(data)
        .then((result) => {
          console.log('Record added:', result);
          
          // For demo purposes, let's add the item to the local data
          // In a real application, you'd wait for the API call to complete
          const newItem = { ...data, id: Date.now() }; // Generate temp ID
          setAllData(prev => [newItem, ...prev]);
          
          // Only close the form if keep open is not checked
          if (!keepFormOpen) {
            setShowAddForm(false);
          }
        })
        .catch(error => {
          console.error('Error adding record:', error);
        });
    } else {
      // Fallback if no API is provided
      const newItem = { ...data, id: Date.now() }; // Generate temp ID
      setAllData(prev => [newItem, ...prev]);
      
      // Only close the form if keep open is not checked
      if (!keepFormOpen) {
        setShowAddForm(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Controller UI with search, filter, sort */}
      <ControllerBar
        title={displayTitle}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={`Search ${title.toLowerCase()}...`}
        filterOptions={filterOptions}
        sortOptions={sortOptions}
        onFilterChange={handleFilterChange}
        onFilterRemove={handleFilterRemove}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        activeFilters={activeFilters}
        activeSort={activeSort}
        totalItems={filteredData.length}
        onAddNew={handleAddNew}
        showAddButton={showAddButton}
        addButtonText={showAddForm ? `Close ${title}` : `Add ${title}`}
      />
      
      {/* Add Form when showing */}
      {addForm && showAddForm && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="keepFormOpen"
                checked={keepFormOpen}
                onCheckedChange={() => setKeepFormOpen(!keepFormOpen)}
              />
              <label
                htmlFor="keepFormOpen"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Keep form open after submission
              </label>
            </div>
          </div>
          
          {/* Render the form with props */}
          {React.createElement(addForm, {
            onSubmit: handleFormSubmit,
            isOpen: true,
            onClose: () => setShowAddForm(false)
          })}
        </div>
      )}
      
      {/* Custom content if provided */}
      {children}
      
      {/* Default table if no custom content is provided */}
      {!children && <GenericTable table={tableProps} />}
    </div>
  );
}
