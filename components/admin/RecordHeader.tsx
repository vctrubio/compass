'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { DbTable } from '@/utils/context/db-context';
import { AddRecordForm } from './AddRecordForm';
import { TableFields } from './TableFields';
import { RecordCards } from './RecordCards';

interface RecordHeaderProps {
  title: string;
  table: DbTable;
  showTableFields?: boolean;
  showRecordCards?: boolean;
  className?: string;
}

export function RecordHeader({ 
  title, 
  table, 
  showTableFields = true,
  showRecordCards = true,
  className = ''
}: RecordHeaderProps) {
  const [isAdding, setIsAdding] = useState(false);
  
  // Loading and error states
  const showLoading = table?.loading;
  const showError = table?.error;
  const showEmpty = table && !table.loading && !table.error && table.data?.length === 0;
  const showData = table && !table.loading && !table.error && table.data?.length > 0;
  
  // Safe way to get the table name with capitalization
  const getTableName = () => {
    try {
      if (!table?.name) return 'Unknown';
      return table.name.charAt(0).toUpperCase() + table.name.slice(1);
    } catch (error) {
      console.error('Error accessing table name:', error);
      return 'Unknown';
    }
  };

  return (
    <div className={`border rounded-lg p-6 flex flex-col gap-4 ${className}`}>
      {/* Header with title and action buttons */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => table?.refresh?.()}
            disabled={showLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${showLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New {title.replace('Management', '').trim()}
          </Button>
        </div>
      </div>
      
      {/* Table data section */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">{getTableName()} Data</h2>
        
        {showLoading && (
          <div className="text-center py-4">
            <p>Loading data...</p>
          </div>
        )}
        
        {showError && (
          <div className="text-center py-4 text-red-500">
            <p>Error: {table?.error}</p>
          </div>
        )}
        
        {isAdding && (
          <AddRecordForm 
            table={table}
            onCancel={() => setIsAdding(false)}
          />
        )}
        
        {showEmpty && (
          <div className="text-center py-4 text-muted-foreground">
            <p>No data found in the {getTableName()} table.</p>
            <p className="text-sm mt-1">Add a record using the Add New button above.</p>
          </div>
        )}
        
        {showData && (
          <div className="space-y-6">
            {showTableFields && <TableFields table={table} />}
            {showRecordCards && <RecordCards table={table} />}
          </div>
        )}
      </div>
    </div>
  );
}