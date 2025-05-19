'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { DbTable } from '@/utils/context-oldbutgold/db-context';

interface EditRecordFormProps {
  table: DbTable;
  record: any;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function EditRecordForm({ table, record, onCancel, onSuccess }: EditRecordFormProps) {
  const [editForm, setEditForm] = useState<any>({});

  // Initialize form with record data
  useEffect(() => {
    setEditForm({...record});
  }, [record]);

  // Save edits to a record
  const handleSaveEdit = async () => {
    if (!record.id) return;
    
    const result = await table.update(record.id, editForm);
    if (result.success) {
      onCancel();
      if (onSuccess) onSuccess();
    } else {
      alert(`Error updating item: ${result.error}`);
    }
  };

  return (
    <div className="p-4">
      <h4 className="font-medium mb-2">Edit Record</h4>
      <div className="space-y-3">
        {Object.keys(record).map(key => 
          key !== 'id' ? (
            <div key={key}>
              <label className="text-sm text-muted-foreground">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <Input 
                value={editForm[key] || ''} 
                onChange={e => setEditForm({...editForm, [key]: e.target.value})}
                className="mt-1"
              />
            </div>
          ) : null
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="default" size="sm" onClick={handleSaveEdit}>
            <Save className="h-3.5 w-3.5 mr-1" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}