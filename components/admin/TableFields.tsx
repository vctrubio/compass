'use client'

import React from 'react';
import { DbTable } from '@/utils/context/db-context';
import { DataCard, DataItem } from '@/components/ui/data-rows';

interface TableFieldsProps {
  table: DbTable;
}

export function TableFields({ table }: TableFieldsProps) {
  // Convert table data to DataItems format for structure overview
  const convertTableDataToItems = (data: any[]): DataItem[] => {
    if (!data || data.length === 0) return [];
    
    // Take the first row as a sample to get all keys
    const sampleRow = data[0];
    
    return Object.keys(sampleRow).map(key => {
      // Format the heading for better display
      const formattedHeading = key
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
      
      // For each key, we'll show how many values are present
      const valuesCount = data.filter(row => row[key] !== null && row[key] !== undefined).length;
      
      return {
        heading: formattedHeading,
        value: `${valuesCount} of ${data.length} items have this field`
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Display table field information */}
      <div className="bg-muted/10 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Table Fields for <span className="text-primary">{table.name}</span></h3>
        <div className="grid grid-cols-3 gap-2">
          {table.fields.map((field, index) => (
            <div key={index} className="border rounded p-2 text-sm">
              <div className="font-medium">{field.name}</div>
              <div className="text-xs text-muted-foreground">
                Type: {field.type}
                {field.isPrimaryKey && " • Primary Key"}
                {field.required && " • Required"}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Summary Card - Shows all fields from the table */}
      {table.data.length > 0 && (
        <DataCard
          title={`Table Structure: ${table.name}`}
          subtitle={`${table.data.length} records in the database`}
          data={convertTableDataToItems(table.data)}
        />
      )}
    </div>
  );
}