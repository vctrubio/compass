'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DbTable } from '@/utils/context-oldbutgold/db-context';

interface AddRecordFormProps {
  table: DbTable;
  onCancel: () => void;
  className?: string;
}

export function AddRecordForm({ table, onCancel, className = '' }: AddRecordFormProps) {
  const [newItem, setNewItem] = useState<Record<string, string>>({});

  // Handle input change in the new item form
  const handleNewItemChange = (field: string, value: string) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  // Handle record creation
  const handleAddNew = async () => {
    const result = await table.add(newItem);
    if (!result.error) {
      setNewItem({});
      onCancel();
    } else {
      alert(`Error adding item: ${result.error}`);
    }
  };

  return (
    <div className={`border rounded-lg p-4 mb-4 bg-muted/10 ${className}`}>
      <h3 className="font-medium mb-2">Add New Item</h3>
      <div className="space-y-3">
        {table.fields
          .filter(field => !field.isPrimaryKey) // Skip primary key fields (like ID)
          .map(field => (
            <div key={field.name}>
              <label className="text-sm text-muted-foreground">
                {field.name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <Input 
                value={newItem[field.name] || ''}
                onChange={e => handleNewItemChange(field.name, e.target.value)}
                placeholder={`Enter ${field.name}`}
                className="mt-1"
                required={field.required}
              />
              <p className="text-xs text-muted-foreground mt-1">Type: {field.type}</p>
            </div>
          ))}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="default" size="sm" onClick={handleAddNew}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}