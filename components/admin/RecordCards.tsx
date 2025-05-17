'use client'

import React, { useState } from 'react';
import { DbTable } from '@/utils/context/db-context';
import { DataCard, DataItem } from '@/components/ui/data-rows';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { EditRecordForm } from './EditRecordForm';

interface RecordCardsProps {
  table: DbTable;
}

export function RecordCards({ table }: RecordCardsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Convert a single record to DataItems format
  const recordToDataItems = (record: any): DataItem[] => {
    return Object.entries(record).map(([key, value]) => ({
      heading: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value: typeof value === 'object' ? JSON.stringify(value) : String(value)
    }));
  };
  
  // Start editing a record
  const handleEdit = (record: any) => {
    setEditingId(record.id);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
  };
  
  // Delete a record
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const result = await table.destroy(id);
      if (!result.success) {
        alert(`Error deleting item: ${result.error}`);
      }
    }
  };
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Individual Records</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {table.data.map((record, index) => (
          <div key={record.id || index} className="border rounded-lg">
            {editingId === record.id ? (
              <EditRecordForm
                table={table}
                record={record}
                onCancel={handleCancelEdit}
              />
            ) : (
              <DataCard
                title={`Record ${index + 1}`}
                data={recordToDataItems(record)}
                cardClassName="h-full"
                actions={
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(record)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(record.id)}
                    >
                      <Trash className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}